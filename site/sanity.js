/*
 * Reads published Insights articles from Sanity (project 7veoevjj) for the site build.
 * The dataset is public, so no token is needed; only published articles are returned.
 */
const PROJECT = "7veoevjj";
const DATASET = "production";
const API = `https://${PROJECT}.api.sanity.io/v2025-02-19/data/query/${DATASET}`;

const QUERY = `*[_type == "article" && defined(slug.current)] | order(publishedAt desc) {
  "slug": slug.current, title, standfirst, practice, "date": publishedAt, artwork, author, body,
  coverImage { hotspot, asset->{ url, metadata { dimensions { width, height } } } }
}`;

const esc = (s) => String(s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Portable Text spans to inline HTML (bold, italic, links). */
const renderSpans = (block) => (block.children || []).map((span) => {
  let html = esc(span.text || "").replace(/\n/g, "<br>");
  for (const mark of span.marks || []) {
    if (mark === "strong") html = `<strong>${html}</strong>`;
    else if (mark === "em") html = `<em>${html}</em>`;
    else {
      const def = (block.markDefs || []).find((d) => d._key === mark);
      if (def && def._type === "link" && def.href) {
        const external = /^https?:/.test(def.href);
        html = `<a href="${esc(def.href)}"${external ? ' rel="noopener" target="_blank"' : ""}>${html}</a>`;
      }
    }
  }
  return html;
}).join("");

const BLOCK_TAGS = { normal: "p", h2: "h2", h3: "h3", blockquote: "blockquote" };

/** Portable Text blocks to the HTML used inside .prose on article pages. */
const toHtml = (blocks = []) => {
  const out = [];
  let list = null; // { tag, items }
  const flush = () => {
    if (list) out.push(`<${list.tag}>\n${list.items.map((i) => `  <li>${i}</li>`).join("\n")}\n</${list.tag}>`);
    list = null;
  };
  for (const block of blocks) {
    if (block._type !== "block") continue;
    const inner = renderSpans(block);
    if (block.listItem) {
      const tag = block.listItem === "number" ? "ol" : "ul";
      if (!list || list.tag !== tag) { flush(); list = { tag, items: [] }; }
      list.items.push(inner);
      continue;
    }
    flush();
    if (!inner.trim()) continue;
    if (block.style === "lead") out.push(`<p class="prose-lead">${inner}</p>`);
    else {
      const tag = BLOCK_TAGS[block.style] || "p";
      out.push(`<${tag}>${inner}</${tag}>`);
    }
  }
  flush();
  return out.join("\n");
};

const plainText = (blocks = []) => blocks
  .filter((b) => b._type === "block")
  .map((b) => (b.children || []).map((c) => c.text || "").join(""))
  .join(" ");

/** A Sanity cover image as the image object the layout expects (src, srcset, size, crop). */
const coverImage = (cover) => {
  const asset = cover?.asset;
  if (!asset?.url) return null;
  const { width = 2000, height = 1335 } = asset.metadata?.dimensions || {};
  const at = (w) => `${asset.url}?w=${w}&auto=format&q=80&fit=max`;
  const spot = cover.hotspot;
  return {
    src: at(1400),
    srcset: [900, 1400, 2000].map((w) => `${at(w)} ${w}w`).join(", "),
    w: width,
    h: height,
    pos: spot ? `${Math.round(spot.x * 100)}% ${Math.round(spot.y * 100)}%` : "50% 50%",
  };
};

/** Fetch published articles, newest first, shaped like the site's insight objects. */
const fetchArticles = async () => {
  const url = `${API}?perspective=published&query=${encodeURIComponent(QUERY)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Sanity query failed: ${res.status} ${await res.text()}`);
  const { result } = await res.json();
  return result.map((a) => {
    const words = plainText(a.body).split(/\s+/).filter(Boolean).length;
    return {
      slug: a.slug,
      title: a.title,
      standfirst: a.standfirst || "",
      practice: a.practice,
      date: a.date,
      image: coverImage(a.coverImage) || a.artwork || "photo",
      readMinutes: Math.max(1, Math.round(words / 220)),
      author: a.author || "Trueworth",
      body: toHtml(a.body),
    };
  });
};

module.exports = { fetchArticles, toHtml };
