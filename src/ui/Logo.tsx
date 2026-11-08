/** The Health Hub mark: a page with three lines, the middle line traced out to a dot.
 *  A fact, followed back to its source. Draws in currentColor so it sits on any ground. */
export function Mark({ className = "hh-mark", title }: { className?: string; title?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" role={title ? "img" : "presentation"} aria-hidden={title ? undefined : true} aria-label={title}>
      <rect x="5" y="4" width="22" height="32" rx="5" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <path d="M11 13h10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M11 27h7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M11 20h22" stroke="#fff" strokeWidth="6.5" strokeLinecap="round" />
      <path d="M11 20h22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="34" cy="20" r="3.25" fill="currentColor" />
    </svg>
  );
}

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <a className="hh-logo" href={href} aria-label="Health Hub home">
      <span style={{ color: "var(--hh-primary)", display: "inline-flex" }}>
        <Mark />
      </span>
      <span>Health Hub</span>
    </a>
  );
}
