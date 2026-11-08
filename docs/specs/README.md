# Domain specs

One spec per bounded context, named after its folder in `src/domains/`. Every spec uses the same sections so they can be reviewed alike.

Write them in dependency order: Records, Extraction, Timeline, Identity, Q&A, Pathways.

## Template

```md
# <Context>

## Purpose
One paragraph. Why this context exists and what it must never do.

## Glossary
Link to `src/domains/<context>/GLOSSARY.md`. Use its terms exactly.

## Invariants
Rules that must always hold, one per bullet. Each is testable.

## Use cases
One per application-layer operation:
- **Name**: who triggers it, inputs, outcome, other contexts touched.

## Events in
What this context reacts to, and which context emits it.

## Events out
What this context emits, and who consumes it.

## Out of scope
Explicit no-s, so nobody re-adds them.

## Open questions
Anything unresolved, with who decides.
```

## Shared requirements

These apply to every context and are restated in each spec's Invariants where relevant.

- Everything is scoped to one Person. No query crosses Persons.
- Facts and Records are never edited after creation.
- Every statement shown to a Person is traceable to a Source.
- Nothing calculates thresholds, overdue states, risk, or suggested clinical actions.
- A Fact from a Person Statement is marked as the Person's Account wherever it appears: Timeline, Answers, Pathways.
- Data at rest and AI processing stay in the UK or EU (ADR 0001).
- Contexts communicate through in-process domain events; only Extraction Runs are background jobs (ADR 0002).
