# Prototype Instructions

## Selected design and user preferences

The user selected the second option of the final concept set (the supplied tall editorial screenshot). Preserve its warm ivory paper, oversized condensed Cyrillic name overlapping the monochrome supplied portrait, crimson side panel and handwritten SMM Lead mark, sparse mono labels, serif editorial copy, airy case studies, and real project results. Avoid SaaS aesthetics. Keep effects subtle and readability strong. The source of truth is the uploaded screenshot in the conversation and the user's portfolio/resume PDFs. Do not invent metrics or replace source project imagery with synthetic evidence.

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.
