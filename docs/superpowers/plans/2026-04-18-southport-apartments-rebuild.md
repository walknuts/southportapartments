# Southport Apartments Rebuild — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Jekyll site at `walknuts/southportapartments` with a fresh Astro 6 static site, sourcing content from the WYSIWYG-built `southport.apartments` mirror, with a quiet modern visual design built on plain CSS.

**Architecture:** Astro 6 static output, Content Collections for pages and posts, dynamic `[...slug]` routing. Plain CSS with custom-property design tokens. Bespoke `index.astro` for the home page; everything else flows through the collections. Content extraction is fanned out to parallel subagents — one per source HTML file.

**Tech Stack:** Astro 6, TypeScript strict, pnpm, mise (Node 22), `@fontsource/fraunces`, Astro `<Image>`, View Transitions, Prettier with `prettier-plugin-astro`.

**Working directory:** `/home/ben/projects/southport-apartments/southportapartments` (existing git repo `walknuts/southportapartments`).

**Spec:** `docs/superpowers/specs/2026-04-18-southport-apartments-rebuild-design.md`

---

## Phase 1 — Repo wipe & Astro scaffold

### Task 1: Preserve current main as `old` tag and start clean branch

**Files:**

- Modify: git refs only

- [ ] **Step 1: Confirm clean working tree**

```bash
cd /home/ben/projects/southport-apartments/southportapartments
git status
```

Expected: `nothing to commit, working tree clean`. If dirty, stop and ask.

- [ ] **Step 2: Tag current main as `old` and push tag**

```bash
git fetch --all
git tag -f old main
git push origin old
```

Expected: `* [new tag] old -> old` (or forced update).

- [ ] **Step 3: Create orphan branch and clear tracked files**

```bash
git checkout --orphan main-fresh
git rm -rf .
```

Expected: working tree empty except `.git/`. Verify with `ls -A` showing only `.git`.

### Task 2: Scaffold Astro 6 minimal project

**Files:**

- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/pages/index.astro` (default scaffold)

- [ ] **Step 1: Run Astro create in place**

```bash
pnpm create astro@latest . -- --template minimal --typescript strict --install --no-git --skip-houston --yes
```

Expected: Astro project files created, dependencies installed. If the version installed is < 6, abort and report.

- [ ] **Step 2: Verify Astro 6**

```bash
pnpm exec astro --version
```

Expected: `6.x.y`. If not, run `pnpm add -D astro@latest` and re-check.

- [ ] **Step 3: Verify dev server boots**

```bash
pnpm dev --host 127.0.0.1 --port 4321 &
sleep 4
curl -sI http://127.0.0.1:4321/ | head -1
kill %1
```

Expected: `HTTP/1.1 200 OK`.

### Task 3: Project hygiene files

**Files:**

- Create: `mise.toml`, `.gitignore`, `.prettierrc.json`, `README.md`
- Modify: `package.json` (add prettier)

- [ ] **Step 1: Create mise.toml**

```toml
# mise.toml
[tools]
node = "22"
pnpm = "9"
```

- [ ] **Step 2: Append to .gitignore**

Add (or create) lines so the file contains at minimum:

```
node_modules
dist
.astro
.DS_Store
.env
.env.*
!.env.example
scrape/
```

- [ ] **Step 3: Add Prettier with Astro plugin**

```bash
pnpm add -D prettier prettier-plugin-astro
```

Create `.prettierrc.json`:

```json
{
  "plugins": ["prettier-plugin-astro"],
  "overrides": [{ "files": "*.astro", "options": { "parser": "astro" } }],
  "printWidth": 100,
  "singleQuote": false,
  "trailingComma": "all"
}
```

- [ ] **Step 4: Replace README**

Create `README.md`:

```markdown
# Southport Apartments

Static site for the Southport Apartments residential complex on Lake Tuggeranong, Canberra. Built with Astro 6.

## Develop

    pnpm install
    pnpm dev

## Build

    pnpm build

Output is in `dist/`.

## Content

- `src/content/pages/` — main site pages
- `src/content/posts/` — news/blog posts
- `src/assets/images/` — content imagery (processed by Astro `<Image>`)
- `public/downloads/` — PDFs

## Licence

