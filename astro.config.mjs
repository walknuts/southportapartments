// @ts-check
import { defineConfig } from "astro/config";
import astroBrokenLinksChecker from "astro-broken-links-checker";

// https://astro.build/config
export default defineConfig({
  integrations: [
    astroBrokenLinksChecker({
      checkExternalLinks: false,
      throwError: true,
    }),
  ],
});
