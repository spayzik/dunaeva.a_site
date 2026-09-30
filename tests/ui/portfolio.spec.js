import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.auditErrors = errors;
  await page.goto("./");
  await expect(page.locator("html")).not.toHaveClass(/no-js/);
  await page.evaluate(() => document.fonts.ready);
});
test.afterEach(async ({ page }) => {
  expect(page.auditErrors).toEqual([]);
});

test("hero dust is bounded, settles when idle and stops for reduced motion", async ({
  page,
  isMobile,
}) => {
  const layer = page.locator(".hero-dust");
  if (isMobile) {
    await expect(layer).toBeHidden();
    await expect(layer).toHaveAttribute("data-state", "disabled");
    return;
  }
  await page.setViewportSize({ width: 1440, height: 1100 });
  await expect(layer).toHaveAttribute("data-state", "ready");
  const hero = await page.locator(".hero").boundingBox();
  const running = () =>
    layer.evaluate(
      (el) =>
        el
          .getAnimations({ subtree: true })
          .filter((a) => a.playState === "running").length,
    );
  await page.mouse.move(hero.x + 25, hero.y + hero.height - 25);
  await expect.poll(running).toBeGreaterThan(0);
  await expect(layer.locator("span")).toHaveCount(8);
  // Animation completion, rather than an idle frame loop, is the stop condition.
  await expect.poll(running).toBe(0);
  await page.mouse.move(hero.x + 90, hero.y + hero.height - 25);
  await expect.poll(running).toBeGreaterThan(0);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(layer).toBeHidden();
  await expect(layer).toHaveAttribute("data-state", "disabled");
  expect(await running()).toBe(0);
});

test("hero dust protects portrait and type from pointer particles", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "Cursor effect is disabled on touch devices");
  await expect(page.locator(".hero-dust")).toHaveAttribute(
    "data-state",
    "ready",
  );
  for (const selector of [".hero__portrait", ".hero__role", "h1"]) {
    const box = await page.locator(selector).boundingBox();
    await page.mouse.move(
      box.x + box.width / 2,
      box.y + Math.min(30, box.height / 2),
    );
    expect(
      await page
        .locator(".hero-dust")
        .evaluate(
          (el) =>
            el
              .getAnimations({ subtree: true })
              .filter((a) => a.playState === "running").length,
        ),
    ).toBe(0);
  }
});

test("all nine project viewers open, close and restore focus", async ({
  page,
}) => {
  await page.locator(".case-expand summary").click();
  const triggers = page.locator(".image-open");
  await expect(triggers).toHaveCount(9);
  for (const trigger of await triggers.all()) {
    await trigger.click();
    const dialog = page.locator(".image-dialog[open]");
    await expect(dialog).toBeVisible();
    await expect(dialog.locator("img")).toBeVisible();
    await expect
      .poll(() =>
        dialog
          .locator("img")
          .evaluate((image) => image.complete && image.naturalWidth > 0),
      )
      .toBe(true);
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
  }
});

test("viewer locks background, keeps inside padding open and restores scroll", async ({
  page,
  isMobile,
}) => {
  await page.locator(".case-expand summary").click();
  const trigger = page.getByRole("button", {
    name: "Рассмотреть материалы проекта Wildberries — профиль Instagram",
    exact: true,
  });
  await trigger.scrollIntoViewIfNeeded();
  const before = await page.evaluate(() => scrollY);
  await trigger.click();
  const dialog = page.locator(".image-dialog[open]");
  const bounds = await dialog.boundingBox();
  await page.mouse.click(bounds.x + 4, bounds.y + bounds.height / 2);
  await expect(dialog).toBeVisible();
  const fixedTop = await page
    .locator("body")
    .evaluate((body) => body.getBoundingClientRect().top);
  await page.mouse.move(1, 1);
  if (isMobile) await page.keyboard.press("PageDown");
  else await page.mouse.wheel(0, 800);
  await expect
    .poll(() =>
      page.locator("body").evaluate((body) => body.getBoundingClientRect().top),
    )
    .toBe(fixedTop);
  if (isMobile) {
    // The actual dialog must still be scrollable independently of the fixed body.
    expect(await dialog.evaluate((el) => getComputedStyle(el).overflowY)).toBe(
      "auto",
    );
  }
  await page.mouse.click(1, 1);
  await expect(dialog).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeCloseTo(before, 0);
  await expect(trigger).toBeFocused();
});

