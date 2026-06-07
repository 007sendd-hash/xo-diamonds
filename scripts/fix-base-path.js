/**
 * Fix all hardcoded absolute paths in .astro files to use BASE_URL.
 * Pattern: href="/path/" or href="/path" becomes href={`${base}path/`}
 * Pattern: src="/images/..." becomes src={`${base}images/...`}
 */
import { readFileSync, writeFileSync } from "fs";
import { globSync } from "glob";

const files = globSync("src/**/*.astro");

for (const file of files) {
  let content = readFileSync(file, "utf8");
  let changed = false;

  // Check if we need to add the `base` const
  const needsBase =
    content.includes('href="/') ||
    content.includes('src="/') ||
    content.includes("href='/");

  if (!needsBase) continue;

  // Add `const base = import.meta.env.BASE_URL;` to frontmatter
  content = content.replace(
    /^(---[\s\S]*?---)/,
    "$1\nconst base = import.meta.env.BASE_URL;",
  );

  // Replace href="/..." with href={`${base}..."
  content = content.replace(
    /href="\/([^"]*)"/g,
    'href={`${base}$1`}',
  );

  // Replace src="/images/..." with src={`${base}images/..."
  content = content.replace(
    /src="\/images\/([^"]*)"/g,
    'src={`${base}images/$1`}',
  );

  // Replace style="background-image: url('/images/...')"
  content = content.replace(
    /url\('\/images\/([^']*)'\)/g,
    "url(`${base}images/$1`)",
  );

  if (content !== readFileSync(file, "utf8")) {
    writeFileSync(file, content);
    console.log(`✓ ${file}`);
  } else {
    console.log(`- ${file} (no changes needed)`);
  }
}

console.log("\nDone!");
