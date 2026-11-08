import { useRouter } from "@void/react";
import { useState, type ReactNode } from "react";
import { isRecentSignInRequired, messageFor } from "../auth/client";
import { Notice } from "../auth/Field";

const dateTime = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/London" });
export const formatWhen = (iso: string) => dateTime.format(new Date(iso));

export function Section({ title, danger, children }: { title: string; danger?: boolean; children: ReactNode }) {
  const id = title.toLowerCase().replace(/[^a-z]+/g, "-");
  return (
    <section className={`hh-panel hh-settings__section${danger ? " hh-settings__section--danger" : ""}`} aria-labelledby={id}>
      <h2 id={id}>{title}</h2>
      {children}
    </section>
  );
}

type BetterAuthError = { code?: string; message?: string; status?: number } | null | undefined;

/** Runs a Better Auth call, tracks pending state, and turns its error into a plain message. */
export function useAuthTask() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<BetterAuthError | string>(null);
  const [done, setDone] = useState<string | null>(null);

  async function run(task: () => Promise<{ error?: BetterAuthError } | void>, success?: string): Promise<boolean> {
    setPending(true);
    setError(null);
    setDone(null);
    try {
      const result = await task();
      if (result && result.error) {
        setError(result.error);
        return false;
      }
      if (success) setDone(success);
      await router.refresh();
      return true;
    } catch {
      setError("Something went wrong. Please try again.");
      return false;
    } finally {
      setPending(false);
    }
  }

  const feedback = (
    <>
      {error ? <TaskError error={error} /> : null}
      {done ? <Notice tone="success">{done}</Notice> : null}
    </>
  );

  return { run, pending, feedback, setError };
}

function TaskError({ error }: { error: BetterAuthError | string }) {
  if (typeof error === "string") return <Notice tone="error">{error}</Notice>;
  if (isRecentSignInRequired(error)) {
    return (
      <Notice tone="error">
        <p>For your safety, please sign in again before making this change.</p>
        <p>
          <a href="/signin?reauth=1&next=%2Faccount">Sign in again</a>
        </p>
      </Notice>
    );
  }
  return <Notice tone="error">{messageFor(error)}</Notice>;
}
