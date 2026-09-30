# Design QA

**Source visual truth:** user-selected screenshot, `/workspace/scratch/66cc63fd2bcc/upload/6FDAC9AA-E877-410B-BA91-70D20569FA15.jpeg` (983 × 1536 px). The source is a concept; factual case imagery in the implementation comes from the supplied PDF.

**Implementation capture:** cloud browser tab `http://terminal.local:4173/qa/compare.html` displayed the reference and live `/` iframe side by side. This comparison page exists only in the local preview workspace; the browser capture is retained in the conversation, with no local screenshot file exported by the cloud browser. Main site: `http://terminal.local:4173/`.

**Viewport and normalization:** reference 983 × 1536 pixels. Implementation iframe 983 × 1536 CSS pixels, captured alongside the reference at 0.5 visual scale in a 1363 × 936 cloud browser viewport; browser device pixel ratio 1. Mobile check: 390 × 844 iframe, 375 CSS px content width after scrollbar. Same initial route, light theme, menu closed, Wildberries strategy collapsed.

## Findings and comparison history

1. Initial browser capture: the oversized name crossed Alexandra's eyes, and the portrait/heading proportions at the 983 px reference viewport were too short. **P1.** Narrowed the display heading, then tuned its vertical size at 983 px, portrait height, accent and spacing. The final side-by-side capture shows the face unobstructed, role aligned below the name, and the project section beginning at nearly the same vertical position.
2. Initial capture: the full Wildberries detail placed Металлоинвест below the reference crop. **P2.** Moved supporting results into a semantic expandable case section. The final comparison shows both featured cases in the first 1536 px while retaining the extra results on demand.
3. Experience section: “До масштаба” wrapped onto an unintended third line at the desktop viewport. **P2.** Widened its title column. The post-fix browser capture shows the intended two-line heading.

## Required fidelity surfaces

- **Typography:** Oswald for condensed display, Cormorant Garamond for editorial reading text, IBM Plex Mono for labels. Cyrillic font files are bundled. Final hero name and role proportions were checked against the 983 px reference.
- **Spacing/layout:** hero, two featured case blocks, fine dividers and generous white space match the source rhythm. Further case, experience and contact sections continue the same grid.
- **Colors/tokens:** warm ivory `#f7f5ef`, near-black `#121110`, crimson `#a50836`; the contact close uses the accent color. Contrast remains readable.
- **Images:** the real monochrome portrait and original project images are used. The concept's invented purple Wildberries mock and studio-light triangle were intentionally replaced by source material; this is a P3 art-direction difference, not a missing asset. The signature is an isolated image asset.
- **Copy/content:** seven project stories, four experience periods and all displayed metrics were checked against the uploaded PDFs. Longer Wildberries results live in the expandable section.

**Interactions tested in cloud browser:** Projects and Contact anchor links; Resume PDF opened in a new tab; mobile menu expanded, navigated and closed; Wildberries details expanded. No application console errors were observed (the browser extension logged unrelated metadata errors). At the mobile content width, `scrollWidth === clientWidth === 375`, with no horizontal overflow. Build and Sites worker tests passed.

**Follow-up polish:** a user-provided alternate hero portrait with an actual studio-light photograph could bring the image treatment even closer to the concept. The supplied original is retained for factual fidelity.

**Final result: passed**

## Итерация: фирменные знаки, 30.09.2026

- Источник: выбранный reference.jpeg в preview-only QA; текущая правка пользователя требует добавить логотипы к кейсам и опыту.
- Сравнение: http://terminal.local:4173/qa/compare.html, исходник 983×1536 и живой iframe 983×1536 CSS px рядом, оба масштабированы до 0.5. Снимок в текущей беседе. Основные пропорции hero, цвета и иерархия сохранены; новые логотипы — согласованное отклонение.
- Фокус: фирменные знаки и заголовки кейсов в desktop screenshot; мобильные Металлоинвест и SYBOX при iframe 390×844. Снимки получены в облачном браузере и сохранены в беседе.
- Типографика: прежние семейства и веса, длинные заголовки имеют полную ширину. Логотипы отделены от крупных названий строкой подписи.
- Ритм: сохранены сетка и поля; добавлены небольшие строки идентификации.
- Цвет: исходные фирменные цвета без CSS-перекрашивания.
- Изображения: оригинальные SVG, сохраненные пропорции, без синтетических логотипов.
- Контент: семь кейсов и все результаты сохранены; знаки соответствуют компаниям.
- На мобильном document clientWidth = scrollWidth = 375px, горизонтального переполнения нет.
- Навигация и раскрытие стратегии сохранены. Новых интерактивных элементов нет. Консоль: ошибок приложения не обнаружено; присутствует посторонняя ошибка chrome-extension metadata.
- P0/P1/P2: отсутствуют в текущем сравнении. Проверка ограничена добавлением фирменных знаков.
- final result: passed
