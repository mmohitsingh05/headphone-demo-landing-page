# Halden Arc — Headphone Landing Page

A cinematic, scroll-driven landing page for the fictional **Halden Arc** headphones: Bluetooth listening, real wood accents, an optional cable, and a $249 price point.

Built with plain HTML, CSS, and vanilla JavaScript — no frameworks, no build step, no dependencies. The page pairs semantic markup with a small scroll engine that scrubs video, pins the hero, and reveals sections as the visitor moves down the page.

## Live demo

- **Site:** https://mmohitsingh05.github.io/headphone-demo-landing-page/
- **Repository:** https://github.com/mmohitsingh05/headphone-demo-landing-page

## Highlights

- **Scroll-scrubbed hero film** — the opening video plays forward and backward with scroll position, with separate desktop and mobile cuts.
- **Pinned storytelling** — the hero stage holds while layered titles, captions, and calls to action fade through defined scroll ranges.
- **Finish selector** — switch between the wood and black Arc finishes with live status announcements.
- **Connection toggle** — compare Bluetooth and optional-cable modes with a matched image and graphic transition.
- **Product still with scroll progress** — a portrait product film tracks scroll inside its section.
- **Responsive by design** — a phone-specific hero poster and video, fluid type, and layouts tuned for small screens.
- **Accessible first** — semantic landmarks, a skip link, visible focus states, `aria-pressed` controls, live regions, and a full `prefers-reduced-motion` fallback.
- **Installable metadata** — web app manifest, SVG and PNG favicons, Apple touch icon, and Open Graph tags.

## Tech stack

| Layer | What is used |
| --- | --- |
| Markup | HTML5 |
| Styling | Hand-written CSS (`style.css`, `scene.css`, `filmtype.css`, `fx.css`) |
| Behavior | Vanilla JavaScript (`scene.js`, `filmtrack.js`, `filmtype.js`, `fx.js`, `main.js`) |
| Media | MP4 video, WebP posters, SVG artwork |
| Hosting | GitHub Pages (static) |

There is **no package manager, bundler, or runtime dependency**. Open the page from any static host.

## Project structure

```text
.
├── index.html            # Page content and scene markup
├── style.css             # Layout, type, components, responsive rules
├── scene.css             # Scroll-stage primitives and hero bands
├── filmtype.css          # Scroll-painted film titles
├── fx.css                # Grain, routes, rings, and visual effects
├── scene.js              # Scroll engine: pinning, video scrubbing, reveals
├── filmtrack.js          # Hero film timeline tracking
├── filmtype.js           # Scroll-painted typography
├── fx.js                 # Pointer, grain, and ambient effects
├── main.js               # Page behavior: header, finish and connection controls
├── assets/               # Hero films, product imagery, posters, illustrations
├── favicon.svg
├── favicon-48.png
├── apple-touch-icon.png
├── icon-192.png
├── icon-512.png
├── og.jpg                # Social share image
└── site.webmanifest      # Installable app metadata
```

## Run locally

Because the hero video is streamed and scrubbed through JavaScript, serve the folder over HTTP instead of opening `index.html` directly from disk.

With Python:

```bash
python -m http.server 8000
```

With Node.js:

```bash
npx serve .
```

Then open <http://localhost:8000>.

## Deploy to GitHub Pages

This site needs no build step.

1. Push the repository to GitHub.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the `main` branch and the `/ (root)` folder, then save.
5. GitHub publishes the site at `https://<username>.github.io/<repository>/` after the first build.

Every push to `main` updates the live site automatically.

## Before going live

Two placeholders in `index.html` are intentionally waiting on real business details:

- **Checkout** — the purchase button is disabled until a checkout URL exists. Update the button in the `#purchase` section and remove the `button--pending` state and the `checkout-note` text.
- **Canonical / Open Graph URL** — add the final domain to the `og:url` metadata (see the `DEPLOY STEP` comment near the top of `index.html`) and point `og:image` at an absolute URL.

The price, finishes, and product claims are demo content and should be reviewed before any public launch.

## Customization

- **Copy and sections:** edit `index.html`. Sections are self-contained; the purchase block is `#purchase`.
- **Colors, spacing, and type:** edit the custom properties at the top of `style.css`.
- **Scroll timing:** the hero's scroll length is set by `data-k-span` on the hero section. Caption windows use `data-k-band="start end"` (values from `0` to `1`).
- **Media:** replace files in `assets/` while keeping the same names, or update the `data-src` paths. Keep `data-bytes` roughly in sync with the hero file size so the loading ring stays accurate.
- **Reduced motion:** all scroll effects degrade to static posters and visible content under `prefers-reduced-motion: reduce`.

## Browser support

Current versions of Chrome, Edge, Firefox, and Safari. The page uses `IntersectionObserver`, CSS custom properties, `matchMedia`, and modern video APIs; older browsers receive the poster and fallback content.

## License

This is a demo project. Product names, copy, and imagery are used for presentation purposes. Add a license before redistributing the assets commercially.
