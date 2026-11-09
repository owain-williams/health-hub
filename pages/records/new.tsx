import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Notice, useHydrated } from "../../src/ui/auth/Field";
import type { Props } from "./new.server";
import "../account.css";
import "./records.css";

const ACCEPT = "application/pdf,image/jpeg,image/png";

interface Chosen {
  key: string;
  file: File;
  preview: string | null;
}

/**
 * Upload. Without JavaScript this is a plain multipart form. Once hydrated it
 * keeps a list the Person can add to (one photo at a time is fine), reorder and
 * trim, and shows upload progress.
 */
export default function UploadPage({ problem }: Props) {
  const hydrated = useHydrated();
  const [chosen, setChosen] = useState<Chosen[]>([]);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => () => chosen.forEach((c) => c.preview && URL.revokeObjectURL(c.preview)), []); // eslint-disable-line react-hooks/exhaustive-deps

  function add(event: ChangeEvent<HTMLInputElement>) {
    if (!hydrated) return;
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    setError(null);
    setChosen((list) => [
      ...list,
      ...files.map((file) => ({ key: crypto.randomUUID(), file, preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : null })),
    ]);
  }

  function move(index: number, by: -1 | 1) {
    setChosen((list) => {
      const next = [...list];
      [next[index], next[index + by]] = [next[index + by], next[index]];
      return next;
    });
  }

  function remove(index: number) {
    setChosen((list) => {
      const gone = list[index];
      if (gone.preview) URL.revokeObjectURL(gone.preview);
      return list.filter((_, i) => i !== index);
    });
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    if (!hydrated) return; // let the browser post the form itself
    event.preventDefault();
    if (chosen.length === 0) return setError("Choose a PDF or some photos to upload.");
    const data = new FormData();
    chosen.forEach((c) => data.append("files", c.file, c.file.name));
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/records/new");
    xhr.upload.onprogress = (e) => e.lengthComputable && setProgress(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 400 && xhr.responseURL) window.location.assign(xhr.responseURL);
      else fail();
    };
    xhr.onerror = fail;
    setProgress(0);
    xhr.send(data);
  }

  function fail() {
    setProgress(null);
    setError("The upload did not finish. Check your connection and try again.");
  }

  const uploading = progress !== null;

  return (
    <section className="hh-account">
      <div className="hh-container hh-account__wrap">
        <div className="hh-panel hh-account__panel hh-upload">
          <p>
            <a href="/records">← Your records</a>
          </p>
          <h1>Upload a record</h1>
          <p className="hh-lede">One letter, result or prescription: a PDF, or photos of each paper page.</p>
          {problem ? <Notice tone="error">{problem}</Notice> : null}
          {error ? <Notice tone="error">{error}</Notice> : null}

          <form method="post" action="/records/new" encType="multipart/form-data" onSubmit={submit}>
            <label className="hh-upload__picker">
              <strong>{chosen.length > 0 ? "Add more photos" : "Choose a PDF or take photos"}</strong>
              <span className="hh-muted">On a phone you can take a photo of each page.</span>
              <input type="file" name="files" accept={ACCEPT} multiple onChange={add} disabled={uploading} />
            </label>

            {chosen.length > 0 ? (
              <ol className="hh-upload__pages" aria-label="Pages to upload, in order">
                {chosen.map((c, i) => (
                  <li className="hh-upload__page" key={c.key}>
                    {c.preview ? <img className="hh-upload__thumb" src={c.preview} alt="" /> : <span className="hh-upload__thumb">PDF</span>}
                    <span>
                      <strong>Page {i + 1}</strong>
                      <br />
                      <span className="hh-upload__page-name hh-muted">{c.file.name}</span>
                    </span>
                    <div className="hh-actions">
                      <button type="button" className="hh-btn hh-btn--quiet" onClick={() => move(i, -1)} disabled={i === 0 || uploading} aria-label={`Move page ${i + 1} up`}>
                        Move up
                      </button>
                      <button type="button" className="hh-btn hh-btn--quiet" onClick={() => move(i, 1)} disabled={i === chosen.length - 1 || uploading} aria-label={`Move page ${i + 1} down`}>
                        Move down
                      </button>
                      <button type="button" className="hh-btn hh-btn--quiet" onClick={() => remove(i)} disabled={uploading} aria-label={`Remove page ${i + 1}`}>
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ol>
            ) : null}

            {uploading ? (
              <div role="status">
                <progress max={100} value={progress} aria-label="Upload progress" />
                <p>Uploading… {progress}%</p>
              </div>
            ) : null}

            <div className="hh-actions">
              <button className="hh-btn hh-btn--primary hh-btn--large" type="submit" disabled={uploading}>
                Upload
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
