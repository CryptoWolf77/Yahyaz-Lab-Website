# YahyazLab Portfolio

## Destinations

- `/`: the Nebula flight: hero, Two Worlds, Apps and Games stations, Reel, About (`/#about`), Contact (`/#contact`).
- `/apps`: Apps intro planet, then the ApexLoad and QuranHaven stations (`/apps#apexload`, `/apps#quranhaven`).
- `/games`: Games intro planet, the White Ninja, Puzzle VS Zombie and Ball Crusher stations, then the Reel (`/games#reel`).
- `/privacy/white-ninja` and `/privacy/puzzle-vs-zombie`: unchanged English policies in a reading layout.

The Vite build includes all five HTML entry points. Deploy the entire `dist/` directory using the existing hosting workflow. Links shared from the previous site keep working: `/#games` and `/#showreel` go to the Games page (`#showreel` lands on `#reel`), `/#studio` lands on `/#about`, and `/games#games` / `/games#showreel` land on the stations and the reel.

## Code Layout

The site is plain HTML entries plus vanilla ES modules in `src/site/` (bundled by Vite, Three.js for the scene):

- `content.js`: every verified text, link and media record (EN/AR). Edit products here.
- `core.js` (routes, language, UI copy), `chrome.js` (header, menu, footer, timeline), `ui.js` (dialogs, lightbox, trailers, reel, reveals), `stations.js` (product stations).
- `flight.js`, `scene.js`, `shaders.js`, `targets.js`: the scroll-driven WebGL particle scene. `sky.js`: the static starfield (no-WebGL fallback and privacy pages).
- Entries: `home.js` (`/`), `product-page.js` (`/apps`, `/games`, chosen by `<body data-page>`), `privacy-page.js` (both policies).
- `style.css`: the whole design system. `public/boot.js` adds the `js` class before first paint (external, so the CSP needs no inline script).

## Adding An App

1. Place optimized local WebP icons and screenshots under `public/assets/apps/<slug>/`. Keep authentic UI and original aspect ratios.
2. Add a record to `apps` in `src/site/content.js` with English and Arabic copy, the verified website, icon, ordered screenshots with exact dimensions and descriptive labels, verified features and store links. Stations, the page index, the home manifest and the camera stops are generated from that list.
3. Only add verified or explicitly user-approved platform destinations. ApexLoad's Android Google Play destination is verified on its official website; its iPhone release is still coming soon, so no iOS badge is shown. QuranHaven uses the Google Play and App Store destinations supplied by the user.
4. Check both languages at phone, tablet and desktop sizes.

## Content Verification

Last verified: **2026-10-17**, against the actual applications. Product captures are authentic, local-only, optimized WebP files. Recheck functionality and destinations before changing product claims or adding platform links.

- ApexLoad: `https://apexload.org/` is the verified social media downloader and identifies YahyazLab as creator. The originally supplied `https://apexload.com/` timed out on repeated checks; no redirect was verified. The portfolio therefore links to `.org`. Download formats and quality depend on the supported source. Do not promise all platforms or guaranteed 4K. No iOS release badge is shown.
- QuranHaven: `https://quranhaven.org/` is the verified application. Reading/listening, Tafsir/translations, browse/search and Khatmah/memorization plans are verified. `surahs.webp` is actually the Mushaf reading interface, not a Surah index; its gallery caption is **Mushaf reader**. Keep its Arabic content unedited and within the gallery, not as animated decoration. Its Google Play destination was explicitly provided by the user; the user also supplied its App Store destination on 2026-11-02.
- Maintain game records, asset URLs, videos and store links in `src/site/content.js`. Keep existing destinations and authentic media intact when updating the general studio description.

## Language And Accessibility

English uses `lang="en"` and LTR; Arabic uses `lang="ar"` with an RTL page (Alexandria for Arabic text). `?lang=ar|en` deep links work, and the choice is stored under the same `yahyaz-language` key as the previous site. Latin product names stay isolated with `dir="ltr"`/`<bdi>`; never split Arabic characters for animation. Privacy pages always stay English/LTR and never overwrite the stored choice. Dialogs (menu, lightbox, trailer, details) close on Escape, trap focus and restore it on close.

Do not use `background-clip: text` (gradient text) on an element whose children animate separately: Chrome paints squashed, overlapping copies during the reveal. The hero headline is a solid colour for that reason.

## Scene And Media

The scene is one persistent WebGL particle field that morphs between the logo, two planets, the station tunnel, the galaxy and the contact logo as you scroll. It honours reduced motion, falls back to the static starfield when WebGL is unavailable (preview with `?nowebgl`), and pauses when the tab is hidden. Game trailers load only after a play action (`white-ninja-promo.mp4` is 49.6 MB). QuranHaven screenshots are shown respectfully inside the gallery, never as animated decoration.

Fonts are self-hosted in `public/assets/fonts/` (Unbounded, Manrope, JetBrains Mono, Alexandria; OFL licences alongside) because the production CSP only allows `font-src 'self'`.

## Development And Checks

Run these commands from the project root:

Use Node.js 22.12.0 or newer. The build prints its actual Node.js version before running TypeScript and Vite. Vite must remain on a patched release, at least 7.3.7 within the existing Vite 7 line.

Coolify keeps the existing Nixpacks static-site workflow and build-time `NIXPACKS_NODE_VERSION=22`. `nixpacks.toml` pins the official nixpkgs snapshot providing Node.js 22.23.4 because a major-version setting alone can select an outdated package. When changing this archive, verify the actual Node.js version, clean installation, production build, health check and all five routes before considering deployment complete. Keep the `dist/` publish directory and existing Nginx routing unchanged.

- `npm.cmd run dev`: start the Vite development server at `http://127.0.0.1:5173/`.
- `npm.cmd run build`: run TypeScript checks and generate the five-entry production build in `dist/`.
- `npm.cmd run preview`: serve the existing production build at `http://127.0.0.1:4173/`. Rebuild first to include source changes.

Use the URL printed by Vite if a preferred port is occupied. Reuse an already running server when appropriate.

Verify Home, Apps, Games and both privacy pages through direct navigation, refresh and browser history. Check English and Arabic on desktop, tablet and narrow phones; active navigation, mobile menu and Escape behavior; screenshot galleries and keyboard focus; external product and game-store links; reduced motion and WebGL fallback. Confirm no horizontal overflow, missing media or new console errors. Capture desktop and mobile screenshots when changing visual layouts.
