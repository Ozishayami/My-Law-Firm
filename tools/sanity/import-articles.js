/*
 * One-off migration: copies the articles that used to live in site/data.js into Sanity.
 *   node tools/sanity/import-articles.js [--dry-run]
 * Needs write access to project 7veoevjj (an Editor token sent as a Bearer header).
 * Documents get fixed ids (article-<slug>), so running it again replaces rather than duplicates.
 */
const crypto = require("crypto");
const { legacyInsights } = require("./legacy-articles");

const PROJECT = "7veoevjj";
const DATASET = "production";
const DRY = process.argv.includes("--dry-run");
const key = () => crypto.randomBytes(6).toString("hex");

const decode = (s) => s
  .replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'")
  .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\s+/g, " ");

/** Inline HTML (text and <strong>) to Portable Text spans. */
const spans = (html) => {
  const out = [];
  const re = /<strong>(.*?)<\/strong>|([^<]+)/g;
  let m;
  while ((m = re.exec(html))) {
    const text = decode(m[1] ?? m[2]);
    if (text) out.push({ _type: "span", _key: key(), text, marks: m[1] !== undefined ? ["strong"] : [] });
  }
  if (out.length) {
    out[0].text = out[0].text.replace(/^\s+/, "");
    out[out.length - 1].text = out[out.length - 1].text.replace(/\s+$/, "");
  }
  return out;
};

const block = (html, extra = {}) => ({ _type: "block", _key: key(), style: "normal", markDefs: [], children: spans(html), ...extra });

/** The small subset of HTML used in the articles: <p>, <p class="prose-lead">, <h2>, <ul><li>. */
const toPortableText = (html) => {
  const blocks = [];
  const re = /<p class="prose-lead">([\s\S]*?)<\/p>|<p>([\s\S]*?)<\/p>|<h2>([\s\S]*?)<\/h2>|<ul>([\s\S]*?)<\/ul>/g;
  let m;
  while ((m = re.exec(html))) {
    if (m[1] !== undefined) blocks.push(block(m[1], { style: "lead" }));
    else if (m[2] !== undefined) blocks.push(block(m[2]));
    else if (m[3] !== undefined) blocks.push(block(m[3], { style: "h2" }));
    else {
      for (const li of m[4].matchAll(/<li>([\s\S]*?)<\/li>/g)) blocks.push(block(li[1], { listItem: "bullet", level: 1 }));
    }
  }
  return blocks;
};

const docs = legacyInsights.map((a) => ({
  _id: `article-${a.slug}`,
  _type: "article",
  title: a.title,
  slug: { _type: "slug", current: a.slug },
  standfirst: a.standfirst,
  body: toPortableText(a.body),
  practice: a.practice,
  publishedAt: a.date,
  artwork: a.image,
  author: "Trueworth",
}));

(async () => {
  const url = `https://${PROJECT}.api.sanity.io/v2024-01-01/data/mutate/${DATASET}?returnIds=true${DRY ? "&dryRun=true" : ""}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.SANITY_TOKEN || "proxy-injected"}` },
    body: JSON.stringify({ mutations: docs.map((d) => ({ createOrReplace: d })) }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`${res.status} ${JSON.stringify(json)}`);
  console.log(`${DRY ? "[dry run] " : ""}${json.results.length} articles written:`);
  for (const d of docs) console.log(`  ${d._id}  (${d.body.length} blocks)`);
})().catch((e) => { console.error(e.message); process.exit(1); });
