import { defineHandler, defineHead, type InferProps } from "void";

export type Props = InferProps<typeof loader>;

/** Better Auth redirects here after a Verification link, adding `?error=` when the link is bad. */
export const loader = defineHandler((c) => ({ failed: Boolean(c.req.query("error")) }));

export const head = defineHead(() => ({
  title: "Email address confirmed",
  meta: [{ name: "robots", content: "noindex" }],
}));
