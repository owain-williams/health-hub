import { defineHandler, defineHead, type InferProps } from "void";

export type Props = InferProps<typeof loader>;

/** Better Auth's emailed link lands here with `?token=` (or `?error=INVALID_TOKEN`). */
export const loader = defineHandler((c) => ({
  token: c.req.query("token") ?? null,
  failed: Boolean(c.req.query("error")),
}));

export const head = defineHead(() => ({
  title: "Reset your password",
  meta: [{ name: "robots", content: "noindex" }],
}));
