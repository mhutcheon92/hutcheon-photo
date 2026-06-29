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
npm run dev   # → localhost:4321
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

Image fields return strings like `/images/home/photo.jpg` — use directly as `src` or `background-image` URL.

## Design System
All tokens in `src/styles/tokens.css`. Key values:
- `--bg: #0e0e0d` · `--accent: #c8a96e` (warm gold) · `--text-primary: #f0ece4`
- Display font: Cormorant Garamond · Body font: Inter
- Max width: `--max-w: 1280px` · Gutter: `--gutter: clamp(1.5rem, 4vw, 3rem)`

## Gallery Pattern (elopements + adventure detail pages)
Images distributed round-robin across 3 flex columns, each `aspect-ratio: 3/4`. Collapses to 2-per-row grid on mobile. Identical implementation in both `elopements.astro` and `adventures/[slug].astro`.

## Hardcoded Content (not CMS-driven)
- Pricing tiers on elopements page (Still / Wandering / Boundless) — edit directly in `elopements.astro`
- Hero title on home page (`Records of a life.`) — hardcoded in `index.astro`
- About section copy on home page — hardcoded in `index.astro`
