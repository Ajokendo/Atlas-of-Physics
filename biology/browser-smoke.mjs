import { chromium } from "playwright";
import { readdir } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("biology");
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
  for (const viewport of [{ width: 390, height: 844 }, { width: 1365, height: 900 }]) {
    const page = await browser.newPage({ viewport });
    let current = "";
    page.on("pageerror", e => errors.push(current + ": " + e.message));
    for (const file of pages) {
      current = file;
      const response = await page.goto("http://127.0.0.1:4173/" + file, { waitUntil: "domcontentloaded" });
      if (!response || !response.ok()) errors.push(file + ": HTTP " + (response?.status() ?? "no response"));
      if (!(await page.locator("main").count())) errors.push(file + ": missing main landmark");
      const lang = page.locator("#lang, #language").first();
      if (await lang.count()) {
        const before = (await lang.innerText()).trim();
        await lang.click();
        const after = (await lang.innerText()).trim();
        if (before === after) errors.push(file + ": language toggle did not change");
        await lang.click();
        languageChecks++;
      } else errors.push(file + ": language switch control not found");
      const missingType = await page.locator("button:not([type='button'])").count();
      if (missingType) errors.push(file + ": " + missingType + " button(s) lack type=button");
      await page.keyboard.press("Tab");
    }
    await page.close();
  }
} finally { await browser.close(); }
if (errors.length) {
  console.error("Biology browser smoke tests failed:\\n" + errors.map(x => " - " + x).join("\\n"));
  process.exit(1);
}
console.log("Biology browser smoke tests passed: " + pages.length + " pages at mobile and desktop widths; " + languageChecks + " language-toggle interactions; no uncaught page errors.");
