# Trueworth: website

Static website for Trueworth. It is plain HTML, CSS and JavaScript, with no build step and no dependencies.
Every homepage section fills the screen on desktop and mobile.

## Structure

```
index.html              Homepage (hero slider, firm, expertise, approach, insights, careers, contact)
404.html                Not-found page (Vercel serves it automatically)
assets/css/styles.css   All styles; colours and type sizes are tokens at the top
assets/js/main.js       Slider, mobile menu, header, scroll reveals
assets/fonts/           Hanken Grotesk (text) and Newsreader (headings), self-hosted, SIL Open Font License
assets/img/             Wordmarks, favicons and the architectural artwork
tools/generate-art.py   Regenerates the artwork (python3 tools/generate-art.py assets/img)
archive/                Replaced elements kept for restoring (not published)
vercel.json             Vercel headers and clean URLs
robots.txt              Blocks search engines until launch
```

## Preview locally

```bash
python3 -m http.server 4173
```

Then open http://localhost:4173.

## Deploy on Vercel

No configuration is needed. Import the GitHub repository in Vercel with the
**Framework Preset** set to **Other**, leave the build command and output directory empty, and deploy.
Every push to the production branch deploys automatically, and other branches get preview URLs.

## Content still to supply (placeholders)

| Where | Placeholder |
| --- | --- |
| Contact section, mobile menu | Phone `+00 (0)00 0000 0000`, email `info@trueworth.example`, office address, hours |
| Careers | `careers@trueworth.example` |
| Firm section | Statement, intro paragraph and the three principles |
| Expertise | Practice-area list and descriptions |
| Insights | The three article cards (titles, dates, categories) |
| Hero slider | The three headlines |
| Footer | Regulatory details required by your bar (regulator, registration number), checked by a lawyer |
| Images | Hero slide 1 uses your photo. The remaining artwork in `assets/img/art-*.svg` can be swapped for photography: keep the same file names, or update the `src` attributes |

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
