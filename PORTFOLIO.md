# YahyazLab Portfolio

## Destinations

- `/`: personal introduction, Apps/Games gateways, About (`/#studio`), Contact (`/#contact`).
- `/apps`: data-driven ApexLoad and QuranHaven showcases and screenshot galleries.
- `/games`: the existing game descriptions, galleries, trailers and four store destinations.
- `/privacy/white-ninja` and `/privacy/puzzle-vs-zombie`: unchanged English policies.

The Vite build includes all five HTML entry points. Deploy the entire `dist/` directory using the existing hosting workflow. Directory routes, optional trailing slashes, `/index.html` and query parameters are normalized by the client. Legacy `/#games` and `/#showreel` lead to the corresponding Games sections. Internal navigation preserves real link semantics and updates history without a full document reload.

## Adding An App

1. Place optimized local WebP icons and screenshots under `public/assets/apps/<slug>/`. Keep authentic UI and original aspect ratios.
2. Add an `Application` record to `src/data/appContent.ts`. Include both English and Arabic copy, the verified website, icon, ordered screenshots with exact dimensions and descriptive labels, three verified features, accent (`cyan` or `green`) and display order.
3. The reusable `AppShowcase` renders the identity, external visit action and accessible full-size gallery. A portrait screenshot uses a phone-sized presentation; landscape screenshots use a browser presentation. ApexLoad uses the approved overview artwork with chamfered corners and no redundant single-image navigation. QuranHaven retains its multi-image selector.
4. Only add verified or explicitly user-approved platform destinations. The component renders entries in `platformLinks`. ApexLoad's Android Google Play destination is verified on its official website; its iPhone release is still coming soon. QuranHaven uses the Google Play destination supplied by the user: `https://play.google.com/store/apps/details?id=org.quranflutter.quran_flutter`.
5. Update the home gateway names/media and any project count if the portfolio expands beyond the current four projects. Check both languages at phone, tablet and desktop sizes.

## Content Verification

Last verified: **2026-10-17**, against the actual applications. Product captures are authentic, local-only, optimized WebP files. Recheck functionality and destinations before changing product claims or adding platform links.

- ApexLoad: `https://apexload.org/` is the verified social media downloader and identifies YahyazLab as creator. The originally supplied `https://apexload.com/` timed out on repeated checks; no redirect was verified. The portfolio therefore links to `.org`. Download formats and quality depend on the supported source. Do not promise all platforms or guaranteed 4K. No iOS release badge is shown.
- QuranHaven: `https://quranhaven.org/` is the verified application. Reading/listening, Tafsir/translations, browse/search and Khatmah/memorization plans are verified. `surahs.webp` is actually the Mushaf reading interface, not a Surah index; its gallery caption is **Mushaf reader**. Keep its Arabic content unedited and within the gallery, not as animated decoration. Its Google Play destination was explicitly provided by the user; do not infer an iOS release.
- Maintain game records, asset URLs, videos and store links in `src/data/siteContent.ts`. Keep existing destinations and authentic media intact when updating the general studio description.

## Language And Accessibility

The latest direction restores the existing live website's stable LTR page frame in both languages. English uses `lang="en"`; Arabic uses `lang="ar"` with targeted RTL reading text, balanced Arabic headings and unmirrored logos, Latin names, controls and product screenshots. This replaces the rejected ivory design's mirrored composition. Use bidi isolation where Latin names meet Arabic prose; never split Arabic characters for animation. The language preference is stored locally when browser storage is available; privacy content stays English/LTR without overwriting that choice. Galleries close on Escape, cycle with arrow keys, trap Tab focus, lock background scrolling and restore focus on close. Mobile navigation exposes active state and expansion state and closes on Escape, outside activation, navigation or focus leaving the header.

Game detail dialogs keep screenshot navigation and the close control in a persistent toolbar outside the scrolling body. Fit complete gameplay frames with `object-fit: contain` and an explicit responsive height; intrinsic image dimensions must not create a fixed-height portrait crop. Home gateways likewise preserve complete interfaces and gameplay context. When adjusting hero spacing, retain a visible next-section content hint at 375x812, 390x844, 768x1024, 1440x900 and 1920x1080 in both languages without overlapping the scene.

## Scene Integration And Media

The visual reference is the actual deployed **https://yahyazlab.com/**, inspected in English and Arabic on desktop and mobile on 2026-10-17. Preserve its logo-led hero, near-black lab background, cyan/pink/gold accents, floating dark navigation, cyan-to-gold buttons, graphical Since 2021 badge and original game/media panels. Extend that same visual language to Apps, ApexLoad and QuranHaven. Do not reintroduce the rejected ivory surfaces, oversized Syne headlines, coral page palette or Y/Z sculpture.

The existing production typography comes from `src/styles.css`: Inter/system sans-serif for English, with Segoe UI/Noto Sans Arabic/Tahoma fallbacks for Arabic. Rejected-design font files may remain locally, but should not be imported or fetched by the restored website. Keep letter spacing natural and Arabic shaping intact.

`HeroScene` supplies the original logo/game-media planes, grid and restrained particles. Reuse its optimized lifecycle and lazy-load the Three.js resources separately from the ordinary HTML logo, copy and controls. Preserve a useful fallback for loading, data saver or WebGL failure; pause continuous rendering offscreen and when the tab is hidden, and honor reduced motion. The rejected `WorldsHero`/`WorldsScene` composition should not be imported. Game videos load only after a play action and pause offscreen or when the tab becomes hidden.

## Development And Checks

Run these commands from the project root:

- `npm.cmd run dev`: start the Vite development server at `http://127.0.0.1:5173/`.
- `npm.cmd run build`: run TypeScript checks and generate the five-entry production build in `dist/`.
- `npm.cmd run preview`: serve the existing production build at `http://127.0.0.1:4173/`. Rebuild first to include source changes.

Use the URL printed by Vite if a preferred port is occupied. Reuse an already running server when appropriate.

Verify Home, Apps, Games and both privacy pages through direct navigation, refresh and browser history. Check English and Arabic on desktop, tablet and narrow phones; active navigation, mobile menu and Escape behavior; screenshot galleries and keyboard focus; external product and game-store links; reduced motion and WebGL fallback. Confirm no horizontal overflow, missing media or new console errors. Capture desktop and mobile screenshots when changing visual layouts.
