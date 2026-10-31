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
      const originalDocumentLanguage = await page.locator("html").getAttribute("lang");
      await lang.click();
      const after = (await lang.innerText()).trim();
      const switchedDocumentLanguage = await page.locator("html").getAttribute("lang");
      if (before === after) errors.push(file + ": language toggle did not change");
      if (originalDocumentLanguage === "ru" && switchedDocumentLanguage !== "en") {
        errors.push(file + ": document language was not updated to English after switching");
      }
      await lang.click();
      const restoredDocumentLanguage = await page.locator("html").getAttribute("lang");
      if (restoredDocumentLanguage !== originalDocumentLanguage) {
        errors.push(file + ": document language was not restored after switching back");
      }
      languageChecks++;
    }

    if (await page.locator("button").evaluateAll(items => items.some(button => button.type !== "button"))) {
      errors.push(file + ": a button is missing an explicit button type");
    }

    if (file === "chapters/atomic-structure.html") {
      const stats = page.locator(".atom-stats");
      if (await stats.getAttribute("aria-live") !== "polite") {
        errors.push(file + ": changing atom statistics are not announced to assistive technology");
      }
      const expectedAtoms = { H: ["1", "0", "1"], C: ["6", "6", "6"], O: ["8", "8", "8"], Na: ["11", "12", "11"], Cl: ["17", "18", "17"] };
      for (const [symbol, expected] of Object.entries(expectedAtoms)) {
        await page.locator("#element").selectOption(symbol);
        const actual = await Promise.all(["#p", "#n", "#e"].map(selector => page.locator(selector).innerText().then(value => value.trim())));
        if (JSON.stringify(actual) !== JSON.stringify(expected)) {
          errors.push(file + ": incorrect proton, neutron or electron count for " + symbol + " (got " + actual.join("/") + ")");
        }
      }
      await page.locator("#element").selectOption("O");
      await page.locator("#lang").click();
      if (await page.locator("#element").inputValue() !== "O" ||
          (await page.locator("#p").innerText()).trim() !== "8" ||
          (await page.locator("#e").innerText()).trim() !== "8") {
        errors.push(file + ": changing language reset the selected atom or its statistics");
      }
      await page.locator("#lang").click();
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
      const ruConductivity = await page.locator('[data-i="ionicFeature"]').innerText();
      if (!ruConductivity.includes("твёрдом состоянии") || !ruConductivity.includes("подвижными ионами")) {
        errors.push(file + ": Russian ionic conductivity explanation is incomplete");
      }
      await page.locator("#lang").click();
      if (!(await page.locator("#detailText").innerText()).includes("crystal lattice")) {
        errors.push(file + ": ionic bonding clarification is missing in English");
      }
      const enConductivity = await page.locator('[data-i="ionicFeature"]').innerText();
      if (!enConductivity.includes("solid state") || !enConductivity.includes("mobile ions")) {
        errors.push(file + ": English ionic conductivity explanation is incomplete");
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

    if (file === "chapters/chemical-elements.html") {
      const isotopeButtons = page.locator("[data-iso]");
      const russianLabels = await isotopeButtons.allInnerTexts();
      if (JSON.stringify(russianLabels) !== JSON.stringify(["Углерод-12", "Углерод-13", "Углерод-14"])) {
        errors.push(file + ": isotope selector labels are not localized in Russian");
      }
      await page.locator("#lang").click();
      const englishLabels = await isotopeButtons.allInnerTexts();
      if (JSON.stringify(englishLabels) !== JSON.stringify(["Carbon-12", "Carbon-13", "Carbon-14"])) {
        errors.push(file + ": isotope selector labels are not localized in English");
      }
      await page.locator("#lang").click();
      if (await isotopeButtons.evaluateAll(items => items.some(button => button.type !== "button"))) {
        errors.push(file + ": isotope selector contains a button without explicit button type");
      }
    }

    if (file === "chapters/solutions.html") {
      await page.locator("#n").fill("1");
      await page.locator("#v").fill("2");
      let result = (await page.locator("#result").innerText()).trim();
      if (!result.endsWith("моль/л")) {
        errors.push(file + ": Russian molar-concentration unit is not localized");
      }
      await page.locator("#lang").click();
      result = (await page.locator("#result").innerText()).trim();
      if (!result.endsWith("mol/L")) {
        errors.push(file + ": English molar-concentration unit is incorrect");
      }
      await page.locator("#lang").click();
    }

    if (file === "chapters/amount-of-substance.html") {
      await page.locator("#mass").fill("18.015");
      if (!(await page.locator("#moles").innerText()).startsWith("1")) {
        errors.push(file + ": one mole of water was not calculated correctly");
      }
      if (await page.locator(".result").getAttribute("aria-live") !== "polite") {
        errors.push(file + ": dynamic amount results are not announced to assistive technology");
      }
      await page.locator("#substance").selectOption("custom");
      await page.locator("#molar").fill("10");
      await page.locator("#mass").fill("20");
      if (!(await page.locator("#moles").innerText()).startsWith("2")) {
        errors.push(file + ": custom molar-mass calculation is incorrect");
      }
      await page.locator("#lang").click();
      if (!(await page.locator("#moles").innerText()).endsWith("mol")) {
        errors.push(file + ": amount-of-substance unit did not switch to English");
      }
    }

    if (file === "chapters/chemical-reactions.html") {
      await page.locator("#answer").selectOption("2,1,2");
      await page.locator("#check").click();
      if (!(await page.locator("#feedback").innerText()).includes("Верно")) {
        errors.push(file + ": balanced water equation was not accepted");
      }
    }

    if (file === "chapters/redox.html") {
      await page.locator("#ans").selectOption("zn");
      await page.locator("#check").click();
      if (!(await page.locator("#feedback").innerText()).includes("Верно")) {
        errors.push(file + ": zinc was not accepted as the reducing agent");
      }
    }

    if (file === "chapters/organic-chemistry.html") {
      await page.locator("#n").fill("4");
      await page.locator("#calc").click();
      if ((await page.locator("#result").innerText()).trim() !== "C₄H₁₀") {
        errors.push(file + ": alkane formula for n=4 is incorrect");
      }
      await page.locator("#n").fill("0");
      await page.locator("#calc").click();
      if (!(await page.locator("#feedback").innerText()).includes("от 1 до 20")) {
        errors.push(file + ": invalid alkane input was not rejected clearly");
      }
    }

    if (file === "chapters/chemistry-of-life.html") {
      await page.locator("#fraction").fill("0.05");
      if ((await page.locator("#ppm").innerText()).trim() !== "500 ppm") {
        errors.push(file + ": CO2 percent-to-ppm conversion is incorrect");
      }
      if (await page.locator("#ppm").getAttribute("aria-live") !== "polite") {
        errors.push(file + ": changing CO2 model result is not announced to assistive technology");
      }
    }

    if (["chapters/amount-of-substance.html", "chapters/chemical-reactions.html", "chapters/redox.html", "chapters/organic-chemistry.html", "chapters/chemistry-of-life.html"].includes(file)) {
      if (await page.locator("button").evaluateAll(items => items.some(button => button.type !== "button"))) {
        errors.push(file + ": a button is missing an explicit button type");
      }
    }

    if (file === "periodic-table.html") {
      if (!await page.locator("#search").getAttribute("aria-label") ||
          !await page.locator("#category").getAttribute("aria-label") ||
          !await page.locator("#group").getAttribute("aria-label")) {
        errors.push(file + ": search and filters need accessible names");
      }
      await page.locator("#search").fill("oxygen");
      if (await page.locator("#table button[data-id]").count() !== 1) {
        errors.push(file + ": element search did not narrow results to oxygen");
      }
      await page.locator("#search").fill("");
      if (await page.locator("#table button[data-id]").evaluateAll(items => items.some(button => button.type !== "button"))) {
        errors.push(file + ": generated element buttons need explicit button type");
      }
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
      if (!(await page.locator("#baseOut").innerText()).trim().endsWith("мл") ||
          !(await page.locator("#status").innerText()).trim().endsWith("5 мл")) {
        errors.push(file + ": Russian volume units are not localized consistently");
      }
      await page.locator("#lang").click();
      if (!(await page.locator("#baseOut").innerText()).trim().endsWith("mL") ||
          !(await page.locator("#status").innerText()).trim().endsWith("5 mL")) {
        errors.push(file + ": English volume units are not localized consistently");
      }
      await page.locator("#lang").click();
      await page.locator("#reset").click();
      await page.locator("#acidC").fill("0");
      await page.locator("#acidC").dispatchEvent("input");
      if (!(await page.locator("#ph").innerText()).includes("—") ||
          (await page.locator("#pin").evaluate(el => el.style.left)) !== "50%" ||
          (await page.locator("#beakerLabel").innerText()).trim() !== "—") {
        errors.push(file + ": invalid input left stale visual results in the beaker");
      }
      await page.locator("#acidC").fill("0.1");
      await page.locator("#acidC").dispatchEvent("input");
      await page.locator("#baseV").fill("100");
      await page.locator("#baseV").dispatchEvent("input");
      if ((await page.locator("#ph").innerText()).trim() !== "pH = 7.00") {
        errors.push(file + ": exact strong acid/base equivalence did not produce pH 7");
      }
      await page.locator("#baseC").fill("0.100000000001");
      await page.locator("#baseC").dispatchEvent("input");
      const nearEquivalencePH = Number((await page.locator("#ph").innerText()).replace("pH = ", ""));
      if (!Number.isFinite(nearEquivalencePH) || nearEquivalencePH < 6.9 || nearEquivalencePH > 7.1) {
        errors.push(file + ": pH is discontinuous near equivalence because water autoionisation is not represented");
      }
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

      await page.locator("#a").fill("1");
      await page.locator("#b").fill("1");
      await page.locator("#c").fill("1");
      await page.locator("#na").fill("0.000000000001");
      await page.locator("#nb").fill("0.000000001");
      await page.locator("#actual").fill("");
      await page.locator("#na").dispatchEvent("input");
      const traceLimit = (await page.locator("#limit").innerText()).trim();
      const traceRemainder = (await page.locator("#left").innerText()).trim();
      if (traceLimit !== "A" || !traceRemainder.replace(",", ".").includes("0.000000000999")) {
        errors.push(file + ": trace quantities expected limiting A and 9.99e-10 mol B remaining; got " + traceLimit + " / " + traceRemainder);
      }

      await page.locator("#na").fill("0");
      await page.locator("#nb").fill("2");
      await page.locator("#na").dispatchEvent("input");
      if ((await page.locator("#limit").innerText()).trim() !== "A" ||
          !(await page.locator("#left").innerText()).includes("2 mol")) {
        errors.push(file + ": zero amount of one reactant did not identify it as limiting");
      }

      await page.locator("#na").fill("0");
      await page.locator("#nb").fill("0");
      await page.locator("#actual").fill("0");
      await page.locator("#na").dispatchEvent("input");
      if (!(await page.locator("#yield").innerText()).includes("нулю")) {
        errors.push(file + ": zero theoretical product amount was reported as a numeric percentage");
      }

      await page.locator("#na").fill("1");
      await page.locator("#nb").fill("1");
      await page.locator("#actual").fill("1.01");
      await page.locator("#na").dispatchEvent("input");
      if (!(await page.locator("#yield").innerText()).includes("превышает")) {
        errors.push(file + ": actual yield above theoretical yield was not rejected");
      }

      await page.locator("#a").fill("0");
      await page.locator("#a").dispatchEvent("input");
      if (!(await page.locator("#explain").innerText()).includes("коэффициенты")) {
        errors.push(file + ": zero stoichiometric coefficient was not rejected");
      }
    }

    if (file === "gas-laws.html") {
      const before = (await page.locator("#pressureValue").innerText()).trim();
      const particle = page.locator(".particle").first();
      const initialParticleTransform = await particle.evaluate(el => getComputedStyle(el).transform);
      await page.locator("#t").fill("100");
      await page.locator("#t").dispatchEvent("input");
      const after = (await page.locator("#pressureValue").innerText()).trim();
      const heatedParticleTransform = await particle.evaluate(el => getComputedStyle(el).transform);
      if (before === after) errors.push(file + ": temperature change did not update pressure");
      if (initialParticleTransform !== heatedParticleTransform) {
        errors.push(file + ": particle size appears to change with temperature, suggesting molecules expand when heated");
      }
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
