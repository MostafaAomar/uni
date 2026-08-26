import { access, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const bundledActions = path.join(projectRoot, "docs", "question-review", "actions");
const defaultActionFiles = [
  path.join(bundledActions, "review-years-1-3-actions.json"),
  path.join(bundledActions, "review-fourth-lit-actions.json"),
  path.join(bundledActions, "review-fourth-theory-actions.json"),
  path.join(bundledActions, "review-root-actions.json"),
];
const actionFiles = process.argv.slice(2).filter((value) => !value.startsWith("--"));
const shouldApply = process.argv.includes("--apply");

function normalise(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .replace(/[’‘`´]/g, "'")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(/^\s*(?:[a-f]\s*[).:\-]|\([a-f]\))\s*/iu, "")
    .replace(/[\p{P}\p{S}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function questionIds(question) {
  return new Set([
    String(question.id ?? ""),
    ...(question.legacyIds || []).map(String),
    ...(question.legacyPrimaryIds || []).map(String),
  ].filter(Boolean));
}

function findQuestion(questions, requestedId, excludedIds = new Set()) {
  const id = String(requestedId ?? "");
  const active = questions.filter(
    (question) => !excludedIds.has(String(question.id)),
  );
  const exact = active.filter((question) => String(question.id) === id);
  if (exact.length === 1) return exact[0];
  if (exact.length > 1) {
    throw new Error(`Stable question ID ${id} occurs ${exact.length} times.`);
  }
  const primaryMatches = active.filter((question) =>
    (question.legacyPrimaryIds || []).map(String).includes(id),
  );
  if (primaryMatches.length === 1) return primaryMatches[0];
  if (primaryMatches.length > 1) {
    throw new Error(`Primary legacy question ID ${id} occurs ${primaryMatches.length} times.`);
  }
  const matches = active.filter(
    (question) =>
      questionIds(question).has(id),
  );
  if (matches.length !== 1) {
    throw new Error(`Expected one question for ID ${id}, found ${matches.length}.`);
  }
  return matches[0];
}

function mergeAliases(keeper, removed) {
  const legacyIds = new Set((keeper.legacyIds || []).map(String));
  const primaryIds = new Set((keeper.legacyPrimaryIds || []).map(String));
  for (const question of removed) {
    legacyIds.add(String(question.id));
    primaryIds.add(String(question.id));
    (question.legacyIds || []).forEach((id) => legacyIds.add(String(id)));
    (question.legacyPrimaryIds || []).forEach((id) => primaryIds.add(String(id)));
    if (!String(keeper.feedback || "").trim() && String(question.feedback || "").trim()) {
      keeper.feedback = question.feedback;
    }
  }
  legacyIds.delete(String(keeper.id));
  primaryIds.delete(String(keeper.id));
  keeper.legacyIds = [...legacyIds].filter(Boolean).sort();
  keeper.legacyPrimaryIds = [...primaryIds].filter(Boolean).sort();
}

function setCorrectAnswer(question, action) {
  const answer = action.correctAnswer ?? action.answer ?? action.toAnswer;
  const rawIndex = action.correctIndex ?? action.toCorrectIndex;
  if (answer != null) {
    const expected = normalise(answer);
    const indices = question.options
      .map((option, index) => ({ option, index }))
      .filter(({ option }) => normalise(option) === expected)
      .map(({ index }) => index);
    if (indices.length === 1) {
      question.correct = indices[0];
      return;
    }
    const fallbackIndex = Number(rawIndex);
    if (
      Number.isInteger(fallbackIndex) &&
      fallbackIndex >= 0 &&
      fallbackIndex < question.options.length
    ) {
      question.correct = fallbackIndex;
      return;
    }
    if (indices.length !== 1) {
      throw new Error(
        `Answer "${answer}" matched ${indices.length} options for ${question.id}: ${question.q}`,
      );
    }
  } else if (rawIndex != null) {
    const index = Number(rawIndex);
    if (!Number.isInteger(index) || index < 0 || index >= question.options.length) {
      throw new Error(`Invalid correctIndex ${rawIndex} for ${question.id}.`);
    }
    question.correct = index;
  }
}

function updateQuestion(question, action) {
  const replacementOptions = action.options ?? action.setOptions;
  if (Array.isArray(replacementOptions)) question.options = replacementOptions.map(String);
  if (action.setOption && Number.isInteger(Number(action.setOption.index))) {
    const index = Number(action.setOption.index);
    if (index < 0 || index >= question.options.length) {
      throw new Error(`Invalid setOption index ${index} for ${question.id}.`);
    }
    question.options[index] = String(action.setOption.text);
  }
  setCorrectAnswer(question, action);
  const prompt = action.q ?? action.newPrompt ?? action.prompt ?? action.setQuestion;
  if (prompt != null) question.q = String(prompt).trim();
  if (action.feedback != null) question.feedback = String(action.feedback).trim();
  else if (action.rationale != null) question.feedback = String(action.rationale).trim();
  else if (action.reason != null) question.feedback = String(action.reason).trim();
  if (action.removeCommentedOut) delete question.commented_out;
}

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

const selectedFiles = actionFiles.length
  ? actionFiles.map((file) => path.resolve(file))
  : (await Promise.all(defaultActionFiles.map(async (file) => [file, await exists(file)])))
      .filter(([, present]) => present)
      .map(([file]) => file);

if (!selectedFiles.length) {
  throw new Error("No review action files were found.");
}

const actions = [];
const supportedTypes = new Set([
  "mergeGroups", "merges", "corrections", "fixes", "rewrites",
  "promptRewrites", "removals", "removeQuestions",
]);
for (const actionFile of selectedFiles) {
  const parsed = JSON.parse(await readFile(actionFile, "utf8"));
  for (const [type, entries] of Object.entries(parsed)) {
    if (!supportedTypes.has(type) || !Array.isArray(entries)) continue;
    entries.forEach((entry) => actions.push({ ...entry, type, source: actionFile }));
  }
}

const byFile = new Map();
for (const action of actions) {
  const relativeFile = String(action.file || "").replace(/\\/g, "/");
  if (!relativeFile) throw new Error(`Action without file in ${action.source}.`);
  if (!byFile.has(relativeFile)) byFile.set(relativeFile, []);
  byFile.get(relativeFile).push(action);
}

const counts = {
  mergeGroups: 0,
  mergedQuestions: 0,
  corrections: 0,
  rewrites: 0,
  advisoryRewrites: 0,
  removals: 0,
};
const retiredRecords = [];
const retiredPath = path.join(projectRoot, "retired-question-ids.json");
const existingRetired = (await exists(retiredPath))
  ? JSON.parse(await readFile(retiredPath, "utf8"))
  : [];
const retiredIds = new Set(existingRetired.map((item) => String(item.id || item)));

for (const [relativeFile, fileActions] of byFile) {
  const filePath = path.resolve(projectRoot, relativeFile);
  if (!filePath.startsWith(`${projectRoot}${path.sep}`)) {
    throw new Error(`Action points outside the project: ${relativeFile}`);
  }
  const parsed = JSON.parse(await readFile(filePath, "utf8"));
  const data = Array.isArray(parsed) ? parsed[0] : parsed;
  const questions = data.questions || [];
  const removedIds = new Set();

  for (const action of fileActions) {
    if (["mergeGroups", "merges"].includes(action.type)) {
      const keeper = findQuestion(questions, action.keeper, removedIds);
      const ids = action.remove || action.ids || [];
      const removed = ids
        .map((id) => findQuestion(questions, id, removedIds))
        .filter((q) => q !== keeper);
      updateQuestion(keeper, action);
      mergeAliases(keeper, removed);
      removed.forEach((question) => removedIds.add(String(question.id)));
      counts.mergeGroups += 1;
      counts.mergedQuestions += removed.length;
      continue;
    }

    if (["corrections", "fixes"].includes(action.type)) {
      const question = findQuestion(questions, action.id, removedIds);
      updateQuestion(question, action);
      counts.corrections += 1;
      continue;
    }

    if (["rewrites", "promptRewrites"].includes(action.type)) {
      const executableGroup =
        action.setQuestion != null ||
        action.setOptions != null ||
        action.setOption != null;
      const ids = action.id
        ? [action.id]
        : executableGroup && Array.isArray(action.ids)
          ? action.ids
          : [];
      if (!ids.length) {
        counts.advisoryRewrites += 1;
        continue;
      }
      ids.forEach((id) => {
        const question = findQuestion(questions, id, removedIds);
        updateQuestion(question, action);
        counts.rewrites += 1;
      });
      continue;
    }

    if (["removals", "removeQuestions"].includes(action.type)) {
      const ids = action.ids || (action.id ? [action.id] : []);
      ids.forEach((id) => {
        if (retiredIds.has(String(id))) return;
        const question = findQuestion(questions, id, removedIds);
        removedIds.add(String(question.id));
        retiredRecords.push({
          id: String(question.id),
          file: relativeFile,
          reason: String(action.reason || "Invalid or unanswerable question removed during academic review."),
        });
      });
      counts.removals += ids.length;
    }
  }

  if (removedIds.size) {
    data.questions = questions.filter((question) => !removedIds.has(String(question.id)));
  }
  if (shouldApply) await writeFile(filePath, `${JSON.stringify(parsed, null, 2)}\n`, "utf8");
}

if (shouldApply && retiredRecords.length) {
  const merged = new Map(
    existingRetired.map((item) => [String(item.id || item), item]),
  );
  retiredRecords.forEach((item) => merged.set(item.id, item));
  await writeFile(retiredPath, `${JSON.stringify([...merged.values()], null, 2)}\n`, "utf8");
}

console.log(
  `${shouldApply ? "Applied" : "Validated"}: ` +
    `${counts.mergeGroups} merge groups (${counts.mergedQuestions} removed), ` +
    `${counts.corrections} corrections, ${counts.rewrites} rewrites ` +
    `(${counts.advisoryRewrites} advisory rewrite groups skipped), ` +
    `${counts.removals} invalid removals across ${byFile.size} files.`,
);
