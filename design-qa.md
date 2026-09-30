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

## Итерация: читаемость и лёгкие анимации, 30.09.2026

**Область:** согласованные короткие формулировки задачи и личного вклада, подтверждённый период WB, ранняя ссылка Telegram, читаемые подписи, устранение desktop overflow, анимации без постоянного рендеринга. Композиция и исходные изображения сохранены.

**Текущее сравнение:** [reference и implementation](docs/qa/motion/comparison.jpg). Та же нормализация: исходник 983×1536 px и implementation iframe 983×1536 CSS px рядом, scale 0.5, внешний viewport 1363×936. [Desktop hero](docs/qa/motion/desktop-hero.jpg), [mobile hero](docs/qa/motion/mobile-hero.jpg), [mobile раскрытый кейс](docs/qa/motion/mobile-case.jpg). Mobile iframe 390×844 CSS px. Снимки сделаны после завершения появления элементов.

**Пять поверхностей:**
- Типографика: прежние три семейства и кириллица; подписи увеличены до 11px, крупный текст и рубрика «Мой вклад» сохраняют ясную иерархию.
- Сетка и воздух: композиция hero сохранена; ранний контакт стоит рядом с основной ссылкой. Кейсы не получили дополнительных карточек или декоративных панелей.
- Цвет: прежние ivory/black/crimson и оригинальные цвета фирменных SVG.
- Изображения: прежние портрет и материалы из PDF; свет — необязательный слой внутри портрета. Изображения появляются только один раз.
- Контент: задачи и личный вклад уточнены по портфолио; период роста Telegram подтверждён резюме. Новые результаты не добавлялись.

**История исправлений:** P2 — desktop scrollWidth 1349 при clientWidth 1348. Причина: бордовый блок выходил за viewport на долю процента. После поправки right browser DOM показывает scrollWidth = clientWidth = 1348. На финальном mobile screenshot нет горизонтального скролла; меню открывается, ссылка «Проекты» закрывает меню и переносит к кейсу, стратегия раскрывается.

**Производительность:** shader использует кадры по запросу, объединяет частые pointer events, останавливается вне экрана/в скрытой вкладке, освобождает ресурсы при unmount. Тесты motion passed. Production build и worker/package checks в собранном preview passed. CSS gzip 6.81KB вместо прежних 11.76KB; JS gzip 68.26KB, без новых dependencies. Размеры относятся только к CSS/JS и не включают изображения/шрифты.

**Ограничения проверки:** облачный браузер возвращает WebGL unsupported; работа обычного портрета без shader визуально проверена. Shader на физическом GPU и FPS на реальных телефонах не измерялись. Lifecycle renderer проверен отдельными поведенческими тестами; reduced-motion и mobile gates проверены в коде. В консоли нет ошибок приложения; только посторонние chrome-extension metadata errors. Первичный worker test в checkout без dist ожидал packaging-файлы и завершился ошибкой; в собранном preview тест прошёл.

P0/P1/P2 в проверенной области: отсутствуют.

**final result: passed**

## Итерация: статичная бумажная фактура, 30.09.2026

- Пользователь согласовал тонкое зерно под существующий цветокор. Добавлен фоновый tile 512×512 px, палитра `#f7f5ef` ±5 RGB уровней, без складок и заметных пятен.
- Типографика, сетка, поля, содержимое и исходные изображения сохранены. Текстура применяется к фону body; бордовые блоки, фотографии и фирменные знаки сохраняют собственные цвета.
- Browser DOM: backgroundColor rgb(247,245,239), backgroundImage paper-ivory.png; desktop scrollWidth = clientWidth = 1348.
- [Финальный desktop screenshot](docs/qa/paper/desktop.jpg) подтверждает читаемость и деликатную фактуру после окончания entrance-анимаций.
- Production build passed. Нового runtime JavaScript, WebGL-контекстов и анимационных циклов нет; добавлен один статичный PNG 91,599 байт и CSS background.
- Предел проверки: новый фон и читаемость на desktop. Структура и интерактивное поведение не менялись.
- final result: passed

## Итерация: фирменные заголовки и GitHub Pages

- По запросу пользователя чёрные названия компаний заменены крупными аутентичными SVG в семи кейсах и доступных работодателях. Дублирующие маленькие знаки удалены; заголовки h2/h3 и имена для accessibility сохранены через alt изображений. Компании без подтверждённого знака сохраняют текст.
- На desktop увеличен отступ после фамилии на 23px; высота hero увеличена на 24px, чтобы сохранить воздух перед проектами. Mobile-композиция hero сохранена.
- Цвета логотипов оригинальные, пропорции сохранены object-fit; оптические размеры заданы отдельно по брендам. Бумажный фон, шрифты и источник изображений не менялись.
- [Текущие фирменные заголовки](docs/qa/pages/company-headings.jpg) проверены в browser; desktop hero также визуально проверен с новым интервалом.
- Pages build с DEPLOY_BASE=/dunaeva.a_site/ passed; проверены prefixed JS/CSS entry URLs, URL бумажной фактуры в CSS и оба PDF в output. Motion и worker/package tests passed.
- Публикация: workflow подготовлен, включение Pages и публичная проверка отдельно от этой локальной проверки.
- final result: passed (implementation scope)

