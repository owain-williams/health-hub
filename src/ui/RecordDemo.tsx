import { useId, useState } from "react";
import { IconInfo, IconPerson, IconTrace } from "./icons";

/** A synthetic Record and its Facts, used only to demonstrate the mechanism.
 *  Every value here is invented; the panel is labelled as an example wherever it appears. */
type Fact = {
  id: string;
  date: string;
  dateLabel: string;
  value: string;
  kind: string;
  source: string;
  line: number | null; // index into the letter's lines; null for a Person Statement
  account?: boolean;
};

const LETTER_LINES = [
  "Royal Example Hospital · Diabetes Clinic",
  "21 March 2025",
  "Dear Dr Patel,",
  "Thank you for referring Ms J. Example, whom I saw in clinic on 21 March 2025.",
  "Her most recent HbA1c was 48 mmol/mol on 3 March 2025.",
  "She continues on metformin 500 mg twice daily.",
  "I have arranged a follow-up appointment in six months.",
  "Yours sincerely, Dr A. Specimen",
];

const FACTS: Fact[] = [
  { id: "f1", date: "2025-03-21", dateLabel: "21 Mar 2025", value: "Diabetes clinic appointment", kind: "Appointment", source: "Clinic letter · page 1, line 4", line: 3 },
  { id: "f2", date: "2025-03-03", dateLabel: "3 Mar 2025", value: "HbA1c 48 mmol/mol", kind: "Measurement", source: "Clinic letter · page 1, line 5", line: 4 },
  { id: "f3", date: "2025-03-21", dateLabel: "21 Mar 2025", value: "Metformin 500 mg twice daily", kind: "Medication", source: "Clinic letter · page 1, line 6", line: 5 },
  { id: "f4", date: "2025-04-10", dateLabel: "10 Apr 2025", value: "Felt dizzy for two mornings after the dose change", kind: "Statement", source: "Stated by you, 10 April 2025", line: null, account: true },
];

export function RecordDemo({ compact = false }: { compact?: boolean }) {
  const [active, setActive] = useState<string>("f2");
  const id = useId();
  const current = FACTS.find((f) => f.id === active) ?? FACTS[1];

  return (
    <section className={`hh-demo hh-panel${compact ? " hh-demo--compact" : ""}`} aria-labelledby={`${id}-title`}>
      <header className="hh-demo__head">
        <h2 id={`${id}-title`} className="hh-demo__title">What Health Hub shows you</h2>
        <span className="hh-example"><IconInfo /> Example records, not a real person</span>
      </header>

      <div className="hh-demo__grid">
        <article className="hh-letter" aria-label="Example clinic letter">
          <p className="hh-letter__kind">Clinic letter · page 1 of 1</p>
          <ol className="hh-letter__lines" aria-label="Lines of the letter">
            {LETTER_LINES.map((text, i) => {
              const lit = current.line === i;
              return (
                <li key={i} className={`hh-letter__line${lit ? " is-lit" : ""}${i < 2 ? " hh-letter__line--head" : ""}`} aria-current={lit ? "true" : undefined}>
                  {text}
                </li>
              );
            })}
          </ol>
          {current.line === null && (
            <p className="hh-letter__account">
              <IconPerson /> This fact is the Person's Account. It was written by the person, not lifted from a letter.
            </p>
          )}
        </article>

        <div className="hh-timeline" role="group" aria-label="Timeline of facts from your records">
          <p className="hh-timeline__hint">Select a fact to see the line it came from.</p>
          <ol className="hh-timeline__list">
            {FACTS.map((f) => (
              <li key={f.id}>
                <button
                  type="button"
                  className={`hh-fact${f.account ? " hh-fact--account" : ""}`}
                  aria-pressed={f.id === active}
                  onClick={() => setActive(f.id)}
                  onFocus={() => setActive(f.id)}
                  onMouseEnter={() => setActive(f.id)}
                >
                  <time className="hh-fact__date" dateTime={f.date}>
                    {f.dateLabel}
                  </time>
                  <span className="hh-fact__body">
                    <span className="hh-fact__value">{f.value}</span>
                    <span className="hh-fact__kind">{f.account ? "Person's Account" : f.kind}</span>
                    <span className="hh-source">
                      {f.account ? <IconPerson /> : <IconTrace />}
                      {f.source}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
