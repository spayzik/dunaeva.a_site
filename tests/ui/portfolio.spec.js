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

test("global cursor trail settles and follows later sections without intercepting controls", async ({
  page,
  isMobile,
}) => {
  const canvas = page.locator(".cursor-trail");
  await expect(canvas).toHaveCount(1);
  if (isMobile) {
    await expect(canvas).toBeHidden();
    await expect(canvas).toHaveAttribute("data-state", "disabled");
    return;
  }
  await page.mouse.move(180, 150);
  await page.mouse.move(240, 160, { steps: 8 });
  await expect(canvas).toHaveAttribute("data-state", "active");
  await expect(canvas).toHaveAttribute("data-state", "idle");
  const frames = await canvas.evaluate((el) => el.drawCount || 0);
  await page.waitForTimeout(150);
  expect(await canvas.evaluate((el) => el.drawCount || 0)).toBe(frames);
  await page.locator(".approach").scrollIntoViewIfNeeded();
  const box = await page.locator(".approach").boundingBox();
  await page.mouse.move(box.x + 120, box.y + 90);
  await page.mouse.move(box.x + 180, box.y + 100, { steps: 8 });
  await expect(canvas).toHaveAttribute("data-state", "active");
  expect(
    await canvas.evaluate(
      (el) =>
        el.width <= 240 &&
        el.height <= 240 &&
        getComputedStyle(el).pointerEvents === "none",
    ),
  ).toBe(true);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(canvas).toBeHidden();
  await expect(canvas).toHaveAttribute("data-state", "disabled");
});

test("dark shader runs only in view and recovers context loss", async ({
  page,
  browserName,
  isMobile,
}) => {
  const canvas = page.locator(".approach-glow");
  await expect(canvas).toHaveAttribute("data-state", "paused");
  await page.locator(".approach").scrollIntoViewIfNeeded();
  if (isMobile) {
    await expect(canvas).toBeHidden();
    await expect(canvas).toHaveAttribute("data-state", "paused");
    return;
  }
  test.skip(
    browserName !== "chromium",
    "Software-WebGL lifecycle check on Chromium only",
  );
  await expect(canvas).toHaveAttribute("data-state", "ready");
  expect(
    await canvas.evaluate((el) => el.width <= 720 && el.height <= 420),
  ).toBe(true);
  const sample = () =>
    canvas.evaluate((el) => {
      const gl = el.getContext("webgl");
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      const pixels = new Uint8Array(el.width * el.height * 4);
      gl.readPixels(
        0,
        0,
        el.width,
        el.height,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        pixels,
      );
      let visible = 0,
        maxAlpha = 0,
        signature = 0;
      for (let i = 3; i < pixels.length; i += 4) {
        const alpha = pixels[i];
        if (alpha > 8) visible++;
        maxAlpha = Math.max(maxAlpha, alpha);
        signature += alpha * ((i % 97) + 1);
      }
      return { visible, maxAlpha, signature };
    });
  const initial = await sample();
  expect(initial.visible).toBeGreaterThan(100);
  expect(initial.maxAlpha).toBeLessThanOrEqual(93);
  await expect
    .poll(async () => (await sample()).signature)
    .not.toBe(initial.signature);
  expect(
    await canvas.evaluate((el) => {
      const ext = el.getContext("webgl").getExtension("WEBGL_lose_context");
      if (!ext) return false;
      el.addEventListener(
        "webglcontextlost",
        () => setTimeout(() => ext.restoreContext(), 100),
        { once: true },
      );
      ext.loseContext();
      return true;
    }),
  ).toBe(true);
  await expect(canvas).toHaveAttribute("data-state", "lost");
  await expect(canvas).toHaveAttribute("data-state", "ready");
  await page.getByRole("heading", { level: 1 }).scrollIntoViewIfNeeded();
  await expect(canvas).toHaveAttribute("data-state", "paused");
  const frames = await canvas.evaluate((el) => el.drawCount || 0);
  await page.waitForTimeout(150);
  expect(await canvas.evaluate((el) => el.drawCount || 0)).toBe(frames);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.locator(".approach").scrollIntoViewIfNeeded();
  await expect(canvas).toHaveAttribute("data-state", "paused");
  await expect(canvas).toBeHidden();
});

test("all ten project viewers open, close and restore focus", async ({
  page,
}) => {
  for (const summary of await page
    .locator(".project-disclosure > summary")
    .all())
    await summary.click();
  await page.locator(".case-material summary").click();
  const triggers = page.locator(".image-open");
  await expect(triggers).toHaveCount(10);
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
  await page.locator(".case-expand > summary").click();
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

test("framed navigation stays visible and links follow the reading order", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const nav = page.getByRole("navigation");
  await expect(nav).toBeVisible();
  await expect(nav.getByRole("link")).toHaveCount(3);
  await nav.getByRole("link", { name: "Опыт и экспертиза" }).click();
  await expect(page).toHaveURL(/#experience$/);
  expect(
    await page
      .locator("main > section")
      .evaluateAll((elements) => elements.map((el) => el.id)),
  ).toEqual(["", "experience", "projects", "contact"]);
  await expect(page.locator(".project-disclosure")).toHaveCount(7);
  await expect(page.locator(".project-disclosure[open]")).toHaveCount(0);
  const first = page.locator(".project-disclosure > summary").first();
  await first.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#wildberries")).toHaveAttribute("open", "");
});

for (const width of [320, 390, 768, 1024, 1440, 1920]) {
  test(`layout keeps key numbers and controls inside the viewport at ${width}px`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const summary of await page
      .locator(".project-disclosure > summary")
      .all())
      await summary.click();
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
  await expect(page.locator(".image-fallback")).toHaveCount(10);
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
  await expect(page.getByRole("navigation")).toBeVisible();
  const before = await role.boundingBox();
  release();
  await expect(page.locator("html")).not.toHaveClass(/no-js/);
  await expect
    .poll(async () => (await role.boundingBox()).y)
    .toBeCloseTo(before.y, 0);
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Опыт и экспертиза" })
    .click();
  await expect(page).toHaveURL(/#experience$/);
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
