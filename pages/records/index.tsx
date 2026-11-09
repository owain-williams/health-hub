import { Notice } from "../../src/ui/auth/Field";
import { formatDay } from "../../src/ui/records/format";
import type { Props } from "./index.server";
import "../account.css";
import "./records.css";

export default function RecordsPage({ records, deleted }: Props) {
  return (
    <section className="hh-settings">
      <div className="hh-container hh-settings__wrap">
        <header className="hh-records__head">
          <h1>Your records</h1>
          <a className="hh-btn hh-btn--primary hh-btn--large" href="/records/new">
            Upload a record
          </a>
        </header>
        {deleted ? <Notice tone="success">The Record has been deleted.</Notice> : null}
        {records.length === 0 ? (
          <p className="hh-lede">You have not uploaded any records yet. Upload a letter, result or prescription as a PDF or photos.</p>
        ) : (
          <ul className="hh-records__list">
            {records.map((r) => (
              <li className="hh-records__item" key={r.id}>
                <a href={`/records/${r.id}`}>
                  <span className="hh-records__label">{r.label}</span>
                  <span className="hh-records__meta">
                    Uploaded {formatDay(r.uploadedAt)} · {r.read ? "Read" : "Not read yet"}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
