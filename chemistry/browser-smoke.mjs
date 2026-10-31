import { chromium } from "playwright";
import { readdir } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("chemistry");
const pages = [];
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full);
    else if (entry.isFile() && entry.name.endsWith(".html")) pages.push(path.relative(process.cwd(), full).replaceAll(path.sep, "/"));
  }
}
await walk(root);
const browser = await chromium.launch({ headless: true });
const errors = [];
let languageChecks = 0;
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  page.on("pageerror", error => errors.push(error.message));
  for (const file of pages) {
    const response = await page.goto("http://127.0.0.1:4173/" + file, { waitUntil: "domcontentloaded" });
    if (!response || !response.ok()) errors.push(file + ": HTTP " + (response?.status() ?? "no response"));
    const lang = page.locator("#lang");
    if (await lang.count()) {
      const before = (await lang.innerText()).trim();
      await lang.click();
      const after = (await lang.innerText()).trim();
      if (before === after) errors.push(file + ": language toggle did not change its label");
      await lang.click();
      languageChecks++;
    }
  }
} finally {
  await browser.close();
}
if (errors.length) {
  console.error("Browser smoke checks failed:");
  for (const error of errors) console.error(" - " + error);
  process.exit(1);
}
console.log("Browser smoke checks passed: " + pages.length + " pages loaded; " + languageChecks + " language toggles exercised at 390px viewport; no uncaught page errors.");
