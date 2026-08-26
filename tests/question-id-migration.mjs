import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const inventoryPath = path.resolve(
  process.argv[2] ||
    path.join(projectRoot, "docs", "question-review", "historical-question-inventory.json"),
);

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

const retiredPath = path.join(projectRoot, "retired-question-ids.json");
const retired = (await exists(retiredPath))
  ? new Set(JSON.parse(await readFile(retiredPath, "utf8")).map((item) => String(item.id || item)))
  : new Set();

let oldQuestionCount = 0;
let finalQuestionCount = 0;
let mergedQuestionCount = 0;
let retiredQuestionCount = 0;

const inventory = JSON.parse(await readFile(inventoryPath, "utf8"));
assert.equal(inventory.version, 1);

for (const [relative, oldQuestions] of Object.entries(inventory.files)) {
    const finalFile = path.join(projectRoot, ...relative.split("/"));
    assert.equal(await exists(finalFile), true, `${relative}: missing current file`);
    const newParsed = JSON.parse(await readFile(finalFile, "utf8"));
    const newQuestions = (Array.isArray(newParsed) ? newParsed[0] : newParsed).questions;
    const lookup = new Map();

    newQuestions.forEach((question) => {
      const ids = [question.id, ...(question.legacyPrimaryIds || [])].map(String);
      ids.forEach((id) => {
        assert.equal(lookup.has(id), false, `${relative}: final primary ID collision for ${id}`);
        lookup.set(id, String(question.id));
      });
    });

    oldQuestions.forEach((question) => {
      const stableId = String(question.id);
      oldQuestionCount += 1;
      if (retired.has(stableId)) {
        retiredQuestionCount += 1;
        return;
      }

      const primaryIds = [stableId, ...(question.legacyPrimaryIds || []).map(String)];
      const mapped = primaryIds.map((id) => lookup.get(id));
      assert.equal(
        mapped.every(Boolean),
        true,
        `${relative}: historical question ${stableId} no longer resolves (${primaryIds.filter((_, i) => !mapped[i]).join(", ")})`,
      );
      assert.equal(
        new Set(mapped).size,
        1,
        `${relative}: historical IDs for ${stableId} resolve to different questions`,
      );
      if (mapped[0] !== stableId) mergedQuestionCount += 1;
    });

    finalQuestionCount += newQuestions.length;
}

assert.equal(oldQuestionCount, inventory.historicalQuestionCount);
assert.equal(oldQuestionCount, finalQuestionCount + mergedQuestionCount + retiredQuestionCount);
console.log(
  `Question-ID migration passed: ${oldQuestionCount} historical questions -> ` +
    `${finalQuestionCount} current, ${mergedQuestionCount} merged, ${retiredQuestionCount} retired.`,
);
