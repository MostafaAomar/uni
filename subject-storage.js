(function () {
  "use strict";

  const DATABASE_NAME = "uniquiz-offline-content";
  const DATABASE_VERSION = 1;
  const SUBJECT_STORE = "subjects";
  const META_STORE = "meta";
  const FALLBACK_SUBJECT_PREFIX = "uniquiz_subject_record_v1:";
  const FALLBACK_META_PREFIX = "uniquiz_subject_meta_v1:";

  let databasePromise = null;
  let useLocalStorageFallback = !("indexedDB" in window);

  function requestResult(request) {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("IndexedDB request failed."));
    });
  }

  function transactionComplete(transaction) {
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error || new Error("IndexedDB transaction failed."));
      transaction.onabort = () => reject(transaction.error || new Error("IndexedDB transaction was cancelled."));
    });
  }

  function openDatabase() {
    if (useLocalStorageFallback) return Promise.resolve(null);
    if (databasePromise) return databasePromise;

    databasePromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
      request.onupgradeneeded = () => {
        const database = request.result;
        if (!database.objectStoreNames.contains(SUBJECT_STORE)) {
          const subjects = database.createObjectStore(SUBJECT_STORE, { keyPath: "id" });
          subjects.createIndex("year", "year", { unique: false });
        }
        if (!database.objectStoreNames.contains(META_STORE)) {
          database.createObjectStore(META_STORE, { keyPath: "key" });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("Could not open offline storage."));
      request.onblocked = () => reject(new Error("Offline storage is blocked by another open tab."));
    }).catch((error) => {
      console.warn("IndexedDB is unavailable; using the limited local fallback.", error);
      useLocalStorageFallback = true;
      databasePromise = null;
      return null;
    });

    return databasePromise;
  }

  function startTransaction(database, storeName, mode) {
    try {
      return database.transaction(storeName, mode);
    } catch (err) {
      if (err && err.name === 'InvalidStateError') {
        console.warn('IndexedDB connection closing; falling back to localStorage.', err);
        useLocalStorageFallback = true;
        databasePromise = null;
        return null;
      }
      throw err;
    }
  }

  function fallbackSubjectKey(id) {
    return `${FALLBACK_SUBJECT_PREFIX}${encodeURIComponent(id)}`;
  }

  function fallbackMetaKey(key) {
    return `${FALLBACK_META_PREFIX}${encodeURIComponent(key)}`;
  }

  async function init() {
    await openDatabase();
  }

  async function getAllSubjects() {
    const database = await openDatabase();
    if (!database) {
      const records = [];
      for (let index = 0; index < localStorage.length; index++) {
        const key = localStorage.key(index);
        if (!key?.startsWith(FALLBACK_SUBJECT_PREFIX)) continue;
        try {
          const record = JSON.parse(localStorage.getItem(key) || "null");
          if (record?.id) records.push(record);
        } catch (error) {
          console.warn("Skipped an invalid fallback subject record.", error);
        }
      }
      return records;
    }

    const transaction = startTransaction(database, SUBJECT_STORE, "readonly");
    if (!transaction) {
      const records = [];
      for (let index = 0; index < localStorage.length; index++) {
        const key = localStorage.key(index);
        if (!key?.startsWith(FALLBACK_SUBJECT_PREFIX)) continue;
        try {
          const record = JSON.parse(localStorage.getItem(key) || "null");
          if (record?.id) records.push(record);
        } catch (error) {
          console.warn("Skipped an invalid fallback subject record.", error);
        }
      }
      return records;
    }
    return requestResult(transaction.objectStore(SUBJECT_STORE).getAll());
  }

  async function getSubject(id) {
    const database = await openDatabase();
    if (!database) {
      try {
        return JSON.parse(localStorage.getItem(fallbackSubjectKey(id)) || "null");
      } catch (error) {
        return null;
      }
    }
    const transaction = startTransaction(database, SUBJECT_STORE, "readonly");
    if (!transaction) {
      try {
        return JSON.parse(localStorage.getItem(fallbackSubjectKey(id)) || "null");
      } catch (error) {
        return null;
      }
    }
    return requestResult(transaction.objectStore(SUBJECT_STORE).get(id));
  }

  async function putSubject(record) {
    if (!record?.id || !record?.year || !Array.isArray(record.questions)) {
      throw new Error("The offline subject record is invalid.");
    }
    const database = await openDatabase();
    if (!database) {
      localStorage.setItem(fallbackSubjectKey(record.id), JSON.stringify(record));
      return record;
    }
    const transaction = startTransaction(database, SUBJECT_STORE, "readwrite");
    if (!transaction) {
      // Fallback to localStorage when the DB connection is not usable.
      localStorage.setItem(fallbackSubjectKey(record.id), JSON.stringify(record));
      return record;
    }
    transaction.objectStore(SUBJECT_STORE).put(record);
    await transactionComplete(transaction);
    return record;
  }

  async function removeSubject(id) {
    const database = await openDatabase();
    if (!database) {
      localStorage.removeItem(fallbackSubjectKey(id));
      return;
    }
    const transaction = startTransaction(database, SUBJECT_STORE, "readwrite");
    if (!transaction) {
      localStorage.removeItem(fallbackSubjectKey(id));
      return;
    }
    transaction.objectStore(SUBJECT_STORE).delete(id);
    await transactionComplete(transaction);
  }

  async function clearSubjects() {
    const database = await openDatabase();
    if (!database) {
      const keys = [];
      for (let index = 0; index < localStorage.length; index++) {
        const key = localStorage.key(index);
        if (key?.startsWith(FALLBACK_SUBJECT_PREFIX)) keys.push(key);
      }
      keys.forEach((key) => localStorage.removeItem(key));
      return;
    }
    const transaction = startTransaction(database, SUBJECT_STORE, "readwrite");
    if (!transaction) {
      const keys = [];
      for (let index = 0; index < localStorage.length; index++) {
        const key = localStorage.key(index);
        if (key?.startsWith(FALLBACK_SUBJECT_PREFIX)) keys.push(key);
      }
      keys.forEach((key) => localStorage.removeItem(key));
      return;
    }
    transaction.objectStore(SUBJECT_STORE).clear();
    await transactionComplete(transaction);
  }

  async function getMeta(key) {
    const database = await openDatabase();
    if (!database) {
      try {
        return JSON.parse(localStorage.getItem(fallbackMetaKey(key)) || "null")?.value ?? null;
      } catch (error) {
        return null;
      }
    }
    const transaction = startTransaction(database, META_STORE, "readonly");
    if (!transaction) {
      try {
        return JSON.parse(localStorage.getItem(fallbackMetaKey(key)) || "null")?.value ?? null;
      } catch (error) {
        return null;
      }
    }
    const record = await requestResult(transaction.objectStore(META_STORE).get(key));
    return record?.value ?? null;
  }

  async function setMeta(key, value) {
    const database = await openDatabase();
    if (!database) {
      localStorage.setItem(fallbackMetaKey(key), JSON.stringify({ key, value }));
      return;
    }
    const transaction = startTransaction(database, META_STORE, "readwrite");
    if (!transaction) {
      localStorage.setItem(fallbackMetaKey(key), JSON.stringify({ key, value }));
      return;
    }
    transaction.objectStore(META_STORE).put({ key, value });
    await transactionComplete(transaction);
  }

  async function migrateLegacyYears(years, dataKeyForYear, metaKeyForYear) {
    const hasLegacyData = years.some((year) =>
      Boolean(localStorage.getItem(dataKeyForYear(year))),
    );
    if ((await getMeta("legacy-year-storage-migrated-v1")) && !hasLegacyData)
      return 0;
    let migrated = 0;
    let failed = false;

    for (const year of years) {
      const dataKey = dataKeyForYear(year);
      const raw = localStorage.getItem(dataKey);
      if (!raw) continue;

      try {
        const subjects = JSON.parse(raw);
        const metadata = JSON.parse(localStorage.getItem(metaKeyForYear(year)) || "null");
        if (!Array.isArray(subjects)) continue;

        for (const subject of subjects) {
          if (!subject?.id || !Array.isArray(subject.questions)) continue;
          const serialised = JSON.stringify(subject);
          await putSubject({
            ...subject,
            year,
            sourceSha: metadata?.fileShas?.[subject.id] || null,
            sizeBytes: new Blob([serialised]).size,
            downloadedAt: metadata?.downloadedAt || new Date().toISOString(),
            updatedAt: metadata?.autoUpdatedAt || metadata?.downloadedAt || new Date().toISOString(),
          });
          migrated++;
        }

        localStorage.removeItem(dataKey);
        localStorage.removeItem(metaKeyForYear(year));
      } catch (error) {
        failed = true;
        console.warn(`Could not migrate the legacy ${year} download.`, error);
      }
    }

    if (!failed) {
      await setMeta("legacy-year-storage-migrated-v1", {
        migrated,
        completedAt: new Date().toISOString(),
      });
    }
    return migrated;
  }

  window.UniQuizSubjectStore = Object.freeze({
    init,
    getAllSubjects,
    getSubject,
    putSubject,
    removeSubject,
    clearSubjects,
    getMeta,
    setMeta,
    migrateLegacyYears,
  });
})();
