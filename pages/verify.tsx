import type { Props } from "./verify.server";
import "./account.css";

export default function VerifyPage({ failed }: Props) {
  return (
    <section className="hh-account">
      <div className="hh-container hh-account__wrap">
        <div className="hh-panel hh-account__panel">
          {failed ? (
            <>
              <h1>This link has not worked</h1>
              <p className="hh-lede">It may have expired (links last one hour) or already been used.</p>
              <p className="hh-muted">Try signing in. If your email address is still not confirmed, we will send you a fresh link.</p>
            </>
          ) : (
            <>
              <h1>Email address confirmed</h1>
              <p className="hh-lede">Thank you. You can now sign in.</p>
            </>
          )}
          <a className="hh-btn hh-btn--primary" href="/signin">
            Sign in
          </a>
        </div>
      </div>
    </section>
  );
}
