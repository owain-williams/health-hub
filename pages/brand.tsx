import { Mark } from "../src/ui/Logo";
import { IconCheck, IconDownload, IconFlag, IconInfo, IconPen, IconPerson, IconTrace, IconUpload } from "../src/ui/icons";
import "./brand.css";

const COLOURS = [
  { name: "Ink", token: "--hh-ink", hex: "#16211F", role: "Headings and body text.", on: "white", contrast: "16.5 : 1" },
  { name: "Ink soft", token: "--hh-ink-soft", hex: "#4A5B56", role: "Secondary text, captions, labels.", on: "white", contrast: "7.2 : 1" },
  { name: "Paper", token: "--hh-paper", hex: "#FFFFFF", role: "The page. Light is chosen for a kitchen table in daylight.", on: "ink", contrast: "" },
  { name: "Wash", token: "--hh-wash", hex: "#EEF5F2", role: "Alternating sections, the letter in the demonstration, hover.", on: "ink", contrast: "" },
  { name: "Primary", token: "--hh-primary", hex: "#0E6F5C", role: "The mark, the one primary action, links, Source labels, focus.", on: "white", contrast: "6.1 : 1" },
  { name: "Primary wash", token: "--hh-primary-wash", hex: "#D7ECE6", role: "Selected fact, the lit line in a letter, focus halo.", on: "ink", contrast: "" },
  { name: "Account", token: "--hh-account", hex: "#8A5A00", role: "Reserved by law for the Person's Account. Appears nowhere else.", on: "white", contrast: "5.9 : 1" },
  { name: "Disputed", token: "--hh-disputed", hex: "#B3261E", role: "Reserved by law for a Disputed mark and form errors. Appears nowhere else.", on: "white", contrast: "6.5 : 1" },
];

const TYPE = [
  { name: "Display", sample: "Your medical letters, read back exactly as written.", css: "clamp(2.2rem, 1.4rem + 2.6vw, 3.05rem) / 1.1, weight 700, tracking -0.025em", cls: "hh-type-display" },
  { name: "Heading 2", sample: "What Health Hub never does", css: "36px / 1.15, weight 700, tracking -0.015em", cls: "hh-type-h2" },
  { name: "Heading 3", sample: "A Pathway: related events, in the order they happened", css: "22px / 1.3, weight 700", cls: "hh-type-h3" },
  { name: "Lede", sample: "Upload clinic letters, results and prescriptions. Health Hub puts every fact on a dated timeline.", css: "22px / 1.5, weight 400, ink soft", cls: "hh-type-lede" },
  { name: "Body", sample: "Each statement the document makes becomes a Fact, with its date and a Source pointing to the exact page and line.", css: "19px / 1.55, weight 400 (18px under 720px wide)", cls: "hh-type-body" },
  { name: "Small", sample: "Clinic letter, 21 March 2025, page 1, line 5", css: "18px / 1.5, weight 500", cls: "hh-type-small" },
  { name: "Caption", sample: "Example records, not a real person", css: "16px / 1.5, weight 500, ink soft", cls: "hh-type-caption" },
];