Code: see LICENSE. Content: CC BY-NC-ND 4.0.
```

- [ ] **Step 5: Restore LICENSE from `old` tag**

```bash
git checkout old -- LICENSE
```

- [ ] **Step 6: Commit Phase 1**

```bash
git add -A
git commit -m "chore: scaffold Astro 6 project, tag prior site as 'old'"
```

---

## Phase 2 — Design tokens, layouts, components

### Task 4: Design tokens stylesheet

**Files:**

- Create: `src/styles/tokens.css`

- [ ] **Step 1: Write tokens.css**

```css
/* src/styles/tokens.css
   Design tokens. Imported once at the top of global.css.
*/
:root {
  /* Palette (preserved from previous site) */
  --color-text: #696670;
  --color-text-muted: #677a85;
  --color-bg: #ffffff;
  --color-bg-soft: #ddedf7;
  --color-bg-sage: #e1e6d7;
  --color-accent: #00b2ff;
  --color-accent-ink: #006a99;
  --color-alert: #ce2029;
  --color-rule: rgba(105, 102, 112, 0.15);

  /* Type */
  --font-sans:
    ui-sans-serif, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --font-display: "Fraunces", ui-serif, Georgia, "Times New Roman", serif;

  --fs-300: clamp(0.875rem, 0.84rem + 0.18vw, 0.95rem);
  --fs-400: clamp(1rem, 0.95rem + 0.25vw, 1.1rem);
  --fs-500: clamp(1.15rem, 1.05rem + 0.5vw, 1.4rem);
  --fs-600: clamp(1.4rem, 1.2rem + 1vw, 1.9rem);
  --fs-700: clamp(1.8rem, 1.4rem + 2vw, 2.6rem);
  --fs-800: clamp(2.25rem, 1.6rem + 3.2vw, 3.6rem);

  --lh-tight: 1.15;
  --lh-body: 1.6;

  /* Spacing scale */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.5rem;
  --space-6: 2rem;
  --space-7: 3rem;
  --space-8: 4rem;
  --space-9: 6rem;

  /* Radii & elevation */
  --radius-sm: 6px;
  --radius-lg: 16px;
  --shadow-1: 0 1px 2px rgba(60, 70, 90, 0.06), 0 4px 16px rgba(60, 70, 90, 0.06);

  /* Layout */
  --container-prose: 70ch;
  --container-wide: 1100px;
  --container-pad: 1.25rem;
}
```

### Task 5: Global stylesheet

**Files:**

- Create: `src/styles/global.css`

- [ ] **Step 1: Write global.css**

```css
/* src/styles/global.css */
@import "./tokens.css";
@import "@fontsource/fraunces/400.css";
@import "@fontsource/fraunces/600.css";

*,
*::before,
*::after {
  box-sizing: border-box;
}
html {
  -webkit-text-size-adjust: 100%;
}
body {
  margin: 0;
  font-family: var(--font-sans);
  font-size: var(--fs-400);
  line-height: var(--lh-body);
  color: var(--color-text);
  background: var(--color-bg);
}
img,
svg,
video {
  display: block;
  max-width: 100%;
  height: auto;
}
a {
  color: var(--color-accent-ink);
  text-decoration-color: color-mix(in oklab, var(--color-accent-ink) 35%, transparent);
  text-underline-offset: 0.18em;
  text-decoration-thickness: 1px;
  transition:
    color 120ms ease,
    text-decoration-color 120ms ease;
}
a:hover {
  color: var(--color-accent);
  text-decoration-color: currentColor;
}

h1,
h2,
h3,
h4 {
  font-family: var(--font-display);
  font-weight: 600;
  line-height: var(--lh-tight);
  color: #2f2c38;
  margin: 0 0 var(--space-4);
}
h1 {
  font-size: var(--fs-800);
  letter-spacing: -0.01em;
}
h2 {
  font-size: var(--fs-700);
}
h3 {
  font-size: var(--fs-600);
}
h4 {
  font-size: var(--fs-500);
}

p {
  margin: 0 0 var(--space-4);
}
ul,
ol {
  margin: 0 0 var(--space-4);
  padding-inline-start: 1.25rem;
}
li {
  margin-block: var(--space-2);
}
hr {
  border: 0;
  border-top: 1px solid var(--color-rule);
  margin-block: var(--space-6);
}
blockquote {
  border-inline-start: 3px solid var(--color-accent);
  margin: 0 0 var(--space-4);
  padding: var(--space-2) var(--space-4);
  background: var(--color-bg-soft);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}
figure {
  margin: var(--space-5) 0;
}
figcaption {
  font-size: var(--fs-300);
  color: var(--color-text-muted);
  margin-top: var(--space-2);
}

.container {
  margin-inline: auto;
  padding-inline: var(--container-pad);
  max-inline-size: min(var(--container-wide), 100% - 2 * var(--container-pad));
}
.container--prose {
  max-inline-size: min(var(--container-prose), 100% - 2 * var(--container-pad));
}

.skip-link {
  position: absolute;
  left: -9999px;
  top: 0;
  background: #fff;
  padding: var(--space-2) var(--space-4);
}
.skip-link:focus {
  left: var(--space-3);
  top: var(--space-3);
  z-index: 100;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.001ms !important;
    transition-duration: 0.001ms !important;
  }
}
```

- [ ] **Step 2: Install Fraunces**

```bash
pnpm add @fontsource/fraunces
```

### Task 6: Nav component

**Files:**

- Create: `src/components/Nav.astro`

- [ ] **Step 1: Write Nav.astro**

```astro
---
// src/components/Nav.astro
const items = [
  { href: "/about",      label: "About" },
  { href: "/visiting",   label: "Visiting" },
  { href: "/my-home",    label: "My Home" },
  { href: "/community",  label: "Community" },
  { href: "/moving-in",  label: "Moving In" },
  { href: "/safety",     label: "Safety" },
  { href: "/news",       label: "News" },
  { href: "/contact",    label: "Contact" },
];
const current = Astro.url.pathname.replace(/\/$/, "") || "/";
---
<nav class="nav" aria-label="Primary">
  <a class="nav__brand" href="/">Southport Apartments</a>
  <input id="nav-toggle" class="nav__toggle" type="checkbox" aria-label="Open menu" />
  <label for="nav-toggle" class="nav__burger" aria-hidden="true">
    <span></span><span></span><span></span>
  </label>
  <ul class="nav__list">
    {items.map((it) => (
      <li>
        <a href={it.href} aria-current={current === it.href ? "page" : undefined}>{it.label}</a>
      </li>
    ))}
  </ul>
