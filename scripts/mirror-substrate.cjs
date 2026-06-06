#!/usr/bin/env node

const fs = require('fs');
const os = require('os');
const path = require('path');

const root = path.resolve(__dirname, '..');
const destination = path.join(
  os.homedir(),
  'Library',
  'Mobile Documents',
  'com~apple~CloudDocs',
  'Sync',
  "Josh's Second Brain",
  'Portable IP',
  'Night Shift Substrate Foundry'
);

const copyPlan = [
  { from: 'data/README.md', to: 'data/README.md' },
  { from: 'data/sources.jsonl', to: 'data/sources.jsonl' },
  { from: 'data/items.jsonl', to: 'data/items.jsonl' },
  { from: 'data/misconceptions.jsonl', to: 'data/misconceptions.jsonl' },
  { from: 'data/concept-packs.jsonl', to: 'data/concept-packs.jsonl' },
  { from: 'data/runs.jsonl', to: 'data/runs.jsonl' },
  { from: 'data/review-index.csv', to: 'data/review-index.csv' }
];

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function copyFile(relativeFrom, relativeTo) {
  const source = path.join(root, relativeFrom);
  const target = path.join(destination, relativeTo);
  if (!fs.existsSync(source)) return false;
  ensureDir(target);
  fs.copyFileSync(source, target);
  return true;
}

function copyReports() {
  const reportsDir = path.join(root, 'reports');
  fs.mkdirSync(path.join(destination, 'reports'), { recursive: true });
  if (!fs.existsSync(reportsDir)) return [];

  return fs.readdirSync(reportsDir)
    .filter(file => file.endsWith('.md'))
    .sort()
    .map(file => {
      const from = path.join('reports', file);
      const to = path.join('reports', file);
      copyFile(from, to);
      return to;
    });
}

function writeReadme(copied) {
  const target = path.join(destination, 'README.md');
  ensureDir(target);
  const body = `# Night Shift Substrate Foundry

This folder is a mirror of the canonical substrate asset data from:

\`${root}\`

The working git repo stays outside iCloud to avoid sync conflicts with \`.git\`, \`node_modules\`, generated builds, and automation artifacts.

## Canonical Store

The JSONL files in \`data/\` are the asset store:

- \`sources.jsonl\`
- \`items.jsonl\`
- \`misconceptions.jsonl\`
- \`concept-packs.jsonl\`
- \`runs.jsonl\`

\`review-index.csv\` is a flat review mirror only. It is not canonical.

## Last Mirror

- Mirrored at: ${new Date().toISOString()}
- Files copied: ${copied.length}
`;
  fs.writeFileSync(target, body, 'utf8');
}

function writeManifest(copied) {
  const target = path.join(destination, 'mirror-manifest.json');
  ensureDir(target);
  fs.writeFileSync(target, JSON.stringify({
    mirrored_at: new Date().toISOString(),
    source_repo: root,
    destination,
    copied
  }, null, 2), 'utf8');
}

fs.mkdirSync(destination, { recursive: true });

const copied = [];
for (const entry of copyPlan) {
  if (copyFile(entry.from, entry.to)) copied.push(entry.to);
}
copied.push(...copyReports());
writeReadme(copied);
writeManifest(copied);

console.log(`Mirrored ${copied.length} substrate files to ${destination}`);
