import { defineConfig } from "astro/config";
import { visit } from "unist-util-visit";
import astroBrokenLinksChecker from "astro-broken-links-checker";
import sitemap from "@astrojs/sitemap";
import type { Root } from "hast";

const SITE = "https://walknuts.github.io";
const BASE = "/southportapartments/";

/**
 * Replaces ' --- ' with em-dash and standalone '--' with en-dash in text nodes.
 */
const replaceTripleHyphens = () => (tree: Root) => {
  visit(tree, "text", (node) => {
    if (typeof node.value === "string") {
      node.value = node.value
        .replace(/ --- /g, " — ")
        .replace(/---/g, "—")
        .replace(/(\s)--(\s)/g, "$1–$2");
    }
  });
};

const SOURCE_PATTERNS = [
  /^\s*Photo[: ]/i,
  /^\s*Photo (?:by|from)\b/i,
  /^\s*Source[: ]/i,
  /^\s*From\b/,
  /\bUnsplash\b/,
];

const collectText = (node: { children?: unknown[]; value?: unknown }): string => {
  if (typeof node.value === "string") return node.value;
  if (!Array.isArray(node.children)) return "";
  return node.children
    .map((c) => collectText(c as { children?: unknown[]; value?: unknown }))
    .join("");
};

/**
 * Marks italic-only paragraphs whose text looks like an image attribution
 * (Photo by/Source:/From/etc.) with a class so they can be styled smaller
 * and lighter than ordinary captions.
 */
const tagSourceParagraphs = () => (tree: Root) => {
  visit(tree, "element", (node) => {
    if (node.tagName !== "p" || !Array.isArray(node.children)) return;
    const significant = node.children.filter(
      (c) => !(c.type === "text" && /^\s*$/.test((c as { value: string }).value)),
    );
    if (significant.length !== 1) return;
    const only = significant[0];
    if (only.type !== "element" || (only as { tagName?: string }).tagName !== "em") return;
    const text = collectText(only as { children?: unknown[]; value?: unknown });
    if (!SOURCE_PATTERNS.some((re) => re.test(text))) return;
    const props = (node.properties ??= {});
    const existing =
      typeof props.className === "string"
        ? props.className.split(/\s+/)
        : Array.isArray(props.className)
          ? (props.className as string[])
          : [];
    if (!existing.includes("is-source")) existing.push("is-source");
    props.className = existing;
  });
};

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
    rehypePlugins: [rewriteAbsoluteUrls, replaceTripleHyphens, tagSourceParagraphs],
  },
  integrations: [
    sitemap(),
    astroBrokenLinksChecker({
      checkExternalLinks: false,
      throwError: true,
    }),
  ],
});
