import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, extname, resolve, relative } from "node:path";

const htmlFiles = [
  "index.html",
  "catalog.html",
  ...readdirSync("chapters")
    .filter((name) => name.endsWith(".html"))
    .map((name) => \`chapters/\${name}\`),
];

const errors = [];
const idCache = new Map();

function idsIn(file) {
  if (!idCache.has(file)) {
    const html = readFileSync(file, "utf8");
    idCache.set(file, new Set(
      [...html.matchAll(/\bid=["']([^"']+)["']/g)].map((match) => match[1])
    ));
  }
  return idCache.get(file);
}

for (const source of htmlFiles) {
  const html = readFileSync(source, "utf8");
  const refs = html.matchAll(/\b(?:href|src)=["']([^"'#]*)(#[^"']*)?["']/gi);

  for (const match of refs) {
    const rawPath = match[1];
    const fragment = match[2]?.slice(1);
    if (/^(?:https?:|mailto:|tel:|data:|javascript:|\/\/)/i.test(rawPath)) continue;

    const pathname = rawPath.split("?")[0];
    const target = resolve(dirname(source), pathname || source);
    const displayTarget = relative(".", target);

    if (!existsSync(target)) {
      errors.push(\`\${source}: missing local file "\${rawPath}"\`);
      continue;
    }

    if (fragment && extname(target).toLowerCase() === ".html") {
      let decoded;
      try {
        decoded = decodeURIComponent(fragment);
      } catch {
        errors.push(\`\${source}: invalid URL fragment "#\${fragment}"\`);
        continue;
      }
      if (!idsIn(displayTarget).has(decoded)) {
        errors.push(\`\${source}: missing fragment "#\${decoded}" in \${displayTarget}\`);
      }
    }
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(\`Checked local links and assets in \${htmlFiles.length} HTML pages.\`);
}
