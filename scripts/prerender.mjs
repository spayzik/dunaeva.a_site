import { readFile, writeFile, rm } from "node:fs/promises";
import { createElement, StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { App } from "../dist/prerender/App.js";

const index = new URL("../dist/client/index.html", import.meta.url);
const html = await readFile(index, "utf8");
const marker = '<div id="root"></div>';
if (!html.includes(marker)) throw new Error("Prerender mount point missing");
await writeFile(
  index,
  html.replace(
    marker,
    `<div id="root">${renderToString(createElement(StrictMode, null, createElement(App)))}</div>`,
  ),
);
await rm(new URL("../dist/prerender", import.meta.url), { recursive: true });
console.log("Prerendered portfolio content into static HTML");
