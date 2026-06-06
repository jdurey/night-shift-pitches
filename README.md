# Night Shift v2 (Autonomous Pitch Engine)

This is the master repository for the Night Shift pipeline—an autonomous agentic system that builds, deploys, and drafts bespoke pitches while you sleep.

## The Operating Contract

### 1. How Leads Become Briefs
Every night at midnight, the orchestration agent reads `leads/market-map.md` and `capability-ledger.md`. It scores leads based on fit, pain evidence, and contact confidence. It selects one target, generating a `brief.md` and `prototype-spec.md` that map your proven IP to their specific product weakness.

### 2. How the Prototype is Built
The agent generates a bespoke React component injected into `src/pitches/<company>.jsx`. 
It **never** runs `npm create vite`—it natively injects routes into this single repository to ensure blazing fast CI/CD and zero GitHub sprawl.

### 3. How QA Works (The Iron Gate)
Before any code is committed, the agent runs `npm run qa <company-slug>`. This script enforces the following blocking checks:
- **Linting:** `npm run lint` must pass with 0 errors.
- **Build:** `npm run build` must compile.
- **Route Injection:** The `App.jsx` file must successfully route to the new pitch.
- **Visual Evidence:** Puppeteer generates desktop and mobile screenshots of the live component.
- **Humility/Safety:** The UI must explicitly contain a "Simulated Data" or "Mockup" disclaimer.
- **Email Staging:** A drafted email (`email-draft.md`) must exist without making aggressive claims about private data.

If `npm run qa` fails, the agent attempts to self-repair the code up to 3 times. If it still fails, the pitch is aborted and no email is drafted.

### 4. What Gets Committed
Only code that passes the hard `npm run qa` gate is committed to `main`. 
GitHub Actions then automatically runs a final check and deploys the bundle to GitHub Pages (`jdurey.github.io/night-shift-pitches/p/<company>`).

### 5. Morning Approval Workflow
The agent does **not** send emails autonomously.
Instead, it runs `scripts/generate-dashboard.cjs`. This generates an offline `morning-console.html` dashboard and a clickable bash script (`approve-<company>.command`).
In the morning, you review the HTML dashboard over coffee. If the prototype and score meet your standards, you simply double-click the `.command` file on your local machine, which natively bridges to macOS Apple Mail via AppleScript and stages the draft in your outbox.
