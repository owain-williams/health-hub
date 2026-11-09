import { defineHandler, defineHead, type InferProps } from "void";
import { requirePerson } from "../../src/application/identity/requirePerson";
import { recordsService } from "../../src/application/records/live";

export type Props = InferProps<typeof loader>;

export const loader = defineHandler(async (c) => {
  const { person } = requirePerson(c);
  const records = await recordsService.list(person.id);
  return {
    deleted: c.req.query("deleted") === "1",
    records: records.map((r) => ({ id: r.id, label: r.label, uploadedAt: r.uploadedAt.toISOString(), read: r.read })),
  };
});

export const head = defineHead(() => ({ title: "Your records", meta: [{ name: "robots", content: "noindex" }] }));