</nav>

<style>
  .nav {
    display: flex; align-items: center; gap: var(--space-5);
    padding: var(--space-4) var(--container-pad);
    border-bottom: 1px solid var(--color-rule);
    background: var(--color-bg);
    position: sticky; top: 0; z-index: 10;
  }
  .nav__brand {
    font-family: var(--font-display); font-weight: 600;
    color: inherit; text-decoration: none; font-size: var(--fs-500);
  }
  .nav__list {
    list-style: none; padding: 0; margin: 0 0 0 auto;
    display: flex; gap: var(--space-5); flex-wrap: wrap;
  }
  .nav__list a {
    color: var(--color-text); text-decoration: none; font-size: var(--fs-400);
  }
  .nav__list a[aria-current="page"] {
    color: var(--color-accent-ink);
    border-bottom: 2px solid var(--color-accent);
  }
  .nav__toggle, .nav__burger { display: none; }

  @media (max-width: 720px) {
    .nav { flex-wrap: wrap; }
    .nav__burger {
      display: inline-flex; flex-direction: column; gap: 4px;
      margin-inline-start: auto; cursor: pointer; padding: var(--space-2);
    }
    .nav__burger span {
      width: 22px; height: 2px; background: var(--color-text); border-radius: 2px;
    }
    .nav__list {
      flex-basis: 100%; flex-direction: column; gap: var(--space-3);
      margin: 0; padding: var(--space-3) 0;
      max-height: 0; overflow: hidden;
      transition: max-height 200ms ease;
    }
    .nav__toggle:checked ~ .nav__list { max-height: 60vh; }
  }
</style>
```

### Task 7: Footer component

**Files:**

- Create: `src/components/Footer.astro`

- [ ] **Step 1: Write Footer.astro**

```astro
---
// src/components/Footer.astro
const year = new Date().getFullYear();
---
<footer class="footer">
  <div class="container footer__inner">
    <div>
      <p class="footer__brand">Southport Apartments</p>
      <p class="footer__addr">Lake Tuggeranong, Canberra</p>
    </div>
    <nav aria-label="Footer">
      <ul>
        <li><a href="/about">About</a></li>
        <li><a href="/about/people">Our People</a></li>
        <li><a href="/about/gallery">Gallery</a></li>
        <li><a href="/rules">Rules</a></li>
        <li><a href="/policies">Policies</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </nav>
    <p class="footer__legal">
      &copy; {year} Southport Apartments. Content licensed
      <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/">CC BY-NC-ND 4.0</a>.
    </p>
  </div>
</footer>

<style>
  .footer {
    margin-top: var(--space-9);
    background: var(--color-bg-soft);
    color: var(--color-text);
    padding-block: var(--space-7);
  }
  .footer__inner {
    display: grid; gap: var(--space-5);
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    align-items: start;
  }
  .footer__brand { font-family: var(--font-display); font-weight: 600; margin: 0; }
  .footer__addr { color: var(--color-text-muted); margin: var(--space-1) 0 0; }
  .footer ul { list-style: none; padding: 0; margin: 0; display: grid; gap: var(--space-2); }
  .footer a { color: inherit; }
  .footer__legal { font-size: var(--fs-300); color: var(--color-text-muted); grid-column: 1 / -1; margin: 0; }
</style>
```

### Task 8: Base layout

**Files:**

- Create: `src/layouts/Base.astro`

- [ ] **Step 1: Write Base.astro**

```astro
---
// src/layouts/Base.astro
import { ClientRouter } from "astro:transitions";
import Nav from "../components/Nav.astro";
import Footer from "../components/Footer.astro";
import "../styles/global.css";

interface Props {
  title: string;
  description?: string;
}
const { title, description = "Southport Apartments — a residential community on Lake Tuggeranong." } = Astro.props;
const fullTitle = title === "Southport Apartments" ? title : `${title} — Southport Apartments`;
---
<!doctype html>
<html lang="en-AU">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{fullTitle}</title>
    <meta name="description" content={description} />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <ClientRouter />
  </head>
  <body>
    <a class="skip-link" href="#main">Skip to content</a>
    <Nav />
    <main id="main"><slot /></main>
    <Footer />
  </body>
</html>
```

### Task 9: Page layout

**Files:**

- Create: `src/layouts/Page.astro`

- [ ] **Step 1: Write Page.astro**

```astro
---
// src/layouts/Page.astro
import Base from "./Base.astro";
import { Image } from "astro:assets";

