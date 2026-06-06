#!/usr/bin/env node

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const lockDir = path.join(root, 'data', '.substrate-write.lock');
const lockMeta = path.join(lockDir, 'lock.json');
const staleAfterMs = 6 * 60 * 60 * 1000;

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
}

function removeStaleLock() {
  if (!fs.existsSync(lockDir)) return false;

  const meta = readJson(lockMeta);
  const acquiredAt = meta?.acquired_at ? Date.parse(meta.acquired_at) : 0;
  const ageMs = Number.isFinite(acquiredAt) ? Date.now() - acquiredAt : staleAfterMs + 1;

  if (ageMs <= staleAfterMs) return false;

  fs.rmSync(lockDir, { recursive: true, force: true });
  return true;
}

function acquire() {
  fs.mkdirSync(path.dirname(lockDir), { recursive: true });
  removeStaleLock();

  try {
    fs.mkdirSync(lockDir);
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;

    const meta = readJson(lockMeta);
    console.error('Substrate lock is already held. Refusing to write duplicate-prone data.');
    if (meta) {
      console.error(JSON.stringify(meta, null, 2));
    }
    process.exit(2);
  }

  fs.writeFileSync(lockMeta, JSON.stringify({
    pid: process.pid,
    host: os.hostname(),
    acquired_at: new Date().toISOString(),
    cwd: root
  }, null, 2));
}

function release() {
  fs.rmSync(lockDir, { recursive: true, force: true });
}

function status() {
  if (!fs.existsSync(lockDir)) {
    console.log('No substrate lock is active.');
    return;
  }
  console.log(JSON.stringify(readJson(lockMeta) || { status: 'locked', lockDir }, null, 2));
}

const [command, ...rest] = process.argv.slice(2);

if (!command || command === 'status') {
  status();
  process.exit(0);
}

if (command === 'acquire') {
  acquire();
  console.log(`Acquired substrate lock at ${lockDir}`);
  process.exit(0);
}

if (command === 'release') {
  release();
  console.log(`Released substrate lock at ${lockDir}`);
  process.exit(0);
}

if (command === '--') {
  if (rest.length === 0) {
    console.error('Usage: node scripts/substrate-lock.cjs -- <command> [args...]');
    process.exit(1);
  }

  acquire();
  const child = spawnSync(rest[0], rest.slice(1), {
    cwd: root,
    stdio: 'inherit',
    shell: false
  });
  release();
  process.exit(child.status ?? 1);
}

console.error('Usage: node scripts/substrate-lock.cjs [status|acquire|release|-- <command>]');
process.exit(1);
