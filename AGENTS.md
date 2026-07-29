# Hutcheon Photo — Claude Code Instructions

Freelance photography site for Michael Hutcheon (Knoxville, TN). Astro 7 + Keystatic CMS + Vercel.

**Full technical reference:** `/Users/michaelhutcheon/Desktop/Claude Code/Freelance Photography Website/2026.06.28_Chat to Code Handoff/hutcheon-photo-context.md`

---

## Key URLs
- Live site: https://michaelhutcheon.com
- CMS (prod): https://michaelhutcheon.com/keystatic — sign in with GitHub
- CMS (local): http://localhost:4321/keystatic — no login needed
- Repo: https://github.com/mhutcheon92/hutcheon-photo

## Local Dev
```bash
npm run dev     # → localhost:4321
npm run build   # verify before pushing — Vercel deploys on push to main, no CI typecheck
```
Deploy by committing and pushing to `main` — Vercel auto-deploys.

---

## Critical Rules

### 1. Do NOT add `envField` to `astro.config.mjs`
Adding Astro env schema declarations for `KEYSTATIC_*` variables strips them from `import.meta.env` and breaks the CMS. Leave `astro.config.mjs` as-is unless adding integrations.

### 2. The OAuth token patch must stay intact
`scripts/patch-keystatic.mjs` runs on every `npm install` via `postinstall`. It patches Keystatic's OAuth token validation to handle GitHub's non-expiring tokens (which omit `expires_in` and `refresh_token`). Without it, logging into the CMS fails with "Authorization failed".

If the patch stops working after a Keystatic version bump, search `node_modules/@keystatic/core/dist/keystatic-core-api-generic.node.js` for `tokenDataResultType` and update the `oldSchema` in the patch script.

### 3. Keystatic repo config must be hardcoded
In `keystatic.config.js`, `owner: 'mhutcheon92'` and `name: 'hutcheon-photo'` must be string literals — not `process.env` values. The config runs client-side in the Keystatic UI where `process.env` is unavailable.

### 4. `.npmrc` must stay
`legacy-peer-deps=true` is required because `@keystatic/astro@5.1.0` only declares peer support for Astro 2-6. Removing it breaks Vercel builds with `ERESOLVE`.

---

## Content Structure

All CMS content is in `content/` (JSON/YAML managed by Keystatic). All uploaded images land in `public/images/[section]/`.

Read content in pages with:
```js
import { reader } from '../lib/reader.js';
const page = await reader.singletons.homePage.read();         // singleton
const story = await reader.collections.adventures.read(slug); // collection item
```

### Image fields — always objects, never bare strings
All image fields are `fields.object({ src, focal })`. They return `{ src: '/images/…', focal: 'center' }`. Always use `?.src` when reading and `?? 'center'` as a focal fallback:
```js
// Hero background
`background: url('${img?.src}') ${img?.focal ?? 'center'}/cover no-repeat;`
// Guard before rendering
{page.heroImage?.src && <img src={page.heroImage.src} />}
```

### Gallery images — additionally have `orientation`
Gallery fields (`elopementsPage.galleryImages`, `adventures.galleryImages`) use `galleryArray` in `keystatic.config.js`, which adds an `orientation` select (`'portrait'` | `'landscape'`). Render aspect ratio inline:
```astro
style={`background-image: url('${item.src}'); background-size: cover;
  background-position: ${item.focal ?? 'center'};
  aspect-ratio: ${item.orientation === 'landscape' ? '4/3' : '3/4'};`}
```
Non-gallery image arrays (carousels, list thumbnails) use `imgArray` — no orientation field.

### Keystatic config helpers (`keystatic.config.js`)
- `img(label, dir)` — single image with focal
- `imgArray(label, dir)` — array of images with focal (no orientation)
- `galleryArray(label, dir)` — array of gallery images with focal + orientation
- `focal()` — reusable focal-point select field

### `patch-keystatic.mjs` — two independent patches
**Patch 1** — Token schema: allows non-expiring GitHub tokens (omit `expires_in`/`refresh_token`).  
**Patch 2** — OAuth URL: injects `scope=public_repo` so `createCommitOnBranch` has write access.  
Both patches check themselves independently — no early exit that would skip the second.

## Design System
All tokens in `src/styles/tokens.css`. Key values:
- `--bg: #0e0e0d` · `--accent: #c8a96e` (warm gold) · `--text-primary: #f0ece4`
- Display font: Cormorant Garamond · Body font: Inter
- Max width: `--max-w: 1280px` · Gutter: `--gutter: clamp(1.5rem, 4vw, 3rem)`

## Hero Heights
- **Home** (`index.astro`): `height: 75vh; min-height: 560px`
- **All other pages**: `height: 50vh; min-height: 380px` — except `adventures/[slug].astro` which keeps `min-height: 520px`

## Nav Gradient (`src/components/Nav.astro`)
Multi-stop fade avoids the hard horizontal halo:
```css
background: linear-gradient(
  to bottom,
  rgba(14,14,13,0.75) 0%,
  rgba(14,14,13,0.50) 25%,
  rgba(14,14,13,0.22) 55%,
  rgba(14,14,13,0.05) 80%,
  transparent 100%
);
```

## Gallery Pattern (elopements + adventure detail pages)
Images distributed round-robin across 3 flex columns. Each item's `aspect-ratio` is set inline from its `orientation` field (`3/4` portrait, `4/3` landscape). Collapses to 2-per-row grid on mobile. Identical implementation in `elopements.astro` and `adventures/[slug].astro`.

## Git gotchas
- Files with brackets (e.g. `[slug].astro`) can't be staged by path in zsh — use `git add -u` to stage all tracked modified files instead.
- If push is rejected (remote has new Keystatic commits), run `git pull --rebase` then `git push`.

## Hardcoded Content (not CMS-driven)
- Pricing tiers on elopements page (Still / Wandering / Boundless) — edit directly in `elopements.astro`
- Hero title on home page (`Records of My Life`) — hardcoded in `index.astro`

## CMS-driven Content (Keystatic `homePage` singleton)
- Hero image, eyebrow, subtitle, location tag, body text
- Adventure + elopement preview images
- About portrait image
- About headline + about body paragraph (`aboutHeadline`, `aboutBody` fields)