test("viewer close button works; dragging from inside onto backdrop does not close", async ({
  page,
}) => {
  await page.locator(".image-open").first().click();
  const dialog = page.locator(".image-dialog[open]");
  const bounds = await dialog.boundingBox();
  await page.mouse.move(bounds.x + 4, bounds.y + bounds.height / 2);
  await page.mouse.down();
  await page.mouse.move(1, 1);
  await page.mouse.up();
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Закрыть" }).click();
  await expect(dialog).toHaveCount(0);
});

test("strategy disclosure works from the keyboard", async ({ page }) => {
  const details = page.locator(".case-expand");
  const summary = details.locator("summary");
  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(details).toHaveAttribute("open", "");
  await expect(details.getByText("500 000", { exact: true })).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(details).not.toHaveAttribute("open");
});

test("mobile menu closes on Escape, outside click and navigation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const toggle = page.locator(".menu-toggle");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(toggle).toBeFocused();
  await toggle.click();
  await page.locator(".hero__portrait").click();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Опыт" })
    .click();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(page).toHaveURL(/#experience$/);
  await page.goto("./");
  await toggle.click();
  await page.setViewportSize({ width: 1024, height: 768 });
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
});

for (const width of [320, 390, 768, 1024, 1440, 1920]) {
  test(`layout keeps key numbers and controls inside the viewport at ${width}px`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.locator(".case-expand summary").click();
    const selectors = [
      ".hero__role",
      ".hero__actions a",
      ".wild-stat__old",
      ".wild-stat__new",
      ".wild-business",
      ".metal-results strong",
      ".metal-secondary dd",
      ".micro-stats strong",
      ".case-expand summary",
      ".contact__links a",
    ];
    for (const selector of selectors) {
      for (const element of await page.locator(selector).all()) {
        const bounds = await element.boundingBox();
        expect(bounds, selector).not.toBeNull();
        expect(bounds.x, selector).toBeGreaterThanOrEqual(-1);
        expect(bounds.x + bounds.width, selector).toBeLessThanOrEqual(
          width + 1,
        );
        expect(
          await element.evaluate((el) => el.scrollWidth <= el.clientWidth + 1),
          selector,
        ).toBe(true);
      }
    }
    expect(await page.locator(".wild-stat__new").innerText()).toBe("550 000");
    expect(await page.locator(".metal-secondary dd").allTextContents()).toEqual(
      ["7 348 491", "36 910", "2 156"],
    );
    await expect(page.locator(".mini-case")).toHaveCount(5);
    await expect(page.locator(".timeline__row")).toHaveCount(4);
    if (width === 320 || width === 1440) {
      await page.goto("./");
      await page.screenshot({
        path: testInfo.outputPath(`hero-${width}.png`),
        animations: "disabled",
      });
      await page.locator("#metalloinvest").scrollIntoViewIfNeeded();
      await page.screenshot({
        path: testInfo.outputPath(`hr-${width}.png`),
        animations: "disabled",
      });
    }
  });
}

test("project images, wordmarks and PDF links resolve under the deployment base", async ({
  page,
  request,
}) => {
  await page.locator(".case-expand summary").click();
  const urls = await page
    .locator('img, a[href$=".pdf"]')
    .evaluateAll((elements) => [
      ...new Set(elements.map((el) => el.src || el.href)),
    ]);
  for (const url of urls) {
    const response = await request.get(url);
    expect(response.ok(), url).toBe(true);
    if (url.endsWith(".pdf"))
      expect((await response.body()).subarray(0, 4).toString()).toBe("%PDF");
  }
  for (const link of await page
    .getByRole("navigation")
    .getByRole("link")
    .all()) {
    await expect(page.locator(await link.getAttribute("href"))).toHaveCount(1);
  }
});

