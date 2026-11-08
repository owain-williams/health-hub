---
name: Health Hub
description: A patient-facing hub for a person's own medical records; white page, one green, one typeface, every fact traced to its line.
colors:
  ink: "#16211f"
  ink-soft: "#4a5b56"
  ink-faint: "#7a8a85"
  paper: "#ffffff"
  wash: "#eef5f2"
  wash-deep: "#dcebe4"
  line: "#cfdcd6"
  line-soft: "#e3ece8"
  primary: "#0e6f5c"
  primary-deep: "#0a5546"
  primary-wash: "#d7ece6"
  account: "#8a5a00"
  account-wash: "#f6ecd8"
  disputed: "#b3261e"
  disputed-wash: "#f8e3e1"
typography:
  display:
    fontFamily: "Atkinson Hyperlegible Next, Segoe UI, system-ui, -apple-system, sans-serif"
    fontSize: "clamp(2.2rem, 1.4rem + 2.6vw, 3.05rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Atkinson Hyperlegible Next, Segoe UI, system-ui, -apple-system, sans-serif"
    fontSize: "1.8947rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Atkinson Hyperlegible Next, Segoe UI, system-ui, -apple-system, sans-serif"
    fontSize: "1.1579rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.015em"
  lede:
    fontFamily: "Atkinson Hyperlegible Next, Segoe UI, system-ui, -apple-system, sans-serif"
    fontSize: "1.1579rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  body:
    fontFamily: "Atkinson Hyperlegible Next, Segoe UI, system-ui, -apple-system, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  small:
    fontFamily: "Atkinson Hyperlegible Next, Segoe UI, system-ui, -apple-system, sans-serif"
    fontSize: "0.9474rem"
    fontWeight: 500
    lineHeight: 1.55
    letterSpacing: "normal"
  caption:
    fontFamily: "Atkinson Hyperlegible Next, Segoe UI, system-ui, -apple-system, sans-serif"
    fontSize: "0.8421rem"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "normal"
rounded:
  inline: "6px"
  control: "12px"
  panel: "20px"
  chip: "999px"
spacing:
  s1: "0.25rem"
  s2: "0.5rem"
  s3: "0.75rem"
  s4: "1rem"
  s5: "1.5rem"
  s6: "2rem"
  s7: "3rem"
  s8: "4rem"
  s9: "6rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.paper}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "0 1.5rem"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.primary-deep}"
    textColor: "{colors.paper}"
  button-primary-large:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.paper}"
    typography: "{typography.lede}"
    rounded: "{rounded.control}"
    padding: "0 2rem"
    height: "60px"
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.primary}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "0 1.5rem"
    height: "52px"
  button-secondary-hover:
    backgroundColor: "{colors.wash}"
    textColor: "{colors.primary-deep}"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "0 0.75rem"
    height: "52px"
  button-quiet-hover:
    backgroundColor: "{colors.wash}"
    textColor: "{colors.primary}"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "0 1rem"
    height: "52px"
  panel:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "1.5rem"
  fact-row:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "1rem"
  fact-row-hover:
    backgroundColor: "{colors.wash}"
    textColor: "{colors.ink}"
  fact-row-selected:
    backgroundColor: "{colors.primary-wash}"
    textColor: "{colors.ink}"
  fact-row-account-selected:
    backgroundColor: "{colors.account-wash}"
    textColor: "{colors.ink}"
  source-label:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    typography: "{typography.small}"
  mark-account:
    backgroundColor: "transparent"
    textColor: "{colors.account}"
    typography: "{typography.small}"
  mark-disputed:
    backgroundColor: "transparent"
    textColor: "{colors.disputed}"
    typography: "{typography.small}"
  status-chip:
    backgroundColor: "{colors.primary-wash}"
    textColor: "{colors.primary}"
    typography: "{typography.caption}"
    rounded: "{rounded.chip}"
    padding: "4px 10px"
  example-label:
    backgroundColor: "transparent"
    textColor: "{colors.ink-soft}"
    typography: "{typography.caption}"
  letter:
    backgroundColor: "{colors.wash}"
    textColor: "{colors.ink-soft}"
    typography: "{typography.caption}"
    rounded: "{rounded.control}"
    padding: "1rem"
  letter-line-lit:
    backgroundColor: "{colors.primary-wash}"
    textColor: "{colors.ink}"
    rounded: "{rounded.inline}"
    padding: "3px 8px"
