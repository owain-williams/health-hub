import { useMemo, useState, type FormEvent } from "react";
import { renderSVG } from "uqr";
import { authClient } from "../auth/client";
import { Field, fieldOf, Notice, useHydrated } from "../auth/Field";
import { Section, useAuthTask } from "./shared";

type Setup = { totpURI: string; backupCodes: string[] };

export function TwoFactorSection({ enabled }: { enabled: boolean }) {
  const hydrated = useHydrated();
  const { run, pending, feedback } = useAuthTask();
  const [mode, setMode] = useState<"idle" | "password" | "setup" | "disable">("idle");
  const [setup, setSetup] = useState<Setup | null>(null);

  const reset = () => {
    setMode("idle");
    setSetup(null);
  };

  const start = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const password = fieldOf(event.currentTarget, "password");
    void run(async () => {
      const result = await authClient.twoFactor.enable({ password });
      if (result.error) return { error: result.error };
      setSetup(result.data as Setup);
      setMode("setup");
    });
  };

  const confirm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const code = fieldOf(event.currentTarget, "code");
    void run(async () => {
      const result = await authClient.twoFactor.verifyTotp({ code: code.replace(/\s/g, "") });
      if (result.error) return { error: result.error };
      reset();
    }, "The authenticator app is on. You will be asked for a code when you sign in with your password.");
  };

  const disable = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const password = fieldOf(event.currentTarget, "password");
    void run(async () => {
      const result = await authClient.twoFactor.disable({ password });
      if (result.error) return { error: result.error };
      reset();
    }, "The authenticator app is off.");
  };

  return (
    <Section title="Authenticator app">
      <p className="hh-muted">
        {enabled
          ? "On. When you sign in with your password, you are also asked for a code from your authenticator app."
          : "Off. An authenticator app adds a 6-digit code to signing in with your password. A passkey gives the same protection on its own."}
      </p>
      {feedback}

      {mode === "idle" ? (
        <div className="hh-actions">
          {enabled ? (
            <button className="hh-btn hh-btn--secondary" type="button" onClick={() => setMode("disable")}>
              Turn off
            </button>
          ) : (
            <button className="hh-btn hh-btn--primary" type="button" onClick={() => setMode("password")}>
              Turn on
            </button>
          )}
        </div>
      ) : null}

      {mode === "password" || mode === "disable" ? (
        <form method="post" onSubmit={mode === "password" ? start : disable} noValidate>
          <Field label="Your password" type="password" name="password" autoComplete="current-password" required />
          <div className="hh-actions">
            <button className="hh-btn hh-btn--primary" type="submit" disabled={pending || !hydrated}>
              {mode === "password" ? "Continue" : "Turn off"}
            </button>
            <button className="hh-btn hh-btn--quiet" type="button" onClick={reset}>
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      {mode === "setup" && setup ? <SetupSteps setup={setup} onSubmit={confirm} onCancel={reset} pending={pending} /> : null}
    </Section>
  );
}

function SetupSteps(props: { setup: Setup; onSubmit: (e: FormEvent<HTMLFormElement>) => void; onCancel: () => void; pending: boolean }) {
  const { setup } = props;
  const secret = useMemo(() => new URL(setup.totpURI).searchParams.get("secret") ?? "", [setup.totpURI]);
  const qr = useMemo(() => renderSVG(setup.totpURI, { border: 2 }), [setup.totpURI]);
  const grouped = secret.match(/.{1,4}/g)?.join(" ") ?? secret;

  return (
    <>
      <ol>
        <li>
          <p>
            Add Health Hub to your authenticator app. On this phone, <a href={setup.totpURI}>open it in your authenticator app</a>. On another device, scan this
            code:
          </p>
          <div role="img" aria-label="QR code for your authenticator app" style={{ width: 200, height: 200 }} dangerouslySetInnerHTML={{ __html: qr }} />
          <p className="hh-hint">
            Or type this key into the app: <span className="hh-secret">{grouped}</span>
          </p>
        </li>
        <li>
          <p>Save these backup codes somewhere safe, such as a printed page. Each works once, if you lose your phone.</p>
          <ul className="hh-codes" aria-label="Backup codes">
            {setup.backupCodes.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <Notice>These codes are shown only now.</Notice>
        </li>
        <li>
          <form method="post" onSubmit={props.onSubmit} noValidate>
            <Field label="Type the 6-digit code the app shows" name="code" inputMode="numeric" autoComplete="one-time-code" required />
            <div className="hh-actions">
              <button className="hh-btn hh-btn--primary" type="submit" disabled={props.pending}>
                Turn on
              </button>
              <button className="hh-btn hh-btn--quiet" type="button" onClick={props.onCancel}>
                Cancel
              </button>
            </div>
          </form>
        </li>
      </ol>
    </>
  );
}
