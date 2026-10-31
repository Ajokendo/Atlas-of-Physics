import { readFileSync, readdirSync } from "node:fs";
import vm from "node:vm";

const files = [
  "index.html",
  ...readdirSync("chapters")
    .filter((name) => name.endsWith(".html"))
    .map((name) => `chapters/${name}`),
];

let checked = 0;
const errors = [];

for (const file of files) {
  const html = readFileSync(file, "utf8");
  const scripts = html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi);
  let index = 0;

  for (const match of scripts) {
    index += 1;
    if (/\bsrc\s*=/.test(match[1])) continue;
    const source = match[2].trim();
    if (!source) continue;

    try {
      new vm.Script(source, { filename: `${file}#inline-script-${index}` });
      checked += 1;
    } catch (error) {
      errors.push(`${file} (script ${index}): ${error.message}`);
    }
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Checked ${checked} inline scripts across ${files.length} physics pages.`);
}
