/*
 * Builds the website into dist/.
 *   node site/build.js          (npm run build also builds the Sanity Studio into dist/studio)
 * Articles are fetched from Sanity; everything else comes from site/data.js and site/pages.js.
 * Output (served by Vercel with clean URLs, e.g. /firm -> firm.html):
 *   index.html, firm.html, careers.html, contact.html, 404.html,
 *   expertise/index.html, expertise/<practice>.html,
 *   insights/index.html, insights/<article>.html, plus assets/ and robots.txt
 */
const fs = require("fs");
const path = require("path");
const data = require("./data");
const { fetchArticles } = require("./sanity");

const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist");

(async () => {
  // 1. Articles from Sanity
  const articles = await fetchArticles();
  const known = articles.filter((a) => data.bySlug[a.practice]);
  for (const a of articles) if (!data.bySlug[a.practice]) console.warn(`skipped "${a.title}": unknown practice area "${a.practice}"`);
  if (!known.length) throw new Error("No published articles found in Sanity: publish at least one before building.");
  data.insights.splice(0, data.insights.length, ...known);

  // 2. Pages (required after the articles are loaded, because the templates read data.insights)
  const pages = require("./pages");
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

  // 3. Write dist/ from scratch
  fs.rmSync(DIST, { recursive: true, force: true });
  for (const [rel, html] of Object.entries(files)) {
    const out = path.join(DIST, rel);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, html);
  }
  fs.cpSync(path.join(ROOT, "assets"), path.join(DIST, "assets"), { recursive: true });
  fs.copyFileSync(path.join(ROOT, "robots.txt"), path.join(DIST, "robots.txt"));

  console.log(`built ${Object.keys(files).length} pages (${known.length} articles from Sanity) into dist/`);
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
