import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const years = ["First Year", "Second Year", "Third Year", "Fourth Year"];
const languageOverrides = new Map([
  ["Third Year/french.json", "fr"],
  ["Fourth Year/Modern_Drama.json", "en"],
]);

function normalise(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function generatedQuestionId(relativePath, question, index) {
  const fingerprint = [
    relativePath,
    index,
    normalise(question.q),
    ...(Array.isArray(question.options) ? question.options.map(normalise) : []),
  ].join("\u0000");
  return `q_${createHash("sha256").update(fingerprint).digest("hex").slice(0, 20)}`;
}

async function jsonFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await jsonFiles(fullPath)));
    else if (entry.isFile() && entry.name.toLowerCase().endsWith(".json")) files.push(fullPath);
  }
  return files;
}

let changedFiles = 0;
let assignedIds = 0;

for (const year of years) {
  for (const filePath of await jsonFiles(path.join(projectRoot, year))) {
    const relativePath = path.relative(projectRoot, filePath).split(path.sep).join("/");
    const parsed = JSON.parse(await readFile(filePath, "utf8"));
    const data = Array.isArray(parsed) ? parsed[0] : parsed;
    if (!data || !Array.isArray(data.questions)) {
      throw new Error(`${relativePath}: expected an object with a questions array.`);
    }

    const usedIds = new Set();
    let changed = false;
    data.questions.forEach((question, index) => {
      const suppliedId = question.id == null ? "" : String(question.id).trim();
      let id = suppliedId;
      if (!id || usedIds.has(id)) {
        id = generatedQuestionId(relativePath, question, index);
        let suffix = 2;
        while (usedIds.has(id)) id = `${generatedQuestionId(relativePath, question, index)}_${suffix++}`;
        question.id = id;
        changed = true;
        assignedIds++;
      } else if (question.id !== id) {
        question.id = id;
        changed = true;
      }
      usedIds.add(id);

      const numericCorrect = Number(question.correct);
      if (Number.isInteger(numericCorrect) && question.correct !== numericCorrect) {
        question.correct = numericCorrect;
        changed = true;
      }
    });

    const correctedLanguage = languageOverrides.get(relativePath);
    if (correctedLanguage && data.lang !== correctedLanguage) {
      data.lang = correctedLanguage;
      changed = true;
    }

    if (changed) {
      await writeFile(filePath, `${JSON.stringify(parsed, null, 2)}\n`, "utf8");
      changedFiles++;
    }
  }
}

console.log(`Normalized ${changedFiles} files and assigned ${assignedIds} stable question IDs.`);
