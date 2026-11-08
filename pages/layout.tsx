import { useShared } from "@void/react";
import type { ReactNode } from "react";
import { Logo } from "../src/ui/Logo";
import "./style.css";

export default function Layout({ children }: { children: ReactNode }) {
  const account = useShared()?.account ?? null;
  return (
    <>
      <a className="hh-skip" href="#main">Skip to content</a>
      <header className="hh-header">
        <div className="hh-container hh-header__inner">
          <Logo />
          <nav className="hh-nav" aria-label="Main">
            <a href="/#how-it-works">How it works</a>
            <a href="/#what-you-see">What you'll see</a>
            <a href="/#never">What it never does</a>
            <a href="/#questions">Questions</a>
          </nav>
          <div className="hh-header__actions">
            {account ? (
              <a className="hh-btn hh-btn--primary" href="/account">Your account</a>
            ) : (
              <>
                <a className="hh-btn hh-btn--quiet" href="/signin">Sign in</a>
                <a className="hh-btn hh-btn--primary" href="/signup">Create account</a>
              </>
            )}
            <details className="hh-menu">
              <summary className="hh-btn hh-btn--secondary hh-menu__button" aria-label="Open menu">
                <svg className="hh-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
                <span>Menu</span>
              </summary>
              <nav className="hh-menu__panel" aria-label="Main, compact">
                <a href="/#how-it-works">How it works</a>
                <a href="/#what-you-see">What you'll see</a>
                <a href="/#never">What it never does</a>
                <a href="/#questions">Questions</a>
                {account ? <a href="/account">Your account</a> : <a href="/signin">Sign in</a>}
              </nav>
            </details>
          </div>
        </div>
      </header>
      <main id="main">{children}</main>
      <footer className="hh-footer">
        <div className="hh-container hh-footer__grid">
          <div>
            <Logo />
            <p className="hh-footer__note" style={{ marginTop: "1rem" }}>
              Health Hub is an independent service. It is not part of the NHS, a GP practice, or a pharmacy, and it never
              diagnoses, judges urgency, or suggests clinical action. It shows what your records say.
            </p>
          </div>
          <div>
            <ul className="hh-footer__links">
              <li><a href="/#how-it-works">How it works</a></li>
              <li><a href="/#never">What it never does</a></li>
              <li><a href="/signup">Create account</a></li>
              <li><a href="/signin">Sign in</a></li>
              <li><a href="/brand">Brand toolkit</a></li>
            </ul>
            <p style={{ marginTop: "1.5rem" }}>Your documents and the AI that reads them stay in the UK or EU. Deleting your account deletes everything.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
