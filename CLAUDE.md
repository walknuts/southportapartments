# Southport Apartments

Static site for the Southport Apartments residential community on Lake
Tuggeranong, Canberra. Built with Astro 6, deployed as static HTML.

## Stack

- Astro 6 (static output, no SSR)
- pnpm, Node 24 (pinned via `mise.toml`)
- TypeScript (strict, via `astro/tsconfigs/strict`)
- `sharp` for production image optimisation
- `astro-broken-links-checker` integration --- throws on broken internal links
  during `astro build`
- Pagefind for static search (post-build indexer, `dist/pagefind/`)
- `astro check` for typechecking; oxfmt for formatting; Stylelint
  (`stylelint-config-standard`) for CSS

## Layout

- `src/content/pages/` --- main site pages, rendered by `src/pages/[...slug].astro`
- `src/content/posts/` --- news posts, rendered by `src/pages/news/[slug].astro`
- `src/content.config.ts` --- collection schemas (frontmatter contracts)
- `src/components/` --- shared Astro components (Nav, Footer, HomeTile)
- `src/layouts/` --- `Base.astro` (shell) and `Page.astro` (content wrapper)
- `src/assets/images/` --- imagery processed by Astro's `<Image>` component
- `src/styles/` --- `tokens.css` (design tokens), `global.css` (base styles)
- `public/downloads/` --- PDFs and other static assets served as-is

## Commands

```sh
pnpm dev           # local dev server
pnpm build         # astro build + Pagefind indexing (also runs link checker)
pnpm preview       # serve the built site locally
pnpm typecheck     # astro check
pnpm format        # oxfmt (write); format:check for CI
pnpm lint:css      # stylelint src/**/*.{css,astro}
```

## Content notes

- pages and posts are markdown with frontmatter validated by zod schemas in
  `content.config.ts` --- check the schema before adding new frontmatter fields
- `draft: true` excludes an entry from `getStaticPaths` and from the build
- internal links must resolve --- the broken-link checker fails the build
  otherwise
- prefer `<Image>` from `astro:assets` over raw `<img>` for anything in
  `src/assets/images/` so sharp can optimise it

## Scraped reference site

The original (pre-Astro) site mirror lives in `scrape/` (gitignored). Use it
when you need to cross-check content extraction or styling against the
production site, but don't commit anything from it.
