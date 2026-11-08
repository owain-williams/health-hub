import { useEffect, useId, useState, type InputHTMLAttributes, type ReactNode } from "react";

interface FieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  label: string;
  hint?: ReactNode;
  error?: string | null;
}

/** A labelled input with an optional hint and error, wired for screen readers. */
export function Field({ label, hint, error, ...input }: FieldProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div className="hh-field">
      <label className="hh-label" htmlFor={id}>
        {label}
      </label>
      {hint ? (
        <p className="hh-hint" id={hintId}>
          {hint}
        </p>
      ) : null}
      <input
        {...input}
        id={id}
        className="hh-input"
        aria-invalid={error ? true : undefined}
        aria-describedby={[hintId, errorId].filter(Boolean).join(" ") || undefined}
      />
      {error ? (
        <p className="hh-error" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** A message announced to screen readers when it appears. */
export function Notice({ tone = "info", children }: { tone?: "info" | "error" | "success"; children: ReactNode }) {
  return (
    <div className={`hh-notice hh-notice--${tone}`} role={tone === "error" ? "alert" : "status"}>
      {children}
    </div>
  );
}

/** True once React has hydrated. Submit buttons stay disabled until then, so nothing is sent by a plain HTML form. */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}

/** Reads a text field from a submitted form. Reading the form (not React state) keeps anything typed before hydration. */
export function fieldOf(form: HTMLFormElement, name: string): string {
  const value = new FormData(form).get(name);
  return typeof value === "string" ? value : "";
}
