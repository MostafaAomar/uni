import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const years = ["First Year", "Second Year", "Third Year", "Fourth Year"];
const shouldApply = process.argv.includes("--apply-safe");

function normaliseText(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .replace(/[’‘`´]/g, "'")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function normalisePrompt(value) {
  return normaliseText(value)
    .replace(/^(?:(?:q(?:uestion)?|سؤال)\s*)?\d+\s*[).:\-–—]+\s*/iu, "")
    .replace(/[\p{P}\p{S}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normaliseOption(value) {
  return normaliseText(value)
    .replace(/^\s*(?:[a-f]\s*[).:\-]|\([a-f]\))\s*/iu, "")
    .replace(/[\p{P}\p{S}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function fingerprint(question) {
  const options = (question.options || []).map(normaliseOption).sort();
  return `${normalisePrompt(question.q)}\u0000${options.join("|")}`;
}

function answerKey(question) {
  return normaliseOption(question.options?.[Number(question.correct)]);
}

function presentationScore(question) {
  let score = 0;
  if (!/^(?:(?:q(?:uestion)?|سؤال)\s*)?\d+\s*[).:\-–—]+/iu.test(String(question.q))) {
    score += 20;
  }
  (question.options || []).forEach((option) => {
    if (!/^\s*(?:[a-f]\s*[).:\-]|\([a-f]\))/iu.test(String(option))) score += 2;
  });
  if (typeof question.feedback === "string" && question.feedback.trim()) score += 4;
  if (/[?.!]$/.test(String(question.q).trim())) score += 1;
  return score;
}

function mergeAliases(keeper, removedQuestions) {
  const legacyIds = new Set([
    ...(Array.isArray(keeper.legacyIds) ? keeper.legacyIds : []),
  ]);
  const primaryIds = new Set([
    ...(Array.isArray(keeper.legacyPrimaryIds) ? keeper.legacyPrimaryIds : []),
  ]);

  removedQuestions.forEach((question) => {
    legacyIds.add(String(question.id));
    primaryIds.add(String(question.id));
    (question.legacyIds || []).forEach((id) => legacyIds.add(String(id)));
    (question.legacyPrimaryIds || []).forEach((id) => primaryIds.add(String(id)));
    if (
      (!keeper.feedback || !String(keeper.feedback).trim()) &&
      typeof question.feedback === "string" &&
      question.feedback.trim()
    ) {
      keeper.feedback = question.feedback;
    }
  });

  legacyIds.delete(String(keeper.id));
  primaryIds.delete(String(keeper.id));
  keeper.legacyIds = [...legacyIds].filter(Boolean).sort();
  keeper.legacyPrimaryIds = [...primaryIds].filter(Boolean).sort();
}

async function jsonFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await jsonFiles(fullPath)));
    else if (entry.isFile() && entry.name.toLowerCase().endsWith(".json")) files.push(fullPath);
  }
  return files.sort((a, b) => a.localeCompare(b));
}

let removedCount = 0;
let mergedGroupCount = 0;
let skippedConflictCount = 0;

for (const year of years) {
  for (const filePath of await jsonFiles(path.join(projectRoot, year))) {
    const parsed = JSON.parse(await readFile(filePath, "utf8"));
    const data = Array.isArray(parsed) ? parsed[0] : parsed;
    const questions = data.questions || [];
    const groups = new Map();
    questions.forEach((question) => {
      const key = fingerprint(question);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(question);
    });

    const removedIds = new Set();
    groups.forEach((matches) => {
      if (matches.length < 2) return;
      const answers = new Set(matches.map(answerKey));
      if (answers.size !== 1) {
        skippedConflictCount += 1;
        return;
      }
      const ranked = [...matches].sort(
        (first, second) =>
          presentationScore(second) - presentationScore(first) ||
          questions.indexOf(first) - questions.indexOf(second),
      );
      const keeper = ranked[0];
      const removed = ranked.slice(1);
      mergeAliases(keeper, removed);
      removed.forEach((question) => removedIds.add(String(question.id)));
      removedCount += removed.length;
      mergedGroupCount += 1;
    });

    if (removedIds.size && shouldApply) {
      data.questions = questions.filter((question) => !removedIds.has(String(question.id)));
      await writeFile(filePath, `${JSON.stringify(parsed, null, 2)}\n`, "utf8");
    }
  }
}

console.log(
  `${shouldApply ? "Applied" : "Would apply"} ${mergedGroupCount} safe groups, ` +
    `remove ${removedCount} duplicate questions, skip ${skippedConflictCount} conflicting strict groups.`,
);