---

# Design System: Health Hub

## Overview

**Creative North Star: "The Letter on the Kitchen Table"**

Health Hub looks like the category standard for a trusted UK health service, played straight and at full craft. A white page, one deep sea-green, one typeface designed for legibility, and generous type at 19px. Nothing on screen is trying to be clever; the one memorable moment is functional: touching a Fact lights the exact line of the letter it came from. The visual system exists to make a clinic letter and its Timeline sit side by side and be read by anyone who holds the paper, including older readers on a phone at a kitchen table.

Density is calm and spacious. Sections alternate white and a pale green wash, panels float on soft offset shadows, and every synthetic demonstration carries the words "Example records, not a real person". The two state colours, amber and brick red, are reserved by law for the Person's Account and for Disputed; they never decorate, and they never carry a message without a word and an icon beside them.

Confirmed rejections: no stock photography, no gradient blobs, no hero imagery of smiling people, no entrance animations, no dark theme, and no colour standing in for a word.

**Key Characteristics:**
- One typeface (Atkinson Hyperlegible Next, variable 200 to 800, self-hosted), 19px body, 18px under 720px
- One primary green for the mark, primary action, links and the Source label
- Amber reserved for the Person's Account, brick red reserved for Disputed and form errors
- Colour never alone: every state carries a word and an authored 1.75-stroke icon
- Two radii (12px controls, 20px panels) and two soft offset shadows
- One authored motion: the trace, 240ms exponential ease-out, zero under reduced motion
- Light theme only; WCAG 2.2 AA throughout

## Colors

A white page carrying a single sea-green, with two legally reserved state colours and a near-black green ink.

### Primary
- **Sea Green** (`primary`): the mark, the filled Create account button, links, the Source label, the trace dot, tick icons, section-step numerals, focus rings, caret and form accent. Deepens to **Deep Sea Green** (`primary-deep`) on hover of buttons and links.
- **Sea Green Wash** (`primary-wash`): the lit letter line, the selected Fact row, the Confirmed status chip background, input focus halo, text selection.

### Tertiary (reserved state colours)
- **Account Amber** (`account`) and **Amber Wash** (`account-wash`): used only for the Person's Account, wherever a Fact was written by the person rather than lifted from a Record. Colours the date, the Source label, the pen icon, the Pathway node ring, and the selected row background of an Account fact.
- **Disputed Brick** (`disputed`) and **Brick Wash** (`disputed-wash`): used only for the Disputed mark and for form error text and invalid field borders. Appears nowhere else.

### Neutral
- **Green Ink** (`ink`): headings, body text, bold Fact values.
- **Soft Ink** (`ink-soft`): ledes, descriptions, hints, footer, the letter body, demo titles, kinds, and the example label.
- **Faint Ink** (`ink-faint`): letter header lines, placeholders, input hover border.
- **Paper** (`paper`): the page, panels, buttons' secondary face, the header at 92% opacity.
- **Wash** (`wash`) and **Deep Wash** (`wash-deep`): alternating section backgrounds, the rendered letter, question bubbles, hover fills, file chips; Deep Wash for dividers inside washed sections.
- **Line** (`line`) and **Soft Line** (`line-soft`): borders on secondary buttons, inputs, FAQ rules, the Pathway thread (Line); panel borders, header and footer rules, table rows, answer bubbles (Soft Line).

### Named Rules
**The Colour by Law Rule.** Amber belongs to the Person's Account and brick red to Disputed and form errors. Neither appears on any other element for any reason; when they appear they carry real information.

**The Never by Colour Alone Rule.** Every state also carries a word and an icon: the pen for the Person's Account, the flag for Disputed, the trace for a Source, the tick for Confirmed. Colour confirms; it never carries the message by itself.

**The One Green Rule.** Sea Green is the only accent. It is used for things the reader can act on or follow (links, the primary action, the Source) and for the lit trace; it is never used as a background field except as the mark's reversed tile and the pale wash.

## Typography

