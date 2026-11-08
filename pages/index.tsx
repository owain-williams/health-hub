import type { Props } from "./index.server";
import { RecordDemo } from "../src/ui/RecordDemo";
import { IconCheck, IconDocument, IconFlag, IconInfo, IconLog, IconPen, IconPerson, IconPlus, IconQuestion, IconShield, IconTrace, IconTrash, IconUK, IconUpload } from "../src/ui/icons";
import "./index.css";

export default function HomePage(_props: Props) {
  return (
    <>
      <section className="hh-hero" aria-labelledby="hero-title">
        <div className="hh-container hh-hero__grid">
          <div className="hh-hero__copy">
            <h1 id="hero-title">Your medical letters, read back exactly as written.</h1>
            <p className="hh-lede">
              Upload clinic letters, results and prescriptions. Health Hub puts every fact on a dated timeline and shows you
              the line it came from. It never tells you what your records mean.
            </p>
            <div className="hh-hero__actions">
              <a className="hh-btn hh-btn--primary hh-btn--large" href="/signup">Create account</a>
              <a className="hh-btn hh-btn--quiet" href="/signin">Sign in</a>
            </div>
            <ul className="hh-ticks">
              <li><IconCheck /> Every fact cited</li>
              <li><IconCheck /> No interpretation</li>
              <li><IconCheck /> UK data only</li>
            </ul>
          </div>
          <RecordDemo />
        </div>
      </section>

      <section className="hh-section hh-section--wash" id="how-it-works" aria-labelledby="how-title">
        <div className="hh-container">
          <div className="hh-section__head">
            <h2 id="how-title">How it works</h2>
            <p className="hh-lede">Three steps. Your documents are never changed, and nothing is added that they do not say.</p>
          </div>
          <ol className="hh-steps">
            <li className="hh-step">
              <div className="hh-step__frame hh-panel" aria-hidden="true">
                <p className="hh-frame__title">Add a document</p>
                <div className="hh-frame__drop"><IconUpload /> PDF, or photos of each page</div>
                <ul className="hh-frame__files">
                  <li><IconDocument /> <span>clinic-letter-march.pdf</span><small>1 page</small></li>
                  <li><IconDocument /> <span>discharge-summary.jpg</span><small>2 photos</small></li>
                </ul>
                <span className="hh-example"><IconInfo /> Example records, not a real person</span>
              </div>
              <div>
                <h3>Upload a document</h3>
                <p>A PDF, or photos of the paper pages. A clinic letter, discharge summary, test result, prescription or imaging report. Each upload becomes one Record, kept exactly as given.</p>
              </div>
            </li>
            <li className="hh-step">
              <div className="hh-step__frame hh-panel" aria-hidden="true">
                <p className="hh-frame__title">Reading clinic-letter-march.pdf</p>
                <div className="hh-frame__letter">
                  <span>Dear Dr Patel,</span>
                  <span className="is-lit">Her most recent HbA1c was 48 mmol/mol on 3 March 2025.</span>
                  <span>She continues on metformin 500 mg twice daily.</span>
                </div>
                <div className="hh-frame__fact"><b>HbA1c 48 mmol/mol</b><span className="hh-source"><IconTrace /> Page 1, line 5</span></div>
                <span className="hh-example"><IconInfo /> Example records, not a real person</span>
              </div>
              <div>
                <h3>Health Hub reads it</h3>
                <p>Each statement the document makes becomes a Fact: a measurement, medication, appointment, referral, stated diagnosis or procedure, with its date and a Source pointing to the exact page and line. If a page cannot be read, you are told which one.</p>
              </div>
            </li>
            <li className="hh-step">
              <div className="hh-step__frame hh-panel" aria-hidden="true">
                <p className="hh-frame__title">Your Timeline</p>
                <ul className="hh-frame__timeline">
                  <li><time>14 Jan</time><span>Referral to diabetes clinic</span></li>
                  <li><time>3 Mar</time><span>HbA1c 48 mmol/mol</span></li>
                  <li><time>21 Mar</time><span>Diabetes clinic appointment</span></li>
                  <li className="is-account"><time>10 Apr</time><span>Felt dizzy for two mornings after the dose change</span></li>
                </ul>
                <div className="hh-frame__ask"><IconQuestion /> When was my last HbA1c?</div>
                <span className="hh-example"><IconInfo /> Example records, not a real person</span>
              </div>
              <div>
                <h3>Keep it, group it, ask about it</h3>
                <p>Facts sit on your Timeline in date order. You can group related events into a Pathway, add what was never written down in your own words, and ask questions that are answered only from your cited Facts.</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <section className="hh-section" id="what-you-see" aria-labelledby="see-title">
        <div className="hh-container">
          <div className="hh-section__head">
            <h2 id="see-title">What you'll see</h2>
            <p className="hh-lede">Everything below is an example, not a real person. It shows the shape of what Health Hub gives you.</p>
          </div>

          <div className="hh-shows">
            <article className="hh-show" aria-labelledby="show-pathway">
              <div className="hh-show__copy">
                <h3 id="show-pathway">A Pathway: related events, in the order they happened</h3>
                <p>Health Hub may propose that a referral, an appointment, a result and a follow-up letter belong together. You confirm it, rename it, or reject it. A Pathway records sequence only. It carries no overdue, next-step or urgency logic.</p>
              </div>
              <div className="hh-panel hh-show__art">
                <div className="hh-pathway__title">
                  <h3>Diabetes clinic referral</h3>
                  <span className="hh-status"><IconCheck /> Confirmed by you</span>
                </div>
                <ol className="hh-pathway">
                  <li className="hh-pathway__item"><span className="hh-pathway__node"><span /></span><div className="hh-pathway__text"><b>Referral to diabetes clinic</b>14 Jan 2025 · GP letter, page 1, line 3</div></li>
                  <li className="hh-pathway__item"><span className="hh-pathway__node"><span /></span><div className="hh-pathway__text"><b>HbA1c 48 mmol/mol</b>3 Mar 2025 · Clinic letter, page 1, line 5</div></li>
                  <li className="hh-pathway__item"><span className="hh-pathway__node"><span /></span><div className="hh-pathway__text"><b>Diabetes clinic appointment</b>21 Mar 2025 · Clinic letter, page 1, line 4</div></li>
                  <li className="hh-pathway__item hh-pathway__item--account"><span className="hh-pathway__node"><span /></span><div className="hh-pathway__text"><b>Felt dizzy for two mornings after the dose change</b><span className="hh-mark-account"><IconPerson /> Person's Account</span> · stated by you, 10 Apr 2025</div></li>
                </ol>
                <span className="hh-example"><IconInfo /> Example records, not a real person</span>
              </div>
            </article>

            <article className="hh-show" aria-labelledby="show-qa">
              <div className="hh-show__copy">
                <h3 id="show-qa">Questions answered only from your Facts</h3>
                <p>Ask when something happened or what a letter said. Every Answer cites the Facts it rests on and shows whether each came from a document or from you. Ask what something means, and Health Hub says plainly that it does not interpret or advise.</p>
              </div>
              <div className="hh-panel hh-show__art">
                <div className="hh-qa">
                  <p className="hh-q">When was my last HbA1c, and what was it?</p>
                  <div className="hh-a">
                    <p>Your records state an HbA1c of 48 mmol/mol on 3 March 2025.</p>
                    <span className="hh-source"><IconTrace /> Clinic letter, 21 March 2025, page 1, line 5</span>
                  </div>
                  <p className="hh-q">Is 48 a good result?</p>
                  <div className="hh-a hh-a--declined">
                    <span className="hh-a__declined"><IconInfo /> Health Hub does not interpret or advise</span>
                    <p>Your records state an HbA1c of 48 mmol/mol on 3 March 2025. Whether a result is good is a question for you and your clinician.</p>
                    <span className="hh-source"><IconTrace /> Clinic letter, 21 March 2025, page 1, line 5</span>
                  </div>
                </div>
                <span className="hh-example"><IconInfo /> Example records, not a real person</span>
              </div>
            </article>

            <article className="hh-show" aria-labelledby="show-own">
              <div className="hh-show__copy">
                <h3 id="show-own">Your own words, always marked as yours</h3>
                <p>When a letter is lost or something was never written down, you can add a Person Statement. Facts from it are shown as the Person's Account everywhere they appear, so they are never mistaken for something a clinician wrote. If you believe a fact is wrong, mark it Disputed with a note. It stays visible and unchanged.</p>
              </div>
              <div className="hh-panel hh-show__art">
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
                <span className="hh-example"><IconInfo /> Example records, not a real person</span>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="hh-section hh-section--wash" id="never" aria-labelledby="never-title">
        <div className="hh-container">
          <div className="hh-section__head">
            <h2 id="never-title">What Health Hub never does</h2>
            <p className="hh-lede">These are not settings. They are the limits the product is built around.</p>
          </div>
          <ul className="hh-never">
            <li><IconShield /><div><b>Never diagnoses</b><p>A diagnosis appears only when a document states one, and it is labelled as that document's statement.</p></div></li>
            <li><IconShield /><div><b>Never judges urgency</b><p>No red flags, no alerts, no "overdue". Your Timeline shows dates, not deadlines.</p></div></li>
            <li><IconShield /><div><b>Never scores or sets targets</b><p>No thresholds, ranges or risk calculations are applied to your results. The number on the page is the number you see.</p></div></li>
            <li><IconShield /><div><b>Never suggests what to do</b><p>Questions that ask for advice are declined, with the relevant Facts restated and cited so you can take them to your clinician.</p></div></li>
            <li><IconShield /><div><b>Never edits your records</b><p>Documents and Facts are kept exactly as they arrived. A correction is a new Record, and a Disputed mark sits beside the original.</p></div></li>
            <li><IconShield /><div><b>Never trains AI on your documents</b><p>The models that read your documents are chosen only from providers that keep data in the UK or EU and do not train on it.</p></div></li>
          </ul>
        </div>
      </section>

      <section className="hh-section" id="control" aria-labelledby="control-title">
        <div className="hh-container">
          <div className="hh-section__head">
            <h2 id="control-title">Your documents, your control</h2>
          </div>
          <div className="hh-control">
            <div className="hh-control__item"><IconUK /><div><b>Stored in the UK</b><p>Your documents, the database and the AI processing stay in the UK or, at minimum, the EU. That is a rule of the service, not a setting.</p></div></div>
            <div className="hh-control__item"><IconTrash /><div><b>Delete one record, or everything</b><p>Removing a document removes every fact lifted from it. Deleting your account removes your records, your files and your questions, with no retention period.</p></div></div>
            <div className="hh-control__item"><IconLog /><div><b>A log of every read</b><p>Every time a record, fact or answer is read, it is written to an access log you can see, attributed to the account that read it.</p></div></div>
            <div className="hh-control__item"><IconTrace /><div><b>Traceable to the page</b><p>Every statement Health Hub shows you can be followed back to the page and line it came from in one tap.</p></div></div>
          </div>
        </div>
      </section>

      <section className="hh-section hh-section--wash" id="questions" aria-labelledby="faq-title">
        <div className="hh-container">
          <div className="hh-section__head">
            <h2 id="faq-title">Questions people ask</h2>
          </div>
          <div className="hh-faq">
            <details>
              <summary>Is Health Hub part of the NHS?<IconPlus /></summary>
              <p className="hh-faq__body">No. Health Hub is an independent service. It is not run by the NHS, a GP practice or a pharmacy, and it has no access to your records unless you upload them yourself.</p>
            </details>
            <details>
              <summary>Who is it for?<IconPlus /></summary>
              <p className="hh-faq__body">Anyone who holds their own medical paperwork and wants to read it in one place: from a single referral letter to years of correspondence about a long-term condition. The type is set large and the controls are big because older eyes and unsteady hands are the normal case, not the exception.</p>
            </details>
            <details>
              <summary>Do I need a scanner?<IconPlus /></summary>
              <p className="hh-faq__body">No. A photo of each page taken on your phone is enough. You can also upload PDFs, such as letters sent to you by email.</p>
            </details>
            <details>
              <summary>What happens if a page cannot be read?<IconPlus /></summary>
              <p className="hh-faq__body">The record is marked as a partial read and you are told exactly which pages produced nothing. Nothing is guessed to fill the gap.</p>
            </details>
            <details>
              <summary>What if a fact is wrong?<IconPlus /></summary>
              <p className="hh-faq__body">Mark it Disputed and add a note. The fact stays visible and unchanged, with your note beside it. If a document itself is wrong, that is a matter for the clinic that wrote it; Health Hub never edits what a document says.</p>
            </details>
            <details>
              <summary>Can I keep records for someone else?<IconPlus /></summary>
              <p className="hh-faq__body">Not yet. Each account holds one person's records today. Whether and how someone could hold records for a relative, with their consent, has not been decided.</p>
            </details>
          </div>
        </div>
      </section>

      <section className="hh-section" aria-labelledby="close-title">
        <div className="hh-container hh-close">
          <h2 id="close-title">Start with the letter on your kitchen table.</h2>
          <p className="hh-lede">Create an account, upload one document, and see what it says.</p>
          <a className="hh-btn hh-btn--primary hh-btn--large" href="/signup">Create account</a>
        </div>
      </section>
    </>
  );
}
