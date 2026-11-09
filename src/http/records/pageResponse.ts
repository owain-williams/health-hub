/**
 * The HTTP response for one Page (docs/specs/records.md). Uploaded files are
 * untrusted: `nosniff` and a sandbox CSP stop a crafted PDF or image running
 * script on our origin, and nothing is cached outside the Person's browser.
 */
import type { StoredPage } from "../../application/records/ports";

const PRIVATE = { "cache-control": "private, no-store" };

export function pageResponse(page: StoredPage | null): Response {
  if (!page) return new Response("Not found", { status: 404, headers: PRIVATE });
  return new Response(page.body, {
    headers: {
      ...PRIVATE,
      "content-type": page.contentType,
      "content-length": String(page.size),
      "content-disposition": "inline",
      "x-content-type-options": "nosniff",
      "content-security-policy": "sandbox",
      "referrer-policy": "no-referrer",
    },
  });
}
