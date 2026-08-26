import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const years = ["First Year", "Second Year", "Third Year", "Fourth Year"];

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

function validateSubject(data, relativePath) {
  if (!data || !Array.isArray(data.questions) || data.questions.length === 0) {
    throw new Error(`${relativePath}: missing questions.`);
  }
  const ids = new Set();
  data.questions.forEach((question, index) => {
    if (typeof question?.q !== "string" || !question.q.trim()) {
      throw new Error(`${relativePath}: question ${index + 1} has no text.`);
    }
    if (!Array.isArray(question.options) || question.options.length < 2) {
      throw new Error(`${relativePath}: question ${index + 1} needs at least two options.`);
    }
    if (!Number.isInteger(question.correct) || question.correct < 0 || question.correct >= question.options.length) {
      throw new Error(`${relativePath}: question ${index + 1} has an invalid correct index.`);
    }
    const id = question.id == null ? "" : String(question.id).trim();
    if (!id || ids.has(id)) {
      throw new Error(`${relativePath}: question ${index + 1} has a missing or duplicate stable id.`);
    }
    ids.add(id);
  });

  const primaryOwners = new Map([...ids].map((id) => [id, id]));
  data.questions.forEach((question, index) => {
    const primaryAliases = Array.isArray(question.legacyPrimaryIds)
      ? question.legacyPrimaryIds
      : [];
    primaryAliases.forEach((value) => {
      const alias = String(value ?? "").trim();
      if (!alias) {
        throw new Error(`${relativePath}: question ${index + 1} has an empty primary legacy id.`);
      }
      const existingOwner = primaryOwners.get(alias);
      if (existingOwner && existingOwner !== String(question.id)) {
        throw new Error(
          `${relativePath}: primary legacy id ${alias} maps to more than one question.`,
        );
      }
      primaryOwners.set(alias, String(question.id));
    });
  });
}

const manifest = { version: 2, revision: "", years: {} };
const revisionParts = [];

for (const year of years) {
  manifest.years[year] = [];
  for (const filePath of await jsonFiles(path.join(projectRoot, year))) {
    const relativePath = path.relative(projectRoot, filePath).split(path.sep).join("/");
    const bytes = await readFile(filePath);
    const parsed = JSON.parse(bytes.toString("utf8"));
    const data = Array.isArray(parsed) ? parsed[0] : parsed;
    validateSubject(data, relativePath);
    const sha256 = createHash("sha256").update(bytes).digest("hex");
    revisionParts.push(`${relativePath}:${sha256}`);
    manifest.years[year].push({
      path: relativePath,
      subject: String(data.subject || path.basename(filePath, ".json")).trim(),
      description: typeof data.description === "string" ? data.description.trim() : "",
      lang: data.lang || "en",
      questionCount: data.questions.length,
      sha256,
      size: bytes.byteLength,
    });
  }
}

manifest.revision = createHash("sha256").update(revisionParts.join("\n")).digest("hex").slice(0, 24);
await writeFile(
  path.join(projectRoot, "content-manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
  "utf8",
);
console.log(`Built content manifest ${manifest.revision} with ${revisionParts.length} subjects.`);
