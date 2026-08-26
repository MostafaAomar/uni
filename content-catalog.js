(function () {
  "use strict";

  const CACHE_KEY = "content-catalog-v2";

  function encodePath(path) {
    return String(path || "")
      .split("/")
      .map((part) => encodeURIComponent(part))
      .join("/");
  }

  function inferName(path) {
    return String(path || "")
      .split("/")
      .pop()
      .replace(/\.json$/i, "")
      .replace(/[_-]+/g, " ")
      .trim();
  }

  function parseManifest(manifest, validYears) {
    if (!manifest?.years || ![1, 2].includes(Number(manifest.version))) {
      throw new Error("ملف فهرس المواد غير صالح.");
    }

    const catalog = new Map(validYears.map((year) => [year, []]));
    validYears.forEach((year) => {
      const seen = new Set();
      const entries = Array.isArray(manifest.years[year]) ? manifest.years[year] : [];
      entries.forEach((entry) => {
        const path = typeof entry?.path === "string" ? entry.path.trim() : "";
        if (!path.toLowerCase().endsWith(".json") || seen.has(path)) return;
        seen.add(path);
        catalog.get(year).push({
          id: path,
          path,
          year,
          subject: String(entry.subject || inferName(path)).trim(),
          description: typeof entry.description === "string" ? entry.description.trim() : "",
          lang: entry.lang || "en",
          questionCount: Math.max(0, Number(entry.questionCount) || 0),
          size: Math.max(0, Number(entry.size) || 0),
          sha: entry.sha256 || entry.sha || null,
          downloadUrl: `./${encodePath(path)}`,
        });
      });
      catalog.get(year).sort((a, b) => a.subject.localeCompare(b.subject, "ar"));
    });
    return catalog;
  }

  function serialiseCatalog(catalog) {
    return Object.fromEntries([...catalog.entries()]);
  }

  function restoreCatalog(value, validYears) {
    const source = value?.years || value;
    return new Map(
      validYears.map((year) => [year, Array.isArray(source?.[year]) ? source[year] : []]),
    );
  }

  async function load(options) {
    const {
      url = "./content-manifest.json",
      validYears = [],
      force = false,
      store = window.UniQuizSubjectStore,
    } = options || {};
    const separator = url.includes("?") ? "&" : "?";

    if (navigator.onLine || force) {
      try {
        const response = await fetch(`${url}${separator}catalog=${Date.now()}`, {
          cache: "no-store",
          headers: { Accept: "application/json" },
        });
        if (!response.ok) throw new Error(`تعذر قراءة فهرس المواد (${response.status}).`);
        const manifest = await response.json();
        const catalog = parseManifest(manifest, validYears);
        await store?.setMeta(CACHE_KEY, {
          version: manifest.version,
          revision: manifest.revision || null,
          checkedAt: new Date().toISOString(),
          years: serialiseCatalog(catalog),
        });
        return { catalog, source: "network", revision: manifest.revision || null };
      } catch (error) {
        console.warn("The live content catalog is unavailable.", error);
      }
    }

    const cached = await store?.getMeta(CACHE_KEY);
    if (cached?.years) {
      return {
        catalog: restoreCatalog(cached, validYears),
        source: "cache",
        revision: cached.revision || null,
      };
    }
    return {
      catalog: new Map(validYears.map((year) => [year, []])),
      source: "empty",
      revision: null,
    };
  }

  function getStatus(catalogEntry, installedRecord) {
    if (!installedRecord) return "download";
    if (catalogEntry?.sha && !installedRecord.sourceSha) return "update";
    if (
      catalogEntry?.sha &&
      installedRecord.sourceSha &&
      catalogEntry.sha !== installedRecord.sourceSha
    ) {
      return "update";
    }
    return "current";
  }

  window.UniQuizCatalog = Object.freeze({
    load,
    parseManifest,
    getStatus,
    inferName,
  });
})();
