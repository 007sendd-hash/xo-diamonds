import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
// SITE and BASE override for GitHub Pages preview.
const site = process.env.SITE_URL ?? "https://shop.sendd.ru";
const base = process.env.BASE_PATH ?? "/";

export default defineConfig({
  site,
  base,
  integrations: [sitemap()],
  build: {
    assets: "assets",
  },
  server: {
    host: "0.0.0.0",
    port: 4321,
  },
});
