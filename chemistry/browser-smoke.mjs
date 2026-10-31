import { chromium } from "playwright";
import { readdir } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("chemistry");
const pages = ["portal.html", "catalog.html", "progress.html", "index.html"];
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
  let currentFile = "";
  page.on("pageerror", error => errors.push(currentFile + ": " + error.message));
  for (const file of pages) {
    currentFile = file;
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
    if (file === "progress.html") {
      const checks = page.locator(".item input[type=checkbox]");
      if (await checks.count() !== 27) errors.push(file + ": expected 27 trackable chapters");
      await checks.first().check();
      await page.reload({ waitUntil: "domcontentloaded" });
      if (!(await page.locator(".item input[type=checkbox]").first().isChecked())) errors.push(file + ": chapter progress did not persist after reload");
      await page.evaluate(() => localStorage.setItem("atlas-chemistry-quiz-v1", JSON.stringify({ score: 8, total: 10, date: new Date().toISOString() })));
      await page.reload({ waitUntil: "domcontentloaded" });
      if (!(await page.locator("#quizScore").innerText()).includes("8 / 10")) errors.push(file + ": assessment result was not displayed");
      await page.evaluate(() => { localStorage.removeItem("atlas-chemistry-quiz-v1"); localStorage.removeItem("atlas-knowledge-completed-v1"); });
    }
    if (file === "catalog.html") {
      await page.locator("#q").fill("атом");
      if (!(await page.locator("#catalog .item").count())) errors.push(file + ": search did not return atom-related resources");
      await page.locator("[data-filter=chemistry]").click();
      if (!(await page.locator("#catalog .item").count())) errors.push(file + ": chemistry filter returned no resources");
      await page.locator("#q").fill("no-such-topic-xyz");
      if (await page.locator("#empty").evaluate(el => getComputedStyle(el).display === "none")) errors.push(file + ": empty-search message was not shown");
      await page.locator("#q").fill("");
      await page.locator("[data-filter=all]").click();
    }
    if (file.endsWith("molecule-lab.html")) {
      await page.locator("#choose").selectOption("co2");
      if (!(await page.locator("#formula").innerText()).includes("CO₂")) errors.push(file + ": molecule selector did not update formula");
      await page.locator("#reset").click();
      await page.locator("#spin").click();
      await page.locator("#spin").click();
    }
    if (file.endsWith("virtual-lab.html")) {
      await page.locator("#add").click();
      await page.locator("#reset").click();
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
console.log("Browser smoke checks passed: " + pages.length + " pages loaded at 390px; " + languageChecks + " language toggles and key molecule/neutralisation interactions exercised; no uncaught page errors.");
