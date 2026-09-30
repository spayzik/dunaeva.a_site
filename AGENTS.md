# Prototype Instructions

## Selected design and user preferences

The user selected the second option of the final concept set (the supplied tall editorial screenshot). Preserve its warm ivory paper, oversized condensed Cyrillic name overlapping the monochrome supplied portrait, crimson side panel and handwritten SMM Lead mark, sparse mono labels, serif editorial copy, airy case studies, and real project results. Avoid SaaS aesthetics. Keep effects subtle and readability strong. The source of truth is the uploaded screenshot in the conversation and the user's portfolio/resume PDFs. Do not invent metrics or replace source project imagery with synthetic evidence.

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

Company logos must identify each named case and available employer clearly. Use authentic downloaded marks at restrained optical sizes, preserve their proportions and colors, and maintain the editorial whitespace. Do not replace them with typed brand names or generic cards.

Latest feedback: keep the portfolio airy and avoid overload. Use lightweight editorial motion, preserve native scrolling, and protect performance on mobile. Latest hero correction: the studio shader belongs behind the entire hero, never over the portrait or type. Preserve the original monochrome photo without additional contrast, fade masks, or zoom. Use clear name/role/copy spacing on mobile and desktop. The shader must draw only on demand, pause offscreen/hidden, and be disabled for coarse pointers and reduced motion. Keep case text short, distinguish task and personal contribution, and use only PDF-confirmed dates.

Paper texture approved: use a subtle static grain in the existing warm ivory color correction. Preserve clear text, original photo/logotype colors and the crimson accents. No animated noise, new shader loop or library for this texture.

Use GitHub Pages for public hosting as explicitly requested. DEPLOY_BASE must preserve project-subdirectory asset and PDF URLs. Company wordmarks now replace black display company names in cases/experience where authentic marks exist. Increase desktop separation between the surname and role.

Wide desktop correction: cap the editorial content width at 1200px and the hero name at 171px. The portrait uses a 4:5 frame rather than growing wider at a fixed 680px height. The transparent WebGL surface uses explicitly premultiplied alpha; RGB must be multiplied by alpha to avoid an opaque white rectangle on GPU-enabled browsers.

Audit refinements approved: on mobile show the role and actions before the portrait; add a compact resume link, expose the confirmed GMV ×3 result in the main WB case, normalize optical logo sizes without recoloring, allow full project images in a native dialog, and make NRF a deliberate final row. Preserve all seven projects and facts. No new decorative images or shader loops.

Latest project-layout feedback: keep the original two-column editorial grid, NOT a carousel. VkusVill starts higher; neighboring right-column stories sit slightly lower (96px desktop / 64px tablet). Preserve the original full-width NRF final row. On single-column mobile remove the stagger. This supersedes the carousel experiment; keep all audit fixes and source facts.

Annotated sketch refinement: raise the start of the case grid by reducing heading bottom padding from 35px to 20px; use a visibly stepped left-high/right-low rhythm for complete cards across both paired rows. Keep single-column mobile unstaggered and NRF as the existing final row.

Approved restrained effects: retain native scrolling with a wine-colored thumb and warm paper track. Add sparse mouse-triggered dust only in free hero space, with a fixed pool, finite transform/opacity animations and no idle render loop. Protect text, controls, portrait and signature; disable on touch, mobile and reduced motion, and clear offscreen/hidden. Do not add another animated gradient alongside these effects.

Latest effect request supersedes hero dust and the prior no-gradient restriction: replace dust with one restrained global cursor thread, keep the native cursor and scrollbar, and add a slow wine/mauve shader behind the dark Approach section. Use a small local cursor canvas and a finite idle tail; bound shader resolution and frame rate, stop offscreen/hidden, support context loss and static fallback, disable decorative animation for mobile/coarse/reduced-motion/forced-colors. Preserve content, photo, typography and layout.

Latest hero feedback: the final A in Александра must stay clear of the face. Narrow desktop name scale to 0.79 and the 761–1100px layout to 0.66, preserving name height and role spacing. Mobile keeps its untransformed name above the portrait. Overlap may use the empty left side of the photo, never the face.

Latest Approach request: replace the prior glow with a slowly warped mesh gradient inspired by the supplied React example. Keep it transparent, subdued wine/mauve, behind all content; preserve bounded resolution, 24fps cap, visibility lifecycle and mobile/reduced-motion fallbacks. Reuse the existing shader renderer without adding framework or shader dependencies.

Latest Approach direction supersedes the mesh gradient: use the supplied metaball field as a small, transparent wine/rose focal point in the upper-right empty area (not beneath the heading). Keep the existing layout, content, perf limits and static fallbacks; no extra full-section gradient animation or cursor interaction.

Approach refinement: retain the supplied metaball recipe’s field strength, gentle drift and five-tap soft edge, with subtle static grain, a wine/rose palette and alpha capped at 0.36. The point must read as a changing organic form rather than a blurred glow; keep upper-right placement clear of text.

Latest size feedback: enlarge the Approach point about 1.4–1.5×, including the static fallback. Use a 210px-high upper-right canvas, positioned at top -15px/right 0 so the larger organic form has room above and to the right of the heading; retain the existing subdued opacity and animation.
