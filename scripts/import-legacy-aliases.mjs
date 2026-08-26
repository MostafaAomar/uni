import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const years = ["First Year", "Second Year", "Third Year", "Fourth Year"];

function argumentValue(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : "";
}

const sourceArgument = argumentValue("--source");
if (!sourceArgument) {
  throw new Error(
    "Usage: node scripts/import-legacy-aliases.mjs --source <legacy-project-directory>",
  );
}
const legacyRoot = path.resolve(sourceArgument);

function normalise(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function simpleHash(value) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash).toString(16);
}

function legacyQuestionId(question) {
  const combined =
    String(question.q ?? "") +
    (Array.isArray(question.options) ? question.options.join("") : "") +
    (question.correct !== undefined ? question.correct : "");
  return `id_${simpleHash(combined)}`;
}

// Reproduces the exact identity rules used by the pre-v12 application,
// including the __2/__3 suffixes that were added for repeated questions.
function legacyAliases(questions) {
  const duplicateCounts = new Map();
  return questions.map((question) => {
    const suppliedId =
      question.id !== undefined && question.id !== null
        ? String(question.id)
        : "";
    const looksGenerated = /^id_[0-9a-f]+$/i.test(suppliedId);
    const fingerprint =
      normalise(question.q) || normalise((question.options || []).join("|"));
    const generated = `qid_${simpleHash(fingerprint)}`;
    const baseId = suppliedId && !looksGenerated ? suppliedId : generated;
    const duplicateNumber = duplicateCounts.get(baseId) || 0;
    duplicateCounts.set(baseId, duplicateNumber + 1);
    const stableId =
      duplicateNumber === 0 ? baseId : `${baseId}__${duplicateNumber + 1}`;
    return {
      // This is the exact ID under which the immediately previous release
      // stored progress and notes. It must outrank heuristic aliases when two
      // questions have identical text.
      primary: stableId,
      aliases: [
        ...new Set([
          stableId,
          baseId,
          suppliedId,
          generated,
          legacyQuestionId(question),
        ]),
      ].filter(Boolean),
    };
  });
}

async function jsonFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await jsonFiles(fullPath)));
    else if (entry.isFile() && entry.name.toLowerCase().endsWith(".json")) {
      files.push(fullPath);
    }
  }
  return files.sort((a, b) => a.localeCompare(b));
}

let fileCount = 0;
let aliasCount = 0;

for (const year of years) {
  for (const legacyPath of await jsonFiles(path.join(legacyRoot, year))) {
    const relativePath = path.relative(legacyRoot, legacyPath);
    const currentPath = path.join(projectRoot, relativePath);
    const legacyParsed = JSON.parse(await readFile(legacyPath, "utf8"));
    const currentParsed = JSON.parse(await readFile(currentPath, "utf8"));
    const legacyData = Array.isArray(legacyParsed) ? legacyParsed[0] : legacyParsed;
    const currentData = Array.isArray(currentParsed) ? currentParsed[0] : currentParsed;
    if (legacyData.questions.length !== currentData.questions.length) {
      throw new Error(`${relativePath}: question count changed; aliases require a manual mapping.`);
    }

    const aliasesByIndex = legacyAliases(legacyData.questions);
    currentData.questions.forEach((question, index) => {
      const oldQuestion = legacyData.questions[index];
      if (
        normalise(question.q) !== normalise(oldQuestion.q) ||
        normalise((question.options || []).join("|")) !==
          normalise((oldQuestion.options || []).join("|"))
      ) {
        throw new Error(`${relativePath}: question ${index + 1} no longer aligns with the legacy file.`);
      }
      const aliases = new Set([
        ...(Array.isArray(question.legacyIds) ? question.legacyIds : []),
        ...aliasesByIndex[index].aliases,
      ]);
      aliases.delete(String(question.id));
      question.legacyIds = [...aliases].sort();
      question.legacyPrimaryIds = [aliasesByIndex[index].primary].filter(
        (id) => id && id !== String(question.id),
      );
      aliasCount += question.legacyIds.length;
    });

    await writeFile(currentPath, `${JSON.stringify(currentParsed, null, 2)}\n`, "utf8");
    fileCount += 1;
  }
}

console.log(`Imported ${aliasCount} legacy aliases across ${fileCount} subject files.`);
