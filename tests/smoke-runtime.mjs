import assert from "node:assert/strict";
import { createHash, webcrypto } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

class MemoryStorage {
  #values = new Map();
  get length() {
    return this.#values.size;
  }
  key(index) {
    return [...this.#values.keys()][index] ?? null;
  }
  getItem(key) {
    return this.#values.has(String(key)) ? this.#values.get(String(key)) : null;
  }
  setItem(key, value) {
    this.#values.set(String(key), String(value));
  }
  removeItem(key) {
    this.#values.delete(String(key));
  }
  clear() {
    this.#values.clear();
  }
}

function elementStub() {
  return {
    classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    setAttribute() {},
    addEventListener() {},
    appendChild() {},
    replaceChildren() {},
    querySelector() { return null; },
    querySelectorAll() { return []; },
    closest() { return null; },
    focus() {},
    style: {},
    textContent: "",
    innerHTML: "",
  };
}

const context = {
  console,
  UNIQUIZ_TEST_MODE: true,
  crypto: webcrypto,
  TextEncoder,
  TextDecoder,
  Blob,
  URL,
  Map,
  Set,
  Date,
  JSON,
  Math,
  Array,
  Object,
  String,
  Number,
  Boolean,
  Promise,
  Error,
  localStorage: new MemoryStorage(),
  sessionStorage: new MemoryStorage(),
  navigator: { onLine: true, storage: {}, serviceWorker: null },
  location: { protocol: "https:", href: "https://example.test/", reload() {} },
  HTMLElement: class HTMLElement {},
  MutationObserver: class MutationObserver { observe() {} },
  MessageChannel: class MessageChannel {},
  confirm: () => true,
  alert() {},
  fetch: async () => { throw new Error("Network is disabled in smoke tests."); },
  setTimeout: () => 1,
  clearTimeout() {},
  setInterval: () => 1,
  clearInterval() {},
  addEventListener() {},
  removeEventListener() {},
};
context.window = context;
context.document = {
  body: elementStub(),
  documentElement: elementStub(),
  visibilityState: "visible",
  activeElement: null,
  getElementById() { return null; },
  querySelectorAll() { return []; },
  createElement: elementStub,
  addEventListener() {},
};
vm.createContext(context);

for (const file of [
  "subject-storage.js",
  "content-catalog.js",
  "app.js",
  "app-v12.js",
]) {
  const source = await readFile(path.join(projectRoot, file), "utf8");
  new vm.Script(source, { filename: file }).runInContext(context);
}

assert.equal(context.UNIQUIZ_V12_ENABLED, true);
assert.equal(typeof context.window.onload, "function");
assert.equal(typeof context.openAccountSync, "function");
assert.equal(typeof context.removeDownloadedSubject, "function");
assert.equal(typeof context.getVisibleSubjectCount, "function");

const deduplicatedProgress = vm.runInContext(
  `(() => {
    const subject = {
      id: "merged_subject",
      questions: [{
        id: "q_current",
        q: "Merged question",
        options: ["Old", "New"],
        correct: 1,
        legacyIds: [],
        legacyPrimaryIds: ["q_removed_1", "q_removed_2"]
      }]
    };
    localStorage.setItem(
      "progress_merged_subject_quiz",
      JSON.stringify({
        answers: {
          q_removed_1: { selectedIndex: 0, selectedOption: "Old", updatedAt: "2026-01-01T00:00:00.000Z" },
          q_removed_2: { selectedIndex: 1, selectedOption: "New", updatedAt: "2026-02-01T00:00:00.000Z" }
        },
        updatedAt: "2026-02-01T00:00:00.000Z"
      })
    );
    return readSubjectProgress(subject, "quiz").answers.q_current;
  })()`,
  context,
);
assert.equal(deduplicatedProgress.selectedIndex, 1);
assert.equal(deduplicatedProgress.selectedOption, "New");

const parsedCatalog = context.UniQuizCatalog.parseManifest(
  {
    version: 2,
    years: {
      "First Year": [
        {
          path: "First Year/a.json",
          subject: "A",
          sha256: "new",
          questionCount: 2,
          size: 100,
        },
      ],
    },
  },
  ["First Year"],
);
const catalogEntry = parsedCatalog.get("First Year")[0];
assert.equal(context.UniQuizCatalog.getStatus(catalogEntry, null), "download");
assert.equal(
  context.UniQuizCatalog.getStatus(catalogEntry, { sourceSha: "new" }),
  "current",
);
assert.equal(
  context.UniQuizCatalog.getStatus(catalogEntry, { sourceSha: "old" }),
  "update",
);
assert.equal(
  context.UniQuizCatalog.getStatus(catalogEntry, { sourceSha: "" }),
  "update",
);

await context.UniQuizSubjectStore.putSubject({
  id: "First Year/test.json",
  year: "First Year",
  subject: "Test",
  questions: [{ id: "q_test", q: "Q", options: ["A", "B"], correct: 0 }],
});
assert.equal(
  (await context.UniQuizSubjectStore.getSubject("First Year/test.json")).subject,
  "Test",
);
assert.equal((await context.UniQuizSubjectStore.getAllSubjects()).length, 1);
await context.UniQuizSubjectStore.removeSubject("First Year/test.json");
assert.equal(await context.UniQuizSubjectStore.getSubject("First Year/test.json"), null);

const mergedSync = vm.runInContext(
  `mergeCloudCollections(
    {
      vocabulary: [], notes: [],
      progress: [{ key: "progress_subject_quiz", value: "local", updatedAt: "2026-01-02T00:00:00.000Z" }],
      deleted: { vocabulary: {}, notes: {}, progress: {} }
    },
    {
      vocabulary: [], notes: [],
      progress: [{ key: "progress_subject_quiz", value: "remote", updatedAt: "2026-01-01T00:00:00.000Z" }],
      deleted: { vocabulary: {}, notes: {}, progress: {} }
    }
  )`,
  context,
);
assert.equal(mergedSync.progress[0].value, "local");

const perQuestionMerge = vm.runInContext(
  `mergeCloudCollections(
    {
      vocabulary: [], notes: [],
      progress: [{
        key: "progress_subject_quiz",
        updatedAt: "2026-01-03T00:00:00.000Z",
        value: JSON.stringify({
          schemaVersion: 3,
          updatedAt: "2026-01-03T00:00:00.000Z",
          answers: {
            q_local: { selectedIndex: 1, updatedAt: "2026-01-03T00:00:00.000Z" }
          }
        })
      }],
      deleted: { vocabulary: {}, notes: {}, progress: {} }
    },
    {
      vocabulary: [], notes: [],
      progress: [{
        key: "progress_subject_quiz",
        updatedAt: "2026-01-02T00:00:00.000Z",
        value: JSON.stringify({
          schemaVersion: 3,
          updatedAt: "2026-01-02T00:00:00.000Z",
          answers: {
            q_remote: { selectedIndex: 0, updatedAt: "2026-01-02T00:00:00.000Z" }
          }
        })
      }],
      deleted: { vocabulary: {}, notes: {}, progress: {} }
    }
  )`,
  context,
);
const perQuestionPayload = JSON.parse(perQuestionMerge.progress[0].value);
assert.equal(perQuestionPayload.answers.q_local.selectedIndex, 1);
assert.equal(perQuestionPayload.answers.q_remote.selectedIndex, 0);

const resetMerge = vm.runInContext(
  `mergeCloudCollections(
    {
      vocabulary: [], notes: [],
      progress: [{
        key: "progress_subject_quiz",
        updatedAt: "2026-01-04T00:00:00.000Z",
        value: JSON.stringify({
          schemaVersion: 3,
          updatedAt: "2026-01-04T00:00:00.000Z",
          resetAt: "2026-01-04T00:00:00.000Z",
          answers: {}
        })
      }],
      deleted: { vocabulary: {}, notes: {}, progress: {} }
    },
    {
      vocabulary: [], notes: [],
      progress: [{
        key: "progress_subject_quiz",
        updatedAt: "2026-01-02T00:00:00.000Z",
        value: JSON.stringify({
          schemaVersion: 3,
          updatedAt: "2026-01-02T00:00:00.000Z",
          answers: {
            q_old: { selectedIndex: 0, updatedAt: "2026-01-02T00:00:00.000Z" }
          }
        })
      }],
      deleted: { vocabulary: {}, notes: {}, progress: {} }
    }
  )`,
  context,
);
assert.deepEqual(Object.keys(JSON.parse(resetMerge.progress[0].value).answers), []);

const restartedAfterFullReset = vm.runInContext(
  `(() => {
    localStorage.clear();
    const subject = {
      id: "subject_after_full_reset",
      questions: [{ id: "q_old", q: "Q", options: ["A", "B"], correct: 0 }]
    };
    setSubjectSourceQuestions(subject, subject.questions);
    localStorage.setItem(
      CLOUD_TOMBSTONES_KEY,
      JSON.stringify({
        vocabulary: {}, notes: {},
        progress: {
          progress_subject_after_full_reset_quiz: "2026-04-01T00:00:00.000Z"
        }
      })
    );
    return writeSubjectProgress(
      subject,
      "quiz",
      {
        answers: {},
        lastQuestionId: "q_old",
        index: 0,
        questionOrder: ["q_old"]
      },
      { now: "2026-05-01T00:00:00.000Z", updatedAt: "2026-05-01T00:00:00.000Z" }
    );
  })()`,
  context,
);
assert.equal(restartedAfterFullReset.resetAt, "2026-04-01T00:00:00.000Z");

const fullResetBoundaryMerge = vm.runInContext(
  `mergeCloudCollections(
    {
      vocabulary: [], notes: [],
      progress: [{
        key: "progress_subject_after_full_reset_quiz",
        updatedAt: "2026-05-01T00:00:00.000Z",
        value: ${JSON.stringify(JSON.stringify(restartedAfterFullReset))}
      }],
      deleted: {
        vocabulary: {}, notes: {},
        progress: {
          progress_subject_after_full_reset_quiz: "2026-04-01T00:00:00.000Z"
        }
      }
    },
    {
      vocabulary: [], notes: [],
      progress: [{
        key: "progress_subject_after_full_reset_quiz",
        updatedAt: "2026-03-01T00:00:00.000Z",
        value: JSON.stringify({
          schemaVersion: 3,
          updatedAt: "2026-03-01T00:00:00.000Z",
          answers: {
            q_old: { selectedIndex: 0, updatedAt: "2026-03-01T00:00:00.000Z" }
          }
        })
      }],
      deleted: { vocabulary: {}, notes: {}, progress: {} }
    }
  )`,
  context,
);
assert.deepEqual(
  Object.keys(JSON.parse(fullResetBoundaryMerge.progress[0].value).answers),
  [],
);

const upgradedProgress = vm.runInContext(
  `(() => {
    const subject = {
      id: "subject_timestamp_test",
      questions: [{ id: "q1", q: "Q", options: ["A", "B"], correct: 0 }]
    };
    setSubjectSourceQuestions(subject, subject.questions);
    localStorage.setItem(
      "progress_subject_timestamp_test_quiz",
      JSON.stringify({
        schemaVersion: 2,
        updatedAt: "2025-05-01T00:00:00.000Z",
        lastQuestionId: "q1",
        index: 0,
        answers: { q1: { selectedIndex: 0, selectedOption: "A" } },
        questionOrder: ["q1"]
      })
    );
    upgradeStoredProgress(subject, "quiz");
    return JSON.parse(localStorage.getItem("progress_subject_timestamp_test_quiz"));
  })()`,
  context,
);
assert.equal(upgradedProgress.schemaVersion, 3);
assert.equal(upgradedProgress.updatedAt, "2025-05-01T00:00:00.000Z");
assert.equal(
  upgradedProgress.answers.q1.updatedAt,
  "2025-05-01T00:00:00.000Z",
);

const upgradedUntimestampedProgress = vm.runInContext(
  `(() => {
    const subject = {
      id: "subject_untimestamped_test",
      questions: [{ id: "q1", q: "Q", options: ["A", "B"], correct: 0 }]
    };
    setSubjectSourceQuestions(subject, subject.questions);
    localStorage.setItem(
      "progress_subject_untimestamped_test_quiz",
      JSON.stringify({
        schemaVersion: 1,
        lastQuestionId: "q1",
        index: 0,
        answers: [0]
      })
    );
    upgradeStoredProgress(subject, "quiz");
    return JSON.parse(localStorage.getItem("progress_subject_untimestamped_test_quiz"));
  })()`,
  context,
);
assert.equal(
  upgradedUntimestampedProgress.updatedAt,
  "1970-01-01T00:00:00.000Z",
);
assert.equal(
  upgradedUntimestampedProgress.answers.q1.updatedAt,
  "1970-01-01T00:00:00.000Z",
);

const aliasMigration = vm.runInContext(
  `(() => {
    localStorage.clear();
    const subject = {
      id: "alias_subject",
      questions: [
        {
          id: "canonical_generic",
          _primaryProgressAliases: [],
          _progressAliases: ["shared_alias"]
        },
        {
          id: "canonical_primary",
          _primaryProgressAliases: ["shared_alias"],
          _progressAliases: ["shared_alias"]
        }
      ]
    };
    localStorage.setItem("note_alias_subject_shared_alias", "newer legacy note");
    localStorage.setItem("note_alias_subject_canonical_primary", "older canonical note");
    localStorage.setItem(
      CLOUD_NOTE_TIMESTAMPS_KEY,
      JSON.stringify({
        note_alias_subject_shared_alias: "2026-06-02T00:00:00.000Z",
        note_alias_subject_canonical_primary: "2026-06-01T00:00:00.000Z"
      })
    );
    __UNIQUIZ_V12_TEST_HOOKS__.migrateNoteAliases(subject);
    const generationAfterFirstMigration =
      __UNIQUIZ_V12_TEST_HOOKS__.getMutationGeneration();
    __UNIQUIZ_V12_TEST_HOOKS__.migrateNoteAliases(subject);
    const generationAfterSecondMigration =
      __UNIQUIZ_V12_TEST_HOOKS__.getMutationGeneration();

    // Simulate another device returning the old alias with a timestamp newer
    // than the first migration tombstone. The tombstone must advance too, or
    // the same stale alias would return on every cloud sync.
    localStorage.setItem("note_alias_subject_shared_alias", "returned legacy note");
    const returnedTimestamps = JSON.parse(
      localStorage.getItem(CLOUD_NOTE_TIMESTAMPS_KEY),
    );
    returnedTimestamps.note_alias_subject_shared_alias =
      "2999-01-01T00:00:00.000Z";
    localStorage.setItem(
      CLOUD_NOTE_TIMESTAMPS_KEY,
      JSON.stringify(returnedTimestamps),
    );
    __UNIQUIZ_V12_TEST_HOOKS__.migrateNoteAliases(subject);
    const generationAfterReturnedAlias =
      __UNIQUIZ_V12_TEST_HOOKS__.getMutationGeneration();
    __UNIQUIZ_V12_TEST_HOOKS__.migrateNoteAliases(subject);
    return {
      primary: localStorage.getItem("note_alias_subject_canonical_primary"),
      generic: localStorage.getItem("note_alias_subject_canonical_generic"),
      alias: localStorage.getItem("note_alias_subject_shared_alias"),
      timestamps: JSON.parse(localStorage.getItem(CLOUD_NOTE_TIMESTAMPS_KEY)),
      deleted: JSON.parse(localStorage.getItem(CLOUD_TOMBSTONES_KEY)),
      generationAfterFirstMigration,
      generationAfterSecondMigration,
      generationAfterReturnedAlias,
      generationAfterReturnedAliasReplay:
        __UNIQUIZ_V12_TEST_HOOKS__.getMutationGeneration()
    };
  })()`,
  context,
);
assert.equal(aliasMigration.primary, "returned legacy note");
assert.equal(aliasMigration.generic, null);
assert.equal(aliasMigration.alias, null);
assert.equal(
  aliasMigration.timestamps.note_alias_subject_canonical_primary,
  "2999-01-01T00:00:00.000Z",
);
assert.equal(
  aliasMigration.deleted.notes.note_alias_subject_shared_alias.migratedTo,
  "note_alias_subject_canonical_primary",
);
assert.equal(
  aliasMigration.generationAfterSecondMigration,
  aliasMigration.generationAfterFirstMigration,
);
assert.ok(
  Date.parse(
    aliasMigration.deleted.notes.note_alias_subject_shared_alias.deletedAt,
  ) >= Date.parse("2999-01-01T00:00:00.000Z"),
);
assert.equal(
  aliasMigration.generationAfterReturnedAliasReplay,
  aliasMigration.generationAfterReturnedAlias,
);

const aliasTombstoneMigration = vm.runInContext(
  `(() => {
    localStorage.clear();
    const subject = {
      id: "alias_deleted_subject",
      questions: [{
        id: "canonical",
        _primaryProgressAliases: ["legacy"],
        _progressAliases: ["legacy"]
      }]
    };
    localStorage.setItem("note_alias_deleted_subject_canonical", "note to delete");
    localStorage.setItem(
      CLOUD_NOTE_TIMESTAMPS_KEY,
      JSON.stringify({
        note_alias_deleted_subject_canonical: "2026-06-01T00:00:00.000Z"
      })
    );
    localStorage.setItem(
      CLOUD_TOMBSTONES_KEY,
      JSON.stringify({
        vocabulary: {},
        notes: { note_alias_deleted_subject_legacy: "2026-06-02T00:00:00.000Z" },
        progress: {}
      })
    );
    __UNIQUIZ_V12_TEST_HOOKS__.migrateNoteAliases(subject);
    return {
      canonical: localStorage.getItem("note_alias_deleted_subject_canonical"),
      timestamps: JSON.parse(localStorage.getItem(CLOUD_NOTE_TIMESTAMPS_KEY)),
      deleted: JSON.parse(localStorage.getItem(CLOUD_TOMBSTONES_KEY))
    };
  })()`,
  context,
);
assert.equal(aliasTombstoneMigration.canonical, null);
assert.equal(
  aliasTombstoneMigration.timestamps.note_alias_deleted_subject_canonical,
  undefined,
);
assert.equal(
  aliasTombstoneMigration.deleted.notes.note_alias_deleted_subject_canonical,
  "2026-06-02T00:00:00.000Z",
);

context.confirm = () => false;
vm.runInContext(
  `(() => {
    localStorage.clear();
    localStorage.setItem("note_guest_subject_q1", "guest note");
    localStorage.setItem(
      CLOUD_NOTE_TIMESTAMPS_KEY,
      JSON.stringify({ note_guest_subject_q1: "2026-02-01T00:00:00.000Z" })
    );
    __UNIQUIZ_V12_TEST_HOOKS__.setCloudSnapshot(collectLocalCloudData());
  })()`,
  context,
);
await context.__UNIQUIZ_V12_TEST_HOOKS__.switchLocalProfile(
  "00000000-0000-4000-8000-000000000001",
);
const guestIsolation = vm.runInContext(
  `(() => {
    const captured = captureCloudDeletions();
    return {
      owner: localStorage.getItem("uniquiz_sync_owner_v2"),
      guestProfile: localStorage.getItem("uniquiz_sync_profile_v2:guest"),
      noteDeletion: captured.deleted.notes.note_guest_subject_q1 || null
    };
  })()`,
  context,
);
assert.equal(
  guestIsolation.owner,
  "00000000-0000-4000-8000-000000000001",
);
assert.ok(guestIsolation.guestProfile);
assert.equal(guestIsolation.noteDeletion, null);

const manifest = JSON.parse(
  await readFile(path.join(projectRoot, "content-manifest.json"), "utf8"),
);
assert.equal(manifest.version, 2);
let subjectCount = 0;
let questionCount = 0;
let legacyAliasCount = 0;
let primaryLegacyAliasCount = 0;
for (const entries of Object.values(manifest.years)) {
  for (const entry of entries) {
    const bytes = await readFile(path.join(projectRoot, entry.path));
    assert.equal(createHash("sha256").update(bytes).digest("hex"), entry.sha256);
    assert.equal(bytes.byteLength, entry.size);
    const parsed = JSON.parse(bytes.toString("utf8"));
    const data = Array.isArray(parsed) ? parsed[0] : parsed;
    assert.equal(data.questions.length, entry.questionCount);
    const ids = data.questions.map((question) => String(question.id || ""));
    assert.equal(ids.every(Boolean), true);
    assert.equal(new Set(ids).size, ids.length);
    data.questions.forEach((question) => {
      assert.equal(Array.isArray(question.legacyIds), true);
      assert.equal(question.legacyIds.includes(String(question.id)), false);
      assert.equal(Array.isArray(question.legacyPrimaryIds), true);
      legacyAliasCount += question.legacyIds.length;
      primaryLegacyAliasCount += question.legacyPrimaryIds.length;
    });
    const preparedQuestions = context.ensureStableQuestionIds(data.questions);
    const legacyLookup = context.buildQuestionLookup(preparedQuestions);
    preparedQuestions.forEach((question) => {
      question.legacyPrimaryIds.forEach((legacyId) => {
        assert.equal(
          legacyLookup.get(String(legacyId)),
          question.id,
          `${entry.path}: primary legacy ID ${legacyId} mapped to the wrong question`,
        );
      });
    });
    subjectCount++;
    questionCount += ids.length;
  }
}
assert.equal(subjectCount, 20);
assert.equal(questionCount, 3293);
assert.equal(legacyAliasCount, 8849);
assert.equal(primaryLegacyAliasCount, 4733);

console.log("Smoke tests passed: runtime loaded, button states verified, 20 subjects, 3293 reviewed questions and historical ID mappings validated.");
