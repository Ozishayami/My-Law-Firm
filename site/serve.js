/*
 * Local preview of the built site in dist/, resolving URLs the way Vercel does.
 *   npm run build, then: node site/serve.js [port]   and open http://localhost:4173
 * /firm -> firm.html, /expertise -> expertise/index.html, /studio/* -> the Studio app, unknown -> 404.html
 */
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..", "dist");
const PORT = Number(process.argv[2]) || 4173;
const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".mjs": "text/javascript",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".ico": "image/x-icon",
  ".woff2": "font/woff2", ".txt": "text/plain", ".json": "application/json", ".webmanifest": "application/manifest+json",
};

const isFile = (p) => fs.existsSync(p) && fs.statSync(p).isFile();

const resolve = (urlPath) => {
  let clean = decodeURIComponent(urlPath.split("?")[0]).replace(/\/+$/, "") || "/";
  if (clean.startsWith("/static/")) clean = `/studio${clean}`; // Studio favicons (see vercel.json)
  const base = path.join(ROOT, path.normalize(clean));
  if (!base.startsWith(ROOT)) return null;
  const candidates = clean === "/" ? [path.join(ROOT, "index.html")] : [base, `${base}.html`, path.join(base, "index.html")];
  const hit = candidates.find(isFile);
  if (hit) return hit;
  if (clean === "/studio" || clean.startsWith("/studio/")) return path.join(ROOT, "studio", "index.html"); // Studio routes
  return null;
};

if (!fs.existsSync(ROOT)) {
  console.error("dist/ not found: run `npm run build` (or `node site/build.js`) first.");
  process.exit(1);
}

http.createServer((req, res) => {
  const file = resolve(req.url);
  const target = file || path.join(ROOT, "404.html");
  res.writeHead(file ? 200 : 404, { "Content-Type": TYPES[path.extname(target)] || "application/octet-stream" });
  fs.createReadStream(target).pipe(res);
}).listen(PORT, "127.0.0.1", () => console.log(`Trueworth site on http://localhost:${PORT}`));
