/*
 * Local preview server that resolves clean URLs the way Vercel does.
 *   node site/serve.js [port]      then open http://localhost:4173
 * /firm -> firm.html, /expertise -> expertise/index.html, unknown paths -> 404.html
 */
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const PORT = Number(process.argv[2]) || 4173;
const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml",
  ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".woff2": "font/woff2", ".txt": "text/plain",
};

const resolve = (urlPath) => {
  const clean = decodeURIComponent(urlPath.split("?")[0]).replace(/\/+$/, "") || "/";
  const base = path.join(ROOT, path.normalize(clean));
  if (!base.startsWith(ROOT)) return null;
  const candidates = clean === "/" ? [path.join(ROOT, "index.html")] : [base, `${base}.html`, path.join(base, "index.html")];
  return candidates.find((c) => fs.existsSync(c) && fs.statSync(c).isFile()) || null;
};

http.createServer((req, res) => {
  const file = resolve(req.url);
  const status = file ? 200 : 404;
  const target = file || path.join(ROOT, "404.html");
  res.writeHead(status, { "Content-Type": TYPES[path.extname(target)] || "application/octet-stream" });
  fs.createReadStream(target).pipe(res);
}).listen(PORT, "127.0.0.1", () => console.log(`Trueworth site on http://localhost:${PORT}`));
