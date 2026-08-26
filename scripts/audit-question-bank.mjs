import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const years = ["First Year", "Second Year", "Third Year", "Fourth Year"];

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

function distinctOptionKey(value) {
  return normaliseText(value)
    .replace(/^\s*(?:[a-f]\s*[).:\-]|\([a-f]\))\s*/iu, "")
    .replace(/\s+/g, " ")
    .trim();
}

function answerText(question) {
  const index = Number(question.correct);
  return normaliseOption(question.options?.[index]);
}

function tokenSimilarity(first, second) {
  const a = new Set(first.split(" ").filter(Boolean));
  const b = new Set(second.split(" ").filter(Boolean));
  if (!a.size || !b.size) return 0;
  let intersection = 0;
  a.forEach((token) => {
    if (b.has(token)) intersection += 1;
  });
  return intersection / new Set([...a, ...b]).size;
}

function feedbackOptionScore(option, feedback) {
  const feedbackKey = normaliseOption(feedback);
  const tokens = normaliseOption(option)
    .split(" ")
    .filter((token) => token.length >= 3 && !/^[a-f]$/i.test(token));
  if (!tokens.length) return 0;
  const matched = tokens.filter((token) => feedbackKey.includes(token)).length;
  return matched / tokens.length;
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

const report = {
  generatedAt: new Date().toISOString(),
  totals: {
    subjects: 0,
    questions: 0,
    exactDuplicateGroups: 0,
    removableExactDuplicates: 0,
    conflictingExactGroups: 0,
    strictDuplicateGroups: 0,
    removableStrictDuplicates: 0,
    probableNearPairs: 0,
    markedDuplicateQuestions: 0,
    markedDuplicatesWithPromptPeer: 0,
    feedbackAnswerSuspects: 0,
    duplicateOptionQuestions: 0,
    invalidCorrectIndices: 0,
  },
  subjects: [],
};

for (const year of years) {
  for (const filePath of await jsonFiles(path.join(projectRoot, year))) {
    const relativePath = path.relative(projectRoot, filePath).split(path.sep).join("/");
    const parsed = JSON.parse(await readFile(filePath, "utf8"));
    const data = Array.isArray(parsed) ? parsed[0] : parsed;
    const questions = data?.questions || [];
    const byPrompt = new Map();
    questions.forEach((question, index) => {
      const key = normalisePrompt(question.q);
      if (!key) return;
      if (!byPrompt.has(key)) byPrompt.set(key, []);
      byPrompt.get(key).push({
        index,
        id: String(question.id ?? ""),
        prompt: question.q,
        options: question.options,
        correctIndex: Number(question.correct),
        answer: question.options?.[Number(question.correct)] ?? null,
        answerKey: answerText(question),
      });
    });

    const exactDuplicates = [...byPrompt.entries()]
      .filter(([, matches]) => matches.length > 1)
      .map(([key, matches]) => ({
        key,
        matches,
        conflictingAnswers: new Set(matches.map((item) => item.answerKey)).size > 1,
      }));

    const strictByFingerprint = new Map();
    questions.forEach((question, index) => {
      const promptKey = normalisePrompt(question.q);
      const optionKey = (question.options || []).map(normaliseOption).sort().join("|");
      const key = `${promptKey}\u0000${optionKey}`;
      if (!promptKey || !optionKey) return;
      if (!strictByFingerprint.has(key)) strictByFingerprint.set(key, []);
      strictByFingerprint.get(key).push({
        index,
        id: String(question.id ?? ""),
        prompt: question.q,
        options: question.options,
        correctIndex: Number(question.correct),
        answer: question.options?.[Number(question.correct)] ?? null,
        answerKey: answerText(question),
      });
    });
    const strictDuplicates = [...strictByFingerprint.entries()]
      .filter(([, matches]) => matches.length > 1)
      .map(([key, matches]) => ({
        key,
        matches,
        conflictingAnswers: new Set(matches.map((item) => item.answerKey)).size > 1,
      }));

    const probableNearPairs = [];
    const prompts = [...byPrompt.keys()];
    for (let firstIndex = 0; firstIndex < prompts.length; firstIndex += 1) {
      const first = prompts[firstIndex];
      if (first.length < 24) continue;
      for (let secondIndex = firstIndex + 1; secondIndex < prompts.length; secondIndex += 1) {
        const second = prompts[secondIndex];
        const lengthRatio = Math.min(first.length, second.length) / Math.max(first.length, second.length);
        if (lengthRatio < 0.86) continue;
        const similarity = tokenSimilarity(first, second);
        if (similarity < 0.92) continue;
        probableNearPairs.push({
          similarity: Number(similarity.toFixed(3)),
          first: byPrompt.get(first)[0],
          second: byPrompt.get(second)[0],
        });
      }
    }

    const subjectReport = {
      path: relativePath,
      subject: data.subject || path.basename(filePath, ".json"),
      questionCount: questions.length,
      exactDuplicates,
      strictDuplicates,
      probableNearPairs,
      markedDuplicates: questions
        .map((question, index) => ({ question, index }))
        .filter(({ question }) => String(question.commented_out || "").toLowerCase() === "duplicate")
        .map(({ question, index }) => ({
          index,
          id: String(question.id || ""),
          prompt: question.q,
          hasPromptPeer: (byPrompt.get(normalisePrompt(question.q)) || []).length > 1,
        })),
      feedbackAnswerSuspects: questions.flatMap((question, index) => {
        if (!question.feedback || !Array.isArray(question.options)) return [];
        const scores = question.options.map((option) =>
          feedbackOptionScore(option, question.feedback),
        );
        const chosenIndex = Number(question.correct);
        const bestScore = Math.max(...scores);
        const bestIndex = scores.indexOf(bestScore);
        const chosenScore = scores[chosenIndex] || 0;
        if (
          bestIndex === chosenIndex ||
          bestScore < 0.7 ||
          bestScore - chosenScore < 0.45
        ) {
          return [];
        }
        return [{
          index,
          id: String(question.id || ""),
          prompt: question.q,
          chosenIndex,
          chosenAnswer: question.options[chosenIndex],
          suggestedIndex: bestIndex,
          suggestedAnswer: question.options[bestIndex],
          chosenScore: Number(chosenScore.toFixed(2)),
          suggestedScore: Number(bestScore.toFixed(2)),
          feedback: question.feedback,
        }];
      }),
      duplicateOptionQuestions: questions.flatMap((question, index) => {
        const optionKeys = (question.options || []).map(distinctOptionKey);
        if (optionKeys.length === new Set(optionKeys).size && optionKeys.every(Boolean)) return [];
        return [{
          index,
          id: String(question.id || ""),
          prompt: question.q,
          options: question.options,
        }];
      }),
      invalidCorrectIndices: questions.flatMap((question, index) => {
        const correctIndex = Number(question.correct);
        if (
          Number.isInteger(correctIndex) &&
          correctIndex >= 0 &&
          correctIndex < (question.options || []).length
        ) return [];
        return [{ index, id: String(question.id || ""), prompt: question.q, correctIndex }];
      }),
    };
    report.subjects.push(subjectReport);
    report.totals.subjects += 1;
    report.totals.questions += questions.length;
    report.totals.exactDuplicateGroups += exactDuplicates.length;
    report.totals.removableExactDuplicates += exactDuplicates.reduce(
      (total, group) => total + group.matches.length - 1,
      0,
    );
    report.totals.conflictingExactGroups += exactDuplicates.filter(
      (group) => group.conflictingAnswers,
    ).length;
    report.totals.strictDuplicateGroups += strictDuplicates.length;
    report.totals.removableStrictDuplicates += strictDuplicates.reduce(
      (total, group) => total + group.matches.length - 1,
      0,
    );
    report.totals.probableNearPairs += probableNearPairs.length;
    report.totals.markedDuplicateQuestions += subjectReport.markedDuplicates.length;
    report.totals.markedDuplicatesWithPromptPeer += subjectReport.markedDuplicates.filter(
      (question) => question.hasPromptPeer,
    ).length;
    report.totals.feedbackAnswerSuspects += subjectReport.feedbackAnswerSuspects.length;
    report.totals.duplicateOptionQuestions += subjectReport.duplicateOptionQuestions.length;
    report.totals.invalidCorrectIndices += subjectReport.invalidCorrectIndices.length;
  }
}

if (process.argv.includes("--json")) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(JSON.stringify(report.totals, null, 2));
  report.subjects
    .filter((subject) => subject.exactDuplicates.length || subject.probableNearPairs.length)
    .forEach((subject) => {
      const conflicts = subject.exactDuplicates.filter((group) => group.conflictingAnswers).length;
      console.log(
        `${subject.path}: ${subject.questionCount} questions, ` +
          `${subject.exactDuplicates.length} repeated prompts (${conflicts} answer variants), ` +
          `${subject.strictDuplicates.length} strict duplicate groups, ` +
          `${subject.probableNearPairs.length} near pairs`,
      );
    });
}
