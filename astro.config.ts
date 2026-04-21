import { defineConfig } from "astro/config";
import { visit } from "unist-util-visit";
import astroBrokenLinksChecker from "astro-broken-links-checker";
import sitemap from "@astrojs/sitemap";
import type { Root } from "hast";

const SITE = "https://walknuts.github.io";
const BASE = "/southportapartments/";

/**
 * Rewrites root-relative URLs in markdown-rendered HTML so that anchor and
 * image references like `/foo` resolve correctly under the configured base.
 */
const rewriteAbsoluteUrls = () => (tree: Root) => {
  const prefix = (value: unknown) =>
    typeof value === "string" && value.startsWith("/") && !value.startsWith("//")
      ? BASE + value.slice(1)
      : value;
  visit(tree, "element", (node) => {
    if (node.tagName === "a" && node.properties?.href) {
      node.properties.href = prefix(node.properties.href) as typeof node.properties.href;
    }
    if (node.tagName === "img" && node.properties?.src) {
      node.properties.src = prefix(node.properties.src) as typeof node.properties.src;
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
    sitemap(),
    astroBrokenLinksChecker({
      checkExternalLinks: false,
      throwError: true,
    }),
  ],
});
