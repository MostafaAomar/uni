import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = path.resolve(process.argv[2] || projectRoot);
const outputPath = path.resolve(
  process.argv[3] ||
    path.join(projectRoot, "docs", "question-review", "historical-question-inventory.json"),
);
const years = ["First Year", "Second Year", "Third Year", "Fourth Year"];

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

const inventory = { version: 1, historicalQuestionCount: 0, files: {} };
for (const year of years) {
  for (const filePath of await jsonFiles(path.join(sourceRoot, year))) {
    const relative = path.relative(sourceRoot, filePath).split(path.sep).join("/");
    const parsed = JSON.parse(await readFile(filePath, "utf8"));
    const data = Array.isArray(parsed) ? parsed[0] : parsed;
    inventory.files[relative] = (data.questions || []).map((question) => ({
      id: String(question.id),
      legacyPrimaryIds: (question.legacyPrimaryIds || []).map(String),
    }));
    inventory.historicalQuestionCount += inventory.files[relative].length;
  }
}

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(inventory, null, 2)}\n`, "utf8");
console.log(
  `Wrote ${inventory.historicalQuestionCount} historical question identities to ${outputPath}.`,
);
