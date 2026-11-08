# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: an adult in the UK who holds their own medical paperwork (clinic letters, discharge summaries, test results, prescriptions, imaging reports) and wants it in one place they can read and search. They range from someone with a single referral in flight to someone managing a long-term condition with years of letters. Ages span young adults to older people; vision, dexterity, and confidence with technology vary widely.

The product separates the Account (who logs in) from the Person (whose records these are) so that one human can later hold records for a relative or child. In v1 one Account holds one Person; carers are a named future audience, not a confirmed one.

## Product Purpose

Health Hub is a patient-facing hub for a person's own medical records. A Person uploads a document as a PDF or photos of paper pages; Health Hub extracts Facts (measurements, medications, appointments, referrals, stated diagnoses, procedures) and lays them on a Timeline in date order, every Fact citing the exact page and region it came from. The Person can ask questions and get Answers built only from cited Facts, and group related events into Pathways (referral, appointment, scan, follow-up letter) they confirm themselves.

Success is a Person opening a letter they half-understood and being able to see what it says, when, and where that came from, without being told what it means.

## Positioning

Health Hub presents what the records say and never what they mean. It does not diagnose, judge urgency, calculate thresholds, flag overdue states, or suggest clinical action. Every statement shown is traceable to a Source; when the Person wrote something themselves it is marked as the Person's Account wherever it appears. A question that asks for interpretation gets a Declined Answer that restates the cited Facts and says plainly that Health Hub does not interpret or advise. Neighbouring products (symptom checkers, wellness trackers, portal apps that score or nudge) cannot truthfully make this claim.

## Operating Context

- Documents arrive as PDFs or phone photos of paper, often years old, often from several NHS trusts and GP practices.
- The Person reads on a phone at the kitchen table, in a waiting room before an appointment, or on a laptop while on the phone to a relative.
- Extraction runs as a background job and can take seconds to minutes; everything else is immediate.
- Vocabulary is fixed by the domain glossaries in `src/domains/*/GLOSSARY.md` (Record, Fact, Source, Timeline, Pathway, Person Statement, Person's Account, Disputed, Declined). UI copy uses those terms exactly and avoids the listed alternatives.

## Capabilities and Constraints

- Confirmed capabilities: Upload, Timeline, Source citations, Q&A with Declined Answers, Pathways (Proposed, Confirmed, Manual), Person Statements, Disputed marks, Erasure, Access Log.
- Records and Facts are immutable; corrections are new Records.
- Data at rest and all AI processing stay in the UK or EU and providers must not train on inputs (ADR 0001).
- Stack: Void on Cloudflare Workers, React 19 pages with server loaders, Postgres via Drizzle. Landing page lives at `pages/index.tsx`.
- Landing page call to action (confirmed 2026-11-08): individuals create an account. `/signup`, `/signin` and account settings exist (Identity spec, ADR 0003); sign-up is limited to the Allowlist until launch.
- Undecided: pricing, launch date, whether a carer-first flow ships in v1.

## Brand Commitments

- "Health Hub" is a working name (confirmed 2026-11-08). No logo, palette, or type exists yet; the identity is designed from scratch and the name may change later, so the mark must not depend on a letterform pun.
- Voice follows the product principle: plain, factual, unhurried. No urgency language, no scoring, no gamification, no clinical reassurance or alarm.
- Brief for the identity (user's words): comforting but beautiful; inviting to use, but serious enough for people of all ages and wellnesses.
- Standing preference (confirmed 2026-11-08): the landing page follows the category standard for trusted UK health services, played straight and at full craft, rather than an unconventional visual world. The named peer whose craft level sets the bar is Pharmacy2U. Future surfaces inherit this preference unless the user changes it.
- Health Hub is independent and not part of the NHS or any pharmacy; no surface may imply affiliation.

## Evidence on Hand

- Domain model and glossaries: `GLOSSARY-MAP.md`, `src/domains/*/GLOSSARY.md`.
- Architecture decisions: `docs/adr/0001-*.md`, `docs/adr/0002-*.md`.
- An explanatory isometric figure of the domain model, "The Record Reader": `docs/figures/health-hub/`.
- No real users, testimonials, partner logos, metrics, press, or screenshots of a working app exist. Nothing of that kind may be invented; demonstration content on the landing page must be synthetic and labelled as an example.

## Product Principles

1. Show, never interpret. Every surface presents record facts and their Sources; nothing on screen implies a judgement about health.
2. Traceable by default. Any statement a Person can read, they can follow back to the page it came from in one step.
3. The Person is in charge of meaning. Pathways, Outcomes, and Disputed marks are theirs; the system proposes, the Person confirms.
4. Calm under uncertainty. Partial extractions, undated Facts, and deleted Records are shown plainly as what they are, never hidden or smoothed over.
5. Readable by anyone who holds a letter. Older eyes, shaky hands, low confidence, and small screens are the default case, not an edge case.

## Accessibility & Inclusion

WCAG 2.2 AA throughout (confirmed 2026-11-08): 4.5:1 contrast on body text, 3:1 on large text and UI boundaries, 24px minimum target size, visible focus, reduced-motion honoured, no information carried by colour alone. Default type is set larger than the web norm because the primary audience includes older readers.
