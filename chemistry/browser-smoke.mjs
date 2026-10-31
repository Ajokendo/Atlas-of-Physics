import { chromium } from "playwright";
import path from "node:path";

const base = "http://127.0.0.1:4173/chemistry/";
const pages = [
  "index.html",
  "chapters/atomic-structure.html",
  "chapters/chemical-elements.html",
  "periodic-table.html",
  "chapters/chemical-bonding.html",
  "chapters/amount-of-substance.html",
  "chapters/chemical-formulae.html",
  "chapters/solutions.html",
  "chapters/acids-and-bases.html",
  "chapters/chemical-reactions.html",
  "chapters/redox.html",
  "chapters/organic-chemistry.html",
  "chapters/chemistry-of-life.html",
  "molecule-lab.html",
  "virtual-lab.html",
  "reaction-trainer.html",
  "stoichiometry.html",
  "gas-laws.html",
  "chemistry-constants.html",
  "glossary.html",
  "knowledge-check.html"
];

const browser = await chromium.launch({ headless: true });
const errors = [];
let languageChecks = 0;
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  let current = "";
  page.on("pageerror", error => errors.push(current + ": " + error.message));

  for (const file of pages) {
    current = file;
    const response = await page.goto(base + file, { waitUntil: "domcontentloaded" });
    if (!response || !response.ok()) {
      errors.push(file + ": HTTP " + (response?.status() ?? "no response"));
      continue;
    }

    if (file === "index.html") {
      const chapterCount = await page.locator(".chapter").count();
      if (chapterCount !== 12) errors.push(file + ": expected 12 visible chapter cards, found " + chapterCount);
      const widths = await page.evaluate(() => ({
        document: document.documentElement.scrollWidth,
        viewport: document.documentElement.clientWidth
      }));
      if (widths.document > widths.viewport + 1) {
        errors.push(file + ": horizontal overflow at 390px (" + widths.document + "px > " + widths.viewport + "px)");
      }
    }

    const lang = page.locator("#lang, #language").first();
    if (await lang.count()) {
      const before = (await lang.innerText()).trim();
      await lang.click();
      const after = (await lang.innerText()).trim();
      if (before === after) errors.push(file + ": language toggle did not change");
      await lang.click();
      languageChecks++;
    }

    if (file === "chapters/chemical-bonding.html") {
      const detail = page.locator(".detail");
      if (await detail.getAttribute("aria-live") !== "polite") {
        errors.push(file + ": dynamic bond explanation is not announced to assistive technology");
      }
      await page.locator('[data-type="ionic"]').click();
      if (!(await page.locator("#detailText").innerText()).includes("кристаллическую решётку")) {
        errors.push(file + ": ionic bonding explanation does not distinguish a crystal lattice from an isolated ion pair");
      }
      await page.locator("#lang").click();
      if (!(await page.locator("#detailText").innerText()).includes("crystal lattice")) {
        errors.push(file + ": ionic bonding clarification is missing in English");
      }
      await page.locator("#lang").click();
    }

    if (file === "chapters/chemical-formulae.html") {
      const formula = page.locator("#formula");
      const calculate = page.locator("#calc");
      const rows = page.locator("#rows tr");
      const total = page.locator("#total");

      await formula.fill("H2O");
      await calculate.click();
      let values = await rows.evaluateAll(items => items.map(row => [row.cells[0].textContent.trim(), row.cells[1].textContent.trim()]));
      if ((await total.innerText()).trim() !== "Всего атомов: 3" ||
          JSON.stringify(values) !== JSON.stringify([["H", "2"], ["O", "1"]])) {
        errors.push(file + ": H2O was not parsed into 2 H and 1 O atoms");
      }

      await formula.fill("Ca(OH)2");
      await calculate.click();
      values = await rows.evaluateAll(items => items.map(row => [row.cells[0].textContent.trim(), row.cells[1].textContent.trim()]));
      if ((await total.innerText()).trim() !== "Всего атомов: 5" ||
          JSON.stringify(values) !== JSON.stringify([["Ca", "1"], ["O", "2"], ["H", "2"]])) {
        errors.push(file + ": Ca(OH)2 or group multipliers were calculated incorrectly");
      }

      await formula.fill("Al2(SO4)3");
      await calculate.click();
      values = await rows.evaluateAll(items => items.map(row => [row.cells[0].textContent.trim(), row.cells[1].textContent.trim()]));
      if ((await total.innerText()).trim() !== "Всего атомов: 17" ||
          JSON.stringify(values) !== JSON.stringify([["Al", "2"], ["S", "3"], ["O", "12"]])) {
        errors.push(file + ": nested-group formula Al2(SO4)3 was calculated incorrectly");
      }

      await formula.fill("H 2 O");
      await calculate.click();
      if ((await total.innerText()).trim() !== "Всего атомов: 3") {
        errors.push(file + ": harmless spaces in a formula were not ignored");
      }

      await formula.fill("Ca()2");
      await calculate.click();
      if ((await page.locator("#feedback").innerText()).trim() === "Формула разобрана успешно.") {
        errors.push(file + ": empty brackets were incorrectly accepted");
      }

      await formula.fill("Xx2");
      await calculate.click();
      if ((await page.locator("#feedback").innerText()).trim() === "Формула разобрана успешно.") {
        errors.push(file + ": unknown element symbol was incorrectly accepted");
      }
    }

    if (file === "periodic-table.html") {
      await page.locator("#search").fill("oxygen");
      if (await page.locator("#table button[data-id]").count() !== 1) {
        errors.push(file + ": element search did not narrow results to oxygen");
      }
      await page.locator("#search").fill("");
      await page.locator('#table button[data-id="8"]').click();
      if (!(await page.locator("#detail").innerText()).toLowerCase().includes("oxygen")) {
        errors.push(file + ": selecting oxygen did not update element details");
      }
    }

    if (file === "molecule-lab.html") {
      await page.locator("#choose").selectOption("co2");
      if (!(await page.locator("#formula").innerText()).includes("CO₂")) errors.push(file + ": molecule selector failed");
      await page.locator("#reset").click();
      await page.locator("#spin").click();
      await page.locator("#spin").click();
    }

    if (file === "virtual-lab.html") {
      await page.locator("#add").click();
      if (!(await page.locator("#status").innerText()).trim()) errors.push(file + ": experiment did not report a result");
      await page.locator("#reset").click();
    }

    if (file === "reaction-trainer.html") {
      const fields = page.locator('#equation input[type="number"]');
      if (await fields.count() < 2) errors.push(file + ": coefficient inputs were not rendered");
      else {
        await fields.first().fill("1");
        await page.locator("#check").click();
        if (!(await page.locator("#feedback").innerText()).trim()) errors.push(file + ": answer feedback was not shown");

        const solutions = [[2, 1, 2], [1, 3, 2], [4, 3, 2], [2, 6, 2, 3], [2, 1, 1, 2], [1, 5, 3, 4]];
        for (let i = 0; i < solutions.length; i++) {
          if (i > 0) await page.locator("#next").click();
          const currentFields = page.locator('#equation input[type="number"]');
          if (await currentFields.count() !== solutions[i].length) {
            errors.push(file + ": unexpected coefficient count in task " + (i + 1));
            break;
          }
          for (let j = 0; j < solutions[i].length; j++) {
            await currentFields.nth(j).fill(String(solutions[i][j]));
          }
          await page.locator("#check").click();
          if (!(await page.locator("#feedback").innerText()).includes("Верно")) {
            errors.push(file + ": correct solution was rejected in task " + (i + 1));
            break;
          }
        }
        await page.locator("#next").click();
        const history = await page.evaluate(() => JSON.parse(localStorage.getItem("atlas-chemistry-trainer-v1-history-v1") || "[]"));
        if (!Array.isArray(history) || history.length !== 1 || history[0].total !== 6) {
          errors.push(file + ": completed trainer attempt was not saved exactly once");
        }
      }
    }

    if (file === "stoichiometry.html") {
      const before = (await page.locator("#theory").innerText()).trim();
      await page.locator("#na").fill("1");
      await page.locator("#na").dispatchEvent("input");
      const after = (await page.locator("#theory").innerText()).trim();
      if (before === after) errors.push(file + ": changing amount did not update calculation");
    }

    if (file === "gas-laws.html") {
      const before = (await page.locator("#pressureValue").innerText()).trim();
      await page.locator("#t").fill("100");
      await page.locator("#t").dispatchEvent("input");
      const after = (await page.locator("#pressureValue").innerText()).trim();
      if (before === after) errors.push(file + ": temperature change did not update pressure");
    }

    if (file === "knowledge-check.html") {
      const questionCount = await page.locator("#quiz .question").count();
      if (questionCount !== 10) {
        errors.push(file + ": expected 10 quiz questions, found " + questionCount);
      } else {
        for (let i = 0; i < questionCount; i++) {
          await page.locator("#q" + i + ' input[type="radio"]').first().check();
        }
        await page.locator("#finish").click();
        if (!(await page.locator("#score").innerText()).trim()) errors.push(file + ": quiz score was not produced");
        if (!(await page.locator("#finish").isDisabled())) errors.push(file + ": completed quiz finish button was not locked");
        const history = await page.evaluate(() => JSON.parse(localStorage.getItem("atlas-chemistry-quiz-v1-history-v1") || "[]"));
        if (!Array.isArray(history) || history.length !== 1 || history[0].total !== 10) {
          errors.push(file + ": completed quiz attempt was not saved exactly once");
        }
        await page.locator("#reset").click();
      }
    }
  }
} finally {
  await browser.close();
}

if (errors.length) {
  console.error("Chemistry browser smoke checks failed:");
  for (const error of errors) console.error(" - " + error);
  process.exit(1);
}
console.log("Chemistry browser smoke checks passed: " + pages.length + " pages loaded at 390px; " + languageChecks + " language toggles and key interactive workflows checked; no uncaught page errors.");
