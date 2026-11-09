import { HTTPException } from "hono/http-exception";
import { defineHandler, defineHead, type InferProps } from "void";
import { requirePerson } from "../../src/application/identity/requirePerson";
import { recordsService } from "../../src/application/records/live";

export type Props = InferProps<typeof loader>;

export const loader = defineHandler(async (c) => {
  const { person } = requirePerson(c);
  const record = await recordsService.view(person.id, c.req.param("id") ?? "");
  if (!record) throw new HTTPException(404, { message: "There is no such Record." });
  return {
    record: { ...record, uploadedAt: record.uploadedAt.toISOString() },
    uploaded: c.req.query("uploaded") === "1",
    duplicate: c.req.query("duplicate") === "1",
    confirmDelete: c.req.query("confirm-delete") === "1",
  };
});

export const actions = {
  /** Deletion. Confirmed on the page first; a plain POST, so it works without JavaScript. */
  delete: defineHandler(async (c) => {
    const { person } = requirePerson(c);
    const outcome = await recordsService.delete(person.id, c.req.param("id") ?? "");
    if (outcome === "not_found") throw new HTTPException(404, { message: "There is no such Record." });
    return c.redirect("/records?deleted=1", 303);
  }),
};

export const head = defineHead((_c, props: Props) => ({ title: props.record.label, meta: [{ name: "robots", content: "noindex" }] }));
