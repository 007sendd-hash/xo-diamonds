import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

function findAstroFiles(dir) {
  let results = [];
  const list = readdirSync(dir);
  for (const item of list) {
    const full = join(dir, item);
    const stat = statSync(full);
    if (stat.isDirectory() && item !== "node_modules" && item !== ".astro" && item !== "dist") {
      results = results.concat(findAstroFiles(full));
    } else if (item.endsWith(".astro")) {
      results.push(full);
    }
  }
  return results;
}

const files = findAstroFiles("src");

for (const file of files) {
  let content = readFileSync(file, "utf8");
  const original = content;

  // Only process if there are hardcoded paths
  if (!content.includes('href="/') && !content.includes('src="/')) {
    console.log("-- " + file + " (no paths to fix)");
    continue;
  }

  // Add base const INSIDE the frontmatter block, after imports
  if (!content.includes("const base = import.meta.env.BASE_URL;")) {
    // Find the closing --- of the frontmatter and insert before it
    content = content.replace(
      /^(---[\s\S]*?)(---)/,
      "$1const base = import.meta.env.BASE_URL;\n$2",
    );
  }

  // Replace href="/..." (standalone attribute)
  content = content.replace(/href="\/([^"]*)"/g, (_match, p1) => {
    return "href={`${base}" + p1 + "`}";
  });

  // Replace src="/images/..."
  content = content.replace(/src="\/images\/([^"]*)"/g, (_match, p1) => {
    return "src={`${base}images/" + p1 + "`}";
  });

  if (content !== original) {
    writeFileSync(file, content);
    console.log("OK " + file);
  }
}

console.log("\nDone!");