test("small section indices meet text contrast on the darkest paper tone", async ({
  page,
}) => {
  const colors = await page
    .locator(".section-label__index")
    .evaluateAll((elements) =>
      elements.map((el) => getComputedStyle(el).color),
    );
  const luminance = (rgb) =>
    rgb
      .map((c) => {
        const v = c / 255;
        return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
      })
      .reduce((sum, c, i) => sum + c * [0.2126, 0.7152, 0.0722][i], 0);
  for (const color of colors) {
    const foreground = luminance(color.match(/\d+/g).slice(0, 3).map(Number));
    const background = luminance([242, 240, 234]);
    expect((background + 0.05) / (foreground + 0.05)).toBeGreaterThanOrEqual(
      4.5,
    );
  }
});

test("static HTML remains usable when JavaScript is unavailable", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto(baseURL);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Александра",
  );
  await expect(
    page.getByRole("navigation").getByRole("link", { name: "Проекты" }),
  ).toBeVisible();
  await page.locator(".case-expand summary").click();
  await expect(page.locator(".strategy-proof")).toBeVisible();
  await expect(page.locator(".image-fallback")).toHaveCount(9);
  await expect(page.locator(".contact__links a")).toHaveCount(2);
  await context.close();
});

test("reduced motion disables the studio light", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".studio-light")).not.toHaveAttribute(
    "data-state",
    "ready",
  );
  expect(
    await page
      .locator(".hero__line")
      .first()
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
});

test("slow JavaScript keeps initial mobile layout stable and content readable", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  let release;
  const held = new Promise((resolve) => {
    release = resolve;
  });
  await context.route("**/assets/*.js", async (route) => {
    await held;
    await route.continue();
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(baseURL, { waitUntil: "commit" });
  const role = page.locator(".hero__role");
  await expect
    .poll(() => role.evaluate((el) => getComputedStyle(el).fontFamily))
    .toContain("Cormorant");
  // An unresolved module keeps document.fonts.ready pending in some engines.
  // Explicitly load the two faces used by the measured name/role instead.
  await page.evaluate(() =>
    Promise.all([
      document.fonts.load(
        '500 32px "Cormorant Garamond"',
        "Руководитель команды",
      ),
      document.fonts.load('700 60px "Oswald"', "АЛЕКСАНДРА ДУНАЕВА"),
    ]),
  );
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("navigation")).not.toBeVisible();
  const before = await role.boundingBox();
  release();
  await expect(page.locator("html")).not.toHaveClass(/no-js/);
  await expect
    .poll(async () => (await role.boundingBox()).y)
    .toBeCloseTo(before.y, 0);
  await page.locator(".menu-toggle").click();
  await expect(page.locator(".menu-toggle")).toHaveAttribute(
    "aria-expanded",
    "true",
  );
  expect(errors).toEqual([]);
  await context.close();
});

test("studio light initializes after widening and recovers a lost context", async ({
  browser,
  browserName,
  isMobile,
  baseURL,
}) => {
  test.skip(
    browserName !== "chromium" || isMobile,
    "Software-WebGL lifecycle check on desktop Chromium only",
  );
  const context = await browser.newContext({
    viewport: { width: 700, height: 900 },
  });
  const page = await context.newPage();
  await page.goto(baseURL);
  const canvas = page.locator(".studio-light");
  await expect(canvas).toHaveAttribute("data-state", "disabled");
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(canvas).toHaveAttribute("data-state", "ready");
  expect(
    await canvas.evaluate((el) => el.width <= 900 && el.height <= 720),
  ).toBe(true);
  expect(
    await canvas.evaluate((el) => {
      const extension = el
        .getContext("webgl")
        .getExtension("WEBGL_lose_context");
      if (!extension) return false;
      el.addEventListener(
        "webglcontextlost",
        () => setTimeout(() => extension.restoreContext(), 100),
        { once: true },
      );
      extension.loseContext();
      return true;
    }),
  ).toBe(true);
  await expect(canvas).toHaveAttribute("data-state", "lost");
  await expect(canvas).toHaveAttribute("data-state", "ready");
  await context.close();
});
