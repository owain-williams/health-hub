/**
 * Identity rules. Pure functions and constants; no I/O.
 * Terms follow src/domains/identity/GLOSSARY.md.
 */

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** A session ends after this long without use. */
export const SESSION_IDLE_LIMIT_MS = 12 * HOUR;
/** A session ends this long after sign-in, however often it is used. */
export const SESSION_ABSOLUTE_LIMIT_MS = 7 * DAY;
/** A sign-in younger than this counts as a Recent Sign-in. */
export const RECENT_SIGN_IN_MS = 5 * MINUTE;
/** Accounts that never complete Verification are removed after this long. */
export const UNVERIFIED_ACCOUNT_LIMIT_MS = 7 * DAY;
/** Sign-in History entries older than this are trimmed. */
export const SIGN_IN_HISTORY_RETENTION_MS = 365 * DAY;

export const PASSWORD_MIN_LENGTH = 12;
export const PASSWORD_MAX_LENGTH = 128;

export function isRecentSignIn(signedInAt: Date, now: Date): boolean {
  return now.getTime() - signedInAt.getTime() <= RECENT_SIGN_IN_MS;
}

export function isPastAbsoluteLimit(signedInAt: Date, now: Date): boolean {
  return now.getTime() - signedInAt.getTime() > SESSION_ABSOLUTE_LIMIT_MS;
}

export function unverifiedCutoff(now: Date): Date {
  return new Date(now.getTime() - UNVERIFIED_ACCOUNT_LIMIT_MS);
}

export function signInHistoryCutoff(now: Date): Date {
  return new Date(now.getTime() - SIGN_IN_HISTORY_RETENTION_MS);
}

/** Pages anyone may open without signing in. Everything else requires sign-in. */
const PUBLIC_PAGES = new Set(["/", "/signin", "/signup", "/verify", "/reset-password", "/erased", "/brand"]);
// Asset and dev-server prefixes ("/@", "/src/", "/pages/", "/node_modules/") only matter in local development.
const PUBLIC_PREFIXES = ["/api/auth/", "/brand/", "/fonts/", "/assets/", "/__", "/@", "/src/", "/pages/", "/node_modules/"];
const PUBLIC_FILES = /\.(?:svg|png|jpe?g|webp|ico|woff2?|css|js|mjs|map|txt|xml|json|webmanifest)$/i;

export function isPublicPath(path: string): boolean {
  if (PUBLIC_PAGES.has(path) || path === "/api/auth") return true;
  if (PUBLIC_PREFIXES.some((prefix) => path.startsWith(prefix))) return true;
  return !path.startsWith("/api/") && PUBLIC_FILES.test(path);
}

/** Where to go after sign-in. Only same-origin paths are honoured; anything else goes to the default. */
export const DEFAULT_SIGNED_IN_PATH = "/account";

export function safeNextPath(next: string | null | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return DEFAULT_SIGNED_IN_PATH;
  try {
    const url = new URL(next, "http://same.origin");
    if (url.origin !== "http://same.origin") return DEFAULT_SIGNED_IN_PATH;
    return url.pathname + url.search + url.hash;
  } catch {
    return DEFAULT_SIGNED_IN_PATH;
  }
}

export function normaliseEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** The one name asked for at sign-up fills both the Account's name and the Person's name. */
export function normaliseName(name: string): string {
  return name.trim().replace(/\s+/g, " ");
}

/** Sign-in History entry kinds. */
export const SIGN_IN_EVENT_KINDS = [
  "signed_in",
  "sign_in_failed",
  "password_changed",
  "password_reset",
  "email_changed",
  "two_factor_on",
  "two_factor_off",
  "passkey_added",
  "passkey_removed",
] as const;
export type SignInEventKind = (typeof SIGN_IN_EVENT_KINDS)[number];

export const SIGN_IN_EVENT_LABELS: Record<SignInEventKind, string> = {
  signed_in: "Signed in",
  sign_in_failed: "Sign-in attempt failed",
  password_changed: "Password changed",
  password_reset: "Password reset by email link",
  email_changed: "Email address changed",
  two_factor_on: "Authenticator app turned on",
  two_factor_off: "Authenticator app turned off",
  passkey_added: "Passkey added",
  passkey_removed: "Passkey removed",
};

/** A plain description of a browser, from its user agent. Never more specific than browser and device. */
export function describeDevice(userAgent: string | null | undefined): string {
  if (!userAgent) return "Unknown device";
  const ua = userAgent;
  const browser = /Edg\//.test(ua)
    ? "Edge"
    : /Firefox\//.test(ua)
      ? "Firefox"
      : /Chrome\//.test(ua)
        ? "Chrome"
        : /Safari\//.test(ua)
          ? "Safari"
          : "A browser";
  const device = /iPhone/.test(ua)
    ? "iPhone"
    : /iPad/.test(ua)
      ? "iPad"
      : /Android/.test(ua)
        ? "Android"
        : /Macintosh|Mac OS X/.test(ua)
          ? "Mac"
          : /Windows/.test(ua)
            ? "Windows"
            : /Linux/.test(ua)
              ? "Linux"
              : "unknown device";
  return `${browser} on ${device}`;
}
