# Ramendra Kumar — Personal Website

A single-page marketing site for author, storyteller and TEDx speaker **Ramendra Kumar**.
Plain **static HTML / CSS / JS — no build step, no dependencies.**

## Structure

```
public/
  index.html     # all page markup
  styles.css     # design tokens, layout, responsive rules
  script.js      # hero identity rotator, book rail arrows, inline "coin" media,
                 # rich session dropdown, scroll reveals, sticky header
  assets/        # images (JP/PNG/SVG) + self-hosted fonts (Romie, Kalice, Satoshi)
```

Everything the site needs is inside `public/`. All asset paths are **relative**, so the
site works at any domain or subpath without changes.

## Run locally

```bash
cd public
python3 -m http.server 8777
# open http://localhost:8777
```

(Any static file server works — `npx serve public`, Live Server, etc.)

## Page sections

Header (sticky, with CTA) · Hero (rotating identity headline + key-achievements bar) ·
Manifesto · The Work (horizontal book rail) · Book in Focus · On Stage (videos +
interactions + Cancer Warrior) · Selected Appearances · Recognition · Book a session
(contact form) · Footer.

## Type & design

- **Display / serif:** Romie (with Kalice + Georgia fallbacks)
- **Body / sans:** Satoshi
- Palette and tokens are defined as CSS custom properties at the top of `styles.css`.

## Deployment (current)

Hosted on **GitHub Pages**, served from the **`gh-pages`** branch (root).
Live: https://aniketkumar9504.github.io/ramen-website-2026-new/

To deploy, publish the contents of `public/` to the `gh-pages` branch root
(include an empty `.nojekyll` file so the `assets/` folders are served as-is).

## For developers — still to wire up

These are intentionally placeholders and need real destinations / a backend:

- **Contact form** (`#booking`) — no backend; currently `onsubmit="return false;"`.
  Point it at a form handler / email service.
- **Video tiles & "On Stage" cards** — `href="#"` placeholders; add real video URLs.
- **Social, WhatsApp, and email links** in the footer/contact — update to real handles.
- **Routing / custom domain** — configure under GitHub **Settings → Pages**
  (or move to another host; it's all static).
