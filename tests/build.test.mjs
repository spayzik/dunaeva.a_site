import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

const output = new URL("../dist/client/", import.meta.url);
test("production export contains portfolio content and social metadata", async () => {
  const html = await readFile(new URL("index.html", output), "utf8");
  for (const text of [
    "Александра",
    "550 000",
    "7 348 491",
    "36 910",
    "2 156",
    "+64 000",
    "twitter:card",
    "og:image",
    'rel="canonical"',
  ]) {
    assert.ok(html.includes(text), `Missing content: ${text}`);
  }
  assert.ok(!html.includes('<div id="root"></div>'));
  assert.ok(!html.includes("/src/main.jsx"));
  const base = process.env.DEPLOY_BASE || "/";
  for (const file of ["resume.pdf", "portfolio.pdf"]) {
    assert.ok(html.includes(`href="${base}docs/${file}"`));
  }
});

test("signature assets stay within delivery budgets and have real PNG dimensions", async () => {
  for (const [file, width, height, budget] of [
    ["assets/signature.png", 460, 268, 70000],
    ["assets/favicon-signature.png", 48, 48, 3000],
    ["assets/apple-touch-icon.png", 180, 180, 15000],
    ["og.png", 1200, 630, 500000],
  ]) {
    const url = new URL(file, output);
    const bytes = await readFile(url);
    assert.equal(bytes.subarray(1, 4).toString(), "PNG");
    assert.equal(bytes.readUInt32BE(16), width);
    assert.equal(bytes.readUInt32BE(20), height);
    assert.ok(
      (await stat(url)).size <= budget,
      `Asset exceeds budget: ${file}`,
    );
  }
});
