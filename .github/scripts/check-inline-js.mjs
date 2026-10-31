import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, posix, resolve } from "node:path";
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
  const scripts = html.matchAll(/<script\\b([^>]*)>([\\s\\S]*?)<\\/script>/gi);
  let index = 0;

  for (const match of scripts) {
    index += 1;
    if (/\\bsrc\\s*=/.test(match[1])) continue;
    const source = match[2].trim();
    if (!source) continue;

    try {
      new vm.Script(source, { filename: `${file}#inline-script-${index}` });
      checked += 1;
    } catch (error) {
      errors.push(`${file} (script ${index}): ${error.message}`);
    }
  }

  for (const match of html.matchAll(/\\b(?:href|src)=["']([^"']+)["']/gi)) {
    const reference = match[1];
    if (/^(?:https?:|mailto:|tel:|data:|javascript:|\\/\\/)/i.test(reference)) continue;

    const [rawPath, rawFragment] = reference.split("#", 2);
    const pathname = decodeURIComponent(rawPath.split("?")[0]);
    const target = pathname
      ? resolve(pathname.startsWith("/") ? "." : dirname(file), pathname)
      : resolve(file);

    if (!existsSync(target)) {
      errors.push(`${file}: missing local resource "${reference}"`);
      continue;
    }

    if (rawFragment && target.endsWith(".html")) {
      const targetHtml = readFileSync(target, "utf8");
      const fragment = decodeURIComponent(rawFragment);
      const escaped = fragment.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&");
      if (!new RegExp(`\\\\bid=["']${escaped}["']`).test(targetHtml)) {
        errors.push(`${file}: missing fragment "${reference}"`);
      }
    }
  }
}

if (errors.length) {
  console.error(errors.join("\\n"));
  process.exitCode = 1;
} else {
  console.log(`Checked ${checked} inline scripts and local links across ${files.length} physics pages.`);
}
