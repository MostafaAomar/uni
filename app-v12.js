(function () {
  "use strict";

  // This compatibility layer replaces the old year-wide downloader while
  // preserving the existing quiz, study, vocabulary and note screens.
  window.UNIQUIZ_V12_ENABLED = true;

  const v12Store = window.UniQuizSubjectStore;
  const v12CatalogApi = window.UniQuizCatalog;
  const V12_SYNC_OWNER_KEY = "uniquiz_sync_owner_v2";
  const V12_SYNC_PROFILE_PREFIX = "uniquiz_sync_profile_v2:";
  const V12_GUEST_PROFILE_KEY = `${V12_SYNC_PROFILE_PREFIX}guest`;
  const V12_SYNC_DIRTY_KEY = "uniquiz_sync_dirty_v2";
  const V12_SYNC_SCHEMA_VERSION = 3;
  const V12_APP_VERSION = "13";
  const V12_LEGACY_TIMESTAMP = "1970-01-01T00:00:00.000Z";
  const V12_YEAR_LABELS = {
    "First Year": "السنة الأولى",
    "Second Year": "السنة الثانية",
    "Third Year": "السنة الثالثة",
    "Fourth Year": "السنة الرابعة",
  };

  let v12InstalledSubjects = new Map();
  let v12CatalogByYear = new Map(VALID_YEARS.map((year) => [year, []]));
  let v12CatalogSource = "empty";
  let v12PendingSubjectId = null;
  let v12SyncQueued = false;
  let v12ModalReturnFocus = null;
  let v12MutationGeneration = 0;
  let v12ProfileEpoch = 0;
  let v12ProfileSwitchQueue = Promise.resolve();

  function v12Now() {
    return new Date().toISOString();
  }

  function v12InstalledForYear(year) {
    return [...v12InstalledSubjects.values()]
      .filter((subject) => subject.year === year)
      .sort((a, b) => String(a.subject).localeCompare(String(b.subject), "ar"));
  }

  function v12MigrateNoteAliases(subject) {
    const timestamps = getCloudNoteTimestamps();
    const deleted = getCloudTombstones();
    const aliasOwners = new Map();
    const questions = subject.questions || [];
    const claimAlias = (alias, canonicalId) => {
      if (alias === undefined || alias === null || canonicalId === undefined) {
        return;
      }
      const aliasId = String(alias);
      if (!aliasId || aliasOwners.has(aliasId)) return;
      aliasOwners.set(aliasId, String(canonicalId));
    };

    // Reserve every canonical ID first, then prefer aliases imported from the
    // immediately previous release over heuristic aliases. An alias is claimed
    // once globally so a text collision cannot move a note to another question.
    questions.forEach((question) => claimAlias(question.id, question.id));
    questions.forEach((question) => {
      (question._primaryProgressAliases || []).forEach((alias) =>
        claimAlias(alias, question.id),
      );
    });
    questions.forEach((question) => {
      (question._progressAliases || []).forEach((alias) =>
        claimAlias(alias, question.id),
      );
    });

    let changed = false;
    aliasOwners.forEach((canonicalId, alias) => {
      if (alias === canonicalId) return;
      let aliasChanged = false;
      const canonicalKey = `note_${subject.id}_${canonicalId}`;
      const aliasKey = `note_${subject.id}_${alias}`;
      const legacyValue = localStorage.getItem(aliasKey);
      const legacyTimestamp = timestamps[aliasKey];
      const legacyDeletion = deleted.notes?.[aliasKey];
      const isMigrationDeletion =
        legacyDeletion &&
        typeof legacyDeletion === "object" &&
        typeof legacyDeletion.migratedTo === "string";
      const isThisMigrationDeletion =
        isMigrationDeletion && legacyDeletion.migratedTo === canonicalKey;
      const canonicalValue = localStorage.getItem(canonicalKey);
      const canonicalTimestamp =
        timestamps[canonicalKey] || V12_LEGACY_TIMESTAMP;
      const effectiveLegacyTimestamp =
        legacyTimestamp || V12_LEGACY_TIMESTAMP;
      if (
        legacyValue &&
        (!canonicalValue ||
          cloudTimestamp(effectiveLegacyTimestamp) >
            cloudTimestamp(canonicalTimestamp))
      ) {
        localStorage.setItem(canonicalKey, legacyValue);
        timestamps[canonicalKey] = effectiveLegacyTimestamp;
        aliasChanged = true;
      }
      if (
        legacyDeletion &&
        !isMigrationDeletion &&
        cloudTimestamp(legacyDeletion) >=
          cloudTimestamp(deleted.notes[canonicalKey])
      ) {
        deleted.notes[canonicalKey] = legacyDeletion;
        aliasChanged = true;
      }
      const canonicalDeletion = deleted.notes[canonicalKey];
      const survivingCanonicalValue = localStorage.getItem(canonicalKey);
      const survivingCanonicalTimestamp =
        timestamps[canonicalKey] || V12_LEGACY_TIMESTAMP;
      if (
        canonicalDeletion &&
        survivingCanonicalValue &&
        cloudTimestamp(canonicalDeletion) >=
          cloudTimestamp(survivingCanonicalTimestamp)
      ) {
        localStorage.removeItem(canonicalKey);
        delete timestamps[canonicalKey];
        aliasChanged = true;
      }
      if (legacyValue) {
        localStorage.removeItem(aliasKey);
        aliasChanged = true;
      }
      if (legacyTimestamp) {
        delete timestamps[aliasKey];
        aliasChanged = true;
      }
      if (
        legacyValue ||
        legacyTimestamp ||
        (legacyDeletion && !isThisMigrationDeletion)
      ) {
        deleted.notes[aliasKey] = {
          deletedAt: new Date(
            Math.max(
              Date.now(),
              cloudTimestamp(legacyTimestamp),
              cloudTimestamp(legacyDeletion),
            ),
          ).toISOString(),
          migratedTo: canonicalKey,
        };
        aliasChanged = true;
      }
      changed = changed || aliasChanged;
    });
    if (changed) {
      localStorage.setItem(CLOUD_NOTE_TIMESTAMPS_KEY, JSON.stringify(timestamps));
      localStorage.setItem(CLOUD_TOMBSTONES_KEY, JSON.stringify(deleted));
      v12MarkLocalMutation();
    }
  }

  function v12PrepareStoredSubject(subject) {
    if (!subject?.id || !Array.isArray(subject.questions)) return null;
    setSubjectSourceQuestions(subject, subject.questions);
    v12MigrateNoteAliases(subject);
    ["study", "quiz"].forEach((savedMode) =>
      upgradeStoredProgress(subject, savedMode),
    );
    return subject;
  }

  async function v12LoadInstalledSubjects() {
    v12InstalledSubjects = new Map();
    const records = await v12Store.getAllSubjects();
    records.forEach((record) => {
      const prepared = v12PrepareStoredSubject(record);
      if (prepared) v12InstalledSubjects.set(prepared.id, prepared);
    });
    globalSearchSourcesCache = null;
  }

  function v12CatalogEntries(year) {
    const remote = [...(v12CatalogByYear.get(year) || [])];
    const knownIds = new Set(remote.map((entry) => entry.id));
    v12InstalledForYear(year).forEach((subject) => {
      if (knownIds.has(subject.id)) return;
      remote.push({
        id: subject.id,
        path: subject.id,
        year,
        subject: subject.subject,
        description: subject.description || "",
        lang: subject.lang || "en",
        questionCount: subject.questions.length,
        size: subject.sizeBytes || 0,
        sha: null,
        downloadUrl: null,
        unavailable: true,
      });
    });
    return remote.sort((a, b) =>
      String(a.subject).localeCompare(String(b.subject), "ar"),
    );
  }

  function v12FindCatalogEntry(subjectId) {
    for (const year of VALID_YEARS) {
      const entry = v12CatalogEntries(year).find((item) => item.id === subjectId);
      if (entry) return entry;
    }
    return null;
  }

  function v12SubjectStatus(entry) {
    return v12CatalogApi.getStatus(entry, v12InstalledSubjects.get(entry.id));
  }

  function v12UpdateCount(year) {
    return v12CatalogEntries(year).filter(
      (entry) => v12SubjectStatus(entry) === "update",
    ).length;
  }

  async function v12RefreshCatalog(force = false, announce = false) {
    const result = await v12CatalogApi.load({
      url: CONTENT_MANIFEST_URL,
      validYears: VALID_YEARS,
      force,
      store: v12Store,
    });
    v12CatalogByYear = result.catalog;
    v12CatalogSource = result.source;

    const updateCount = VALID_YEARS.reduce(
      (total, year) => total + v12UpdateCount(year),
      0,
    );
    if (announce && updateCount > 0) {
      showAutomaticUpdateNotice(
        updateCount === 1
          ? "يوجد تحديث لمادة محمّلة. لم تُنزّل الأسئلة؛ اضغط تحديث عندما يناسبك."
          : `توجد تحديثات لـ ${updateCount} مواد محمّلة. لم تُنزّل الأسئلة بعد.`,
        "success",
      );
    }

    renderDynamicYears();
    if (activeYear) renderSubjectListWithSync(activeYear);
    return result;
  }

  readDownloadedYear = function (yearName) {
    return v12InstalledForYear(yearName);
  };

  getDownloadedYearMeta = function (yearName) {
    const subjects = v12InstalledForYear(yearName);
    if (subjects.length === 0) return null;
    return {
      subjectCount: subjects.length,
      questionCount: subjects.reduce(
        (total, subject) => total + subject.questions.length,
        0,
      ),
      sizeBytes: subjects.reduce(
        (total, subject) => total + (Number(subject.sizeBytes) || 0),
        0,
      ),
    };
  };

  restoreLastDownloadedSession = function () {
    const savedPosition = localStorage.getItem("app_last_position");
    if (!savedPosition) return false;
    try {
      const position = JSON.parse(savedPosition);
      const foundSubject = v12InstalledSubjects.get(position.subjectId);
      if (!foundSubject) return false;
      activeYear = foundSubject.year;
      quizData = v12InstalledForYear(activeYear);
      currentSubject = foundSubject;
      mode = position.mode === "study" ? "study" : "quiz";
      restoreCurrentSubjectProgress(position.lastQuestionId);
      renderStep();
      return true;
    } catch (error) {
      console.warn("Could not restore the last offline session.", error);
      return false;
    }
  };

  registerOfflineWorker = function () {
    if (!("serviceWorker" in navigator) || location.protocol === "file:") return;
    navigator.serviceWorker
      .register(`./service-worker.js?v=${V12_APP_VERSION}`, {
        updateViaCache: "none",
      })
      .catch((error) => console.warn("Offline worker registration failed.", error));
  };

  bindConnectionStatus = function () {
    const update = () => {
      const status = document.getElementById("connection-status");
      if (!status) return;
      status.textContent = navigator.onLine
        ? "متصل — يمكنك فحص الفهرس وتنزيل المادة التي تحتاجها فقط"
        : "وضع عدم الاتصال — المواد المحمّلة متاحة بالكامل";
      status.classList.toggle("is-offline", !navigator.onLine);
    };
    window.addEventListener("online", async () => {
      update();
      await v12RefreshCatalog(true, true);
      scheduleVocabularyCloudSync();
    });
    window.addEventListener("offline", () => {
      update();
      renderDynamicYears();
      if (activeYear) renderSubjectListWithSync(activeYear);
    });
    update();
  };

  init = async function () {
    loadThemePreference();
    showWelcomeMessage();
    registerOfflineWorker();
    bindConnectionStatus();

    if (!v12Store || !v12CatalogApi) {
      throw new Error("تعذر تحميل وحدات التخزين وفهرس المواد.");
    }

    await v12Store.init();
    await v12Store.migrateLegacyYears(
      VALID_YEARS,
      getYearDataKey,
      getYearMetaKey,
    );
    await v12LoadInstalledSubjects();
    await v12RefreshCatalog(false, true);

    if (navigator.storage?.persist) {
      navigator.storage.persist().catch(() => false);
    }

    if (restoreLastDownloadedSession()) return;
    showScreen("setup");
  };

  renderDynamicYears = function () {
    const yearsContainer = document.getElementById("years-container");
    if (!yearsContainer) return;
    globalSearchSourcesCache = null;
    yearsContainer.innerHTML = "";

    VALID_YEARS.forEach((yearName) => {
      const entries = v12CatalogEntries(yearName);
      const installed = v12InstalledForYear(yearName);
      const updateCount = v12UpdateCount(yearName);
      const card = document.createElement("div");
      card.className = `subject-btn year-btn offline-year-card${
        installed.length ? " downloaded-year" : ""
      }${updateCount ? " has-new-subjects" : ""}${
        activeYear === yearName ? " active-year" : ""
      }`;
      card.dir = "rtl";

      const catalogSummary = entries.length
        ? `${entries.length} مادة · ${installed.length} محمّلة`
        : `${installed.length} مادة محمّلة متاحة دون اتصال`;
      card.innerHTML = `
        <div class="year-card-main">
          <strong>${escapeCardHTML(V12_YEAR_LABELS[yearName] || yearName)}</strong>
          <small>${escapeCardHTML(catalogSummary)}${
            updateCount
              ? `<span class="year-update-summary"> · ${updateCount} تحديث</span>`
              : ""
          }</small>
        </div>
        <div class="year-card-actions">
          <button type="button" class="year-download-btn">عرض المواد</button>
        </div>
      `;
      const openYear = () => loadYearData(yearName);
      card.addEventListener("click", (event) => {
        if (!event.target.closest("button")) openYear();
      });
      card.querySelector("button")?.addEventListener("click", openYear);
      yearsContainer.appendChild(card);
    });
  };

  function v12OpenInstalledSubject(subjectId) {
    const subject = v12InstalledSubjects.get(subjectId);
    if (!subject) return;
    activeYear = subject.year;
    quizData = v12InstalledForYear(subject.year);
    currentSubject = subject;
    const selectedName = document.getElementById("selected-subject-name");
    if (selectedName) selectedName.textContent = subject.subject;
    showScreen("mode");
  }

  function v12CreateSubjectCard(entry) {
    const installed = v12InstalledSubjects.get(entry.id);
    const status = v12SubjectStatus(entry);
    const title = installed?.subject || entry.subject;
    const description =
      installed?.description || entry.description || "مادة دراسية متاحة للتنزيل المستقل.";
    const questionCount = installed?.questions?.length || entry.questionCount || 0;
    const progress = installed
      ? getSubjectProgress(installed.id, installed.questions.length)
      : 0;
    const card = document.createElement("article");
    card.className = `subject-btn subject-library-card status-${status}`;
    card.dir = installed?.lang === "en" || entry.lang === "en" ? "ltr" : "rtl";
    if (installed) {
      card.setAttribute("role", "button");
      card.tabIndex = 0;
    }

    const stateLabel = entry.unavailable
      ? "محفوظة محلياً — لم تعد في الفهرس"
      : status === "update"
        ? "تحديث متاح"
        : status === "current"
          ? "محمّلة ومحدّثة"
          : "غير محمّلة";
    const primaryLabel = status === "update" ? "تحديث" : "تحميل";
    const canTransfer = navigator.onLine && !entry.unavailable;

    card.innerHTML = `
      <div class="subject-library-main">
        <div class="subject-library-title-row">
          <h3>${escapeCardHTML(title)}</h3>
          <span class="subject-state-badge state-${status}">${escapeCardHTML(stateLabel)}</span>
        </div>
        <p>${escapeCardHTML(description)}</p>
        <small>${questionCount ? `${questionCount} سؤال` : "عدد الأسئلة يظهر بعد التنزيل"}${
          entry.size ? ` · ${escapeCardHTML(formatStoredBytes(entry.size))}` : ""
        }</small>
        ${
          installed
            ? `<div class="subject-card-progress" dir="ltr"><div class="subject-library-progress-label"><span>${progress}%</span></div><div class="subject-library-progress-track"><span style="width:${progress}%"></span></div></div>`
            : ""
        }
      </div>
      <div class="subject-library-actions" dir="rtl">
        ${
          installed
            ? '<button type="button" class="subject-open-btn">فتح</button>'
            : ""
        }
        ${
          status === "download" || status === "update"
            ? `<button type="button" class="subject-transfer-btn ${status}" ${
                canTransfer ? "" : "disabled"
              }>${primaryLabel}</button>`
            : ""
        }
        ${
          installed
            ? '<button type="button" class="subject-remove-btn">إزالة</button>'
            : ""
        }
      </div>
    `;

    const open = () => v12OpenInstalledSubject(entry.id);
    card.querySelector(".subject-open-btn")?.addEventListener("click", open);
    card.querySelector(".subject-transfer-btn")?.addEventListener("click", () =>
      openDownloadModal(entry.id),
    );
    card.querySelector(".subject-remove-btn")?.addEventListener("click", () =>
      removeDownloadedSubject(entry.id),
    );
    if (installed) {
      card.addEventListener("click", (event) => {
        if (!event.target.closest("button")) open();
      });
      card.addEventListener("keydown", (event) => {
        if ((event.key === "Enter" || event.key === " ") && !event.target.closest("button")) {
          event.preventDefault();
          open();
        }
      });
    }
    return card;
  }

  loadYearData = async function (yearName) {
    if (!VALID_YEARS.includes(yearName)) return;
    activeYear = yearName;
    quizData = v12InstalledForYear(yearName);
    const globalSearch = document.getElementById("global-subject-search");
    if (globalSearch) globalSearch.value = "";
    renderDynamicYears();
    renderSubjectListWithSync(yearName);
    setSubjectDashboardState("year");
    showScreen("setup");
    window.scrollTo(0, 0);
  };

  renderSubjectListWithSync = function (yearName) {
    const list = document.getElementById("subject-list");
    if (!list) return;
    list.innerHTML = "";
    const header = document.createElement("div");
    header.className = "year-header";
    header.innerHTML = `
      <div>
        <h3>${escapeCardHTML(V12_YEAR_LABELS[yearName] || yearName)}</h3>
        <small>نزّل المادة التي تحتاجها فقط؛ المواد المحمّلة تعمل دون إنترنت.</small>
      </div>
      <button type="button" class="small-btn ghost-btn">العودة</button>
    `;
    header.querySelector("button")?.addEventListener("click", backToYears);
    list.appendChild(header);

    const entries = v12CatalogEntries(yearName);
    if (entries.length === 0) {
      const message = document.createElement("p");
      message.className = "subject-library-empty";
      message.textContent = navigator.onLine
        ? "لا توجد مواد في فهرس هذه السنة حالياً."
        : "لا يوجد فهرس محفوظ لهذه السنة. اتصل بالإنترنت مرة واحدة لعرض المواد.";
      list.appendChild(message);
    } else {
      entries.forEach((entry) => list.appendChild(v12CreateSubjectCard(entry)));
    }
    const count = document.getElementById("subjects-count");
    if (count) count.textContent = `${entries.length} مادة`;
  };

  backToYears = function () {
    const subjectList = document.getElementById("subject-list");
    if (subjectList) {
      subjectList.classList.add("hidden");
      subjectList.hidden = true;
      subjectList.innerHTML = "";
    }
    activeYear = null;
    quizData = [];
    const globalSearch = document.getElementById("global-subject-search");
    if (globalSearch) globalSearch.value = "";
    setSubjectDashboardState("home");
    renderDynamicYears();
    showScreen("setup");
    window.scrollTo(0, 0);
  };

  openDownloadModal = function (subjectId) {
    const entry = v12FindCatalogEntry(subjectId);
    if (!entry || entry.unavailable) return;
    const installed = v12InstalledSubjects.get(subjectId);
    const status = v12SubjectStatus(entry);
    if (installed && status !== "update") return;
    v12PendingSubjectId = subjectId;
    pendingDownloadYear = subjectId;
    const isUpdate = status === "update";
    const modal = document.getElementById("download-modal");
    const title = document.getElementById("download-modal-title");
    const target = document.getElementById("target-year");
    const confirmButton = document.getElementById("download-confirm-btn");
    v12ModalReturnFocus = document.activeElement;
    if (title) title.textContent = isUpdate ? "تحديث المادة؟" : "تحميل المادة؟";
    if (target) target.textContent = entry.subject;
    if (confirmButton) confirmButton.textContent = isUpdate ? "تحديث" : "تحميل";
    updateDownloadStatus(
      isUpdate
        ? "سيتم تنزيل هذه المادة فقط، مع الحفاظ على تقدمك وملاحظاتك."
        : `سيتم حفظ هذه المادة فقط للاستخدام دون اتصال${entry.size ? ` (${formatStoredBytes(entry.size)})` : ""}.`,
    );
    modal?.classList.remove("hidden");
    window.setTimeout(() => confirmButton?.focus(), 0);
  };

  function v12ValidateSubjectData(data, entry) {
    return {
      id: entry.id,
      year: entry.year,
      subject: String(data.subject || entry.subject).trim(),
      description: typeof data.description === "string" ? data.description.trim() : "",
      lang: data.lang || entry.lang || "en",
      questions: data.questions,
    };
  }

  async function v12Sha256(buffer) {
    if (!globalThis.crypto?.subtle) {
      throw new Error(
        "هذا المتصفح لا يدعم التحقق الآمن من الملفات. استخدم متصفحاً حديثاً عبر HTTPS.",
      );
    }
    const digest = await globalThis.crypto.subtle.digest("SHA-256", buffer);
    return [...new Uint8Array(digest)]
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  }

  async function downloadSubjectData(subjectId) {
    const entry = v12FindCatalogEntry(subjectId);
    if (!entry || entry.unavailable) return false;
    if (!navigator.onLine) {
      updateDownloadStatus("اتصل بالإنترنت لتنزيل المادة أو تحديثها.", true);
      return false;
    }

    setDownloadBusy(true);
    updateDownloadStatus("جاري تنزيل المادة والتحقق منها…");
    const previous = v12InstalledSubjects.get(subjectId);

    try {
      const response = await fetch(entry.downloadUrl, { cache: "no-store" });
      if (!response.ok) throw new Error(`تعذر تنزيل المادة (${response.status}).`);
      const bytes = await response.arrayBuffer();
      const digest = await v12Sha256(bytes);
      if (entry.sha && digest !== entry.sha) {
        throw new Error("فشل التحقق من سلامة المادة. بقيت النسخة السابقة دون تغيير.");
      }
      const content = JSON.parse(new TextDecoder().decode(bytes));
      const data = Array.isArray(content) ? content[0] : content;
      const subject = v12ValidateSubjectData(data, entry);
      setSubjectSourceQuestions(subject, subject.questions);

      if (previous) {
        ["study", "quiz"].forEach((savedMode) =>
          upgradeStoredProgress(previous, savedMode),
        );
      }
      ["study", "quiz"].forEach((savedMode) =>
        upgradeStoredProgress(subject, savedMode),
      );

      const record = {
        ...subject,
        questions: getSubjectSourceQuestions(subject),
        sourceSha: entry.sha || digest,
        sizeBytes: bytes.byteLength,
        downloadedAt: previous?.downloadedAt || v12Now(),
        updatedAt: v12Now(),
      };
      await v12Store.putSubject(record);
      v12InstalledSubjects.set(record.id, v12PrepareStoredSubject(record));
      globalSearchSourcesCache = null;
      quizData = v12InstalledForYear(entry.year);
      updateDownloadStatus(
        previous
          ? "تم تحديث المادة وحُفظ تقدمك وملاحظاتك."
          : "تم تحميل المادة وأصبحت متاحة بالكامل دون إنترنت.",
      );
      renderDynamicYears();
      if (activeYear === entry.year) renderSubjectListWithSync(entry.year);
      window.setTimeout(() => closeDownloadModal(), 700);
      return true;
    } catch (error) {
      console.error("Subject download failed.", error);
      updateDownloadStatus(error.message || "تعذر تنزيل المادة.", true);
      return false;
    } finally {
      setDownloadBusy(false);
    }
  }

  confirmYearDownload = async function () {
    if (!v12PendingSubjectId) return;
    await downloadSubjectData(v12PendingSubjectId);
  };

  closeDownloadModal = function () {
    if (downloadInProgress) return;
    document.getElementById("download-modal")?.classList.add("hidden");
    pendingDownloadYear = null;
    v12PendingSubjectId = null;
    if (v12ModalReturnFocus instanceof HTMLElement) v12ModalReturnFocus.focus();
    v12ModalReturnFocus = null;
  };

  window.removeDownloadedSubject = async function (subjectId) {
    const subject = v12InstalledSubjects.get(subjectId);
    if (!subject) return;
    if (
      !confirm(
        `هل تريد إزالة مادة «${subject.subject}» من هذا الجهاز؟ سيبقى التقدم والملاحظات محفوظين ويمكن استعادتهما بعد تنزيل المادة مجدداً.`,
      )
    ) {
      return;
    }
    await v12Store.removeSubject(subjectId);
    v12InstalledSubjects.delete(subjectId);
    globalSearchSourcesCache = null;
    quizData = v12InstalledForYear(subject.year);
    renderDynamicYears();
    if (activeYear === subject.year) renderSubjectListWithSync(subject.year);
  };

  window.getVisibleSubjectCount = function () {
    return activeYear ? v12CatalogEntries(activeYear).length : quizData.length;
  };

  window.openAccountSync = function () {
    retrieveData();
    const panel = document.getElementById("vocabulary-cloud-panel");
    panel?.classList.remove("hidden");
    refreshVocabularyCloudInterface();
    document.getElementById("vocabulary-sync-email")?.focus();
  };

  toggleSyncSettings = function () {};
  saveSyncConfig = function () {};

  // ----- Cross-device sync v2: vocabulary, notes, progress and last position. -----

  function v12SyncedStorageKeys() {
    const keys = [];
    for (let index = 0; index < localStorage.length; index++) {
      const key = localStorage.key(index);
      if (
        key === VOCABULARY_STORAGE_KEY ||
        key === "app_last_position" ||
        key?.startsWith("note_") ||
        key?.startsWith("progress_")
      ) {
        keys.push(key);
      }
    }
    return keys;
  }

  getCloudTombstones = function () {
    const stored = readJsonStorage(CLOUD_TOMBSTONES_KEY, {});
    return {
      vocabulary:
        stored?.vocabulary && typeof stored.vocabulary === "object"
          ? stored.vocabulary
          : {},
      notes: stored?.notes && typeof stored.notes === "object" ? stored.notes : {},
      progress:
        stored?.progress && typeof stored.progress === "object"
          ? stored.progress
          : {},
    };
  };

  function v12ProgressRecords() {
    const records = [];
    for (let index = 0; index < localStorage.length; index++) {
      const key = localStorage.key(index);
      if (!(key?.startsWith("progress_") || key === "app_last_position")) continue;
      const value = localStorage.getItem(key);
      if (!value) continue;
      let updatedAt = "1970-01-01T00:00:00.000Z";
      try {
        updatedAt = JSON.parse(value)?.updatedAt || updatedAt;
      } catch (error) {}
      records.push({ key, value, updatedAt });
    }
    return records;
  }

  collectLocalCloudData = function () {
    const noteTimestamps = getCloudNoteTimestamps();
    const notes = [];
    for (let index = 0; index < localStorage.length; index++) {
      const key = localStorage.key(index);
      if (!key?.startsWith("note_")) continue;
      const value = localStorage.getItem(key);
      if (!value) continue;
      notes.push({
        key,
        value,
        updatedAt: noteTimestamps[key] || "1970-01-01T00:00:00.000Z",
      });
    }
    const vocabulary = getVocabularyEntries().map((entry) => ({
      ...entry,
      updatedAt: entry.updatedAt || entry.createdAt || "1970-01-01T00:00:00.000Z",
    }));
    return {
      schemaVersion: V12_SYNC_SCHEMA_VERSION,
      vocabulary,
      notes,
      progress: v12ProgressRecords(),
      deleted: getCloudTombstones(),
    };
  };

  function v12MergeKeyedRecords(remoteItems, localItems, isValid) {
    const byKey = new Map();
    [...(remoteItems || []), ...(localItems || [])].forEach((item) => {
      if (!isValid(item)) return;
      const existing = byKey.get(item.key);
      if (!existing || cloudTimestamp(item.updatedAt) >= cloudTimestamp(existing.updatedAt)) {
        byKey.set(item.key, item);
      }
    });
    return byKey;
  }

  function v12LaterIso(first, second) {
    return cloudTimestamp(second) >= cloudTimestamp(first) ? second || first : first;
  }

  function v12ParseProgressItem(item) {
    if (!item || typeof item.value !== "string") return null;
    try {
      const payload = JSON.parse(item.value);
      return payload && typeof payload === "object" ? payload : null;
    } catch (error) {
      return null;
    }
  }

  function v12NormaliseProgressAnswer(answer, fallbackUpdatedAt) {
    if (answer === undefined || answer === null) return null;
    if (typeof answer === "object") {
      return {
        ...answer,
        updatedAt: answer.updatedAt || fallbackUpdatedAt,
      };
    }
    return { selectedIndex: answer, updatedAt: fallbackUpdatedAt };
  }

  function v12MergeProgressItems(remoteItem, localItem) {
    if (!remoteItem) return localItem;
    if (!localItem) return remoteItem;
    if (remoteItem.key === "app_last_position") {
      return cloudTimestamp(localItem.updatedAt) >= cloudTimestamp(remoteItem.updatedAt)
        ? localItem
        : remoteItem;
    }

    const remotePayload = v12ParseProgressItem(remoteItem);
    const localPayload = v12ParseProgressItem(localItem);
    if (!remotePayload || !localPayload) {
      return cloudTimestamp(localItem.updatedAt) >= cloudTimestamp(remoteItem.updatedAt)
        ? localItem
        : remoteItem;
    }

    const remoteUpdatedAt = remotePayload.updatedAt || remoteItem.updatedAt;
    const localUpdatedAt = localPayload.updatedAt || localItem.updatedAt;
    const localIsNewer =
      cloudTimestamp(localUpdatedAt) >= cloudTimestamp(remoteUpdatedAt);
    const base = localIsNewer ? localPayload : remotePayload;
    const resetAt = v12LaterIso(remotePayload.resetAt, localPayload.resetAt) || null;
    const answers = {};
    const answerIds = new Set([
      ...Object.keys(
        remotePayload.answers && !Array.isArray(remotePayload.answers)
          ? remotePayload.answers
          : {},
      ),
      ...Object.keys(
        localPayload.answers && !Array.isArray(localPayload.answers)
          ? localPayload.answers
          : {},
      ),
    ]);

    answerIds.forEach((questionId) => {
      const remoteAnswer = v12NormaliseProgressAnswer(
        remotePayload.answers?.[questionId],
        remoteUpdatedAt,
      );
      const localAnswer = v12NormaliseProgressAnswer(
        localPayload.answers?.[questionId],
        localUpdatedAt,
      );
      let selected = remoteAnswer;
      if (
        localAnswer &&
        (!selected ||
          cloudTimestamp(localAnswer.updatedAt) >=
            cloudTimestamp(selected.updatedAt))
      ) {
        selected = localAnswer;
      }
      if (
        selected &&
        (!resetAt || cloudTimestamp(selected.updatedAt) > cloudTimestamp(resetAt))
      ) {
        answers[questionId] = selected;
      }
    });

    const updatedAt = v12LaterIso(remoteUpdatedAt, localUpdatedAt) || v12Now();
    const mergedPayload = {
      ...base,
      schemaVersion: Math.max(
        Number(remotePayload.schemaVersion) || 0,
        Number(localPayload.schemaVersion) || 0,
        3,
      ),
      updatedAt,
      resetAt,
      answers,
    };
    return {
      key: localItem.key || remoteItem.key,
      value: JSON.stringify(mergedPayload),
      updatedAt,
    };
  }

  function v12MergeProgressRecords(remoteItems, localItems) {
    const byKey = new Map();
    [...(remoteItems || []), ...(localItems || [])].forEach((item) => {
      if (
        !(
          item?.key?.startsWith("progress_") ||
          item?.key === "app_last_position"
        ) ||
        typeof item.value !== "string"
      ) {
        return;
      }
      byKey.set(item.key, v12MergeProgressItems(byKey.get(item.key), item));
    });
    return byKey;
  }

  mergeCloudCollections = function (localData, remoteData) {
    const local = localData || {};
    const remote = remoteData || {};
    const deleted = {
      vocabulary: mergeTimestampMaps(
        remote.deleted?.vocabulary,
        local.deleted?.vocabulary,
      ),
      notes: mergeTimestampMaps(remote.deleted?.notes, local.deleted?.notes),
      progress: mergeTimestampMaps(
        remote.deleted?.progress,
        local.deleted?.progress,
      ),
    };

    const vocabularyById = new Map();
    [...(remote.vocabulary || []), ...(local.vocabulary || [])].forEach((entry) => {
      if (!entry?.id || typeof entry.word !== "string" || typeof entry.meaning !== "string") return;
      const existing = vocabularyById.get(entry.id);
      if (
        !existing ||
        cloudTimestamp(entry.updatedAt || entry.createdAt) >=
          cloudTimestamp(existing.updatedAt || existing.createdAt)
      ) {
        vocabularyById.set(entry.id, entry);
      }
    });
    const notesByKey = v12MergeKeyedRecords(
      remote.notes,
      local.notes,
      (note) => note?.key?.startsWith("note_") && typeof note.value === "string",
    );
    const progressByKey = v12MergeProgressRecords(
      remote.progress,
      local.progress,
    );

    const vocabulary = [...vocabularyById.values()].filter(
      (entry) =>
        cloudTimestamp(deleted.vocabulary[entry.id]) <
        cloudTimestamp(entry.updatedAt || entry.createdAt),
    );
    const notes = [...notesByKey.values()].filter(
      (note) =>
        cloudTimestamp(deleted.notes[note.key]) < cloudTimestamp(note.updatedAt),
    );
    const progress = [...progressByKey.values()].filter(
      (item) =>
        cloudTimestamp(deleted.progress[item.key]) < cloudTimestamp(item.updatedAt),
    );
    return {
      schemaVersion: V12_SYNC_SCHEMA_VERSION,
      vocabulary,
      notes,
      progress,
      deleted,
    };
  };

  cloudComparableData = function (data) {
    const prepared = data || {};
    const byKey = (items) =>
      [...(items || [])].sort((a, b) => String(a.key).localeCompare(String(b.key)));
    return JSON.stringify({
      vocabulary: [...(prepared.vocabulary || [])].sort((a, b) =>
        String(a.id).localeCompare(String(b.id)),
      ),
      notes: byKey(prepared.notes),
      progress: byKey(prepared.progress),
      deleted: prepared.deleted || { vocabulary: {}, notes: {}, progress: {} },
    });
  };

  applyCloudDataLocally = function (data) {
    localStorage.setItem(VOCABULARY_STORAGE_KEY, JSON.stringify(data.vocabulary || []));

    const incomingNotes = new Map((data.notes || []).map((note) => [note.key, note]));
    const incomingProgress = new Map(
      (data.progress || []).map((item) => [item.key, item]),
    );
    const currentKeys = v12SyncedStorageKeys();
    currentKeys.forEach((key) => {
      if (key === VOCABULARY_STORAGE_KEY) return;
      if (key.startsWith("note_") && !incomingNotes.has(key)) localStorage.removeItem(key);
      if (
        (key.startsWith("progress_") || key === "app_last_position") &&
        !incomingProgress.has(key)
      ) {
        localStorage.removeItem(key);
      }
    });

    const noteTimestamps = {};
    incomingNotes.forEach((note) => {
      localStorage.setItem(note.key, note.value);
      noteTimestamps[note.key] = note.updatedAt;
    });
    incomingProgress.forEach((item) => localStorage.setItem(item.key, item.value));
    localStorage.setItem(CLOUD_NOTE_TIMESTAMPS_KEY, JSON.stringify(noteTimestamps));
    localStorage.setItem(CLOUD_TOMBSTONES_KEY, JSON.stringify(data.deleted || {}));
    renderVocabularyTable();
    if (currentSubject && mode) {
      const quizWasVisible = Boolean(
        screens.quiz && !screens.quiz.classList.contains("hidden"),
      );
      const studyWasVisible = Boolean(
        screens.study && !screens.study.classList.contains("hidden"),
      );
      restoreCurrentSubjectProgress();
      if (quizWasVisible || studyWasVisible) renderStep();
      else displayNotes();
    }
  };

  captureCloudDeletions = function () {
    const current = collectLocalCloudData();
    if (!cloudLastKnownSnapshot) {
      cloudLastKnownSnapshot = current;
      return current;
    }
    const deleted = getCloudTombstones();
    const now = v12Now();
    const currentVocabulary = new Set(current.vocabulary.map((entry) => entry.id));
    const currentNotes = new Set(current.notes.map((note) => note.key));
    const currentProgress = new Set(current.progress.map((item) => item.key));
    (cloudLastKnownSnapshot.vocabulary || []).forEach((entry) => {
      if (!currentVocabulary.has(entry.id)) deleted.vocabulary[entry.id] ||= now;
    });
    (cloudLastKnownSnapshot.notes || []).forEach((note) => {
      if (!currentNotes.has(note.key)) deleted.notes[note.key] ||= now;
    });
    (cloudLastKnownSnapshot.progress || []).forEach((item) => {
      if (!currentProgress.has(item.key)) deleted.progress[item.key] ||= now;
    });
    localStorage.setItem(CLOUD_TOMBSTONES_KEY, JSON.stringify(deleted));
    cloudLastKnownSnapshot = collectLocalCloudData();
    return cloudLastKnownSnapshot;
  };

  function v12MarkLocalMutation() {
    v12MutationGeneration += 1;
    localStorage.setItem(V12_SYNC_DIRTY_KEY, "1");
    return v12MutationGeneration;
  }

  function v12RememberDeletion(type, key) {
    const deleted = getCloudTombstones();
    deleted[type][key] = v12Now();
    localStorage.setItem(CLOUD_TOMBSTONES_KEY, JSON.stringify(deleted));
    v12MarkLocalMutation();
  }

  function v12ProfileStorageKey(userId) {
    return `${V12_SYNC_PROFILE_PREFIX}${userId}`;
  }

  function v12SaveCurrentProfile(userId) {
    if (!userId) return true;
    try {
      localStorage.setItem(v12ProfileStorageKey(userId), JSON.stringify(collectLocalCloudData()));
      return true;
    } catch (error) {
      console.warn("Could not save the local account profile.", error);
      return false;
    }
  }

  function v12ClearSyncedData() {
    v12SyncedStorageKeys().forEach((key) => localStorage.removeItem(key));
    localStorage.removeItem(CLOUD_NOTE_TIMESTAMPS_KEY);
    localStorage.removeItem(CLOUD_TOMBSTONES_KEY);
  }

  function v12ResetStudyRuntimeForProfileSwitch() {
    currentSubject = null;
    currentIndex = 0;
    userAnswers = [];
    mode = "";
    activeYear = null;
    quizData = [];
    resetVocabularyForm();
    document.documentElement.setAttribute("dir", "rtl");
    document.documentElement.setAttribute("lang", "ar");
    setSubjectDashboardState("home");
    renderDynamicYears();
    showScreen("setup");
  }

  function v12SaveGuestProfile(data) {
    try {
      localStorage.setItem(V12_GUEST_PROFILE_KEY, JSON.stringify(data));
      return true;
    } catch (error) {
      console.warn("Could not preserve the guest profile.", error);
      return false;
    }
  }

  async function v12SwitchLocalProfileUnsafe(userId) {
    if (!userId) return false;
    const currentOwner = localStorage.getItem(V12_SYNC_OWNER_KEY) || "";
    if (!currentOwner) {
      const guestData = collectLocalCloudData();
      const savedProfile = readJsonStorage(v12ProfileStorageKey(userId), null);
      const hasGuestData = Boolean(
        guestData.vocabulary.length ||
          guestData.notes.length ||
          guestData.progress.length,
      );
      let nextProfile = savedProfile;
      if (hasGuestData) {
        if (!v12SaveGuestProfile(guestData)) {
          throw new Error("تعذر حفظ نسخة بيانات الضيف، لذلك لم يتم تبديل الحساب.");
        }
        const shouldImport = confirm(
          "توجد بيانات محلية غير مرتبطة بحساب. هل تريد دمجها مع هذا الحساب؟ اضغط إلغاء لعرض بيانات الحساب فقط.",
        );
        if (shouldImport) {
          nextProfile = mergeCloudCollections(guestData, savedProfile);
        }
      }
      v12ProfileEpoch += 1;
      v12ResetStudyRuntimeForProfileSwitch();
      v12ClearSyncedData();
      if (nextProfile) applyCloudDataLocally(nextProfile);
      localStorage.setItem(V12_SYNC_OWNER_KEY, userId);
      cloudLastKnownSnapshot = collectLocalCloudData();
      return true;
    }
    if (currentOwner === userId) return true;

    v12ProfileEpoch += 1;
    if (!v12SaveCurrentProfile(currentOwner)) {
      throw new Error("تعذر حفظ بيانات الحساب الحالي، لذلك لم يتم تبديل الحساب.");
    }
    v12ResetStudyRuntimeForProfileSwitch();
    v12ClearSyncedData();
    const nextProfile = readJsonStorage(v12ProfileStorageKey(userId), null);
    if (nextProfile) applyCloudDataLocally(nextProfile);
    localStorage.setItem(V12_SYNC_OWNER_KEY, userId);
    cloudLastKnownSnapshot = collectLocalCloudData();
    return true;
  }

  function v12SwitchLocalProfile(userId) {
    const runSwitch = () => v12SwitchLocalProfileUnsafe(userId);
    const queuedSwitch = v12ProfileSwitchQueue.then(() => {
      if (navigator.locks?.request) {
        return navigator.locks.request("uniquiz-v12-profile-switch", runSwitch);
      }
      return runSwitch();
    });
    v12ProfileSwitchQueue = queuedSwitch.catch(() => false);
    return queuedSwitch;
  }

  initializeVocabularySupabaseSync = function () {
    if (vocabularySupabaseInitialization) return vocabularySupabaseInitialization;
    const initialization = (async () => {
      try {
        const client = createVocabularySupabaseClient();
        const { data, error } = await client.auth.getSession();
        if (error) throw error;
        vocabularySupabaseSession = data?.session || null;
        if (vocabularySupabaseSession?.user?.id) {
          await v12SwitchLocalProfile(vocabularySupabaseSession.user.id);
        }
        localStorage.removeItem("sync_token");
        refreshVocabularyCloudInterface();
        client.auth.onAuthStateChange((event, session) => {
          vocabularySupabaseSession = session || null;
          refreshVocabularyCloudInterface();
          if (session?.user?.id && event === "SIGNED_IN") {
            window.setTimeout(async () => {
              try {
                const switched = await v12SwitchLocalProfile(session.user.id);
                if (switched) await syncVocabularyCloudData(false);
              } catch (switchError) {
                console.warn("Could not switch the local account profile.", switchError);
                setVocabularyCloudStatus(
                  explainCloudSyncError(switchError),
                  "error",
                );
              }
            }, 0);
          }
        });
        if (vocabularySupabaseSession?.user?.id) {
          window.setTimeout(() => syncVocabularyCloudData(false), 0);
        }
        return client;
      } catch (error) {
        console.warn("Supabase initialization failed.", error);
        setVocabularyCloudStatus(explainCloudSyncError(error), "error");
        return null;
      }
    })();
    vocabularySupabaseInitialization = initialization;
    initialization.then((client) => {
      if (!client && vocabularySupabaseInitialization === initialization) {
        vocabularySupabaseInitialization = null;
      }
    });
    return initialization;
  };

  readVocabularySupabaseData = async function (userId) {
    const { data, error } = await vocabularySupabaseClient
      .from(SUPABASE_DATA_TABLE)
      .select("data, updated_at")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) throw error;
    return data ? { data: data.data || null, updatedAt: data.updated_at } : null;
  };

  writeVocabularySupabaseData = async function (
    userId,
    data,
    expectedUpdatedAt = null,
  ) {
    const updatedAt = v12Now();
    const record = {
      user_id: userId,
      data: { ...data, updatedAt },
      updated_at: updatedAt,
    };
    if (!expectedUpdatedAt) {
      const { error } = await vocabularySupabaseClient
        .from(SUPABASE_DATA_TABLE)
        .insert(record);
      if (error?.code === "23505") return false;
      if (error) throw error;
      return true;
    }
    const { data: updated, error } = await vocabularySupabaseClient
      .from(SUPABASE_DATA_TABLE)
      .update(record)
      .eq("user_id", userId)
      .eq("updated_at", expectedUpdatedAt)
      .select("updated_at");
    if (error) throw error;
    return Array.isArray(updated) && updated.length === 1;
  };

  function v12SyncContextIsCurrent(userId, epoch) {
    return (
      vocabularySupabaseSession?.user?.id === userId &&
      localStorage.getItem(V12_SYNC_OWNER_KEY) === userId &&
      v12ProfileEpoch === epoch
    );
  }

  function v12LocalStateMatches(data, generation) {
    return (
      v12MutationGeneration === generation &&
      cloudComparableData(collectLocalCloudData()) === cloudComparableData(data)
    );
  }

  syncVocabularyCloudData = async function (showStatus = true) {
    const config = getVocabularyCloudConfig();
    if (!config.enabled || !config.userId) return false;
    if (cloudSyncBusy) {
      v12SyncQueued = true;
      return false;
    }
    if (!navigator.onLine) {
      localStorage.setItem(V12_SYNC_DIRTY_KEY, "1");
      if (showStatus) {
        setVocabularyCloudStatus(
          "أنت غير متصل. حُفظت التغييرات محلياً وستتم مزامنتها عند عودة الاتصال.",
          "error",
        );
      }
      return false;
    }

    cloudSyncBusy = true;
    if (showStatus) {
      setVocabularyCloudStatus("جاري مزامنة الكلمات والملاحظات والتقدم…", "loading");
    }
    try {
      const switched = await v12SwitchLocalProfile(config.userId);
      if (!switched) return false;
      const syncEpoch = v12ProfileEpoch;
      if (!v12SyncContextIsCurrent(config.userId, syncEpoch)) return false;
      let merged = null;
      let saved = false;
      let stableGeneration = -1;
      let stableLocalData = null;
      for (let attempt = 0; attempt < 6; attempt++) {
        const attemptGeneration = v12MutationGeneration;
        const localData = captureCloudDeletions();
        const remoteEnvelope = await readVocabularySupabaseData(config.userId);
        if (!v12SyncContextIsCurrent(config.userId, syncEpoch)) return false;
        if (!v12LocalStateMatches(localData, attemptGeneration)) {
          v12SyncQueued = true;
          continue;
        }
        merged = mergeCloudCollections(localData, remoteEnvelope?.data);
        const alreadyEqual =
          remoteEnvelope?.data &&
          cloudComparableData(merged) === cloudComparableData(remoteEnvelope.data);
        if (alreadyEqual) {
          saved = true;
          stableGeneration = attemptGeneration;
          stableLocalData = localData;
          break;
        }
        saved = await writeVocabularySupabaseData(
          config.userId,
          merged,
          remoteEnvelope?.updatedAt || null,
        );
        if (!v12SyncContextIsCurrent(config.userId, syncEpoch)) return false;
        if (!v12LocalStateMatches(localData, attemptGeneration)) {
          v12SyncQueued = true;
          saved = false;
          continue;
        }
        if (saved) {
          stableGeneration = attemptGeneration;
          stableLocalData = localData;
          break;
        }
      }
      if (!saved || !merged) throw new Error("تعارضت المزامنة مع جهاز آخر. حاول مرة أخرى.");
      if (
        !v12SyncContextIsCurrent(config.userId, syncEpoch) ||
        !v12LocalStateMatches(stableLocalData, stableGeneration)
      ) {
        v12SyncQueued = true;
        return false;
      }
      applyCloudDataLocally(merged);
      cloudLastKnownSnapshot = collectLocalCloudData();
      if (!v12SaveCurrentProfile(config.userId)) {
        throw new Error("تمت المزامنة، لكن تعذر حفظ نسخة الحساب المحلية.");
      }
      if (
        !v12SyncContextIsCurrent(config.userId, syncEpoch) ||
        v12MutationGeneration !== stableGeneration ||
        cloudComparableData(cloudLastKnownSnapshot) !==
          cloudComparableData(merged)
      ) {
        localStorage.setItem(V12_SYNC_DIRTY_KEY, "1");
        v12SyncQueued = true;
        return false;
      }
      localStorage.removeItem(V12_SYNC_DIRTY_KEY);
      localStorage.setItem("sync_last_success_at", v12Now());
      refreshVocabularyCloudInterface();
      setVocabularyCloudStatus("تمت مزامنة الكلمات والملاحظات والتقدم بنجاح.", "success");
      return true;
    } catch (error) {
      console.warn("Cloud sync failed.", error);
      if (localStorage.getItem(V12_SYNC_OWNER_KEY) === config.userId) {
        localStorage.setItem(V12_SYNC_DIRTY_KEY, "1");
      }
      if (showStatus && vocabularySupabaseSession?.user?.id === config.userId) {
        setVocabularyCloudStatus(explainCloudSyncError(error), "error");
      }
      return false;
    } finally {
      cloudSyncBusy = false;
      if (v12SyncQueued) {
        v12SyncQueued = false;
        window.setTimeout(() => syncVocabularyCloudData(false), 50);
      }
    }
  };

  scheduleVocabularyCloudSync = function () {
    if (!vocabularySupabaseSession?.user?.id || !navigator.onLine) return;
    window.clearTimeout(cloudSyncTimer);
    cloudSyncTimer = window.setTimeout(() => syncVocabularyCloudData(false), 900);
  };

  const v12OriginalSaveProgress = saveDetailedProgress;
  saveDetailedProgress = function () {
    if (!currentSubject || !currentSubject.questions?.length) return;
    v12OriginalSaveProgress();
    try {
      const last = JSON.parse(localStorage.getItem("app_last_position") || "null");
      if (last) {
        last.updatedAt = v12Now();
        localStorage.setItem("app_last_position", JSON.stringify(last));
      }
    } catch (error) {}
    v12MarkLocalMutation();
    scheduleVocabularyCloudSync();
  };

  const v12OriginalSaveNote = saveUserNote;
  saveUserNote = function () {
    const questionId = currentSubject?.questions?.[currentIndex]?.id;
    const key = currentSubject?.id && questionId ? `note_${currentSubject.id}_${questionId}` : null;
    v12OriginalSaveNote();
    if (key && localStorage.getItem(key)) {
      const timestamps = getCloudNoteTimestamps();
      timestamps[key] = v12Now();
      localStorage.setItem(CLOUD_NOTE_TIMESTAMPS_KEY, JSON.stringify(timestamps));
      const deleted = getCloudTombstones();
      delete deleted.notes[key];
      localStorage.setItem(CLOUD_TOMBSTONES_KEY, JSON.stringify(deleted));
      v12MarkLocalMutation();
      scheduleVocabularyCloudSync();
    }
  };

  const v12OriginalPersistVocabularyEntries = persistVocabularyEntries;
  persistVocabularyEntries = function (entries) {
    const saved = v12OriginalPersistVocabularyEntries(entries);
    if (saved) {
      v12MarkLocalMutation();
      scheduleVocabularyCloudSync();
    }
    return saved;
  };

  const v12OriginalDeleteVocabulary = deleteVocabularyEntry;
  deleteVocabularyEntry = function (id) {
    const existed = getVocabularyEntries().some((entry) => entry.id === id);
    v12OriginalDeleteVocabulary(id);
    if (existed && !getVocabularyEntries().some((entry) => entry.id === id)) {
      v12RememberDeletion("vocabulary", id);
      scheduleVocabularyCloudSync();
    }
  };

  restartSubject = function () {
    if (!currentSubject || !confirm("هل تريد إعادة هذه المادة من البداية؟")) return;
    const progressKey = `progress_${currentSubject.id}_${mode}`;
    localStorage.removeItem(progressKey);
    currentSubject.questions.forEach((question) => {
      const noteKey = `note_${currentSubject.id}_${question.id}`;
      if (localStorage.getItem(noteKey)) v12RememberDeletion("notes", noteKey);
      localStorage.removeItem(noteKey);
    });
    currentIndex = 0;
    userAnswers = [];
    const resetAt = v12Now();
    writeSubjectProgress(
      currentSubject,
      mode,
      {
        answers: {},
        lastQuestionId: currentSubject.questions[0]?.id || null,
        index: 0,
        questionOrder: currentSubject.questions.map((question) => question.id),
        resetAt,
        updatedAt: resetAt,
      },
      { now: resetAt, updatedAt: resetAt },
    );
    const deleted = getCloudTombstones();
    delete deleted.progress[progressKey];
    localStorage.setItem(CLOUD_TOMBSTONES_KEY, JSON.stringify(deleted));
    saveDetailedProgress();
    renderStep();
  };

  fullReset = async function () {
    if (
      !confirm(
        "سيتم حذف التقدم والملاحظات والكلمات من هذا الجهاز ومن الحساب عند المزامنة. ستبقى المواد المحمّلة وإعدادات الحساب. هل تريد المتابعة؟",
      )
    ) {
      return;
    }
    const snapshot = collectLocalCloudData();
    snapshot.vocabulary.forEach((entry) => v12RememberDeletion("vocabulary", entry.id));
    snapshot.notes.forEach((note) => v12RememberDeletion("notes", note.key));
    snapshot.progress.forEach((item) => v12RememberDeletion("progress", item.key));
    v12SyncedStorageKeys().forEach((key) => localStorage.removeItem(key));
    localStorage.setItem(VOCABULARY_STORAGE_KEY, "[]");
    cloudLastKnownSnapshot = collectLocalCloudData();
    renderVocabularyTable();
    scheduleVocabularyCloudSync();
    currentSubject = null;
    backToYears();
  };

  const v12OriginalRefreshCloudInterface = refreshVocabularyCloudInterface;
  refreshVocabularyCloudInterface = function () {
    v12OriginalRefreshCloudInterface();
    const config = getVocabularyCloudConfig();
    const accountButton = document.getElementById("account-sync-btn");
    accountButton?.classList.toggle("sync-active", config.enabled);
    if (config.enabled) {
      setVocabularyCloudStatus(
        `متصل بالحساب ${config.email} — تتم مزامنة الكلمات والملاحظات والتقدم.`,
        "success",
      );
    }
  };

  connectVocabularyCloudSync = async function () {
    const email = document.getElementById("vocabulary-sync-email")?.value.trim() || "";
    const password = document.getElementById("vocabulary-sync-password")?.value || "";
    if (!email || !password) {
      setVocabularyCloudStatus("أدخل البريد الإلكتروني وكلمة المرور.", "error");
      return;
    }
    const client = await initializeVocabularySupabaseSync();
    if (!client) return;
    setVocabularyCloudStatus("جاري تسجيل الدخول…", "loading");
    try {
      const { data, error } = await client.auth.signInWithPassword({ email, password });
      if (error) throw error;
      vocabularySupabaseSession = data?.session || null;
      if (data?.session?.user?.id) await v12SwitchLocalProfile(data.session.user.id);
      const passwordInput = document.getElementById("vocabulary-sync-password");
      if (passwordInput) passwordInput.value = "";
      refreshVocabularyCloudInterface();
      await syncVocabularyCloudData(true);
    } catch (error) {
      setVocabularyCloudStatus(explainCloudSyncError(error), "error");
    }
  };

  registerVocabularyCloudAccount = async function () {
    const email = document.getElementById("vocabulary-sync-email")?.value.trim() || "";
    const password = document.getElementById("vocabulary-sync-password")?.value || "";
    if (!email || password.length < 6) {
      setVocabularyCloudStatus("أدخل بريداً صحيحاً وكلمة مرور من 6 أحرف على الأقل.", "error");
      return;
    }
    const client = await initializeVocabularySupabaseSync();
    if (!client) return;
    setVocabularyCloudStatus("جاري إنشاء الحساب…", "loading");
    try {
      const { data, error } = await client.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: getVocabularyAuthRedirectUrl() },
      });
      if (error) throw error;
      const passwordInput = document.getElementById("vocabulary-sync-password");
      if (passwordInput) passwordInput.value = "";
      if (data?.session?.user?.id) {
        vocabularySupabaseSession = data.session;
        await v12SwitchLocalProfile(data.session.user.id);
        refreshVocabularyCloudInterface();
        await syncVocabularyCloudData(true);
      } else {
        setVocabularyCloudStatus(
          "تم إنشاء الحساب. افتح رسالة التأكيد في بريدك ثم سجّل الدخول.",
          "success",
        );
      }
    } catch (error) {
      setVocabularyCloudStatus(explainCloudSyncError(error), "error");
    }
  };

  disconnectVocabularyCloudSync = async function () {
    if (
      !confirm(
        "هل تريد تسجيل الخروج من هذا الجهاز؟ ستُخفى بيانات الحساب المحلية، وتعود بعد تسجيل الدخول بالحساب نفسه.",
      )
    )
      return;
    const client = await initializeVocabularySupabaseSync();
    if (!client) return;
    try {
      const userId = vocabularySupabaseSession?.user?.id || "";
      if (!v12SaveCurrentProfile(userId)) {
        throw new Error("تعذر حفظ بيانات الحساب محلياً، لذلك لم يتم تسجيل الخروج.");
      }
      const { error } = await client.auth.signOut({ scope: "local" });
      if (error) throw error;
      vocabularySupabaseSession = null;
      v12ProfileEpoch += 1;
      v12ResetStudyRuntimeForProfileSwitch();
      v12ClearSyncedData();
      localStorage.removeItem(V12_SYNC_OWNER_KEY);
      cloudLastKnownSnapshot = collectLocalCloudData();
      renderVocabularyTable();
      refreshVocabularyCloudInterface();
      setVocabularyCloudStatus(
        "تم تسجيل الخروج من هذا الجهاز فقط وإخفاء بيانات الحساب المحلية.",
        "success",
      );
    } catch (error) {
      setVocabularyCloudStatus(explainCloudSyncError(error), "error");
    }
  };

  // Replace the old automatic content downloader with a manifest-only check.
  performAutomaticDailyUpdate = async function (force = false) {
    if (!navigator.onLine) return false;
    await v12RefreshCatalog(force, true);
    try {
      const registration = await navigator.serviceWorker?.getRegistration();
      await registration?.update();
    } catch (error) {}
    return true;
  };

  bindAutomaticDailyUpdates = function () {
    if ("serviceWorker" in navigator && location.protocol !== "file:") {
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data?.type === "CHECK_CONTENT_CATALOG") {
          performAutomaticDailyUpdate(true);
        }
      });
      navigator.serviceWorker.ready
        .then((registration) =>
          registration.periodicSync?.register("uniquiz-daily-update", {
            minInterval: AUTOMATIC_UPDATE_INTERVAL_MS,
          }),
        )
        .catch(() => {});
    }
    window.addEventListener("online", () => performAutomaticDailyUpdate(true));
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") performAutomaticDailyUpdate(false);
    });
    window.setInterval(
      () => performAutomaticDailyUpdate(false),
      AUTOMATIC_UPDATE_INTERVAL_MS,
    );
  };

  window.addEventListener("load", () => {
    window.setTimeout(bindAutomaticDailyUpdates, 0);
  });
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      !document.getElementById("download-modal")?.classList.contains("hidden") &&
      !downloadInProgress
    ) {
      closeDownloadModal();
    }
  });
  if (window.UNIQUIZ_TEST_MODE) {
    window.__UNIQUIZ_V12_TEST_HOOKS__ = Object.freeze({
      getMutationGeneration: () => v12MutationGeneration,
      getProfileEpoch: () => v12ProfileEpoch,
      setCloudSnapshot: (data) => {
        cloudLastKnownSnapshot = data;
      },
      migrateNoteAliases: v12MigrateNoteAliases,
      switchLocalProfile: v12SwitchLocalProfile,
    });
  }
  window.onload = init;
})();
