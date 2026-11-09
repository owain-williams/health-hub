import { describe, expect, it } from "vite-plus/test";
import { pageResponse } from "./pageResponse";

const page = (contentType: "application/pdf" | "image/jpeg", text = "%PDF-1.7 body") => {
  const bytes = new TextEncoder().encode(text);
  return { contentType, size: bytes.length, body: new Response(bytes).body! };
};

describe("pageResponse", () => {
  it("serves a Page inline with headers that stop it running as part of the site or being cached", async () => {
    const res = pageResponse(page("application/pdf"));
    expect(res.status).toBe(200);
    expect(Object.fromEntries(res.headers)).toEqual({
      "content-type": "application/pdf",
      "content-length": "13",
      "content-disposition": "inline",
      "x-content-type-options": "nosniff",
      "cache-control": "private, no-store",
      "content-security-policy": "sandbox",
      "referrer-policy": "no-referrer",
    });
    expect(await res.text()).toBe("%PDF-1.7 body");
  });

  it("is a plain 404 when there is no such Page for this Person", async () => {
    const res = pageResponse(null);
    expect(res.status).toBe(404);
    expect(res.headers.get("cache-control")).toBe("private, no-store");
  });
});
