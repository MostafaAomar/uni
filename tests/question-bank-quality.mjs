import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const years = ["First Year", "Second Year", "Third Year", "Fourth Year"];

function normalise(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .replace(/[’‘`´]/g, "'")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function normalisePrompt(value) {
  return normalise(value)
    .replace(/^(?:(?:q(?:uestion)?|سؤال)\s*)?\d+\s*[).:\-–—]+\s*/iu, "")
    .replace(/[\p{P}\p{S}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normaliseOption(value) {
  return normalise(value)
    .replace(/^\s*(?:[a-f]\s*[).:\-]|\([a-f]\))\s*/iu, "")
    .replace(/\s+/g, " ")
    .trim();
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

let subjectCount = 0;
let questionCount = 0;

for (const year of years) {
  for (const filePath of await jsonFiles(path.join(projectRoot, year))) {
    const relativePath = path.relative(projectRoot, filePath);
    const parsed = JSON.parse(await readFile(filePath, "utf8"));
    const data = Array.isArray(parsed) ? parsed[0] : parsed;
    assert.ok(data && Array.isArray(data.questions), `${relativePath}: missing questions array`);
    const promptOwners = new Map();
    const stableIds = new Set();
    const primaryAliases = new Set();

    data.questions.forEach((question, index) => {
      const label = `${relativePath} question ${index + 1} (${question.id || "missing ID"})`;
      assert.ok(String(question.id || "").trim(), `${label}: empty stable ID`);
      assert.equal(stableIds.has(String(question.id)), false, `${label}: duplicate stable ID`);
      stableIds.add(String(question.id));

      const prompt = normalisePrompt(question.q);
      assert.ok(prompt, `${label}: empty prompt`);
      assert.equal(
        promptOwners.has(prompt),
        false,
        `${label}: repeated prompt also used by ${promptOwners.get(prompt)}`,
      );
      promptOwners.set(prompt, question.id);

      assert.ok(Array.isArray(question.options) && question.options.length >= 2, `${label}: too few options`);
      const optionKeys = question.options.map(normaliseOption);
      assert.equal(optionKeys.every(Boolean), true, `${label}: empty or placeholder-only option`);
      assert.equal(new Set(optionKeys).size, optionKeys.length, `${label}: duplicate options`);
      assert.ok(
        Number.isInteger(Number(question.correct)) &&
          Number(question.correct) >= 0 &&
          Number(question.correct) < question.options.length,
        `${label}: invalid correct answer index`,
      );
      assert.ok(String(question.feedback || "").trim(), `${label}: missing explanation`);
      assert.notEqual(
        String(question.commented_out || "").toLowerCase(),
        "duplicate",
        `${label}: still marked as duplicate`,
      );

      assert.ok(Array.isArray(question.legacyIds), `${label}: missing legacyIds`);
      assert.ok(Array.isArray(question.legacyPrimaryIds), `${label}: missing legacyPrimaryIds`);
      question.legacyPrimaryIds.forEach((alias) => {
        assert.equal(
          primaryAliases.has(String(alias)),
          false,
          `${label}: primary legacy alias ${alias} belongs to more than one question`,
        );
        primaryAliases.add(String(alias));
      });
    });

    subjectCount += 1;
    questionCount += data.questions.length;
  }
}

assert.equal(subjectCount, 20);
console.log(`Question-bank quality checks passed: ${subjectCount} subjects, ${questionCount} unique questions.`);
