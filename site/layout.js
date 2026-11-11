/*
 * Shared page parts: <head>, header with the Expertise menu, mobile menu, page hero,
 * insight cards, the contact screen and the footer.
 */
const { contact, images, practices, bySlug } = require("./data");

const esc = (s) => String(s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const fmtDate = (iso) => {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
};

/** An <img> for one of the shared images, cropped with object-fit by its class. */
const img = (key, { cls = "", eager = false, alt = "" } = {}) => {
  const i = images[key];
  const srcset = i.srcset ? ` srcset="${i.srcset}" sizes="100vw"` : "";
  const load = eager ? ` fetchpriority="high"` : ` loading="lazy"`;
  return `<img class="${cls}" src="${i.src}"${srcset} alt="${esc(alt)}" width="${i.w}" height="${i.h}" style="object-position: ${i.pos}"${load}>`;
};

const chevron = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>`;

// ---------- header ----------
const NAV = [
  { key: "firm", href: "/firm", label: "Our Firm" },
  { key: "expertise", href: "/expertise", label: "Expertise", menu: true },
  { key: "insights", href: "/insights", label: "Insights" },
  { key: "careers", href: "/careers", label: "Careers" },
];

const current = (active, key) => (active === key ? ` aria-current="page"` : "");

const header = (active) => `
  <header class="site-header" data-header>
    <div class="container header-inner">
      <a class="brand" href="/" aria-label="Trueworth home">
        <img src="/assets/img/trueworth-wordmark.svg" alt="Trueworth" width="150" height="28">
      </a>

      <nav class="primary-nav" aria-label="Primary">
        <ul>
${NAV.map((n) => n.menu ? `          <li class="has-menu" data-menu>
            <a href="${n.href}"${current(active, n.key)}>${n.label}</a>
            <button class="submenu-toggle" type="button" aria-expanded="false" aria-controls="menu-${n.key}" data-menu-button>
              <span class="visually-hidden">Show ${n.label.toLowerCase()} menu</span>${chevron}
            </button>
            <div class="mega" id="menu-${n.key}" data-menu-panel>
              <div class="container mega-inner">
                <div class="mega-intro">
                  <p class="eyebrow eyebrow--teal">Expertise</p>
                  <p class="mega-lead">Advice across the life of a business, a family and a career.</p>
                  <a class="link-arrow" href="/expertise">All expertise</a>
                </div>
                <ul class="mega-list" role="list">
${practices.map((p, i) => `                  <li><a href="/expertise/${p.slug}"><span class="mega-num">${String(i + 1).padStart(2, "0")}</span>${esc(p.name)}</a></li>`).join("\n")}
                </ul>
              </div>
            </div>
          </li>` : `          <li><a href="${n.href}"${current(active, n.key)}>${n.label}</a></li>`).join("\n")}
        </ul>
      </nav>

      <a class="btn btn-outline header-cta" href="/contact"${current(active, "contact")}>Contact us</a>

      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" data-menu-toggle>
        <span class="visually-hidden">Menu</span>
        <span class="menu-icon" aria-hidden="true"><span></span><span></span></span>
      </button>
    </div>
  </header>

  <div class="mobile-menu" id="mobile-menu" data-mobile-menu hidden>
    <nav class="container mobile-menu-inner" aria-label="Mobile">
      <ul>
        <li><a href="/firm">Our Firm</a></li>
        <li>
          <a href="/expertise">Expertise</a>
          <ul class="mobile-sub" role="list">
${practices.map((p) => `            <li><a href="/expertise/${p.slug}">${esc(p.name)}</a></li>`).join("\n")}
          </ul>
        </li>
        <li><a href="/insights">Insights</a></li>
        <li><a href="/careers">Careers</a></li>
        <li><a href="/contact">Contact us</a></li>
      </ul>
      <p class="mobile-menu-foot">
        <a href="${contact.phoneHref}">${esc(contact.phone)}</a><br>
        <a href="mailto:${contact.email}">${esc(contact.email)}</a>
      </p>
    </nav>
  </div>`;

// ---------- footer ----------
const footer = () => `
      <footer class="site-footer">
        <div class="container footer-inner">
          <div class="footer-top">
            <a href="/" aria-label="Trueworth home"><img class="footer-logo" src="/assets/img/trueworth-wordmark-white.svg" alt="Trueworth" width="150" height="28" loading="lazy"></a>
            <nav aria-label="Footer">
              <ul>
                <li><a href="/firm">Our Firm</a></li>
                <li><a href="/expertise">Expertise</a></li>
                <li><a href="/insights">Insights</a></li>
                <li><a href="/careers">Careers</a></li>
                <li><a href="/contact">Contact</a></li>
              </ul>
            </nav>
          </div>
          <p class="disclaimer">
            The information on this website is for general information only and is not legal advice.
            Contacting us does not by itself create a lawyer–client relationship. Please do not send confidential
            information until we have confirmed that we can act for you.
            <!-- PLACEHOLDER: add regulatory details required by your bar (e.g. regulator, registration number). -->
          </p>
          <div class="footer-bottom">
            <p class="copyright">© <span data-year>2026</span> Trueworth. All rights reserved.</p>
            <a class="link-arrow link-arrow--up" href="#main">Back to top</a>
          </div>
        </div>
      </footer>`;

/** The closing screen on every page: a contact panel and the footer, together filling the screen. */
const contactScreen = ({
  eyebrow = "Contact",
  title = "Let's talk about your matter",
  lead = "Tell us briefly what you need and a lawyer will come back to you within one working day.",
  cta = { href: "/contact", label: "Get in touch" },
} = {}) => `
    <section class="screen contact" id="contact" aria-labelledby="contact-title">
      <div class="container contact-grid">
        <div>
          <p class="eyebrow eyebrow--teal reveal">${esc(eyebrow)}</p>
          <h2 class="section-title reveal" id="contact-title">${esc(title)}</h2>
          <p class="lead reveal">${esc(lead)}</p>
          <a class="btn btn-solid reveal" href="${cta.href}">${esc(cta.label)}</a>
        </div>
        <dl class="contact-list reveal">
          <div><dt>Telephone</dt><dd><a href="${contact.phoneHref}">${esc(contact.phone)}</a></dd></div>
          <div><dt>Email</dt><dd><a href="mailto:${contact.email}">${esc(contact.email)}</a></dd></div>
          <div><dt>Office</dt><dd>${contact.address.map(esc).join("<br>")}</dd></div>
          <div><dt>Hours</dt><dd>${esc(contact.hours)}</dd></div>
        </dl>
      </div>
${footer()}
    </section>`;

/** A full-screen image hero for inner pages. */
const pageHero = ({ image, eyebrow, eyebrowHref, title, lead, meta, actions = "", titleTag = "h1" }) => `
    <section class="page-hero" aria-labelledby="page-title">
      ${img(image, { cls: "page-hero-media", eager: true })}
      <div class="page-hero-shade" aria-hidden="true"></div>
      <div class="container page-hero-content">
        ${eyebrowHref
    ? `<p class="eyebrow crumbs"><a href="${eyebrowHref}">${esc(eyebrow)}</a></p>`
    : `<p class="eyebrow">${esc(eyebrow)}</p>`}
        <${titleTag} class="display" id="page-title">${esc(title)}</${titleTag}>
        ${lead ? `<p class="page-hero-lead">${esc(lead)}</p>` : ""}
        ${meta ? `<p class="page-hero-meta">${meta}</p>` : ""}
        ${actions}
      </div>
    </section>`;

/** An insight card linking to its article. */
const card = (a, { headingTag = "h3" } = {}) => {
  const p = bySlug[a.practice];
  return `
          <article class="card reveal" data-category="${a.practice}">
            <a class="card-link" href="/insights/${a.slug}">
              <div class="card-media">${img(a.image)}</div>
              <div class="card-body">
                <p class="card-meta"><span>${esc(p.short)}</span><span aria-hidden="true">·</span><time datetime="${a.date}">${fmtDate(a.date)}</time></p>
                <${headingTag}>${esc(a.title)}</${headingTag}>
                <p>${esc(a.standfirst)}</p>
              </div>
            </a>
          </article>`;
};

/** Preload hints for an image used above the fold. */
const preloadImage = (key) => {
  const i = images[key];
  return i.srcset
    ? `<link rel="preload" as="image" href="${i.src}" imagesrcset="${i.srcset}" imagesizes="100vw" fetchpriority="high">`
    : `<link rel="preload" as="image" href="${i.src}" fetchpriority="high">`;
};

/** A complete page. */
const page = ({ title, description, active = "", heroImage, main, bodyClass = "" }) => `<!doctype html>
<!-- Generated by site/build.js from the files in site/. Edit those and rebuild; changes made here are overwritten. -->
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <!-- Pre-launch: keep search engines out while the content is still placeholder. Remove at launch. -->
  <meta name="robots" content="noindex, nofollow">
  <meta name="theme-color" content="#0D5E70">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:type" content="website">
  <meta property="og:image" content="/assets/img/icon-512.png">
  <link rel="icon" type="image/svg+xml" href="/assets/img/favicon.svg">
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/img/favicon-32.png">
  <link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
  <link rel="preload" href="/assets/fonts/hanken-grotesk-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/assets/fonts/newsreader-latin-opsz-normal.woff2" as="font" type="font/woff2" crossorigin>
  ${heroImage ? preloadImage(heroImage) : ""}
  <link rel="stylesheet" href="/assets/css/styles.css">
  <script>document.documentElement.classList.add('js')</script>
</head>
<body${bodyClass ? ` class="${bodyClass}"` : ""}>
  <a class="skip-link" href="#main">Skip to content</a>
${header(active)}

  <main id="main">
${main}
  </main>

  <script src="/assets/js/main.js" defer></script>
</body>
</html>
`;

module.exports = { esc, fmtDate, img, page, pageHero, card, contactScreen, footer };
