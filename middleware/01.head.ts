import { defineMiddleware } from "void";

/** Site-wide head defaults: language, viewport, favicon and the preloaded typeface. */
export default defineMiddleware(async (c, next) => {
  c.set("headDefaults", {
    htmlAttrs: { lang: "en-GB" },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#0e6f5c" },
    ],
    link: [
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "preload", href: "/fonts/AtkinsonHyperlegibleNext-Roman-latin.woff2", as: "font", type: "font/woff2", crossorigin: "anonymous" },
    ],
  });
  await next();
});