**Display Font:** Atkinson Hyperlegible Next (with Segoe UI, system-ui, -apple-system, sans-serif)
**Body Font:** Atkinson Hyperlegible Next (same family)
**Label/Mono Font:** ui-monospace, SF Mono, Menlo, Consolas (code tokens only, on the brand page)

**Character:** One hyperlegible humanist sans at every size, set large. Headings are bold with slight negative tracking; body sits at 19px and 1.55 line height; nothing is set in capitals and nothing is condensed. The scale is a near 1.2 ratio stepping 16 / 18 / 19 / 22 / 28 / 36 / 42 to 58.

### Hierarchy
- **Display** (700, `clamp(2.2rem, 1.4rem + 2.6vw, 3.05rem)` = 42 to 58px, 1.1, -0.025em): the page h1 only; the hero headline is held to 16ch and three lines.
- **Headline** (700, 1.8947rem = 36px, 1.15, -0.015em): section h2 and the account-page h1.
- **Title** (700, 1.1579rem = 22px, 1.3): h3 for steps, shows, FAQ summaries, Never-list leads.
- **Lede** (400, 1.1579rem = 22px, 1.5, Soft Ink): the paragraph under a Display or Headline.
- **Body** (400, 1rem = 19px, 1.55): all running text; measure 66ch.
- **Small** (500 or 700, 0.9474rem = 18px): the Source label, marks, hints, Fact kinds, footer, tables, error text, the quiet menu button.
- **Caption** (500, 0.8421rem = 16px, Soft Ink): the example label, the rendered letter, timeline dates, status chips, step frames.
- **Extra-large** (1.4737rem = 28px) is defined but not used on any shipped surface.

### Named Rules
**The Large Default Rule.** Body is 19px on desktop and 18px below 720px; nothing a reader must read is set below 16px. The audience includes older eyes; the size is not negotiable downward.

**The No Capitals Rule.** No text is set in uppercase, no letter-spaced labels, and no kickers or eyebrows above headings. Hierarchy comes from size and weight alone.

**The Tabular Dates Rule.** Dates and numbers in Fact rows, timelines and tables use tabular figures so columns align.

## Layout

A single centred container of 1200px, inset 1.5rem from the viewport edge below 900px and 3rem above. Sections carry 4rem vertical padding, rising to 6rem at 900px and up; a tight variant uses 3rem. Section heads are capped at 48rem with 2rem below (3rem at 900px). Alternating sections switch between Paper and Wash.

Spacing is a base-8 ramp from 0.25rem to 6rem (`s1` to `s9`); grid gaps inside components use `s2` to `s4`, between components `s5` to `s7`, between sections `s8` to `s9`. Two-pixel gaps separate letter lines and timeline rows so lit rows read as a block.

Breakpoints as used: 420px (menu label hides), 640px (demo grid becomes two columns 11fr/10fr; Fact row goes single column below), 720px (root size drops to 18px; brand grids go two-up), 900px (desktop nav appears, menu hides, three-step row, two-column lists, footer 1.4fr/1fr), 1000px (hero becomes 5fr/7fr copy-to-demo). The header is sticky at 76px with 88px scroll padding.

Hero copy is capped at 36rem; the demo panel takes the wider column and stacks below the copy on mobile, letter above timeline. "What you'll see" alternates copy and art 2fr/3fr, swapping order on even rows.

## Elevation & Depth

A hybrid: tonal layering carries most depth (Paper panels on Wash sections, Wash insets inside Paper panels), with two soft offset shadows reserved for raised surfaces. Panels float on a long, diffuse downward shadow; the primary button carries a tinted green lift. Borders are hairline Soft Line on panels and 1.5px Line on controls. The sticky header is translucent Paper at 92% with a 10px blur and saturate so content scrolling beneath stays faint.

### Shadow Vocabulary
- **Panel** (`box-shadow: 0 18px 40px -20px rgba(22, 33, 31, 0.28), 0 4px 12px -6px rgba(22, 33, 31, 0.12)`): the demo panel, step frames, show art, logo tiles, voice cards, component stages, the compact menu, the account panel.
- **Raise** (`box-shadow: 0 10px 24px -14px rgba(14, 111, 92, 0.45)`): the primary button at rest; removed when disabled.
- **Focus halo** (`box-shadow: 0 0 0 4px var(--hh-primary-wash)`): text inputs on focus, together with a Sea Green border.

