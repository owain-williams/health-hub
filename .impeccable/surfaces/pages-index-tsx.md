---
version: 1
slug: "pages-index-tsx"
primary_target: "pages/index.tsx"
related_targets: ["pages/brand.tsx","pages/signup.tsx","pages/signin.tsx"]
---

# Surface brief: pages/index.tsx (landing page)

Scope: the public landing page at `/`. Visitor mode: Persuade. Audience: UK adults holding their own medical letters, every age and level of wellness; often older readers on a phone. Job: understand what Health Hub is, trust it, and create an account. Action: Create account (links to `/signup`); secondary Sign in (`/signin`). Proof: a working, labelled, synthetic demonstration of the Record to Fact to Source mechanism; no testimonials, logos, metrics or claims, because none exist. Constraints: WCAG 2.2 AA; never imply NHS or pharmacy affiliation; copy uses glossary terms exactly; no diagnosis, urgency or advice language.

Chosen direction: the category standard for trusted UK health services, played straight at the craft level of Pharmacy2U (user's named peer). Memorable moment: the live trace, where touching a Fact lights the exact line in the letter it came from.

Related surfaces: `pages/brand.tsx` (Read mode, the brand toolkit page), `pages/signup.tsx` and `pages/signin.tsx` (placeholder destinations until auth exists).

## Direction contract

THESIS: One idea: your records, read back exactly as written, with every fact traceable to its line. The page refuses the vague wellness hero (smiling stock photo, gradient blob, "take control of your health") and instead proves the mechanism in the first viewport with a working demonstration.

OWN-WORLD: White page, one deep sea-green primary (#0E6F5C) used for the mark, primary action and links; near-black green ink (#16211F); pale green wash (#EEF5F2) for alternating sections; amber (#8A5A00) reserved by law for the Person's Account; brick red (#B3261E) reserved for Disputed. One typeface, Atkinson Hyperlegible Next, self-hosted, 200 to 800, large default size (19px body). Radii 12px on controls, 20px on panels. Soft offset shadows only. Icons are authored SVG at 1.75 stroke. The mark is a rounded page outline with three lines, the middle line running out of the page to a dot: a fact traced to its source.

STORY: The visitor understands in one line that Health Hub holds their letters and results and shows what they say. They believe it because they can see a letter beside its timeline and tap a fact to see its exact line, and because the page states plainly what it never does. They create an account.

FIRST VIEWPORT: Header: mark and wordmark left, four plain links and Sign in right, Create account as the single filled button; under 900px the links and Sign in move into a disclosure menu beside the button. Below, a two-column hero on desktop (copy 45%, demo 55%). Left: a 56px headline in three lines (the copy column is about 480px at 1440; two lines would need a shorter headline than the thesis allows), a 21px lede, the filled Create account button and a text Sign in link side by side, then three short ticked assurances in one row at 1440, wrapping below that. Right: the live demonstration panel, labelled "Example records, not a real person": a clinic letter rendered as a document at left of the panel, the Timeline as four dated rows at right, one row active with its line highlighted in the letter and a Source label beneath. On mobile the demo stacks below the copy and the letter sits above the timeline.

FORM: The category standard (standing exit), chosen by the user after two re-roll rounds and a safer-register hand; peer bar Pharmacy2U. Seed key 6fc5110d. Signature interaction: the trace (hover or tap on a Fact highlights its source line; keyboard focus does the same). Motion grammar: one authored moment, the trace highlight easing in at 240ms exponential ease-out; no entrance animations; reduced motion removes the easing.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
