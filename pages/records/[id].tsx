import { Notice } from "../../src/ui/auth/Field";
import { formatDay } from "../../src/ui/records/format";
import type { Props } from "./[id].server";
import "../account.css";
import "./records.css";

export default function RecordPage({ record, uploaded, duplicate, confirmDelete }: Props) {
  const base = `/records/${record.id}`;
  const pageUrl = (n: number) => `/api/records/${record.id}/pages/${n}`;
  return (
    <section className="hh-settings">
      <div className="hh-container hh-settings__wrap">
        <p>
          <a href="/records">← Your records</a>
        </p>
        <header>
          <h1>{record.label}</h1>
        </header>
        {uploaded ? <Notice tone="success">Uploaded. Health Hub has not read it yet.</Notice> : null}
        {duplicate ? <Notice>You have already uploaded this. Here it is.</Notice> : null}

        <div className="hh-panel hh-settings__section">
          <dl className="hh-record__facts">
            <dt>Uploaded</dt>
            <dd>{formatDay(record.uploadedAt)}</dd>
            {record.originalName ? (
              <>
                <dt>Original name</dt>
                <dd>{record.originalName}</dd>
              </>
            ) : null}
            <dt>What it is</dt>
            <dd>{record.form === "pdf" ? "A PDF" : `${record.fileCount} ${record.fileCount === 1 ? "photo" : "photos"}`}</dd>
            <dt>Read</dt>
            <dd>Not read yet</dd>
          </dl>
        </div>

        <div className="hh-panel hh-settings__section">
          <h2>{record.form === "pdf" ? "The document" : "Pages"}</h2>
          {record.form === "pdf" ? (
            <p>
              <a className="hh-btn hh-btn--secondary" href={pageUrl(1)} target="_blank" rel="noopener">
                Open the PDF
              </a>
            </p>
          ) : (
            <ol className="hh-record__pages">
              {Array.from({ length: record.fileCount }, (_, i) => i + 1).map((n) => (
                <li key={n}>
                  <figure>
                    <img src={pageUrl(n)} alt={`Page ${n} of ${record.fileCount}`} loading="lazy" />
                    <figcaption>
                      Page {n} · <a href={pageUrl(n)} target="_blank" rel="noopener">Open full size</a>
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="hh-panel hh-settings__section hh-settings__section--danger" id="delete">
          <h2>Delete this Record</h2>
          {confirmDelete ? (
            <form method="post" action={`${base}?delete`}>
              <p>
                This removes <strong>{record.label}</strong> and its pages from Health Hub. It cannot be undone.
              </p>
              <div className="hh-actions">
                <button className="hh-btn hh-btn--danger" type="submit">
                  Yes, delete it
                </button>
                <a className="hh-btn hh-btn--quiet" href={base}>
                  Cancel
                </a>
              </div>
            </form>
          ) : (
            <p>
              <a className="hh-btn hh-btn--secondary" href={`${base}?confirm-delete=1#delete`}>
                Delete this Record
              </a>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