### Named Rules
**The Soft Offset Rule.** Shadows are ink-tinted, offset downward, negative-spread and low alpha. No hard offset shadows, no spread shadows, no glow, and no shadow on the mark.

**The Flat Inset Rule.** Anything inside a panel (the letter, file chips, lit lines, bubbles) is flat and tonal; only the panel itself is raised.

## Shapes

Two radii do the work: 12px on every control (buttons, inputs, Fact rows, the rendered letter, drop zones, swatches) and 20px on every panel. Pills (999px) are used for status chips and the ask prompt; 6px for inline highlights (lit letter lines, focus ring corners, code). Speech bubbles use 16px with one 4px corner pointing to the speaker. The Pathway thread is a 2px Line rule with 14px Paper nodes ringed 3px in Sea Green (amber for an Account event). Borders are 1.5px on controls, 1px on panels and rules, dashed 1.5px on the upload drop zone.

The mark is a rounded page outline (rx 5 on a 40 grid, 2.5 stroke) with three lines, the middle line running out of the page to a dot: a fact traced to its source. It draws in currentColor; reversed it sits white inside a Sea Green tile. Icons share the grammar: 24px grid, 1.75 stroke, round caps and joins, no fills except the trace dot and punctuation dots.

## Components

### Buttons
Calm and confident; one filled action per view.
- **Shape:** gently rounded (12px), 52px minimum height, 1.5px border (transparent unless secondary), weight 700, body size.
- **Primary:** Sea Green fill, white text, Raise shadow; padding 0 1.5rem. Large variant 60px tall, 0 2rem, 22px text, used once in the hero and once in the close.
- **Secondary:** Paper fill, Sea Green text, Line border; hover switches border to Sea Green and fill to Wash.
- **Quiet:** transparent, Sea Green text, 0 0.75rem padding; hover fills Wash. Used for Sign in beside a primary.
- **Hover / Focus / Active:** primary deepens to Deep Sea Green; all buttons translate 1px down on press; focus is the global 3px Sea Green outline offset 3px. Transitions 240ms ease-out on colour, shadow, transform and border.
- **Disabled:** 55% opacity, no shadow, not-allowed cursor.
- In the header buttons drop to 46px (44px and caption size below 900px).

### Chips
- **Status chip** (`status-chip`): pill, Sea Green Wash fill, Sea Green 700 caption text, 14px tick icon, "Confirmed by you". Only green carries a status chip; Account and Disputed are inline marks, not chips.
- **Ask prompt**: pill with 1.5px Line border, Soft Ink text, Sea Green question icon.

### Cards / Containers
- **Panel:** Paper, 20px radius, 1px Soft Line border, Panel shadow. Padding 1.5rem (demo, show art, stages), 1rem (step frames, 232px min height), 2rem (account panel, wide logo tile).
- **Letter inset:** Wash, 12px radius, 1rem padding, caption size, Soft Ink; lines are flat rows that light to Sea Green Wash with Ink 700 text when traced.
- **Bubbles:** question right-aligned in Wash with the lower-right corner at 4px, 700 weight; answer left-aligned with Soft Line border and the lower-left corner at 4px; Declined answers take a Line border and an off-white ground with a Soft Ink info line.

### Inputs / Fields
- **Style:** Paper, 1.5px Line border, 12px radius, 52px tall, 1rem inline padding; label 700 above, hint Small Soft Ink below; placeholder Faint Ink.
- **Hover / Focus:** border to Faint Ink on hover; on focus the outline is replaced by a Sea Green border and a 4px Sea Green Wash halo.
- **Error:** message in Disputed Brick, 700, Small, beside an invalid border in the same colour; the message says what to check.

### Navigation
- Sticky header, 76px, translucent Paper with blur, Soft Line rule beneath. Mark (36px, Sea Green) and "Health Hub" wordmark (22px, 700, Ink) at left.
- Desktop (900px+): four plain links in Soft Ink 500 with a 2px transparent underline that turns Sea Green and Ink on hover or current page; Sign in as a quiet button and Create account as the only filled button.
- Compact (below 900px): links and Sign in move into a `details` disclosure with a secondary-styled "Menu" button (label hidden below 420px); the panel is a 20px Paper card with Panel shadow, 12px-rounded rows, Sign in last in Sea Green 700 above a rule.
- Footer: Soft Line rule, Small Soft Ink, two columns at 900px, mark repeated, independence statement capped at 60ch.

