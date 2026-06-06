# Night Shift v2 (Substrate Foundry + Pitch Engine)

This is the master repository for the Night Shift pipeline: a nightly agentic system that grows a source-backed K-8 misconception substrate, then uses strong slices of that asset to build and draft bespoke pitches.

The durable asset is the substrate. Pitch pages are distribution artifacts.

## The Operating Contract

### 1. How The Substrate Grows
Every night, the substrate agent chooses one narrow public evidence batch, prioritizing official released assessment items and metadata. It appends normalized records to:

- `data/sources.jsonl`
- `data/items.jsonl`
- `data/misconceptions.jsonl`
- `data/concept-packs.jsonl`
- `data/runs.jsonl`

JSONL is canonical because it preserves evidence links, nested misconception records, confidence labels, and append-only history. `data/review-index.csv` is only a flat mirror for spreadsheet review.

### 2. How Leads Become Briefs
The orchestration agent reads `leads/market-map.md`, `capability-ledger.md`, and the substrate data. It scores leads based on fit, pain evidence, contact confidence, and whether the current substrate contains a credible slice. It only generates a `brief.md` and `prototype-spec.md` when the source-backed asset is strong enough to show.

### 3. How the Prototype is Built
The agent generates a bespoke React component injected into `src/pitches/<company>.jsx`. 
It **never** runs `npm create vite`—it natively injects routes into this single repository to ensure blazing fast CI/CD and zero GitHub sprawl.

### 4. How QA Works (The Iron Gate)
Before any code is committed, the agent runs `npm run qa <company-slug>`. This script enforces the following blocking checks:
- **Linting:** `npm run lint` must pass with 0 errors.
- **Build:** `npm run build` must compile.
- **Route Injection:** The `App.jsx` file must successfully route to the new pitch.
- **Visual Evidence:** Puppeteer generates desktop and mobile screenshots of the live component.
- **Humility/Safety:** The UI must explicitly contain a "Simulated Data" or "Mockup" disclaimer.
- **Email Staging:** A drafted email (`email-draft.md`) must exist without making aggressive claims about private data.

If `npm run qa` fails, the agent attempts to self-repair the code up to 3 times. If it still fails, the pitch is aborted and no email is drafted.

For substrate runs, QA is evidence-first:
- Every item needs source URL, agency, grade, subject, year, rights note, and standard or explicit missing-standard reason.
- Every misconception needs at least one evidence reference.
- Inferred student thinking must be labeled as `inferred`, not stated as observed fact.
- Low-confidence records remain reviewable but cannot be used as polished pitch claims.
- Copyrighted passages are not republished unless rights are explicit.

### 5. What Gets Committed
Only code that passes the hard `npm run qa` gate is committed to `main`. 
GitHub Actions then automatically runs a final check and deploys the bundle to GitHub Pages (`jdurey.github.io/night-shift-pitches/p/<company>`).

### 6. Morning Approval Workflow
The agent does **not** send emails autonomously.
Instead, it runs `scripts/generate-dashboard.cjs`. This generates an offline `morning-console.html` dashboard and a clickable bash script (`approve-<company>.command`).
In the morning, you review the HTML dashboard over coffee. If the prototype and score meet your standards, you simply double-click the `.command` file on your local machine, which natively bridges to macOS Apple Mail via AppleScript and stages the draft in your outbox.