interface Props {
  title: string;
  summary?: string;
  heroImage?: ImageMetadata;
}
const { title, summary, heroImage } = Astro.props;
---
<Base title={title} description={summary}>
  {heroImage && (
    <div class="page-hero">
      <Image src={heroImage} alt="" widths={[800, 1400, 2000]} sizes="100vw" loading="eager" />
    </div>
  )}
  <article class="container container--prose page">
    <header class="page__header">
      <h1>{title}</h1>
      {summary && <p class="page__summary">{summary}</p>}
    </header>
    <div class="prose"><slot /></div>
  </article>
</Base>

<style>
  .page-hero img {
    width: 100%; max-height: 60vh; object-fit: cover;
  }
  .page { padding-block: var(--space-7); }
  .page__header { margin-bottom: var(--space-6); }
  .page__summary {
    color: var(--color-text-muted); font-size: var(--fs-500);
    max-inline-size: 60ch;
  }
  .prose :global(figure) { margin-block: var(--space-6); }
  .prose :global(img) {
    border-radius: var(--radius-sm);
  }
  .prose :global(h2) { margin-top: var(--space-7); }
  .prose :global(h3) { margin-top: var(--space-6); }
</style>
```

- [ ] **Step 2: Add favicon placeholder**

Create `public/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="#00b2ff"/>
  <text x="32" y="42" font-family="Georgia, serif" font-size="36" font-weight="600" fill="#fff" text-anchor="middle">S</text>
</svg>
```

- [ ] **Step 2: Commit Phase 2**

```bash
git add -A
git commit -m "feat: design tokens, base layout, nav and footer"
```

---

## Phase 3 — Content collections & routing

### Task 10: Content collection schemas

**Files:**

- Create: `src/content.config.ts`

- [ ] **Step 1: Write content.config.ts**

```ts
// src/content.config.ts
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const pages = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/pages" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string().optional(),
      order: z.number().optional(),
      heroImage: image().optional(),
      draft: z.boolean().default(false),
    }),
});

const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      summary: z.string(),
      heroImage: image().optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { pages, posts };
```

- [ ] **Step 2: Create empty content directories with .gitkeep**

```bash
mkdir -p src/content/pages src/content/posts src/assets/images public/downloads
touch src/content/pages/.gitkeep src/content/posts/.gitkeep src/assets/images/.gitkeep public/downloads/.gitkeep
```

### Task 11: Smoke-test page (so build passes before real content lands)

**Files:**

- Create: `src/content/pages/about.md` (placeholder, will be overwritten by Phase 4)

- [ ] **Step 1: Write a stub page**

```markdown
---
title: About
summary: Placeholder — will be replaced by extracted content.
order: 1
---

Placeholder content.
```

### Task 12: Dynamic page route

**Files:**

- Create: `src/pages/[...slug].astro`

- [ ] **Step 1: Write [...slug].astro**

```astro
---
// src/pages/[...slug].astro
import { getCollection, render } from "astro:content";
import Page from "../layouts/Page.astro";