### Fact row and Source label (signature)
The product's core component. A Fact row is a full-width button: date column 7.2rem in tabular 700 Ink (single column below 640px), then value (700), kind (Small Soft Ink) and the Source label. The Source label is an inline Sea Green Small 500 line with a 16px trace icon reading "Clinic letter · page 1, line 5". Hover fills Wash; the selected row (`aria-pressed`) takes Sea Green Wash and a Sea Green border. An Account fact colours its date and Source amber, swaps the trace icon for the pen or person, and selects into Amber Wash with an amber border. In the demo timeline the row compacts to 0.75rem padding, single column, caption date and small value.

### The trace (signature interaction)
Hover, focus or tap on a Fact lights its line in the rendered letter: background to Sea Green Wash, text to Ink 700, over 240ms with `cubic-bezier(0.16, 1, 0.3, 1)`. It is the only authored motion on the site; nothing animates on entry or scroll, FAQ chevrons rotate 45 degrees with the same timing, and under `prefers-reduced-motion` every duration is zero.

### Marks and labels
- **Person's Account mark:** amber 700 Small with an 18px pen icon and the words "Person's Account".
- **Disputed mark:** Disputed Brick 700 Small with an 18px flag icon and the word "Disputed", followed where present by the person's statement in quotes.
- **Example label:** Caption Soft Ink 500 with a 16px info icon, "Example records, not a real person", on every synthetic demonstration (demo panel, step frames, show art).

### Lists
- **Ticks:** inline flex, Small Soft Ink, 20px Sea Green tick icons; caption size in the hero.
- **Never list:** 28px Sea Green shield icons in a 32px column, Title-size lead, Soft Ink body to 60ch, Deep Wash rules between items, two columns at 900px.
- **FAQ:** native `details` with Line rules, Title-size 700 summaries, Sea Green plus icon, body in Soft Ink to 66ch.

## Do's and Don'ts

### Do:
- **Do** set everything in Atkinson Hyperlegible Next from the self-hosted variable files; body 19px (18px under 720px), line height 1.55, measure 66ch.
- **Do** use Sea Green for the mark, the single filled action, links, the Source label and focus; deepen to Deep Sea Green on hover.
- **Do** mark every Person's Account fact in amber with the pen or person icon and the words, and every Disputed fact in brick red with the flag icon and the word.
- **Do** label every synthetic demonstration "Example records, not a real person" with the info icon.
- **Do** use 12px on controls and 20px on panels, with the Panel shadow on raised cards and the Raise shadow on the primary button only.
- **Do** show focus as a 3px Sea Green outline offset 3px, and inputs as a Sea Green border plus a 4px wash halo.
- **Do** keep the trace as the one motion: 240ms, `cubic-bezier(0.16, 1, 0.3, 1)`, zero under reduced motion.
- **Do** alternate Paper and Wash sections with 4rem (6rem at 900px) vertical padding inside a 1200px container.
- **Do** use the glossary words exactly: Record, Fact, Source, Timeline, Pathway, Person Statement, Person's Account, Disputed, Declined.

### Don't:
- **Don't** use amber or brick red anywhere except the Person's Account, Disputed, and form errors.
- **Don't** let colour carry a state without a word and an icon beside it.
- **Don't** add a second accent, a gradient, a dark theme, stock photography or decorative illustration.
- **Don't** set text in capitals, add kickers or eyebrows above headings, or go below 16px for anything a reader must read.
- **Don't** use hard offset shadows, spread shadows, glows, or any shadow or outline on the mark.
- **Don't** animate on entry or scroll; the trace is the only motion.
- **Don't** use glyph icons, icon fonts or imported icon packs; icons are authored SVG on the 24px grid at 1.75 stroke.
- **Don't** place more than one filled primary button in a view.
- **Don't** imply NHS or pharmacy affiliation through colour, crests or typography; the independence line stays in the footer.