## Итерация: естественный портрет и стабильные интервалы hero, 30.09.2026

- Убраны дополнительный contrast/grayscale filter, планшетная fade-маска, увеличение портрета при наведении и zoom entrance. Исходный монохромный JPG сохранён; object-position теперь top, чтобы не срезать верх головы. Mobile frame 4:5 с исходными пропорциями изображения через object-fit: cover.
- Световой canvas перенесён в hero позади портрета, текста и акцентной панели. Pointer coordinates считаются относительно hero, включая события над дочерними элементами. Demand renderer, visibility/intersection gates и ограничение 900×720 сохранены.
- Hero получил естественную высоту вместо жёсткой; межстрочный интервал имени 1.02, интервал перед должностью 30px. Mobile: имя и портрет разделены 22px, портрет и должность 30px; отрицательные отступы удалены.
- Browser desktop: clientWidth = scrollWidth = 1348; role начинается на 30px ниже bounding box h1, photo filter none. Tablet iframe: clientWidth = scrollWidth = 968, mask/filter none, gapRole 30px. Mobile iframe: clientWidth = scrollWidth = 375; title bottom 209.28, photo top 231.28, photo bottom 580.91, role top 610.91; canvas disabled.
- Скриншоты: docs/qa/hero-fix/desktop.jpg, mobile.jpg, tablet.jpg. Визуально проверены читаемость, голова/лицо без верхнего обрезания, разделение мобильных блоков и сохранение редакционной композиции.
- Production build с GitHub Pages base passed. Motion и worker/package tests passed. Shader на физическом GPU и FPS на телефоне не измерялись; в облачном браузере WebGL недоступен. Статичное фото и layout проверены в браузере.
- final result: passed (hero correction scope)

## Итерация: ошибка прозрачности WebGL и широкий desktop

- Основание: пользовательский скриншот широкого экрана показывает белый прямоугольник в границах hero и почти квадратный крупный кроп портрета. Пользовательский скриншот в репозиторий не копировался.
- В shader исправлена запись цвета: при premultipliedAlpha=true RGB теперь умножен на alpha. Прежний straight RGB не соответствовал режиму прозрачности canvas и мог давать выбеленный прямоугольник при композитинге на светлом фоне. WebGL-контекст явно задаёт premultipliedAlpha=true.
- Editorial wrap ограничен 1200px вместо 1510px; hero h1 ограничен 171px вместо 190px. У портрета задан aspect-ratio 4/5 вместо фиксированной высоты с непрерывно растущей шириной. Tablet/mobile правила сохранены.
- Wide browser QA: iframe 1920×1080, actual clientWidth=scrollWidth=1905 (15px scrollbar); heroWidth=1200, portrait 548.39×685.48, title 171px. Скриншот docs/qa/wide-fix/desktop-1920.jpg подтверждает композицию и кадрирование.
- Pages production build и worker/package checks passed.
- Предел проверки: WebGL в облачном браузере unsupported, поэтому исправление режима alpha подтверждено по коду, но GPU-композитинг на ПК пользователя не проверен. Layout и fallback просмотрены в browser.
- final result: passed (layout/build); GPU rendering unverified


## Transparent paper sculpture trial — 2026-09-30

Source: selected first artwork `generated_images/exec-0daad639-46c0-4815-b97c-069668deed00.png`; imagegen transparent edit `exec-954274b6-bdbe-4c70-a28c-0108e182bb51.png`. Technical export: 720×480 RGBA WebP, 37,688 bytes.

Compared original, transparent cutout and rendered section together in `docs/qa/paper-art/desktop.jpg`. Desktop content viewport 1185px; mobile viewport 390px in `docs/qa/paper-art/mobile.jpg`.

Fonts and copy remain unchanged. Warm ivory/crimson object fits the charcoal section palette. True transparency includes the internal folds; no rectangular backdrop or halo appears. Desktop image has a separate column (230.7px wide) and does not overlap the heading. Mobile image is 124×82.7px next to the section label; heading begins below it. Horizontal scroll width equals viewport width at both sizes. Decorative empty alt, hidden from assistive technologies, explicit intrinsic dimensions and lazy decoding. No extra animation or renderer. Intentional adaptation: artwork is a supporting accent, not a full-screen photo or project evidence. Existing navigation and project interactions are untouched.

Production build and all 4 Sites packaging tests passed. Browser console showed only older browser-extension metadata errors, no new site errors during this check. No open P0/P1/P2 findings.

final result: passed
