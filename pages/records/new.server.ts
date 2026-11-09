import { defineHandler, defineHead, type InferProps } from "void";
import { requirePerson } from "../../src/application/identity/requirePerson";
import { recordsService } from "../../src/application/records/live";
import { uploadProblemMessage, type UploadProblem } from "../../src/ui/records/messages";

export type Props = InferProps<typeof loader>;

const PROBLEMS = new Set<string>([
  "no_files",
  "unsupported_type",
  "empty_file",
  "file_too_large",
  "upload_too_large",
  "too_many_photos",
  "mixed_pdf_and_photos",
  "more_than_one_pdf",
  "rate_limited",
]);

export const loader = defineHandler((c) => {
  const problem = c.req.query("problem");
  return { problem: problem && PROBLEMS.has(problem) ? uploadProblemMessage(problem as UploadProblem, c.req.query("file")) : null };
});

/** Upload. A plain multipart POST, so it works before (or without) JavaScript. */
export const action = defineHandler(async (c) => {
  const { person } = requirePerson(c);
  const body = await c.req.parseBody({ all: true });
  const supplied = ([] as unknown[]).concat(body["files"] ?? []).filter((f): f is File => f instanceof File && f.name !== "");
  const files = await Promise.all(supplied.map(async (f) => ({ name: f.name, bytes: new Uint8Array(await f.arrayBuffer()) })));

  const result = await recordsService.upload(person.id, files);
  switch (result.outcome) {
    case "created":
      return c.redirect(`/records/${result.recordId}?uploaded=1`, 303);
    case "duplicate":
      return c.redirect(`/records/${result.recordId}?duplicate=1`, 303);
    case "rate_limited":
      return c.redirect("/records/new?problem=rate_limited", 303);
    case "rejected": {
      const query = new URLSearchParams({ problem: result.rejection.reason });
      if ("fileName" in result.rejection) query.set("file", result.rejection.fileName);
      return c.redirect(`/records/new?${query}`, 303);
    }
  }
});

export const head = defineHead(() => ({ title: "Upload a record", meta: [{ name: "robots", content: "noindex" }] }));
