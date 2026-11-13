# Southport Apartments

Static site for the Southport Apartments residential community on Lake
Tuggeranong, Canberra. Built with Astro 7, deployed as static HTML.

The deploy workflow publishes only the `offline/` holding page (the site is
deliberately retired for now; revert `05dc347` to restore it). CI's `check` job
still typechecks, lints and builds the real site.

`pnpm build` runs Pagefind indexing after `astro build`, and the
`astro-broken-links-checker` integration throws on broken internal links during
it.

## Content notes

- pages and posts are markdown with frontmatter validated by zod schemas in
  `content.config.ts` --- check the schema before adding new frontmatter fields
- `draft: true` excludes an entry from `getStaticPaths` and from the build

## Scraped reference site

The original (pre-Astro) site mirror lives in `scrape/` (gitignored). Use it
when you need to cross-check content extraction or styling against the
production site, but don't commit anything from it.
