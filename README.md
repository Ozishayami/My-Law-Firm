# Trueworth: website

The Trueworth website and its CMS. The site is plain HTML, CSS and JavaScript; every section fills the
screen on desktop and mobile. Insights articles are written in a Sanity Studio served at `/studio`.

On every deploy, Vercel runs `npm run build`, which:

1. fetches the published articles from Sanity (project `7veoevjj`, dataset `production`),
2. generates every page from `site/` into `dist/`, and
3. builds the Sanity Studio into `dist/studio`.

## Pages

| URL | Contents |
| --- | --- |
| `/` | Hero slider, firm, expertise, how we work, latest insights, careers, contact |
| `/firm` | Who we are, principles, "titles are earned", commitments to clients |
| `/expertise` | All seven practice areas |
| `/expertise/<area>` | One page per practice area: services, when to call us, related insights |
| `/insights` | Latest article, then all articles with a filter by practice area |
| `/insights/<article>` | Article pages (from Sanity) |
| `/careers` | Why Trueworth, who we hire, how to apply |
| `/contact` | Contact details and an enquiry form (opens the visitor's email app) |
| `/studio` | The CMS (Sanity Studio): sign in to write and publish articles |

## Writing and publishing articles

1. Go to `/studio` on the website and sign in with the account you were invited with.
2. Open **Insights articles** and click **+** to start a new one.
3. Fill in the **Content** tab (title, summary, article) and the **Details** tab (practice area, date, web address,
   cover image or artwork). Use **Intro paragraph** for the larger first paragraph, and **Heading** for section titles.
4. Click **Publish**. The site rebuilds automatically, and the article appears within a minute or two:
   at the top of `/insights`, in the homepage slider and on the homepage, and on its practice-area page.

Drafts are never shown on the website. To take an article down, open it and choose **Unpublish**.

## Editing the rest of the site

Contact details and practice areas are in `site/data.js`; page layouts are in `site/pages.js`; the header, menus,
footer and page hero are in `site/layout.js`; styles are in `assets/css/styles.css`. To preview locally:

```bash
npm install
```

```bash
npm run build
```

```bash
npm run preview
```

Then open http://localhost:4173. `dist/` is generated: never edit it, and it is not committed.
The practice-area list in the Studio (`studio/options.js`) must match the one in `site/data.js`.

## One-time setup (Sanity and Vercel)

1. **Allow the Studio's addresses in Sanity.** At sanity.io/manage → Trueworth → **API → CORS origins**, add each address the
   Studio is opened from, ticking **Allow credentials**: `https://trueworthlp.com`, `https://www.trueworthlp.com`,
   and the project's `https://<project>.vercel.app` address.
2. **Rebuild the site when an article is published.**
   - In Vercel: Project → **Settings → Git → Deploy Hooks**, create a hook named "Sanity" for the production branch, and copy its URL.
   - In Sanity: **API → Webhooks → Create webhook**: paste the URL, dataset `production`, trigger on
     **Create, Update and Delete**, filter `_type == "article"`, method **POST**, and save.
3. **Invite the team.** At sanity.io/manage → **Members → Invite**, add each person who will write articles.
4. **Tidy up.** The "Claude setup" API token was only needed for the initial import. Delete it under **API → Tokens**
   once you no longer need help with the CMS.

## Structure

```
site/                   Page generator: content (data.js), Sanity fetch (sanity.js), shared parts (layout.js),
                        pages (pages.js), build.js and a local preview server (serve.js)
studio/                 Sanity Studio content types (schemas/) and choices (options.js)
sanity.config.js        Studio configuration (title, theme, menu)
sanity.cli.js           Studio build settings (project, served at /studio)
assets/css/styles.css   All styles; colours, fonts and type sizes are tokens at the top
assets/js/main.js       Slider, menus, header, insights filter, contact form, scroll reveals
assets/fonts/           Hanken Grotesk (text) and Newsreader (headings), self-hosted, SIL Open Font License
assets/img/             Wordmarks, favicons, the hero photograph and the architectural artwork
tools/                  Artwork generator, Word template builders, and the one-off Sanity import (tools/sanity)
brand/                  Logo, fonts and Word templates (not published)
archive/                Replaced elements kept for restoring (not published)
vercel.json             Build settings, routing for /studio, headers and clean URLs
robots.txt              Blocks search engines until launch
```

## Deploy on Vercel

Import the GitHub repository in Vercel. The build settings come from `vercel.json` (install, `npm run build`,
output `dist/`), so nothing needs to be set in the dashboard. Every push to the production branch deploys,
other branches get preview URLs, and publishing in the Studio triggers a rebuild once step 2 above is done.

## Content still to supply (placeholders)

| Where | Placeholder |
| --- | --- |
| `site/data.js` → `contact` | Phone `+00 (0)00 0000 0000`, email `info@trueworth.example`, careers email, office address, hours |
| `site/data.js` → `practices` | Practice-area descriptions, services and "when to call us" situations: drafted, to be checked by the lawyers |
| Studio → Insights articles | "Virtual assets in Nigeria" has an outline only: paste the published article into it. The other three articles are sample content to review or replace |
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
