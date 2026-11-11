# Trueworth: website

Static website for Trueworth: plain HTML, CSS and JavaScript, with no dependencies.
Every section fills the screen on desktop and mobile.

The pages are generated from the files in `site/` by a small Node script, and the generated HTML is
committed, so Vercel serves it as-is with no build step.

## Pages

| URL | File | Contents |
| --- | --- | --- |
| `/` | `index.html` | Hero slider, firm, expertise, how we work, latest insights, careers, contact |
| `/firm` | `firm.html` | Who we are, principles, "titles are earned", commitments to clients |
| `/expertise` | `expertise/index.html` | All seven practice areas |
| `/expertise/<area>` | `expertise/<area>.html` | One page per practice area: services, when to call us, related insights |
| `/insights` | `insights/index.html` | Latest article, then all articles with a filter by practice area |
| `/insights/<article>` | `insights/<article>.html` | Article pages |
| `/careers` | `careers.html` | Why Trueworth, who we hire, how to apply |
| `/contact` | `contact.html` | Contact details and an enquiry form (opens the visitor's email app) |

## Editing the site

1. Edit the content in `site/data.js` (contact details, practice areas, articles) or the page layouts in `site/pages.js`.
   The header, menus, footer and page hero are in `site/layout.js`.
2. Rebuild the pages and preview them:

```bash
node site/build.js
```

```bash
node site/serve.js
```

Then open http://localhost:4173. The preview server handles clean URLs (`/firm`) the same way Vercel does.

3. Commit both the `site/` change and the regenerated HTML.

Do not edit the generated `.html` files directly: the next build overwrites them.

### Adding an article

Add an entry at the top of `insights` in `site/data.js` (newest first) with a `slug`, `title`, `standfirst`,
`practice` (the practice area's slug), `date`, `image`, `readMinutes` and the article `body` as HTML, then rebuild.
The newest article automatically appears in the homepage slider, on the homepage and at the top of `/insights`.

## Structure

```
site/                   Page generator: content (data.js), shared parts (layout.js), pages (pages.js), build.js, serve.js
assets/css/styles.css   All styles; colours, fonts and type sizes are tokens at the top
assets/js/main.js       Slider, menus, header, insights filter, contact form, scroll reveals
assets/fonts/           Hanken Grotesk (text) and Newsreader (headings), self-hosted, SIL Open Font License
assets/img/             Wordmarks, favicons, the hero photograph and the architectural artwork
tools/                  Artwork generator and the letterhead/invoice/receipt template builders
brand/                  Logo, fonts and Word templates (not published)
archive/                Replaced elements kept for restoring (not published)
vercel.json             Vercel headers and clean URLs
robots.txt              Blocks search engines until launch
```

## Deploy on Vercel

No configuration is needed. Import the GitHub repository in Vercel with the
**Framework Preset** set to **Other**, leave the build command and output directory empty, and deploy.
Every push to the production branch deploys automatically, and other branches get preview URLs.

## Content still to supply (placeholders)

| Where | Placeholder |
| --- | --- |
| `site/data.js` → `contact` | Phone `+00 (0)00 0000 0000`, email `info@trueworth.example`, careers email, office address, hours |
| `site/data.js` → `practices` | Practice-area descriptions, services and "when to call us" situations: drafted, to be checked by the lawyers |
| `site/data.js` → `insights` | "Virtual assets in Nigeria" has an outline only: paste the published article into its `body`. The other three articles are sample content to review or replace |
| `site/pages.js` | Firm, careers and homepage copy, drawn from the Trueworth Charter: check it still matches the charter as adopted |
| Footer (`site/layout.js`) | Regulatory details required by your bar (regulator, registration number), checked by a lawyer |
| Contact form | It opens the visitor's email app. A form that sends directly needs a form service or a Vercel function |
| Images | Hero slide 1 uses your photo. The remaining artwork in `assets/img/art-*.svg` can be swapped for photography |

## Heading font

Headings use **Newsreader**, a free stand-in for **IvyPresto Text Light**, at weight 380 to match Ivy's density.
IvyPresto is a commercial font: do not commit an Adobe Fonts copy of it to this repository or serve it from the site.
Once a web licence has been bought from The Ivy Foundry (or an Adobe Fonts web project is set up), switch over in `assets/css/styles.css`:

1. Add an `@font-face` for "IvyPresto Text" pointing at the licensed web font files (or link the Adobe Fonts stylesheet in `index.html`).
2. Put "IvyPresto Text" first in `--font-display`, and set `--display-weight` to 300.

## Before launch

1. Replace every placeholder above.
2. Remove `<meta name="robots" content="noindex, nofollow">` from `index.html`.
3. Remove the `X-Robots-Tag` header from `vercel.json`.
4. Replace `robots.txt` with the "launch" version described in the file.
5. Add your domain in Vercel (Project → Settings → Domains).
