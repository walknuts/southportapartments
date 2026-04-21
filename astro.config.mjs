// @ts-check
import { defineConfig } from "astro/config";
import { visit } from "unist-util-visit";
import astroBrokenLinksChecker from "astro-broken-links-checker";

const SITE = "https://walknuts.github.io";
const BASE = "/southportapartments/";

/**
 * Rewrites root-relative URLs in markdown-rendered HTML so that anchor and
 * image references like `/foo` resolve correctly under the configured base.
 */
const rewriteAbsoluteUrls = () => (tree) => {
  const baseNoSlash = BASE.replace(/\/$/, "");
  const prefix = (value) =>
    typeof value === "string" && value.startsWith("/") && !value.startsWith("//")
      ? `${baseNoSlash}${value}`
      : value;
  visit(tree, "element", (node) => {
    if (node.tagName === "a" && node.properties?.href) {
      node.properties.href = prefix(node.properties.href);
    }
    if (node.tagName === "img" && node.properties?.src) {
      node.properties.src = prefix(node.properties.src);
    }
  });
};

// https://astro.build/config
export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: "ignore",
  markdown: {
    rehypePlugins: [rewriteAbsoluteUrls],
  },
  integrations: [
    astroBrokenLinksChecker({
      checkExternalLinks: false,
      throwError: true,
    }),
  ],
});