export async function getStaticPaths() {
  const all = await getCollection("pages", ({ data }) => !data.draft);
  return all.map((entry) => ({
    params: { slug: entry.id.replace(/\.md$/, "") },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await render(entry);
---
<Page title={entry.data.title} summary={entry.data.summary} heroImage={entry.data.heroImage}>
  <Content />
</Page>
```

### Task 13: News index route

**Files:**

- Create: `src/pages/news/index.astro`

- [ ] **Step 1: Write news/index.astro**

```astro
---
// src/pages/news/index.astro
import { getCollection } from "astro:content";
import Base from "../../layouts/Base.astro";

const posts = (await getCollection("posts", ({ data }) => !data.draft))
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
---
<Base title="News" description="Updates from Southport Apartments">
  <article class="container container--prose news">
    <header><h1>News</h1></header>
    <ul class="news__list">
      {posts.map((p) => (
        <li class="news__item">
          <time datetime={p.data.date.toISOString()}>
            {p.data.date.toLocaleDateString("en-AU", { year: "numeric", month: "long", day: "numeric" })}
          </time>
          <h2><a href={`/news/${p.id.replace(/\.md$/, "")}`}>{p.data.title}</a></h2>
          <p>{p.data.summary}</p>
        </li>
      ))}
    </ul>
  </article>
</Base>

<style>
  .news { padding-block: var(--space-7); }
  .news__list { list-style: none; padding: 0; margin: 0; display: grid; gap: var(--space-6); }
  .news__item time {
    display: block; color: var(--color-text-muted); font-size: var(--fs-300);
    text-transform: uppercase; letter-spacing: 0.05em;
  }
  .news__item h2 { margin: var(--space-1) 0 var(--space-2); font-size: var(--fs-600); }
  .news__item a { color: inherit; text-decoration: none; }
  .news__item a:hover { color: var(--color-accent); }
</style>
```

### Task 14: News post route

**Files:**

- Create: `src/pages/news/[slug].astro`

- [ ] **Step 1: Write news/[slug].astro**

```astro
---
// src/pages/news/[slug].astro
import { getCollection, render } from "astro:content";
import Base from "../../layouts/Base.astro";
import { Image } from "astro:assets";

export async function getStaticPaths() {
  const all = await getCollection("posts", ({ data }) => !data.draft);
  return all.map((entry) => ({
    params: { slug: entry.id.replace(/\.md$/, "") },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await render(entry);
const date = entry.data.date.toLocaleDateString("en-AU", {
  year: "numeric", month: "long", day: "numeric",
});
---
<Base title={entry.data.title} description={entry.data.summary}>
  {entry.data.heroImage && (
    <div class="page-hero">
      <Image src={entry.data.heroImage} alt="" widths={[800, 1400, 2000]} sizes="100vw" loading="eager" />
    </div>
  )}
  <article class="container container--prose post">
    <header>
      <p class="post__date">{date}</p>
      <h1>{entry.data.title}</h1>
      <p class="post__summary">{entry.data.summary}</p>
    </header>
    <div class="prose"><Content /></div>
    <footer class="post__footer">
      <a href="/news">&larr; All news</a>
    </footer>
  </article>
</Base>

<style>
  .page-hero img { width: 100%; max-height: 60vh; object-fit: cover; }
  .post { padding-block: var(--space-7); }
  .post__date { color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.05em; font-size: var(--fs-300); }
  .post__summary { color: var(--color-text-muted); font-size: var(--fs-500); }
  .post__footer { margin-top: var(--space-7); padding-top: var(--space-5); border-top: 1px solid var(--color-rule); }
</style>
```

### Task 15: 404 page

**Files:**

- Create: `src/pages/404.astro`

- [ ] **Step 1: Write 404.astro**

```astro
---
import Base from "../layouts/Base.astro";
---
<Base title="Page not found">
  <article class="container container--prose" style="padding-block: var(--space-9); text-align: center;">
    <h1>Page not found</h1>
    <p>That page isn't here. Try the <a href="/">home page</a> or use the navigation above.</p>
  </article>
</Base>
```

### Task 16: HomeTile component

**Files:**

- Create: `src/components/HomeTile.astro`

- [ ] **Step 1: Write HomeTile.astro**

```astro
---
// src/components/HomeTile.astro
import { Image } from "astro:assets";

interface Props {
  href: string;
  label: string;
  image: ImageMetadata;
}
const { href, label, image } = Astro.props;
---
<a class="tile" href={href}>
  <div class="tile__media">
    <Image src={image} alt="" widths={[400, 800]} sizes="(min-width: 720px) 33vw, 100vw" />
  </div>
  <span class="tile__label">{label}</span>
</a>

<style>
  .tile {
    position: relative; display: block;
    border-radius: var(--radius-lg); overflow: hidden;
    text-decoration: none; color: #fff;
    aspect-ratio: 4 / 3;
    box-shadow: var(--shadow-1);
  }
  .tile__media { position: absolute; inset: 0; }
  .tile__media img {
    width: 100%; height: 100%; object-fit: cover;
    transition: transform 400ms ease;
  }
  .tile::after {
    content: ""; position: absolute; inset: 0;
    background: linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%);
  }
  .tile__label {
    position: absolute; left: var(--space-4); bottom: var(--space-3); z-index: 1;
    font-family: var(--font-display); font-size: var(--fs-500); font-weight: 600;
    text-shadow: 0 1px 2px rgba(0,0,0,0.4);
  }
  .tile:hover .tile__media img { transform: scale(1.04); }
  .tile:focus-visible {
    outline: 3px solid var(--color-accent); outline-offset: 3px;
  }
</style>
```

### Task 17: Homepage

**Files:**

- Create: `src/pages/index.astro` (overwriting Astro's default)
- Create: placeholder home tile images at `src/assets/images/home/{property,contact,visitors,my-home,community,moving-in}.jpg` if not yet extracted (Phase 4 will provide real ones)

- [ ] **Step 1: Identify or stage 7 images for the homepage**

The home page needs: 1 banner + 6 tile images. Pick from `scrape/southport.apartments/images/` for now (Phase 4 will replace with curated copies).

```bash
mkdir -p src/assets/images/home
# Banner
cp scrape/southport.apartments/images/n/banner-large-2400.jpg src/assets/images/home/banner.jpg
# Tiles — best-guess matches based on home grid
cp scrape/southport.apartments/images/8/view-across-pond-for-home-grid-640.jpg src/assets/images/home/property.jpg
cp scrape/southport.apartments/images/h/call-centre-640.jpg                     src/assets/images/home/contact.jpg
cp scrape/southport.apartments/images/8/deliver-parcel-unsplash-640.jpg         src/assets/images/home/visitors.jpg
cp scrape/southport.apartments/images/l/pasted-image-640.jpg                    src/assets/images/home/my-home.jpg
cp scrape/southport.apartments/images/c/community-640.jpg                       src/assets/images/home/community.jpg
cp scrape/southport.apartments/images/e/truck-508.png                           src/assets/images/home/moving-in.jpg
```

If any source path doesn't exist, run `find scrape/southport.apartments/images -iname '*<keyword>*'` to find an alternative and substitute.

- [ ] **Step 2: Write index.astro**

```astro
---
// src/pages/index.astro
import Base from "../layouts/Base.astro";
import HomeTile from "../components/HomeTile.astro";
import { Image } from "astro:assets";
import { getCollection } from "astro:content";

import banner from "../assets/images/home/banner.jpg";
import propertyImg from "../assets/images/home/property.jpg";
import contactImg from "../assets/images/home/contact.jpg";
import visitorsImg from "../assets/images/home/visitors.jpg";
import myHomeImg from "../assets/images/home/my-home.jpg";
import communityImg from "../assets/images/home/community.jpg";
import movingImg from "../assets/images/home/moving-in.jpg";

const tiles = [
  { href: "/about",     label: "Our Property", image: propertyImg },
  { href: "/contact",   label: "Contact",      image: contactImg },
  { href: "/visiting",  label: "Visitors",     image: visitorsImg },
  { href: "/my-home",   label: "My Home",      image: myHomeImg },
  { href: "/community", label: "Community",    image: communityImg },
  { href: "/moving-in", label: "Moving In",    image: movingImg },
];

const recent = (await getCollection("posts", ({ data }) => !data.draft))
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
  .slice(0, 3);
---
<Base title="Southport Apartments">
  <section class="hero">
    <Image src={banner} alt="Southport Apartments by Lake Tuggeranong" widths={[1200, 1800, 2400]} sizes="100vw" loading="eager" class="hero__img" />
    <div class="hero__overlay">
      <h1 class="hero__title">Your lifestyle by the lake</h1>
      <p class="hero__sub">A residential community on the shores of Lake Tuggeranong, Canberra.</p>
    </div>
  </section>

  <section class="tiles container">
    <h2 class="visually-hidden">Browse</h2>
    <div class="tiles__grid">
      {tiles.map((t) => <HomeTile {...t} />)}
    </div>
  </section>

  {recent.length > 0 && (
    <section class="recent container">
      <header class="recent__header">
        <h2>Latest news</h2>
        <a href="/news">All news &rarr;</a>
      </header>
      <ul class="recent__list">
        {recent.map((p) => (
          <li>
            <time datetime={p.data.date.toISOString()}>
              {p.data.date.toLocaleDateString("en-AU", { year: "numeric", month: "long", day: "numeric" })}
            </time>
            <a href={`/news/${p.id.replace(/\.md$/, "")}`}>{p.data.title}</a>
            <p>{p.data.summary}</p>
          </li>
        ))}
      </ul>
    </section>
  )}
</Base>

<style>
  .hero { position: relative; }
  .hero__img { width: 100%; height: clamp(360px, 60vh, 640px); object-fit: cover; }
  .hero__overlay {
    position: absolute; inset: auto 0 0 0;
    padding: var(--space-7) var(--container-pad);
    background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 100%);
    color: #fff;
  }
  .hero__title { font-size: var(--fs-800); margin: 0; color: #fff; text-shadow: 0 2px 8px rgba(0,0,0,0.35); }
  .hero__sub { font-size: var(--fs-500); margin: var(--space-2) 0 0; max-inline-size: 40ch; }

  .tiles { padding-block: var(--space-8); }
  .tiles__grid {
    display: grid; gap: var(--space-5);
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }

  .recent { padding-block: var(--space-7); }
  .recent__header { display: flex; align-items: baseline; justify-content: space-between; gap: var(--space-4); margin-bottom: var(--space-5); }
  .recent__header h2 { margin: 0; }
  .recent__list { list-style: none; padding: 0; margin: 0; display: grid; gap: var(--space-5); grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); }
  .recent__list time { color: var(--color-text-muted); font-size: var(--fs-300); text-transform: uppercase; letter-spacing: 0.05em; }
  .recent__list a { display: block; margin: var(--space-1) 0; font-family: var(--font-display); font-size: var(--fs-500); color: inherit; text-decoration: none; }
  .recent__list a:hover { color: var(--color-accent); }
  .recent__list p { margin: 0; color: var(--color-text-muted); }

  .visually-hidden {
    position: absolute; width: 1px; height: 1px;
    padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); border: 0;
  }
</style>
```

- [ ] **Step 3: Run dev server, smoke-test all routes**

```bash
pnpm dev --host 127.0.0.1 --port 4321 &
sleep 4
for path in / /about /news /no-such-page; do
  printf "%-15s -> %s\n" "$path" "$(curl -sI http://127.0.0.1:4321$path | head -1)"
done
kill %1
```

Expected: `/`, `/about`, `/news` all `200 OK`; `/no-such-page` `404`.

- [ ] **Step 4: Commit Phase 3**

```bash
git add -A
git commit -m "feat: content collections, dynamic routing, homepage"
```

---

## Phase 4 — Content extraction (parallel subagents)

### Task 18: Extract main pages (parallel batch 1 — 6 subagents)

**Goal:** dispatch one subagent per source HTML file. Each writes a Markdown file under `src/content/pages/`, copies kept images to `src/assets/images/<page-slug>/`, reports outcome.

**Pages in batch 1:**

| Source HTML                                                                                     | Target MD                                  | Slug                  | Order |
| ----------------------------------------------------------------------------------------------- | ------------------------------------------ | --------------------- | ----- |
| `scrape/southport.apartments/southportapartments/about/about_us.html`                           | `src/content/pages/about.md`               | `about`               | 1     |
| `scrape/southport.apartments/southportapartments/about/our-people-southport-apartments.html`    | `src/content/pages/about/people.md`        | `about/people`        | —     |
| `scrape/southport.apartments/southportapartments/about/gallery-southport-apartments.html`       | `src/content/pages/about/gallery.md`       | `about/gallery`       | —     |
| `scrape/southport.apartments/southportapartments/visiting/visiting.html`                        | `src/content/pages/visiting.md`            | `visiting`            | 2     |
| `scrape/southport.apartments/southportapartments/my-home/my_home.html`                          | `src/content/pages/my-home.md`             | `my-home`             | 3     |
| `scrape/southport.apartments/southportapartments/my-home/alterations-southport-apartments.html` | `src/content/pages/my-home/alterations.md` | `my-home/alterations` | —     |

**Subagent brief (use for each):**

> You are extracting one page from a WYSIWYG-built site mirror into clean Markdown for an Astro 6 site.
>
> **Source:** `<absolute path to source HTML>`
> **Target Markdown:** `<absolute path to target .md>`
> **Image destination:** `src/assets/images/<slug>/`
> **Page slug:** `<slug>`
> **Order:** `<n>` (omit if not provided)
>
> Steps:
>
> 1. Read the source HTML.
> 2. Locate the main content region (skip nav, header, footer, sidebars, framework chrome). Look for `<main>`, `<article>`, or content `<div>`s containing the actual prose.
> 3. For each `<img>` inside the content area, classify as **editorial** (real photo of property, residents, events, infrastructure) or **decorative** (icons, separators, framework chrome, hero banners that duplicate other content). Keep editorial only.
> 4. For each kept image: copy from `scrape/southport.apartments/<src>` to `src/assets/images/<slug>/<descriptive-name>.<ext>` using a human-readable kebab-case filename. Use `cp`.
> 5. Write the target Markdown file with frontmatter:
>    ```yaml
>    ---
>    title: "..."
>    summary: "..." # one-sentence hook
>    order: N # only for top-level pages
>    heroImage: "../../assets/images/<slug>/<chosen-hero>.jpg" # optional
>    ---
>    ```
> 6. Body: clean Markdown, Australian English. Demote H1s (the layout adds the H1). Use `![alt](../../assets/images/<slug>/<file>.jpg)` for inline images — Astro will resolve the relative path. Tighten redundant prose lightly; do not rewrite voice. Keep links pointing to other site sections by their _new_ paths (see URL mapping in the spec).
> 7. Report:
>    - Source path
>    - Target path
>    - Kept image count, dropped image count
>    - Any flags: empty pages, near-empty placeholder copy, unusually long pages, broken markup in source, anything you'd want a human to glance at
>    - Word count of generated Markdown

Dispatch all 6 in **one message with parallel Agent calls** (subagent_type `general-purpose`).

After all return:

- Read each generated Markdown file briefly.
- Note any flags worth surfacing to the user.
- Mark task complete.

- [ ] **Dispatch parallel subagents and review reports**
- [ ] **Commit batch 1**

```bash
git add src/content/pages src/assets/images
git commit -m "content: extract about, visiting, my-home pages"
```

### Task 19: Extract main pages (parallel batch 2 — 5 subagents)

| Source HTML                                                                             | Target MD                        | Slug        | Order |
| --------------------------------------------------------------------------------------- | -------------------------------- | ----------- | ----- |
| `scrape/southport.apartments/southportapartments/community/my_community.html`           | `src/content/pages/community.md` | `community` | 4     |
| `scrape/southport.apartments/southportapartments/moving/moving_in.html`                 | `src/content/pages/moving-in.md` | `moving-in` | 5     |
| `scrape/southport.apartments/southportapartments/safety/safety.html`                    | `src/content/pages/safety.md`    | `safety`    | 6     |
| `scrape/southport.apartments/southportapartments/admin/rules-southport-apartments.html` | `src/content/pages/rules.md`     | `rules`     | —     |
| `scrape/southport.apartments/southportapartments/contact/contact.html`                  | `src/content/pages/contact.md`   | `contact`   | 7     |
| `scrape/southport.apartments/policies.html`                                             | `src/content/pages/policies.md`  | `policies`  | —     |

(That's 6 pages — dispatch all 6.)

Use the same subagent brief from Task 18.

- [ ] **Dispatch parallel subagents and review reports**
- [ ] **Commit batch 2**

```bash
git add src/content/pages src/assets/images
git commit -m "content: extract community, moving-in, safety, rules, contact, policies"
```

### Task 20: Extract blog posts (parallel batches of 4)

**Posts** (16 total — split into 4 batches of 4):

Batch A:

- `a-new-powered-door.html`
- `a-warm-welcome-home.html`
- `great-expectations-southport-s-marketing.html`
- `like-the-new-gym-layout.html`

Batch B:

- `new-entrance-signs.html`
- `new-gym-layout.html`
- `new-lift-carpets.html`
- `new-lights-for-the-pool-area.html`

Batch C:

- `new-pedestrian-bridge-over-the-lake.html`
- `our-tiles-keep-good-company.html`
- `southport-s-beginnings.html`
- `sustainability-scheme-2-exploratory-visit.html`

Batch D:

- `sustainability-scheme-we-re-in.html`
- `sustainability-scheme-we-re-shortlisted.html`
- `sustainable-scheme-first-meeting.html`
- `the-bollards-are-coming.html`
- `the-fish-are-back.html`

(Batch D has 5; that's fine.)

**Source path pattern:** `scrape/southport.apartments/<filename>`
**Target path pattern:** `src/content/posts/<slug>.md` (slug = filename without `.html`)
**Image path pattern:** `src/assets/images/news/<slug>/`

**Subagent brief — same as Task 18 with these substitutions:**

- Frontmatter has `date` (extract from the page or `<time>` element; if missing, use `2024-01-01` and flag for human review) and `summary` (required, one sentence).
- No `order` field.
- `heroImage` recommended.

Dispatch each batch in one message. Review between batches.

- [ ] **Dispatch Batch A and review**
- [ ] **Dispatch Batch B and review**
- [ ] **Dispatch Batch C and review**
- [ ] **Dispatch Batch D and review**
- [ ] **Commit posts**

```bash
git add src/content/posts src/assets/images
git commit -m "content: extract 16 news posts"
```

### Task 21: Copy PDFs

**Files:**

- Copy 5 PDFs from `scrape/southport.apartments/download/` → `public/downloads/`

- [ ] **Step 1: Copy PDFs**

```bash
cp scrape/southport.apartments/download/*.pdf public/downloads/
ls public/downloads/
```

Expected: 5 PDFs listed.

- [ ] **Step 2: Add a small `Downloads` block to `/my-home` and `/rules`**

In `src/content/pages/my-home.md`, append (or place appropriately):

```markdown
## Appliance manuals

- [Blanco oven manual](/downloads/blanco-oven-manual.pdf) (PDF)
- [Blanco dishwasher manual](/downloads/blanco-dishwasher-manual.pdf) (PDF)
- [Modification application form](/downloads/modification-application-general-form.pdf) (PDF)
```

In `src/content/pages/rules.md`, append:

```markdown
## Documents

- [Explanatory memorandum (rules update)](/downloads/explanatory-memorandum-for-rules-update-from-2022-agm-notice.pdf) (PDF)
- [Sustainable Apartments Pilot — meeting minutes (June 2025)](/downloads/2025-06-16-minutes-of-sustainable-apartments-pilot-meeting.pdf) (PDF)
```

(Adjust paths if extraction agents already added these.)

- [ ] **Step 3: Commit**

```bash
git add public/downloads src/content/pages
git commit -m "content: add downloadable PDFs and link from relevant pages"
```

### Task 22: Image dedup pass

**Files:**

- May modify image references across `src/content/`

- [ ] **Step 1: Find duplicate filenames across page image folders**

```bash
find src/assets/images -type f -printf '%f\n' | sort | uniq -d
```

- [ ] **Step 2: For any duplicate filename, decide if it's the same image (compare with `md5sum`) and if so, hoist to `src/assets/images/shared/<file>` and update Markdown references.**

Skip this task if no duplicates found.

- [ ] **Step 3: Commit if changes made**

```bash
git add -A
git commit -m "refactor: hoist shared images to images/shared"
```

---

## Phase 5 — Build, smoke-test, ship the prototype

### Task 23: Production build & route smoke test

- [ ] **Step 1: Build**

```bash
pnpm build 2>&1 | tail -30
```

Expected: `Complete!`. No errors. Warnings about missing image references or schema validation must be fixed before continuing.

- [ ] **Step 2: Preview & smoke test**

```bash
pnpm preview --host 127.0.0.1 --port 4321 &
sleep 3
ROUTES="/ /about /about/people /about/gallery /visiting /my-home /my-home/alterations /community /moving-in /safety /rules /contact /policies /news /no-such-route"
for r in $ROUTES; do printf "%-25s %s\n" "$r" "$(curl -sI http://127.0.0.1:4321$r | head -1)"; done
kill %1
```

Expected: every route except `/no-such-route` returns 200; `/no-such-route` returns 404.

- [ ] **Step 3: Visual check in browser**

Open `http://127.0.0.1:4321/` in a browser and walk through the homepage, one section page (e.g. `/about`), `/news`, and one news post. Look for:

- broken images
- broken internal links
- nav highlighting current page
- hamburger menu working at <720px width
- legible typography, sensible spacing
- no stray WYSIWYG markup leaking through

If anything is broken, file follow-up tasks rather than continuing.

- [ ] **Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix: prototype smoke-test corrections"  # only if fixes made
```

### Task 24: Push prototype branch

- [ ] **Step 1: Push `main-fresh` to origin without overwriting `main` yet**

```bash
git push -u origin main-fresh
```

- [ ] **Step 2: Report to user**

Summarise: tag `old` is preserved, prototype lives on `main-fresh` branch on origin, suggest next step (review locally, then `git branch -M main-fresh main && git push --force-with-lease origin main` to make it the new default — but only when ready).

---

## Out of scope (deferred)

- GitHub Pages deploy workflow
- Dark mode
- Search
- Contact form
- Svelte islands
- ESLint
