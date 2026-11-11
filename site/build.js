/*
 * Generates the website's HTML pages from site/data.js, site/layout.js and site/pages.js.
 *   node site/build.js
 * Output (served by Vercel with clean URLs, e.g. /firm -> firm.html):
 *   index.html, firm.html, careers.html, contact.html, 404.html,
 *   expertise/index.html, expertise/<practice>.html,
 *   insights/index.html, insights/<article>.html
 */
const fs = require("fs");
const path = require("path");
const pages = require("./pages");

const ROOT = path.resolve(__dirname, "..");
const files = {
  "index.html": pages.home(),
  "firm.html": pages.firm(),
  "careers.html": pages.careers(),
  "contact.html": pages.contactPage(),
  "404.html": pages.notFound(),
  "expertise/index.html": pages.expertise(),
  "insights/index.html": pages.insightsIndex(),
};
for (const p of pages.practices) files[`expertise/${p.slug}.html`] = pages.practice(p);
for (const a of pages.insights) files[`insights/${a.slug}.html`] = pages.article(a);

for (const [rel, html] of Object.entries(files)) {
  const out = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
}
console.log(`built ${Object.keys(files).length} pages`);
