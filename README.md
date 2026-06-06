# Night Shift Substrate Foundry

This is the master repository for the Night Shift Substrate Foundry: a nightly agentic system that grows a source-backed K-8 misconception substrate from official public assessment evidence.

The durable asset is the substrate. Pitch generation is out of scope unless explicitly reintroduced later.

## The Operating Contract

### 1. How The Substrate Grows
Every night, the substrate agent chooses one narrow public evidence batch, prioritizing official released assessment items and metadata. It appends normalized records to:

- `data/sources.jsonl`
- `data/items.jsonl`
- `data/misconceptions.jsonl`
- `data/concept-packs.jsonl`
- `data/runs.jsonl`

JSONL is canonical because it preserves evidence links, nested misconception records, confidence labels, and append-only history. `data/review-index.csv` is only a flat mirror for spreadsheet review.

### 2. Math-First Operating Plan
The Foundry starts with math only:

- Phase 1: wide harvest across official public released assessment sources for grades 3-8.
- Phase 2: hole-filling after coverage audit by grade, concept, standard, item type, misconception type, and confidence.
- Phase 3: other subjects only after math is broad, audited, and hole-filled.

### 3. How QA Works

Before any substrate write run commits, it must:

- Acquire the write lock with `npm run substrate:lock acquire`.
- Use deterministic IDs for sources, items, misconceptions, concept packs, and runs.
- Run `npm run substrate:check`.
- Release the lock with `npm run substrate:lock release`.

For substrate runs, QA is evidence-first:
- Every item needs source URL, agency, grade, subject, year, rights note, and standard or explicit missing-standard reason.
- Every misconception needs at least one evidence reference.
- Inferred student thinking must be labeled as `inferred`, not stated as observed fact.
- Low-confidence records remain reviewable but cannot be used as polished pitch claims.
- Copyrighted passages are not republished unless rights are explicit.

### 4. Second Brain Mirror

The working git repo stays outside iCloud. The asset layer mirrors into:

`/Users/joshuadurey/Library/Mobile Documents/com~apple~CloudDocs/Sync/Josh's Second Brain/Portable IP/Night Shift Substrate Foundry`

Run:

```bash
npm run substrate:mirror
```

The mirror copies only `data/` and Markdown reports. It does not copy `.git`, `node_modules`, builds, screenshots, prototype code, or automation internals.
