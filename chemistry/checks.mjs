import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const htmlFiles = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && entry.name.endsWith(".html")) htmlFiles.push(full);
  }
}
walk(root);

const errors = [];
let checkedLinks = 0;
let checkedScripts = 0;

for (const file of htmlFiles) {
  const source = fs.readFileSync(file, "utf8");
  const relativeFile = path.relative(root, file);

  if (!/<html\\b[^>]*lang=["'][^"']+["']/i.test(source)) {
    errors.push(`${relativeFile}: missing html lang attribute`);
  }
  if (!/<meta\\s+name=["']viewport["']/i.test(source)) {
    errors.push(`${relativeFile}: missing viewport meta tag`);
  }

  const ids = new Set([...source.matchAll(/\\bid=["']([^"']+)["']/gi)].map(m => m[1]));
  for (const match of source.matchAll(/<(?:a|img|script|link|source)[^>]*?\\b(href|src)=["']([^"']+)["'][^>]*>/gi)) {
    const attribute = match[1].toLowerCase();
    const value = match[2].trim();
    if (!value || /^(?:https?:|mailto:|tel:|data:|javascript:|#)/i.test(value)) {
      if (value.startsWith("#") && value.length > 1 && !ids.has(decodeURIComponent(value.slice(1)))) {
        errors.push(`${relativeFile}: missing in-page anchor ${value}`);
      }
      continue;
    }
    const [pathname, fragment] = value.split("#", 2);
    const cleanPath = decodeURIComponent(pathname.split("?")[0]);
    const target = path.resolve(path.dirname(file), cleanPath);
    checkedLinks++;
    if (!fs.existsSync(target) || !fs.statSync(target).isFile()) {
      errors.push(`${relativeFile}: broken ${attribute} path "${value}"`);
      continue;
    }
    if (fragment && target.endsWith(".html")) {
      const targetSource = fs.readFileSync(target, "utf8");
      const targetIds = new Set([...targetSource.matchAll(/\\bid=["']([^"']+)["']/gi)].map(m => m[1]));
      if (!targetIds.has(decodeURIComponent(fragment))) errors.push(`${relativeFile}: missing anchor "${fragment}" in ${path.relative(root, target)}`);
    }
  }

  for (const match of source.matchAll(/<script\\b([^>]*)>([\\s\\S]*?)<\\/script>/gi)) {
    const attrs = match[1];
    const code = match[2].trim();
    if (!code || /\\bsrc=/i.test(attrs)) continue;
    try {
      new vm.Script(code, { filename: `${relativeFile}:inline-script` });
      checkedScripts++;
    } catch (error) {
      errors.push(`${relativeFile}: JavaScript syntax error: ${error.message}`);
    }
  }
}

const homepage = fs.readFileSync(path.join(root, "index.html"), "utf8");
const chapterIds = [...homepage.matchAll(/\\["'](0[1-9]|1[0-2])["']/g)].map(m => m[1]);
if (new Set(chapterIds).size < 12) errors.push("index.html: expected all 12 chapter identifiers");

if (errors.length) {
  console.error("Chemistry atlas checks failed:");
  for (const error of errors) console.error(" - " + error);
  process.exit(1);
}
console.log(`Chemistry atlas checks passed: ${htmlFiles.length} HTML pages, ${checkedLinks} local links/assets, ${checkedScripts} inline scripts.`);
