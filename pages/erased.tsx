import "./account.css";

export default function ErasedPage() {
  return (
    <section className="hh-account">
      <div className="hh-container hh-account__wrap">
        <div className="hh-panel hh-account__panel">
          <h1>Your account has been deleted</h1>
          <p className="hh-lede">Everything Health Hub held for you has been removed. Nothing was kept.</p>
          <p className="hh-muted">We have sent one last email to confirm it. We will not email you again.</p>
          <a className="hh-btn hh-btn--secondary" href="/">
            Back to the front page
          </a>
        </div>
      </div>
    </section>
  );
}
