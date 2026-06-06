---
title: "Capability Ledger"
type: ledger
created: 2026-06-05
mirrored: false
tags:
  - grade/K-8
  - topic/dok
  - topic/misconceptions
---

# Capability Ledger

*The new capture lens. For each piece of work, log the **transferable, NDA-safe skill** — not the Alpha artifact.*
*"What can I take away from this project that lets me build the IP later?"*

For each entry: **Skill practiced · Generalized method · What it would take to rebuild this cleanly outside Alpha · Portable takeaway.**

| Date | Source work (Alpha zone) | Skill practiced | Generalized method | Rebuild-outside cost | Portable takeaway |
|------|--------------------------|-----------------|--------------------|----------------------|-------------------|
| 2026-05-18 | DoK rewrites Forms A–E | Lifting item cognitive demand without drifting standard/grade | DoK audit -> targeted replacement-item rewrite at fixed standard | Low — needs only a public standards set + item bank | I can take a low-rigor item bank and raise DoK 2+ rate ~25 pts while holding the standard. |
| 2026-06-02 | K-8 misconception bank (4 domains) | Building an evidence-grounded misconception store as the substrate of a course | Harvest released-assessment data -> map misconceptions -> distractor menu | Medium — re-harvest from public released tests on a neutral subject | Misconception-as-substrate is a reusable course-design primitive, not an Alpha thing. |
| 2026-05-24 | Doom Loops BrainLift / diagnostic | Diagnosing self-reinforcing failure patterns in AI-delivered learning | Pattern registry -> monitor -> preemptive intervention map | Medium | The "doom loop" diagnostic generalizes to any adaptive learning system. |
| 2026-06-03 | Onboarding dashboard + training module | Making scattered institutional knowledge legible & self-serve | Knowledge-scatter audit -> single legible surface -> self-paced module | Low | Core "fragments -> legible & learnable" craft, demonstrable on any domain. |
| 2026-06-04 | egumpp coach dashboard (Independence Ecosystem + USE WHEN rules) | Turning tool sprawl into a decision-rule layer people can actually learn | Map the tool's journey, then attach USE WHEN rules per feature so a novice knows which thing to reach for and when | Low — works on any SaaS tool with public docs | A "USE WHEN" decision layer turns scattered features into a learnable framework, not a cheat sheet. Fragments-to-legible craft applied to tooling. |
| 2026-06-05 | egumpp Independence Ecosystem — shipping the actual GAS dashboard | Engineering a deployed, interactive single-page dashboard with a live DB backend on zero infra | 4-file GAS skeleton + 5 discipline rules (vanilla-only, JSON hydration, DOM-build-not-innerHTML, in-app forms over raw-sheet edits, lint-before-paste). Parse source docs with a throwaway Python script. See [[Methods/build-gas-dashboard]]. | Low — runs on a free Google account + public docs, demonstrable in a day | I can hand a client their scattered Docs + a Sheet and return a working internal tool with a logging backend, no servers, no recurring cost. The cheapest credible proof-of-value artifact I own. |
| 2026-06-06 | egumpp dashboard landed via Davi → coaching chat (Davi + Himanshi publicly backed it, another coach thanked me) | Artifact-led distribution: earning standing through peer adoption instead of a top-down pitch | Build the useful artifact → hand it to one trusted user → let them carry it into the group → only pitch the bigger system after the artifact has earned its own standing | None — it's a go-to-market motion, not a build | Ship something genuinely useful to one real user, make it easy to forward, let adoption create the mandate. The distribution move that makes a product, course, or consulting offer land without selling. Positive proof of the "asked-for work first, let the gap pitch itself" rule. |
| 2026-06-06 | Joining the SS production chat at week 6; reconciling six weeks of work against the now-visible pipeline | Reverse-engineering an in-flight production pipeline from its artifacts, and reading my real role from the contribution receipts | Map the source of truth before building; reconstruct a pipeline from its item bank + curriculum graph; tag contributions by type to read the role the receipts actually assign | Low. Runs on any client's existing artifacts plus channel/working-doc access. | "Build on, not beside." Pipeline visibility is the highest-leverage onboarding investment an org can make in a specialist hire. I can sell a day-one pipeline-mapping diagnostic and name "build beside vs build on" as a costed onboarding failure mode. |
| 2026-06-06 | Coach App Hub — multi-app GAS dashboard + Sheet-as-CMS, plus the load-time fix | Making a Sheets-backed internal tool fast and editable by non-coders | Separate content (Sheet) from presentation (app); hydrate all data once and filter client-side (no per-click round-trips); keep reads read-only (never write on read); enforce clean join keys with dropdowns; never cache the surface users edit | Low — a Google account and a Sheet | I can turn a spreadsheet into a fast internal tool that non-technical people maintain themselves, and diagnose GAS slowness (server round-trips + writes-on-read) on sight. The Sheet-as-CMS plus load-once/filter-client-side pattern ports to any client's internal tooling. |

*(Retrofit older entries over time; add a row for every new piece of work going forward.)*

## Blocker-first coaching session protocol
- **Date:** 2026-06-06
- **Method:** Structure coaching or support sessions around a single repeatable arc: (1) identify the specific blocker within the first few minutes — not a general check-in, but the concrete reason for the call; (2) co-define a session goal scoped to that blocker; (3) work through resolution; (4) close by surfacing what would prevent the same blocker from recurring. Reduces session sprawl, creates a defensible log of what was addressed and why, and tracks progress toward reduced coaching dependency over time. Applicable to instructional coaching, customer success, onboarding support, or peer tutoring contexts.
- **Rebuild Cost:** 1-2h to formalize into a transferable protocol document and cheatsheet template; the framework itself is ready — investment is in packaging and context-stripping
- **Evidence:** Synthesized from ~12 hours of deep study into a coaching-platform workflow; submitted as a framework hypothesis to a specialist for validation before first live session

## Sheet-as-CMS multi-entity dashboard
- **Date:** 2026-06-06
- **Method:** Build a web-app dashboard for multi-entity content (e.g., one view per tool/product/team) where the content layer lives in a spreadsheet tagged by entity — no CMS budget, no code exposure for content authors. The script layer loads all rows once on open, switches entities client-side (zero per-click server calls), and enforces controlled vocabulary via in-sheet dropdowns. Authors edit the sheet; a Refresh button pulls the latest without a full reload. Separates content-authoring concerns from presentation logic entirely. Key anti-pattern to avoid: writes-on-read (applying formatting/style on every read call causes silent latency).
- **Rebuild Cost:** 4-6h to build the script shell + client-side state management + content template from scratch; 1-2h additional to package as a reusable starter kit with documentation
- **Evidence:** Deployed for a multi-tool scenario (~14 tools) where each needed structured support content; replaced fragmented per-tool files with a single Sheet-driven UI, fixed 2-3s per-click latency by eliminating writes-on-read and consolidating server round-trips to a single load
