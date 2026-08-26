import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const years = ["First Year", "Second Year", "Third Year", "Fourth Year"];
const shouldApply = process.argv.includes("--apply");

async function jsonFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await jsonFiles(fullPath)));
    else if (entry.isFile() && entry.name.toLowerCase().endsWith(".json")) files.push(fullPath);
  }
  return files.sort();
}

let clearedMarkers = 0;
let changedFiles = 0;

for (const year of years) {
  for (const filePath of await jsonFiles(path.join(projectRoot, year))) {
    const parsed = JSON.parse(await readFile(filePath, "utf8"));
    const data = Array.isArray(parsed) ? parsed[0] : parsed;
    let changed = false;
    for (const question of data.questions || []) {
      if (String(question.commented_out || "").toLowerCase() === "duplicate") {
        delete question.commented_out;
        clearedMarkers += 1;
        changed = true;
      }
    }
    if (changed) {
      changedFiles += 1;
      if (shouldApply) await writeFile(filePath, `${JSON.stringify(parsed, null, 2)}\n`, "utf8");
    }
  }
}

console.log(
  `${shouldApply ? "Cleared" : "Would clear"} ${clearedMarkers} reviewed duplicate markers across ${changedFiles} files.`,
);
