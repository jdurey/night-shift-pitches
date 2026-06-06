#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const dataDir = path.join(root, 'data');

const stores = [
  {
    file: 'sources.jsonl',
    idField: 'source_id',
    softKeys: [
      record => ['source_url_grade_subject_year', record.url, record.grade, record.subject, record.year]
    ]
  },
  {
    file: 'items.jsonl',
    idField: 'item_id',
    softKeys: [
      record => ['source_item', record.source_id, record.source_item_id || record.item_number || record.item_position || record.safe_summary]
    ]
  },
  {
    file: 'misconceptions.jsonl',
    idField: 'misconception_id',
    softKeys: [
      record => ['misconception_evidence_signal', sorted(record.evidence_refs), record.diagnostic_signal]
    ]
  },
  {
    file: 'concept-packs.jsonl',
    idField: 'concept_pack_id',
    softKeys: [
      record => ['concept_pack_scope', record.subject, record.grade_band, record.concept, sorted(record.standard_refs)]
    ]
  },
  {
    file: 'runs.jsonl',
    idField: 'run_id',
    softKeys: [
      record => ['run_date_source', record.run_date || record.date, record.source_id]
    ]
  }
];

function sorted(value) {
  if (!Array.isArray(value)) return value;
  return [...value].sort().join('|');
}

function compactKey(parts) {
  if (parts.slice(1).some(part => part === undefined || part === null || part === '')) return null;
  return parts.map(part => String(part).trim().toLowerCase()).join('::');
}

function readJsonl(file) {
  if (!fs.existsSync(file)) return [];
  return fs.readFileSync(file, 'utf8')
    .split(/\r?\n/)
    .map((line, index) => ({ line: line.trim(), lineNumber: index + 1 }))
    .filter(entry => entry.line.length > 0)
    .map(entry => {
      try {
        return { ...entry, record: JSON.parse(entry.line) };
      } catch (error) {
        return { ...entry, parseError: error.message };
      }
    });
}

const failures = [];
const warnings = [];

for (const store of stores) {
  const filePath = path.join(dataDir, store.file);
  const entries = readJsonl(filePath);
  const idSeen = new Map();
  const softSeen = new Map();

  for (const entry of entries) {
    if (entry.parseError) {
      failures.push(`${store.file}:${entry.lineNumber} invalid JSON: ${entry.parseError}`);
      continue;
    }

    const id = entry.record[store.idField];
    if (!id) {
      failures.push(`${store.file}:${entry.lineNumber} missing required ${store.idField}`);
    } else if (idSeen.has(id)) {
      failures.push(`${store.file}:${entry.lineNumber} duplicate ${store.idField} "${id}" first seen on line ${idSeen.get(id)}`);
    } else {
      idSeen.set(id, entry.lineNumber);
    }

    for (const makeSoftKey of store.softKeys) {
      const key = compactKey(makeSoftKey(entry.record));
      if (!key) continue;
      if (softSeen.has(key)) {
        warnings.push(`${store.file}:${entry.lineNumber} possible duplicate content key "${key}" first seen on line ${softSeen.get(key)}`);
      } else {
        softSeen.set(key, entry.lineNumber);
      }
    }
  }
}

if (failures.length > 0) {
  console.error('Substrate duplicate/schema check failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  if (warnings.length > 0) {
    console.error('\nWarnings:');
    for (const warning of warnings) console.error(`- ${warning}`);
  }
  process.exit(1);
}

if (warnings.length > 0) {
  console.warn('Substrate duplicate/schema check passed with warnings:');
  for (const warning of warnings) console.warn(`- ${warning}`);
} else {
  console.log('Substrate duplicate/schema check passed.');
}