export default function BrandPage() {
  return (
    <>
      <section className="hh-brand-hero">
        <div className="hh-container">
          <h1>The Health Hub brand toolkit</h1>
          <p className="hh-lede hh-measure">
            Everything needed to make something look and sound like Health Hub: the mark, the colours, the typeface, the words,
            and the handful of components that carry the product's one idea. Facts, shown exactly as the records state them,
            each traceable to its source.
          </p>
          <p className="hh-brand-hero__scope">Version 1, November 2026. Maintained alongside the code in this repository.</p>
          <nav className="hh-brand-toc" aria-label="On this page">
            <a href="#idea">The idea</a>
            <a href="#mark">Mark and wordmark</a>
            <a href="#colour">Colour</a>
            <a href="#type">Type</a>
            <a href="#voice">Voice</a>
            <a href="#components">Components</a>
            <a href="#motion">Motion and access</a>
            <a href="#downloads">Downloads</a>
          </nav>
        </div>
      </section>

      <section className="hh-section hh-brand-section" id="idea">
        <div className="hh-container hh-brand-grid">
          <div className="hh-brand-side">
            <h2>The idea</h2>
          </div>
          <div className="hh-brand-body">
            <p className="hh-lede">Health Hub shows what a person's medical records say. It never says what they mean.</p>
            <p>
              Every visual decision follows from that. The mark is a page with one line traced out to a point: a fact, followed back
              to where it came from. The palette is white and one calm green so that the two reserved colours, amber for the
              Person's Account and red for Disputed, carry real information when they appear. The typeface was designed for
              readers with low vision, because older eyes and unsteady hands are the normal case for this audience.
            </p>
            <p>
              The brief asked for something comforting but beautiful, inviting but serious enough for people of all ages and
              wellnesses. The answer is restraint executed well: generous type, unhurried spacing, plain words, and no device that
              suggests judgement, urgency or play.
            </p>
            <ul className="hh-brand-principles">
              <li><b>Show, never interpret.</b> Nothing on a surface implies a judgement about health.</li>
              <li><b>Traceable by default.</b> Any statement can be followed to its page in one step.</li>
              <li><b>Calm under uncertainty.</b> Partial reads, undated facts and deleted records are shown as what they are.</li>
              <li><b>Readable by anyone who holds a letter.</b> Large type, big targets, high contrast, by default.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="hh-section hh-brand-section hh-section--wash" id="mark">
        <div className="hh-container hh-brand-grid">
          <div className="hh-brand-side">
            <h2>Mark and wordmark</h2>
            <p className="hh-muted">A page, three lines, and one line that leaves the page to end in a point.</p>
          </div>
          <div className="hh-brand-body">
            <div className="hh-brand-logos">
              <figure className="hh-panel hh-logo-tile">
                <span className="hh-logo-tile__mark" style={{ color: "var(--hh-primary)" }}><Mark className="hh-mark-xl" title="Health Hub mark on white" /></span>
                <figcaption>Mark on paper</figcaption>
              </figure>
              <figure className="hh-panel hh-logo-tile hh-logo-tile--primary">
                <img src="/brand/mark-reversed.svg" alt="Health Hub mark reversed on green" width="120" height="120" />
                <figcaption>Mark reversed, inside its tile</figcaption>
              </figure>
              <figure className="hh-panel hh-logo-tile hh-logo-tile--wide">
                <img src="/brand/lockup.svg" alt="Health Hub logo: the mark beside the wordmark" className="hh-lockup-img" />
                <figcaption>Primary lockup. The wordmark is Atkinson Hyperlegible Next Bold, outlined.</figcaption>
              </figure>
            </div>
            <div className="hh-brand-rules">
              <div>
                <h3>Clear space and size</h3>
                <p>Keep clear space around the lockup equal to the height of the mark's page. Never show the mark smaller than 24px, or the lockup narrower than 120px. In a favicon the mark sits in its green tile.</p>
              </div>
              <div>
                <h3>Use it like this</h3>
                <ul className="hh-brand-list">
                  <li>Mark in primary green on white, or white on primary green.</li>
                  <li>Wordmark in ink on white, or white on green.</li>
                  <li>The dot always sits outside the page. It is the point of the mark.</li>
                </ul>
              </div>
              <div>
                <h3>Not like this</h3>
                <ul className="hh-brand-list hh-brand-list--no">
                  <li>No gradients, shadows or outlines on the mark.</li>
                  <li>No other colours. Amber and red are reserved for states.</li>
                  <li>No hearts, crosses, pulses or caducei beside it. Health Hub is not a clinic.</li>
                  <li>Never set the wordmark in another face, or stretch it.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="hh-section hh-brand-section" id="colour">
        <div className="hh-container hh-brand-grid">
          <div className="hh-brand-side">
            <h2>Colour</h2>
            <p className="hh-muted">White, one green, two reserved states. Every pair meets WCAG 2.2 AA; the contrast column is against white.</p>
          </div>
          <div className="hh-brand-body">
            <ul className="hh-swatches">
              {COLOURS.map((c) => (
                <li key={c.token} className="hh-swatch">
                  <span className="hh-swatch__chip" style={{ background: c.hex, color: c.on === "white" ? "#fff" : "var(--hh-ink)", borderColor: c.hex === "#FFFFFF" ? "var(--hh-line)" : "transparent" }}>
                    {c.contrast && <span className="hh-swatch__contrast">{c.contrast}</span>}
                  </span>
                  <span className="hh-swatch__meta">
                    <b>{c.name}</b>
                    <code>{c.hex}</code>
                    <code>{c.token}</code>
                    <span>{c.role}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="hh-brand-rules">
              <div>
                <h3>Colour by law</h3>
                <p>Amber means "the person wrote this". Red means "the person disputes this" or "this field has an error". Neither is used for decoration, emphasis, charts or buttons, so that when a reader sees it, it means one thing.</p>
              </div>
              <div>
                <h3>Never by colour alone</h3>
                <p>Every state also carries a word and an icon: the pen for the Person's Account, the flag for Disputed, the trace for a Source. Colour confirms; it never carries the message by itself.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="hh-section hh-brand-section hh-section--wash" id="type">
        <div className="hh-container hh-brand-grid">
          <div className="hh-brand-side">
            <h2>Type</h2>
            <p className="hh-muted">One typeface for everything: Atkinson Hyperlegible Next, 200 to 800, self-hosted under the SIL Open Font License.</p>
          </div>
          <div className="hh-brand-body">
            <p>
              Atkinson Hyperlegible was drawn for the Braille Institute to be readable by people with low vision. Its letterforms are
              deliberately distinct from one another: the capital I, lowercase l and figure 1 cannot be confused, nor can 0 and O.
              For a product that shows "500 mg" and "48 mmol/mol" to people of every age, that is the whole point.
            </p>
            <ol className="hh-type-scale">
              {TYPE.map((t) => (
                <li key={t.name}>
                  <span className="hh-type-scale__meta"><b>{t.name}</b><span>{t.css}</span></span>
                  <span className={`hh-type-scale__sample ${t.cls}`}>{t.sample}</span>
                </li>
              ))}
            </ol>
            <div className="hh-brand-rules">
              <div>
                <h3>Setting rules</h3>
                <ul className="hh-brand-list">
                  <li>Body is 19px, never smaller than 16px anywhere, including captions.</li>
                  <li>Body measure 60 to 70 characters. Headings are balanced.</li>
                  <li>Numbers in facts, dates and tables use tabular figures.</li>
                  <li>Emphasis is weight, never colour or italics alone. No all-caps labels above headings.</li>
                </ul>
              </div>
              <div>
                <h3>Fallbacks</h3>
                <p>If the font cannot load, the stack falls to Segoe UI, then the system sans. Nothing in the layout depends on the exact face, and no text is set as an image except the outlined wordmark.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="hh-section hh-brand-section" id="voice">
        <div className="hh-container hh-brand-grid">
          <div className="hh-brand-side">
            <h2>Voice</h2>
            <p className="hh-muted">Plain, factual, unhurried. We describe what the records say and what the product does, and nothing else.</p>
          </div>
          <div className="hh-brand-body">
            <div className="hh-voice-grid">
              <div className="hh-panel hh-voice-card">
                <h3><IconCheck /> Say</h3>
                <ul className="hh-brand-list">
                  <li>"Your records state an HbA1c of 48 mmol/mol on 3 March 2025."</li>
                  <li>"Health Hub does not interpret or advise."</li>
                  <li>"Page 2 could not be read. Nothing was guessed to fill the gap."</li>
                  <li>"This fact is the Person's Account."</li>
                  <li>"Deleting your account deletes everything."</li>
                </ul>
              </div>
              <div className="hh-panel hh-voice-card hh-voice-card--no">
                <h3><IconFlag /> Never say</h3>
                <ul className="hh-brand-list hh-brand-list--no">
                  <li>"Your result is normal", "high", "good", "concerning".</li>
                  <li>"You're overdue", "Act now", "Don't miss".</li>
                  <li>"Take control of your health", "Your wellness journey".</li>
                  <li>"Our AI understands your records."</li>
                  <li>Any exclamation mark.</li>
                </ul>
              </div>
            </div>
            <div className="hh-brand-rules">
              <div>
                <h3>Use the product's words</h3>
                <p>Record, Fact, Source, Timeline, Pathway, Person Statement, Person's Account, Disputed, Declined. Not document, data point, reference, journey, note, self-reported, rejected or refusal. The glossaries in the repository are the authority.</p>
              </div>
              <div>
                <h3>Address and tense</h3>
                <p>"You" and "your records". "Health Hub" in the third person, never "we" when describing what the product does. Present tense. One idea per sentence.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="hh-section hh-brand-section hh-section--wash" id="components">
        <div className="hh-container hh-brand-grid">
          <div className="hh-brand-side">
            <h2>Components</h2>
            <p className="hh-muted">The handful of parts every surface is built from. Each is in the shared stylesheet.</p>
          </div>
          <div className="hh-brand-body hh-components">
            <div className="hh-component">
              <h3>Buttons</h3>
              <p className="hh-muted">One filled action per view. Minimum height 52px, 60px for the page's main action. Radius 12px.</p>
              <div className="hh-panel hh-component__stage">
                <a className="hh-btn hh-btn--primary" href="/signup">Create account</a>
                <a className="hh-btn hh-btn--secondary" href="/">Back to the front page</a>
                <a className="hh-btn hh-btn--quiet" href="/signin">Sign in</a>
                <button type="button" className="hh-btn hh-btn--primary" disabled>Uploading…</button>
              </div>
            </div>

            <div className="hh-component">
              <h3>Fields</h3>
              <p className="hh-muted">Label above, hint below, error in red with a sentence that names the problem and the fix.</p>
              <div className="hh-panel hh-component__stage hh-component__stage--stack">
                <div className="hh-field">
                  <label className="hh-label" htmlFor="demo-date">Record date</label>
                  <input className="hh-input" id="demo-date" placeholder="For example, 21 March 2025" readOnly />
                  <span className="hh-hint">The date printed on the letter, not the day you uploaded it.</span>
                </div>
                <div className="hh-field">
                  <label className="hh-label" htmlFor="demo-email">Email address</label>
                  <input className="hh-input" id="demo-email" defaultValue="j.example@" aria-invalid="true" aria-describedby="demo-email-err" readOnly />
                  <span className="hh-error" id="demo-email-err">That email address is missing the part after the @. Check it and try again.</span>
                </div>
              </div>
            </div>

            <div className="hh-component">
              <h3>The Fact row</h3>
              <p className="hh-muted">Date, value, kind, Source. The Source is always present and always a link. The Person's Account turns the date and source amber and adds the pen.</p>
              <div className="hh-panel hh-component__stage hh-component__stage--stack">
                <div className="hh-fact" aria-pressed="true" style={{ cursor: "default" }}>
                  <time className="hh-fact__date" dateTime="2025-03-03">3 Mar 2025</time>
                  <span className="hh-fact__body">
                    <span className="hh-fact__value">HbA1c 48 mmol/mol</span>
                    <span className="hh-fact__kind">Measurement</span>
                    <span className="hh-source"><IconTrace /> Clinic letter, 21 March 2025, page 1, line 5</span>
                  </span>
                </div>
                <div className="hh-fact hh-fact--account" style={{ cursor: "default" }}>
                  <time className="hh-fact__date" dateTime="2025-04-10">10 Apr 2025</time>
                  <span className="hh-fact__body">
                    <span className="hh-fact__value">Felt dizzy for two mornings after the dose change</span>
                    <span className="hh-mark-account"><IconPen /> Person's Account</span>
                    <span className="hh-source"><IconPerson /> Stated by you, 10 April 2025</span>
                  </span>
                </div>
                <div className="hh-fact" style={{ cursor: "default" }}>
                  <time className="hh-fact__date" dateTime="2025-03-21">21 Mar 2025</time>
                  <span className="hh-fact__body">
                    <span className="hh-fact__value">Metformin 500 mg twice daily</span>
                    <span className="hh-mark-disputed"><IconFlag /> Disputed by you: "The dose was changed to once daily in February."</span>
                    <span className="hh-source"><IconTrace /> Clinic letter, 21 March 2025, page 1, line 6</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="hh-component">
              <h3>Marks and labels</h3>
              <p className="hh-muted">Small, always word plus icon. The example label sits on every synthetic demonstration.</p>
              <div className="hh-panel hh-component__stage">
                <span className="hh-source"><IconTrace /> Source</span>
                <span className="hh-mark-account"><IconPen /> Person's Account</span>
                <span className="hh-mark-disputed"><IconFlag /> Disputed</span>
                <span className="hh-status"><IconCheck /> Confirmed by you</span>
                <span className="hh-example"><IconInfo /> Example records, not a real person</span>
              </div>
            </div>

            <div className="hh-component">
              <h3>Icons</h3>
              <p className="hh-muted">Authored SVG on a 24px grid, 1.75px stroke, round caps and joins. Never emoji, never a mixed library.</p>
              <div className="hh-panel hh-component__stage hh-icon-row">
                <IconUpload label="Upload" /><IconTrace label="Trace to source" /><IconPerson label="Person" /><IconPen label="Person Statement" /><IconFlag label="Disputed" /><IconCheck label="Confirmed" /><IconInfo label="Information" /><IconDownload label="Download" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="hh-section hh-brand-section" id="motion">
        <div className="hh-container hh-brand-grid">
          <div className="hh-brand-side">
            <h2>Motion and access</h2>
          </div>
          <div className="hh-brand-body">
            <div className="hh-brand-rules">
              <div>
                <h3>One authored moment</h3>
                <p>The trace: selecting a Fact lights its line in the letter over 240ms with an exponential ease-out. Hover, focus and tap all do it. Nothing animates on entry, nothing scrolls into view, and under reduced motion every duration is zero.</p>
              </div>
              <div>
                <h3>WCAG 2.2 AA, as a floor</h3>
                <ul className="hh-brand-list">
                  <li>Body text at least 4.5 : 1; large text and controls at least 3 : 1.</li>
                  <li>Every target at least 44 by 44px; main actions 52 to 60px tall.</li>
                  <li>A 3px green focus ring, offset 3px, on every interactive element.</li>
                  <li>Nothing conveyed by colour alone. Every image of meaning has text.</li>
                  <li>Everything works with a keyboard and reads in order with a screen reader.</li>
                </ul>
              </div>
              <div>
                <h3>Depth and shape</h3>
                <p>Panels have a 20px radius and a soft, offset shadow. Controls have a 12px radius. There are no hard shadows and no gradients. The only blur is the sticky header's translucent ground, never decoration.</p>
              </div>
              <div>
                <h3>Light, not dark</h3>
                <p>The scene is a kitchen table or a waiting room in daylight, read by someone who may be tired or anxious. A white page with dark text is the most legible choice for that scene, so there is no dark theme.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="hh-section hh-brand-section hh-section--wash" id="downloads">
        <div className="hh-container hh-brand-grid">
          <div className="hh-brand-side">
            <h2>Downloads</h2>
          </div>
          <div className="hh-brand-body">
            <ul className="hh-downloads">
              <li><a className="hh-btn hh-btn--secondary" href="/brand/mark.svg" download><IconDownload /> Mark (SVG)</a></li>
              <li><a className="hh-btn hh-btn--secondary" href="/brand/mark-reversed.svg" download><IconDownload /> Mark, reversed (SVG)</a></li>
              <li><a className="hh-btn hh-btn--secondary" href="/brand/wordmark.svg" download><IconDownload /> Wordmark (SVG)</a></li>
              <li><a className="hh-btn hh-btn--secondary" href="/brand/lockup.svg" download><IconDownload /> Lockup (SVG)</a></li>
            </ul>
            <p className="hh-muted" style={{ marginTop: "1.5rem" }}>
              Tokens live in <code>pages/style.css</code> as <code>--hh-*</code> custom properties. Font files are in{" "}
              <code>public/fonts/</code>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
