# Southport Apartments — Astro 6 rebuild

**Date:** 2026-04-18
**Status:** approved (Ben, in conversation)

## Goal

Replace the existing Jekyll site at `walknuts/southportapartments` with a fresh Astro 6 site. Content is sourced from the contractor-built live site at <https://southport.apartments/> (better content than the Jekyll version, but tangled WYSIWYG framework). The new site is for **current residents** primarily, will eventually be deployed to GitHub Pages, and prioritises clean modern visual design and a small, simple codebase.

## Repo operation

The existing repo is preserved as a tag, then wiped:

1. `git tag old main && git push origin old`
2. `git checkout --orphan main-fresh && git rm -rf .`
3. Scaffold Astro 6 in place
4. Force-push as new `main`; tag `old` keeps history accessible

## Stack

- Astro 6, TypeScript strict, static output
- pnpm, mise (pin Node 22)
- Modern CSS (no Tailwind): CSS custom properties for tokens, CSS grid, container queries, fluid type via `clamp()`
- Astro `<Image>` for content image processing
- Astro Content Collections for pages and posts
- Astro View Transitions
- Prettier with Astro plugin; no ESLint until needed
- One display font via `@fontsource` (Fraunces or similar); system font stack for body
- Svelte 5 deferred — not needed for v1

## Project layout

```
southportapartments/
├── astro.config.mjs
├── tsconfig.json
├── package.json
├── mise.toml
├── public/
│   ├── favicon.svg
│   └── downloads/          # 5 PDFs
├── src/
│   ├── content.config.ts
│   ├── content/
│   │   ├── pages/          # ~12 hand-curated MD pages
│   │   └── posts/          # ~16 blog posts
│   ├── assets/images/      # curated content images
│   ├── layouts/{Base,Page}.astro
│   ├── components/{Nav,Footer,HomeTile,Prose}.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── [...slug].astro
│   │   ├── news/index.astro
│   │   ├── news/[slug].astro
│   │   └── 404.astro
│   └── styles/{tokens,global}.css
└── scrape/   (gitignored, kept locally)
```

## Content collections

```ts
// src/content.config.ts
const pages = defineCollection({
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string().optional(),
      order: z.number().optional(), // controls nav position
      heroImage: image().optional(),
      draft: z.boolean().default(false),
    }),
});

const posts = defineCollection({
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      summary: z.string(),
      heroImage: image().optional(),
      draft: z.boolean().default(false),
    }),
});
```

## URL mapping (live → new)

| Live                                                                 | New                    |
| -------------------------------------------------------------------- | ---------------------- |
| `/index.html`                                                        | `/`                    |
| `/southportapartments/about/about_us.html`                           | `/about`               |
| `/southportapartments/about/our-people-southport-apartments.html`    | `/about/people`        |
| `/southportapartments/about/gallery-southport-apartments.html`       | `/about/gallery`       |
| `/southportapartments/visiting/visiting.html`                        | `/visiting`            |
| `/southportapartments/my-home/my_home.html`                          | `/my-home`             |
| `/southportapartments/my-home/alterations-southport-apartments.html` | `/my-home/alterations` |
| `/southportapartments/community/my_community.html`                   | `/community`           |
| `/southportapartments/moving/moving_in.html`                         | `/moving-in`           |
| `/southportapartments/safety/safety.html`                            | `/safety`              |
| `/southportapartments/admin/rules-southport-apartments.html`         | `/rules`               |
| `/southportapartments/contact/contact.html`                          | `/contact`             |
| `/policies.html`                                                     | `/policies`            |
| `/blog-index.php.html`                                               | `/news`                |
| `/<post-slug>.html` (16 posts)                                       | `/news/<slug>`         |

**Top nav** (kept short): About · Visiting · My Home · Community · Moving In · Safety · Contact. Rules, Policies, Gallery, People reachable via section pages and footer.

## Content extraction

For each source HTML, dispatch a subagent in parallel batches (4-6 at a time) with this brief:

> Read source HTML. Extract prose content only (skip nav/header/footer/WYSIWYG framework). For each `<img>` in the content area, decide editorial vs decorative — keep editorial only. Copy kept images to `src/assets/images/<page-slug>/` with descriptive filenames. Write clean Markdown to `src/content/pages/<slug>.md` (or `posts/<slug>.md`) with frontmatter `{title, summary, order?, heroImage?}`. Australian English. Tighten redundant prose lightly. Report kept/dropped counts and any flags (empty pages, duplicates).

After all subagents finish: dedup pass, hoist shared images to `src/assets/images/shared/`. Copy 5 PDFs to `public/downloads/` and link from relevant pages.

## Visual design

Quiet, modern, lake-and-sky. Photography-led; design recedes.

**Palette** (preserved from current site):

| Token                | Hex       | Use                             |
| -------------------- | --------- | ------------------------------- |
| `--color-text`       | `#696670` | body text                       |
| `--color-bg`         | `#fff`    | page background                 |
| `--color-bg-soft`    | `#ddedf7` | subtle section bg, hero overlay |
| `--color-bg-sage`    | `#e1e6d7` | secondary accent                |
| `--color-accent`     | `#00b2ff` | links, primary CTA              |
| `--color-text-muted` | `#677a85` | secondary text, captions        |
| `--color-alert`      | `#ce2029` | safety/alert callouts only      |

**Type**: system stack for body, Fraunces (or similar humanist serif) for headings via `@fontsource`. Fluid scale.

**Layout patterns**:

- Home: full-bleed hero, 6-up tile grid (`repeat(auto-fit, minmax(220px, 1fr))`), recent news strip
- Section pages: short hero, 70ch prose column, related-page footer
- Gallery: CSS masonry with fallback
- News index: date + title + summary list

**Responsive**: single stylesheet, mobile-first, container queries where useful, hamburger nav <720px. No separate mobile site.

**Motion**: View Transitions, quiet hover states, `prefers-reduced-motion` respected.

## Build/dev/deploy

- `pnpm dev`, `pnpm build`
- No CI/deploy yet — added when ready for GitHub Pages (set `site` and `base` in `astro.config.mjs`, add `.github/workflows/deploy.yml`)
- `scrape/` gitignored

## Out of scope (v1)

- Dark mode
- Contact form (mailto link instead)
- Search
- Booking/availability widget
- CI/CD
- Svelte islands (revisit if interactivity is needed)
