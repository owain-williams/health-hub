import { defineHandler, defineHead, type InferProps } from "void";

export type Props = InferProps<typeof loader>;

export const loader = defineHandler(async () => {
  return {};
});

export const head = defineHead<Props>(() => ({
  title: "Your medical letters, read back exactly as written",
  meta: [
    {
      name: "description",
      content:
        "Health Hub keeps your clinic letters, results and prescriptions in one place and shows what they say, with every fact traced to the line it came from. It never interprets.",
    },
    { property: "og:title", content: "Health Hub" },
    { property: "og:description", content: "Your medical letters, read back exactly as written. Every fact traced to its source. Never interpreted." },
  ],
}));
