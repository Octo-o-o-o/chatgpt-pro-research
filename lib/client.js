window.__ModuleLoader__.load({ id: "chatgpt-pro-research", factory: (require) => {
var module = { exports: {} }; var exports = module.exports;
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/research/client/index.tsx
var index_exports = {};
__export(index_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(index_exports);

// packages/research/client/panel.tsx
var import_react = require("react");

// packages/research/client/icons.ts
var RESEARCH_ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="-40 -76 200 200"><title>Anyvia R</title><defs><mask id="R-mono-black-standard-gap" maskUnits="userSpaceOnUse" x="-100" y="-100" width="400" height="400"><rect x="-100" y="-100" width="400" height="400" fill="white"/><path d="M77.18032292691355 52.74975779269961 A3 3 0 0 1 79.72446721538282 48.16 L108.02474889607315 48.16 A3 3 0 0 1 110.56889318454242 49.57024220730038 L139.21290427606598 95.41024220730039 A3 3 0 0 1 136.6687599875967 100 L108.36847830690638 100 A3 3 0 0 1 105.82433401843711 98.58975779269961 Z" transform="translate(-30 -12)" fill="black" stroke="black" stroke-width="6" stroke-linejoin="round"/></mask></defs><g mask="url(#R-mono-black-standard-gap)"><path d="M3.46 -40 H67 A39 39 0 0 1 67 38 H36.81354211962983 V84.54 Q36.81354211962983 88 33.35354211962983 88 H3.46 Q0 88 0 84.54 V-36.54 Q0 -40 3.46 -40 Z M36.81354211962983 -14 V12 H67 A13 13 0 0 0 67 -14 Z" fill="currentColor" fill-rule="evenodd"/></g><path d="M77.18032292691355 52.74975779269961 A3 3 0 0 1 79.72446721538282 48.16 L108.02474889607315 48.16 A3 3 0 0 1 110.56889318454242 49.57024220730038 L139.21290427606598 95.41024220730039 A3 3 0 0 1 136.6687599875967 100 L108.36847830690638 100 A3 3 0 0 1 105.82433401843711 98.58975779269961 Z" transform="translate(-30 -12)" fill="currentColor"/></svg>';
var DESIGN_ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="-22.599456503942804 -56 200 200"><title>Anyvia X</title><defs><mask id="X-mono-black-standard-gap" maskUnits="userSpaceOnUse" x="-100" y="-100" width="400" height="400"><rect x="-100" y="-100" width="400" height="400" fill="white"/><path d="M77.18032292691355 52.74975779269961 A3 3 0 0 1 79.72446721538282 48.16 L108.02474889607315 48.16 A3 3 0 0 1 110.56889318454242 49.57024220730038 L139.21290427606598 95.41024220730039 A3 3 0 0 1 136.6687599875967 100 L108.36847830690638 100 A3 3 0 0 1 105.82433401843711 98.58975779269961 Z" transform="translate(-12 0)" fill="black" stroke="black" stroke-width="6" stroke-linejoin="round"/></mask></defs><g mask="url(#X-mono-black-standard-gap)"><path d="M89.67202319894069 -10.373520654246889 A3.46 3.46 0 0 1 92.60626961164192 -12 L127.85608887910462 -12 A3.46 3.46 0 0 1 130.79033529180586 -6.706479345753113 L65.12906379317373 98.37352065424689 A3.46 3.46 0 0 1 62.19481738047249 100 L26.94499811300981 100 A3.46 3.46 0 0 1 24.010751700308575 94.70647934575311 Z" fill="currentColor"/><path d="M28.027942559241307 -6.706479345753113 A3.46 3.46 0 0 1 30.96218897194254 -12 L58.17762652153973 -12 A3.46 3.46 0 0 1 61.111872934240964 -10.373520654246889 L91.78046072595076 38.70647934575311 A3.46 3.46 0 0 1 88.84621431324952 44 L61.63077676365233 44 A3.46 3.46 0 0 1 58.69653035095109 42.37352065424689 Z" fill="currentColor"/></g><path d="M77.18032292691355 52.74975779269961 A3 3 0 0 1 79.72446721538282 48.16 L108.02474889607315 48.16 A3 3 0 0 1 110.56889318454242 49.57024220730038 L139.21290427606598 95.41024220730039 A3 3 0 0 1 136.6687599875967 100 L108.36847830690638 100 A3 3 0 0 1 105.82433401843711 98.58975779269961 Z" transform="translate(-12 0)" fill="currentColor"/></svg>';

// packages/research/client/seen.ts
var SEEN_EVENT = "dsh-pro:topic-seen";
function storageKey(panelId) {
  return `dsh-pro:seen:${panelId}`;
}
function storage() {
  try {
    return typeof localStorage === "undefined" ? void 0 : localStorage;
  } catch {
    return void 0;
  }
}
function read(panelId) {
  const store = storage();
  if (store === void 0) return {};
  try {
    const parsed = JSON.parse(store.getItem(storageKey(panelId)) ?? "{}");
    return parsed !== null && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}
function markTopicSeen(panelId, topicId, updated) {
  const store = storage();
  if (store === void 0 || updated === void 0) return;
  const seen = read(panelId);
  if (seen[topicId] === updated) return;
  seen[topicId] = updated;
  try {
    store.setItem(storageKey(panelId), JSON.stringify(seen));
  } catch {
    return;
  }
  if (typeof window !== "undefined") window.dispatchEvent(new Event(SEEN_EVENT));
}
function isTopicSeen(panelId, topicId, updated) {
  if (updated === void 0) return false;
  return read(panelId)[topicId] === updated;
}

// packages/research/client/sidebar-status.ts
var POLL_MS = 5e3;
function countTopics(topics, isSeen) {
  const counts = { active: 0, reviewing: 0, completed: 0, incomplete: 0, failed: 0 };
  for (const topic of topics) {
    switch (topic.status) {
      case "queued":
      case "uploading":
      case "submitted":
      case "waiting":
      case "answered":
      case "adjudicating":
        counts.active += 1;
        break;
      case "reviewing":
        counts.reviewing += 1;
        break;
      case "completed":
        if (!isSeen(topic)) counts.completed += 1;
        break;
      case "capped":
        counts.incomplete += 1;
        break;
      case "failed":
      case "stalled":
        counts.failed += 1;
        break;
      default:
        break;
    }
  }
  return counts;
}
var STATUS_TINT = {
  active: "#6f9fd0",
  reviewing: "#5c88c4",
  incomplete: "#c39a4a",
  completed: "#5f9c7a",
  failed: "#c26a6a"
};
function badgeParts(counts) {
  const parts = [];
  if (counts.active > 0) parts.push({ text: `${counts.active} \u8FDB\u884C`, color: STATUS_TINT.active });
  if (counts.reviewing > 0) parts.push({ text: `${counts.reviewing} \u5F85\u5224\u65AD`, color: STATUS_TINT.reviewing });
  if (counts.incomplete > 0) parts.push({ text: `${counts.incomplete} \u5F85\u63A5\u53D7`, color: STATUS_TINT.incomplete });
  if (counts.completed > 0) parts.push({ text: `${counts.completed} \u5B8C\u6210`, color: STATUS_TINT.completed });
  if (counts.failed > 0) parts.push({ text: `${counts.failed} \u5931\u8D25`, color: STATUS_TINT.failed });
  return parts;
}
function badgeText(counts) {
  return badgeParts(counts).map((part) => part.text).join(" \xB7 ");
}
function mountSidebarStatus(options) {
  if (typeof document === "undefined") return () => {
  };
  let badge;
  let text = "";
  let parts = [];
  let disposed = false;
  let polling = false;
  let attachTimer;
  let observer;
  const rowFor = () => {
    const buttons = document.querySelectorAll("button[aria-label]");
    for (const button of buttons) {
      if (button.getAttribute("aria-label") === options.label) return button;
    }
    return void 0;
  };
  const renderBadge = (target) => {
    target.replaceChildren();
    parts.forEach((part, index) => {
      if (index > 0) {
        const separator = document.createElement("span");
        separator.textContent = "\xB7";
        separator.style.opacity = ".35";
        separator.style.margin = "0 2px";
        target.appendChild(separator);
      }
      const span = document.createElement("span");
      span.textContent = part.text;
      span.style.color = part.color;
      target.appendChild(span);
    });
    target.dataset.text = text;
  };
  const applyText = (next, nextParts) => {
    const changed = text !== next;
    text = next;
    parts = nextParts;
    if (badge !== void 0 && changed) renderBadge(badge);
    ensureMounted();
  };
  const ensureMounted = () => {
    if (disposed) return;
    if (text === "") {
      badge?.remove();
      badge = void 0;
      return;
    }
    const row = rowFor();
    if (row === void 0) return;
    const title = row.querySelector('[class*="panelTitle"]');
    if (title === null) {
      badge?.remove();
      badge = void 0;
      return;
    }
    if (badge !== void 0 && badge.parentElement === row) {
      if (badge.dataset.text !== text) renderBadge(badge);
      return;
    }
    badge = document.createElement("span");
    badge.dataset.dshProBadge = options.panelId;
    badge.setAttribute("aria-hidden", "true");
    badge.style.cssText = [
      "margin-left:auto",
      "display:inline-flex",
      "align-items:center",
      "flex:0 0 auto",
      "font-size:10px",
      "font-weight:500",
      "line-height:1",
      "opacity:.8",
      "white-space:nowrap",
      "font-variant-numeric:tabular-nums",
      "pointer-events:none"
    ].join(";");
    renderBadge(badge);
    row.appendChild(badge);
  };
  const refresh = async () => {
    if (disposed || polling) return;
    polling = true;
    try {
      const response = await fetch(`${options.routes}/topics`, { headers: { accept: "application/json" } });
      if (!response.ok) return;
      const data = await response.json();
      const counts = countTopics(
        data.topics ?? [],
        (topic) => isTopicSeen(options.panelId, topic.topic_id ?? "", topic.updated)
      );
      applyText(badgeText(counts), badgeParts(counts));
    } catch {
    } finally {
      polling = false;
    }
  };
  observer = new MutationObserver(() => {
    if (attachTimer !== void 0) return;
    attachTimer = window.setTimeout(() => {
      attachTimer = void 0;
      ensureMounted();
    }, 100);
  });
  observer.observe(document.body, { childList: true, subtree: true });
  const timer = window.setInterval(() => {
    void refresh();
  }, POLL_MS);
  const onSeen = () => {
    void refresh();
  };
  window.addEventListener(SEEN_EVENT, onSeen);
  void refresh();
  return () => {
    disposed = true;
    window.clearInterval(timer);
    window.removeEventListener(SEEN_EVENT, onSeen);
    if (attachTimer !== void 0) window.clearTimeout(attachTimer);
    observer?.disconnect();
    badge?.remove();
    badge = void 0;
  };
}

// packages/research/client/panel.tsx
var POLL_MS2 = 3e3;
var config = {
  routes: "/chatgpt-pro-research",
  panelId: "chatgpt-pro-research",
  title: "ChatGPT Pro Research",
  label: "Pro Research",
  icon: "research",
  designMode: false
};
function configure(spec) {
  config = spec;
}
var inject = ["slots"];
var showViewer = () => {
};
var STATUS_LABEL = {
  draft: "\u8349\u7A3F",
  queued: "\u6392\u961F",
  uploading: "\u4E0A\u4F20\u4E2D",
  submitted: "\u5DF2\u63D0\u4EA4",
  waiting: "\u7B49\u5F85\u7B54\u590D",
  answered: "\u5DF2\u7B54\u590D",
  adjudicating: "\u88C1\u51B3\u4E2D",
  completed: "\u5B8C\u6210",
  capped: "\u5F85\u63A5\u53D7",
  reviewing: "\u5F85\u539F\u4F1A\u8BDD\u5224\u65AD",
  stalled: "\u5361\u4F4F",
  failed: "\u5931\u8D25",
  cancelled: "\u5DF2\u53D6\u6D88"
};
var STATUS_COLOR = {
  completed: "#2e7d32",
  capped: "#6a1b9a",
  reviewing: "#3f7fbf",
  stalled: "#ed6c02",
  failed: "#c62828",
  cancelled: "#757575"
};
var ACTIVE = /* @__PURE__ */ new Set(["queued", "uploading", "submitted", "waiting", "answered", "adjudicating"]);
var STALL_LABEL = {
  login: "\u767B\u5F55\u5931\u6548",
  upload: "\u6750\u6599\u4E0A\u4F20\u4E0D\u5B8C\u6574",
  timeout: "\u8D85\u65F6\u6216\u65E0\u8FDB\u5C55",
  ui: "\u9875\u9762\u7ED3\u6784\u53D8\u5316",
  config: "\u914D\u7F6E\u6216\u8BF7\u6C42\u53C2\u6570\u88AB\u62D2",
  worker: "\u6D4F\u89C8\u5668\u8FDB\u7A0B\u5D29\u6E83",
  unknown_submission: "\u63D0\u4EA4\u72B6\u6001\u672A\u77E5"
};
function channelLabel(channel) {
  if (channel === void 0 || channel === "") return void 0;
  return channel === "api" ? "API \u751F\u56FE" : "\u7F51\u9875\u4F1A\u8BDD";
}
async function getJson(url) {
  const response = await fetch(url, { headers: { accept: "application/json" }, cache: "no-store" });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return await response.json();
}
async function postAction(body) {
  const response = await fetch(`${config.routes}/action`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    let message = text === "" ? `${response.status}` : text;
    try {
      const parsed = JSON.parse(text);
      if (typeof parsed.error === "string") message = parsed.error;
    } catch {
    }
    throw new Error(message);
  }
  return await response.json();
}
function Dot({ status }) {
  return (0, import_react.createElement)("span", {
    style: {
      display: "inline-block",
      width: 8,
      height: 8,
      borderRadius: 999,
      background: STATUS_COLOR[status] ?? "var(--dsh-text-2, #757575)",
      marginRight: 6,
      flex: "0 0 auto"
    }
  });
}
function Panel() {
  const [topics, setTopics] = (0, import_react.useState)([]);
  const [selected, setSelected] = (0, import_react.useState)(void 0);
  const [detail, setDetail] = (0, import_react.useState)(void 0);
  const [error, setError] = (0, import_react.useState)(void 0);
  const [notice, setNotice] = (0, import_react.useState)(void 0);
  const [regenOpen, setRegenOpen] = (0, import_react.useState)(false);
  const [regenNote, setRegenNote] = (0, import_react.useState)("");
  const [continueOpen, setContinueOpen] = (0, import_react.useState)(false);
  const [continueNote, setContinueNote] = (0, import_react.useState)("");
  const [continueDesigns, setContinueDesigns] = (0, import_react.useState)("");
  const [checkOpen, setCheckOpen] = (0, import_react.useState)(void 0);
  const [checkNote, setCheckNote] = (0, import_react.useState)("");
  const [viewer, setViewer] = (0, import_react.useState)(void 0);
  const [viewerNotice, setViewerNotice] = (0, import_react.useState)(void 0);
  showViewer = setViewer;
  (0, import_react.useEffect)(() => {
    if (notice === void 0) return;
    const timer = setTimeout(() => setNotice(void 0), 4e3);
    return () => clearTimeout(timer);
  }, [notice]);
  const loadList = (0, import_react.useCallback)(async () => {
    try {
      const data = await getJson(`${config.routes}/topics`);
      setTopics(data.topics);
      setError(void 0);
      setSelected((current) => current ?? data.topics[0]?.topic_id);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    }
  }, []);
  const loadDetail = (0, import_react.useCallback)(async (id) => {
    try {
      const data = await getJson(`${config.routes}/topic?id=${encodeURIComponent(id)}`);
      setDetail((current) => current === void 0 || current.topic_id === id ? data.topic : current);
      setError(void 0);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    }
  }, []);
  (0, import_react.useEffect)(() => {
    void loadList();
    const timer = setInterval(() => {
      void loadList();
    }, POLL_MS2);
    return () => clearInterval(timer);
  }, [loadList]);
  (0, import_react.useEffect)(() => {
    if (selected === void 0) return;
    void loadDetail(selected);
    const timer = setInterval(() => {
      void loadDetail(selected);
    }, POLL_MS2);
    return () => clearInterval(timer);
  }, [selected, loadDetail]);
  (0, import_react.useEffect)(() => {
    if (selected === void 0 || detail === void 0) return;
    const listed = topics.find((topic) => topic.topic_id === selected);
    if (listed !== void 0 && listed.status !== detail.status) {
      void loadDetail(selected);
    }
  }, [topics, selected, detail, loadDetail]);
  (0, import_react.useEffect)(() => {
    const refresh = () => {
      if (selected !== void 0) void loadDetail(selected);
      void loadList();
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") refresh();
    };
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [selected, loadDetail, loadList]);
  (0, import_react.useEffect)(() => {
    setViewerNotice(void 0);
  }, [viewer]);
  (0, import_react.useEffect)(() => {
    if (viewer === void 0) return;
    const onKey = (event) => {
      if (event.key === "Escape") setViewer(void 0);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [viewer]);
  const act = (0, import_react.useCallback)(async (action, conclusion, note) => {
    const target = detail?.topic_id;
    if (selected === void 0 || target === void 0 || target !== selected) {
      setNotice({ kind: "error", text: "\u4E3B\u9898\u6B63\u5728\u5207\u6362\uFF0C\u8BF7\u7B49\u8BE6\u60C5\u52A0\u8F7D\u5B8C\u6210\u540E\u518D\u64CD\u4F5C" });
      return;
    }
    try {
      const result = await postAction({ action, topic_id: target, ...conclusion !== void 0 ? { conclusion } : {}, ...note !== void 0 ? { note } : {} });
      const wake = result.topic?.wake;
      if (action === "accept") {
        setDetail((current) => current === void 0 ? current : { ...current, status: "completed" });
        if (result.topic?.updated !== void 0) markTopicSeen(config.panelId, target, result.topic.updated);
        if (wake?.ok === true) {
          setNotice({ kind: "ok", text: wake.resumed === true ? "\u5DF2\u63A5\u53D7\u7ED3\u679C\uFF0C\u5E76\u6062\u590D\u4E86\u539F\u4F1A\u8BDD" : "\u5DF2\u63A5\u53D7\u7ED3\u679C\uFF0C\u539F\u4F1A\u8BDD\u5DF2\u5524\u9192" });
        } else {
          const reason = wake?.reason ?? (wake === void 0 ? "\u5BBF\u4E3B\u672A\u8FD4\u56DE\u5524\u9192\u7ED3\u679C\uFF0C\u8BF7\u91CD\u542F DSH \u540E\u91CD\u8BD5" : "\u539F\u56E0\u672A\u77E5");
          setNotice({ kind: "error", text: `\u5DF2\u63A5\u53D7\u7ED3\u679C\uFF0C\u4F46\u6CA1\u80FD\u5524\u9192\u539F\u4F1A\u8BDD\uFF1A${reason}` });
        }
      } else if (action === "review") {
        if (wake?.ok === true) {
          setNotice({ kind: "ok", text: wake.resumed === true ? "\u5DF2\u6062\u590D\u539F\u4F1A\u8BDD\uFF0C\u8BF7\u5B83\u5224\u65AD\u662F\u5426\u63A5\u53D7" : "\u5DF2\u628A\u7ED3\u679C\u4EA4\u7ED9\u539F\u4F1A\u8BDD\u5224\u65AD" });
        } else {
          const reason = wake?.reason ?? (wake === void 0 ? "\u5BBF\u4E3B\u672A\u8FD4\u56DE\u5524\u9192\u7ED3\u679C\uFF0C\u8BF7\u91CD\u542F DSH \u540E\u91CD\u8BD5" : "\u539F\u56E0\u672A\u77E5");
          setNotice({ kind: "error", text: `\u6CA1\u80FD\u901A\u77E5\u539F\u4F1A\u8BDD\uFF1A${reason}` });
        }
      } else if (action === "wake") {
        if (wake?.ok === true) {
          setNotice({ kind: "ok", text: wake.resumed === true ? "\u5DF2\u6062\u590D\u539F\u4F1A\u8BDD" : "\u539F\u4F1A\u8BDD\u5DF2\u5524\u9192" });
        } else {
          const reason = wake?.reason ?? (wake === void 0 ? "\u5BBF\u4E3B\u672A\u8FD4\u56DE\u5524\u9192\u7ED3\u679C\uFF0C\u8BF7\u91CD\u542F DSH \u540E\u91CD\u8BD5" : "\u539F\u56E0\u672A\u77E5");
          setNotice({ kind: "error", text: `\u6CA1\u80FD\u5524\u9192\u539F\u4F1A\u8BDD\uFF1A${reason}` });
        }
      } else if (action === "review_cancel") {
        setNotice({ kind: "ok", text: "\u5DF2\u64A4\u56DE\u5224\u65AD\u8BF7\u6C42\uFF0C\u8FD4\u56DE\u539F\u72B6\u6001" });
      } else {
        setNotice({ kind: "ok", text: action === "regenerate" ? "\u5DF2\u63D0\u4EA4\u91CD\u65B0\u751F\u6210" : `\u5DF2\u6267\u884C\uFF1A${action}` });
      }
      await loadDetail(target);
      await loadList();
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : String(cause);
      setError(void 0);
      setNotice({ kind: "error", text: message });
    }
  }, [selected, detail, loadDetail, loadList]);
  const runPanelAction = (0, import_react.useCallback)(async (action) => {
    setNotice({ kind: "ok", text: action === "probe" ? "\u6B63\u5728\u81EA\u68C0\u2026" : "\u6B63\u5728\u6253\u5F00\u767B\u5F55\u7A97\u53E3\u2026" });
    try {
      const result = await postAction({ action });
      if (action === "probe") {
        const probe = result.probe ?? {};
        const ok = probe.ok === true;
        const parts = [
          `\u901A\u9053 ${String(result.channel ?? "?")}`,
          ok ? "\u81EA\u68C0\u901A\u8FC7" : "\u81EA\u68C0\u672A\u901A\u8FC7",
          probe.loggedIn === true ? "\u5DF2\u767B\u5F55" : "\u672A\u767B\u5F55",
          probe.model !== void 0 && probe.model !== "" ? `\u6A21\u578B ${String(probe.model)}` : void 0,
          typeof probe.reason === "string" && probe.reason !== "" ? `\u539F\u56E0 ${probe.reason}` : void 0
        ].filter((part) => part !== void 0);
        setNotice({ kind: ok ? "ok" : "error", text: parts.join(" \xB7 ") });
      } else {
        const login = result.login ?? {};
        setNotice({ kind: login.ok === false ? "error" : "ok", text: String(login.note ?? "\u767B\u5F55\u6D41\u7A0B\u5B8C\u6210") });
      }
    } catch (cause) {
      setError(void 0);
      setNotice({ kind: "error", text: cause instanceof Error ? cause.message : String(cause) });
    }
  }, []);
  const submitRegenerate = (0, import_react.useCallback)(async () => {
    const target = detail?.topic_id;
    if (selected === void 0 || target === void 0 || target !== selected) {
      setNotice({ kind: "error", text: "\u4E3B\u9898\u6B63\u5728\u5207\u6362\uFF0C\u8BF7\u7B49\u8BE6\u60C5\u52A0\u8F7D\u5B8C\u6210\u540E\u518D\u64CD\u4F5C" });
      return;
    }
    try {
      await postAction({ action: "regenerate", topic_id: target, note: regenNote.trim() });
      setNotice({ kind: "ok", text: "\u5DF2\u63D0\u4EA4\u91CD\u65B0\u751F\u6210" });
      setDetail((current) => current === void 0 ? current : { ...current, status: "queued" });
      setRegenOpen(false);
      setRegenNote("");
      await loadDetail(target);
      await loadList();
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : String(cause);
      setError(void 0);
      setNotice({ kind: "error", text: message });
    }
  }, [selected, detail, regenNote, loadDetail, loadList]);
  const submitContinue = (0, import_react.useCallback)(async () => {
    const target = detail?.topic_id;
    if (selected === void 0 || target === void 0 || target !== selected) {
      setNotice({ kind: "error", text: "\u4E3B\u9898\u6B63\u5728\u5207\u6362\uFF0C\u8BF7\u7B49\u8BE6\u60C5\u52A0\u8F7D\u5B8C\u6210\u540E\u518D\u64CD\u4F5C" });
      return;
    }
    const brief = continueNote.trim();
    if (brief === "") {
      setNotice({ kind: "error", text: "\u8BF7\u586B\u5199\u8FD9\u4E00\u8F6E\u8981\u8865\u5145\u7684\u95EE\u9898" });
      return;
    }
    let designs;
    if (detail?.type === "design") {
      designs = continueDesigns.trim() === "" ? detail.designs ?? 3 : Number(continueDesigns);
      if (!Number.isInteger(designs) || designs < 1 || designs > 6) {
        setNotice({ kind: "error", text: "\u65B9\u5411\u6570\u5FC5\u987B\u662F 1\u20136 \u7684\u6574\u6570" });
        return;
      }
    }
    try {
      await postAction({
        action: "continue",
        topic_id: target,
        brief,
        ...designs !== void 0 ? { designs } : {}
      });
      setNotice({ kind: "ok", text: "\u5DF2\u8FFD\u52A0\u4E00\u8F6E" });
      setDetail((current) => current === void 0 ? current : { ...current, status: "queued" });
      setContinueOpen(false);
      setContinueNote("");
      setContinueDesigns("");
      await loadDetail(target);
      await loadList();
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : String(cause);
      setError(void 0);
      setNotice({ kind: "error", text: message });
    }
  }, [selected, detail, continueNote, continueDesigns, loadDetail, loadList]);
  const submitHumanCheck = (0, import_react.useCallback)(async () => {
    if (selected === void 0 || checkOpen === void 0) return;
    const note = checkNote.trim();
    if (note === "") {
      setNotice({ kind: "error", text: "\u8BF7\u586B\u5199\u6838\u5BF9\u4F9D\u636E" });
      return;
    }
    await act("human_check", checkOpen, note);
    setCheckOpen(void 0);
    setCheckNote("");
  }, [selected, checkOpen, checkNote, act]);
  const list = (0, import_react.createElement)(
    "div",
    { style: { width: 240, borderRight: "1px solid rgba(127,127,127,.2)", overflowY: "auto", flex: "0 0 auto" } },
    (0, import_react.createElement)("div", { style: { padding: "10px 12px", fontWeight: 600, fontSize: 13, opacity: 0.8 } }, config.title),
    topics.length === 0 ? (0, import_react.createElement)(
      "div",
      { style: { padding: "8px 12px", opacity: 0.6, fontSize: 12, lineHeight: 1.6 } },
      config.designMode ? "\u8FD8\u6CA1\u6709\u8BBE\u8BA1\u4EFB\u52A1\u3002\u5728\u4F1A\u8BDD\u91CC\u7528 /gpt-image-design \u5F00\u59CB\u3002" : "\u8FD8\u6CA1\u6709\u7814\u7A76\u4EFB\u52A1\u3002\u5728\u4F1A\u8BDD\u91CC\u7528 /pro-research \u5F00\u59CB\u3002"
    ) : topics.map((topic) => (0, import_react.createElement)(
      "div",
      {
        key: topic.topic_id,
        onClick: () => {
          markTopicSeen(config.panelId, topic.topic_id, topic.updated);
          setSelected(topic.topic_id);
        },
        style: {
          padding: "8px 12px",
          cursor: "pointer",
          background: topic.topic_id === selected ? "rgba(127,127,127,.12)" : "transparent",
          borderBottom: "1px solid rgba(127,127,127,.12)"
        }
      },
      (0, import_react.createElement)(
        "div",
        { style: { display: "flex", alignItems: "center", fontSize: 13, fontWeight: 500 } },
        (0, import_react.createElement)(Dot, { status: topic.status }),
        (0, import_react.createElement)("span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, topic.title)
      ),
      (0, import_react.createElement)(
        "div",
        { style: { fontSize: 11, opacity: 0.65, marginLeft: 14, marginTop: 2 } },
        `${STATUS_LABEL[topic.status] ?? topic.status} \xB7 ${topic.rounds}/${topic.rounds_cap} \u8F6E`
      )
    ))
  );
  const hasArtifacts = (detail?.artifacts.length ?? 0) > 0;
  const canAccept = detail !== void 0 && (detail.status === "capped" || detail.status === "reviewing" && (detail.review_from === "capped" || hasArtifacts) || (detail.status === "failed" || detail.status === "stalled") && hasArtifacts);
  const canRegenerate = detail !== void 0 && (detail.status === "completed" || detail.status === "capped" || detail.status === "reviewing" || detail.status === "failed" || detail.status === "stalled");
  const canContinue = detail !== void 0 && (detail.status === "completed" || detail.status === "capped" || detail.status === "reviewing" || detail.status === "failed" || detail.status === "stalled");
  const body = (0, import_react.createElement)(
    "div",
    { style: { flex: 1, overflowY: "auto", padding: 14, fontSize: 13, lineHeight: 1.6 } },
    error !== void 0 ? (0, import_react.createElement)("div", { style: { color: "#c62828", marginBottom: 8 } }, `\u63A5\u53E3\u9519\u8BEF\uFF1A${error}`) : void 0,
    notice !== void 0 ? (0, import_react.createElement)("div", {
      style: {
        marginBottom: 8,
        padding: "6px 10px",
        borderRadius: 6,
        fontSize: 12,
        color: notice.kind === "ok" ? "#2e7d32" : "#c62828",
        background: notice.kind === "ok" ? "rgba(46,125,50,.1)" : "rgba(198,40,40,.1)"
      }
    }, notice.text) : void 0,
    detail === void 0 ? (0, import_react.createElement)("div", { style: { opacity: 0.6 } }, "\u9009\u62E9\u5DE6\u4FA7\u7684\u4E3B\u9898\u67E5\u770B\u8F6E\u6B21\u4E0E\u4EA7\u7269\u3002") : (0, import_react.createElement)(
      "div",
      {},
      (0, import_react.createElement)(
        "div",
        { style: { display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", paddingBottom: 8, borderBottom: "1px solid rgba(127,127,127,.18)" } },
        (0, import_react.createElement)("h3", { style: { margin: 0, fontSize: 17, fontWeight: 650, lineHeight: 1.3 } }, detail.title),
        statusPill(detail.status)
      ),
      (0, import_react.createElement)(
        "div",
        { style: { display: "flex", gap: 14, flexWrap: "wrap", margin: "8px 0", fontSize: 11, opacity: 0.62 } },
        (0, import_react.createElement)("span", {}, `${detail.rounds}/${detail.rounds_cap} \u8F6E`),
        (0, import_react.createElement)("span", {}, detail.type),
        channelLabel(detail.channel) !== void 0 ? (0, import_react.createElement)("span", {}, channelLabel(detail.channel)) : void 0,
        detail.model !== void 0 && detail.model !== "" ? (0, import_react.createElement)("span", {}, detail.model) : void 0,
        detail.designs != null ? (0, import_react.createElement)("span", {}, `\u6BCF\u8F6E\u65B9\u5411 ${detail.designs}`) : void 0,
        detail.updated !== void 0 ? (0, import_react.createElement)("span", {}, `\u66F4\u65B0 ${formatTime(detail.updated)}`) : void 0
      ),
      detail.stall_reason !== null ? (0, import_react.createElement)("div", { style: { color: "#ed6c02", marginBottom: 8, fontSize: 12 } }, `\u5361\u4F4F\u539F\u56E0\uFF1A${STALL_LABEL[detail.stall_reason] ?? detail.stall_reason}\uFF08${detail.stall_reason}\uFF09`) : void 0,
      detail.stop_reason !== null ? (0, import_react.createElement)("div", { style: { marginBottom: 8, fontSize: 12, opacity: 0.72 } }, `\u505C\u6B62\u4F9D\u636E\uFF1A${detail.stop_reason}`) : void 0,
      (detail.judge_enabled === false || detail.judge_enabled === void 0 && (detail.stop_reason ?? "").includes("\u672A\u914D\u7F6E\u88C1\u51B3\u6A21\u578B")) && detail.status === "capped" ? (0, import_react.createElement)("div", { style: { marginBottom: 8, fontSize: 11, color: "#ed6c02" } }, "\u5F53\u524D\u6CA1\u6709\u53EF\u7528\u7684\u81EA\u52A8\u88C1\u51B3\u6A21\u578B\uFF1A\u8DD1\u6EE1\u8F6E\u6B21\u540E\u8FDB\u5165\u5F85\u63A5\u53D7\u3002\u53EF\u4EE5\u63A5\u53D7\u3001\u91CD\u65B0\u751F\u6210\uFF0C\u6216\u70B9\u300C\u8BF7\u539F\u4F1A\u8BDD\u5224\u65AD\u300D\u3002") : void 0,
      detail.path !== void 0 ? (0, import_react.createElement)("div", { style: { opacity: 0.5, marginBottom: 10, wordBreak: "break-all", fontSize: 11 } }, detail.path) : void 0,
      (0, import_react.createElement)(
        "div",
        { style: { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 } },
        (0, import_react.createElement)("button", { onClick: () => void runPanelAction("probe"), style: buttonStyle() }, "\u81EA\u68C0"),
        (0, import_react.createElement)("button", { onClick: () => void runPanelAction("login"), style: buttonStyle() }, "\u767B\u5F55"),
        ACTIVE.has(detail.status) ? (0, import_react.createElement)("button", { onClick: () => void act("cancel"), style: buttonStyle() }, "\u53D6\u6D88") : void 0,
        detail.status === "stalled" || detail.status === "failed" ? (0, import_react.createElement)("button", { onClick: () => void act("resume"), style: buttonStyle() }, "\u6062\u590D") : void 0,
        canRegenerate ? (0, import_react.createElement)("button", { onClick: () => {
          setRegenNote("");
          setRegenOpen(true);
        }, style: buttonStyle() }, "\u91CD\u65B0\u751F\u6210") : void 0,
        canContinue ? (0, import_react.createElement)("button", { onClick: () => {
          setContinueNote("");
          setContinueDesigns("");
          setContinueOpen(true);
        }, style: buttonStyle() }, "\u7EE7\u7EED\u4E00\u8F6E") : void 0,
        canAccept ? (0, import_react.createElement)("button", { onClick: () => void act("accept"), style: buttonStyle() }, detail?.status === "capped" || detail?.status === "reviewing" ? "\u63A5\u53D7\u7ED3\u679C" : "\u63A5\u53D7\u5DF2\u6709\u4EA7\u7269") : void 0,
        detail.status === "capped" || detail.status === "reviewing" || (detail.status === "failed" || detail.status === "stalled") && hasArtifacts ? (0, import_react.createElement)("button", { onClick: () => void act("review"), style: buttonStyle() }, detail.status === "reviewing" ? "\u518D\u6B21\u63D0\u9192\u539F\u4F1A\u8BDD" : "\u8BF7\u539F\u4F1A\u8BDD\u5224\u65AD") : void 0,
        detail.status === "reviewing" ? (0, import_react.createElement)("button", { onClick: () => void act("review_cancel"), style: buttonStyle() }, "\u64A4\u56DE\u5224\u65AD\u8BF7\u6C42") : void 0,
        detail.status === "completed" ? (0, import_react.createElement)("button", { onClick: () => void act("wake"), style: buttonStyle() }, "\u5524\u9192\u539F\u4F1A\u8BDD") : void 0,
        detail.status === "stalled" ? (0, import_react.createElement)(
          "span",
          { style: { display: "flex", gap: 8 } },
          (0, import_react.createElement)("button", { onClick: () => {
            setCheckNote("");
            setCheckOpen("submitted");
          }, style: buttonStyle() }, "\u5DF2\u63D0\u4EA4"),
          (0, import_react.createElement)("button", { onClick: () => {
            setCheckNote("");
            setCheckOpen("not_submitted");
          }, style: buttonStyle() }, "\u672A\u63D0\u4EA4"),
          (0, import_react.createElement)("button", { onClick: () => {
            setCheckNote("");
            setCheckOpen("reopen");
          }, style: buttonStyle() }, "\u9700\u91CD\u5F00")
        ) : void 0
      ),
      regenOpen ? (0, import_react.createElement)(
        "div",
        {
          style: {
            maxWidth: 640,
            marginBottom: 18,
            padding: "12px 14px",
            border: "1px solid rgba(127,127,127,.22)",
            borderRadius: 10,
            background: "rgba(127,127,127,.05)",
            boxSizing: "border-box"
          }
        },
        (0, import_react.createElement)(
          "div",
          { style: { display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 } },
          (0, import_react.createElement)("div", { style: { fontSize: 12, fontWeight: 600 } }, "\u91CD\u65B0\u751F\u6210"),
          (0, import_react.createElement)("div", { style: { fontSize: 11, opacity: 0.55 } }, "\u53EF\u8865\u5145\u4E0D\u6EE1\u610F\u7684\u5730\u65B9\uFF1B\u63D0\u4EA4\u540E\u4FDD\u7559\u5DF2\u6709\u8F6E\u6B21")
        ),
        (0, import_react.createElement)("textarea", {
          value: regenNote,
          onChange: (event) => setRegenNote(event.target.value),
          rows: 3,
          placeholder: "\u4F8B\u5982\uFF1A\u4FDD\u7559\u7248\u5F0F\uFF0C\u53EA\u6539\u914D\u8272\uFF1B\u6807\u9898\u5FC5\u987B\u51FA\u73B0\u2026\u2026\uFF1B\u4E0D\u8981\u518D\u7528\u2026\u2026",
          style: {
            width: "100%",
            boxSizing: "border-box",
            resize: "vertical",
            padding: "8px 10px",
            borderRadius: 8,
            border: "1px solid rgba(127,127,127,.3)",
            background: "transparent",
            color: "inherit",
            fontSize: 12,
            lineHeight: 1.55
          }
        }),
        (0, import_react.createElement)(
          "div",
          { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap", marginTop: 8 } },
          (0, import_react.createElement)("span", { style: { fontSize: 11, opacity: 0.45 } }, "\u7559\u7A7A\u5219\u8BA9\u5B83\u76F4\u63A5\u6362\u4E00\u7248"),
          (0, import_react.createElement)(
            "div",
            { style: { display: "flex", gap: 8 } },
            (0, import_react.createElement)("button", { onClick: () => {
              setRegenOpen(false);
              setRegenNote("");
            }, style: buttonStyle() }, "\u53D6\u6D88"),
            (0, import_react.createElement)("button", {
              onClick: () => void submitRegenerate(),
              style: { ...buttonStyle(), borderColor: "rgba(111,159,208,.55)", background: "rgba(111,159,208,.16)" }
            }, "\u63D0\u4EA4\u91CD\u65B0\u751F\u6210")
          )
        )
      ) : void 0,
      continueOpen ? (0, import_react.createElement)(
        "div",
        {
          style: {
            maxWidth: 640,
            marginBottom: 18,
            padding: "12px 14px",
            border: "1px solid rgba(127,127,127,.22)",
            borderRadius: 10,
            background: "rgba(127,127,127,.05)",
            boxSizing: "border-box"
          }
        },
        (0, import_react.createElement)(
          "div",
          { style: { display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 } },
          (0, import_react.createElement)("div", { style: { fontSize: 12, fontWeight: 600 } }, "\u7EE7\u7EED\u4E00\u8F6E"),
          (0, import_react.createElement)("div", { style: { fontSize: 11, opacity: 0.55 } }, "\u53EA\u8FFD\u52A0\u4E00\u8F6E\uFF1B\u4E00\u6B21\u7EE7\u7EED\u4E0D\u4F1A\u987A\u5E26\u8DD1\u5B8C\u5269\u4F59\u4E0A\u9650")
        ),
        (0, import_react.createElement)("textarea", {
          value: continueNote,
          onChange: (event) => setContinueNote(event.target.value),
          rows: 3,
          placeholder: "\u8FD9\u4E00\u8F6E\u53EA\u8865\u5145\u4EC0\u4E48\uFF1F\u4F8B\u5982\uFF1A\u53EA\u67E5\u90E8\u7F72\u98CE\u9669\uFF1B\u53EA\u6539\u914D\u8272\uFF0C\u4FDD\u7559\u7248\u5F0F",
          style: {
            width: "100%",
            boxSizing: "border-box",
            resize: "vertical",
            padding: "8px 10px",
            borderRadius: 8,
            border: "1px solid rgba(127,127,127,.3)",
            background: "transparent",
            color: "inherit",
            fontSize: 12,
            lineHeight: 1.55
          }
        }),
        detail.type === "design" ? (0, import_react.createElement)(
          "div",
          { style: { marginTop: 8, display: "flex", alignItems: "center", gap: 8, fontSize: 11, opacity: 0.75 } },
          (0, import_react.createElement)("span", {}, "\u672C\u8F6E\u65B9\u5411\u6570"),
          (0, import_react.createElement)("input", {
            type: "number",
            min: 1,
            max: 6,
            value: continueDesigns,
            placeholder: String(detail.designs ?? 3),
            onChange: (event) => setContinueDesigns(event.target.value),
            style: {
              width: 64,
              padding: "4px 6px",
              borderRadius: 6,
              border: "1px solid rgba(127,127,127,.3)",
              background: "transparent",
              color: "inherit"
            }
          })
        ) : void 0,
        (0, import_react.createElement)(
          "div",
          { style: { display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 } },
          (0, import_react.createElement)("button", { onClick: () => {
            setContinueOpen(false);
            setContinueNote("");
            setContinueDesigns("");
          }, style: buttonStyle() }, "\u53D6\u6D88"),
          (0, import_react.createElement)("button", {
            onClick: () => void submitContinue(),
            style: { ...buttonStyle(), borderColor: "rgba(111,159,208,.55)", background: "rgba(111,159,208,.16)" }
          }, "\u63D0\u4EA4\u7EE7\u7EED")
        )
      ) : void 0,
      checkOpen !== void 0 ? (0, import_react.createElement)(
        "div",
        {
          style: {
            maxWidth: 640,
            marginBottom: 18,
            padding: "12px 14px",
            border: "1px solid rgba(127,127,127,.22)",
            borderRadius: 10,
            background: "rgba(127,127,127,.05)",
            boxSizing: "border-box"
          }
        },
        (0, import_react.createElement)(
          "div",
          { style: { fontSize: 12, fontWeight: 600, marginBottom: 8 } },
          `\u4EBA\u5DE5\u6838\u5BF9\uFF1A${checkOpen === "submitted" ? "\u786E\u8BA4\u5DF2\u63D0\u4EA4" : checkOpen === "not_submitted" ? "\u786E\u8BA4\u672A\u63D0\u4EA4" : "\u9700\u8981\u91CD\u5F00"}`
        ),
        (0, import_react.createElement)("textarea", {
          value: checkNote,
          onChange: (event) => setCheckNote(event.target.value),
          rows: 2,
          placeholder: "\u5199\u4E00\u4E0B\u6838\u5BF9\u4F9D\u636E\uFF0C\u65B9\u4FBF\u540E\u7EED\u8FFD\u6EAF\uFF08\u5FC5\u586B\uFF09",
          style: {
            width: "100%",
            boxSizing: "border-box",
            resize: "vertical",
            padding: "8px 10px",
            borderRadius: 8,
            border: "1px solid rgba(127,127,127,.3)",
            background: "transparent",
            color: "inherit",
            fontSize: 12,
            lineHeight: 1.55
          }
        }),
        (0, import_react.createElement)(
          "div",
          { style: { display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 } },
          (0, import_react.createElement)("button", { onClick: () => {
            setCheckOpen(void 0);
            setCheckNote("");
          }, style: buttonStyle() }, "\u53D6\u6D88"),
          (0, import_react.createElement)("button", { onClick: () => void submitHumanCheck(), style: buttonStyle() }, "\u63D0\u4EA4\u6838\u5BF9")
        )
      ) : void 0,
      (0, import_react.createElement)("div", { style: { fontWeight: 600, marginBottom: 6, fontSize: 13 } }, "\u8F6E\u6B21"),
      (detail.rounds_detail ?? []).length === 0 ? (0, import_react.createElement)("div", { style: { opacity: 0.6 } }, "\u8FD8\u6CA1\u6709\u63D0\u4EA4\u8BB0\u5F55\u3002") : (0, import_react.createElement)("div", {}, renderGenerations(detail, detail.rounds_detail ?? [])),
      renderArtifacts(detail)
    )
  );
  return (0, import_react.createElement)(
    "div",
    { style: { display: "flex", height: "100%", minHeight: 0, color: "inherit" } },
    list,
    body,
    viewer !== void 0 ? renderViewer(viewer, {
      basePath: detail?.path,
      notice: viewerNotice,
      onNotice: setViewerNotice
    }) : void 0
  );
}
function statusPill(status) {
  const color = STATUS_COLOR[status] ?? "rgba(127,127,127,.9)";
  return (0, import_react.createElement)("span", {
    style: {
      fontSize: 10,
      fontWeight: 600,
      padding: "3px 8px",
      borderRadius: 999,
      color,
      background: "rgba(127,127,127,.12)",
      border: "1px solid rgba(127,127,127,.18)",
      lineHeight: 1.2
    }
  }, STATUS_LABEL[status] ?? status);
}
function renderViewer(view, options) {
  const body = view.kind === "image" && view.src !== void 0 ? (0, import_react.createElement)("img", {
    src: view.src,
    alt: view.title,
    style: { maxWidth: "100%", maxHeight: "74vh", objectFit: "contain", display: "block", margin: "0 auto" }
  }) : view.kind === "frame" && view.src !== void 0 ? (0, import_react.createElement)("iframe", {
    src: view.src,
    sandbox: "allow-scripts",
    title: view.title,
    style: { width: "100%", height: "74vh", border: 0, background: "#fff" }
  }) : (0, import_react.createElement)("pre", {
    style: {
      margin: 0,
      padding: 16,
      maxHeight: "74vh",
      overflow: "auto",
      whiteSpace: "pre-wrap",
      wordBreak: "break-word",
      fontFamily: "ui-monospace, SFMono-Regular, Consolas, monospace",
      fontSize: 12,
      lineHeight: 1.55
    }
  }, view.text ?? "");
  return (0, import_react.createElement)("div", {
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 2147483e3,
      background: "rgba(0,0,0,.55)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24
    },
    onClick: () => showViewer(void 0)
  }, (0, import_react.createElement)(
    "div",
    {
      role: "dialog",
      "aria-modal": true,
      "aria-label": view.title,
      onClick: (event) => event.stopPropagation(),
      style: {
        background: "Canvas",
        color: "CanvasText",
        borderRadius: 12,
        width: "min(92vw, 980px)",
        maxHeight: "88vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        border: "1px solid rgba(127,127,127,.25)",
        boxShadow: "0 24px 80px rgba(0,0,0,.45)"
      }
    },
    (0, import_react.createElement)(
      "div",
      { style: { display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderBottom: "1px solid rgba(127,127,127,.2)" } },
      (0, import_react.createElement)("div", { style: { fontWeight: 600, fontSize: 13, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, view.title),
      (0, import_react.createElement)("button", { onClick: () => showViewer(void 0), style: buttonStyle() }, "\u5173\u95ED")
    ),
    (0, import_react.createElement)("div", { style: { overflow: "auto", flex: 1, minHeight: 0, background: view.kind === "frame" ? "#fff" : "transparent" } }, body),
    viewerActions(view, options)
  ));
  function viewerActions(view2, options2) {
    const buttons = [];
    const run = (label, success, task) => (0, import_react.createElement)("button", {
      key: label,
      onClick: () => {
        options2.onNotice("\u5904\u7406\u4E2D\u2026");
        void task().then(() => options2.onNotice(success)).catch((error) => options2.onNotice(error instanceof Error ? error.message : String(error)));
      },
      style: buttonStyle()
    }, label);
    if (view2.kind === "image" && view2.src !== void 0) {
      buttons.push(run("\u590D\u5236\u56FE\u7247", "\u56FE\u7247\u5DF2\u590D\u5236\u5230\u526A\u8D34\u677F", () => copyImage(view2.src)));
    }
    if (view2.path !== void 0) {
      const native = fullPath(options2.basePath, view2.path);
      buttons.push(run("\u590D\u5236\u8DEF\u5F84", "\u6587\u4EF6\u8DEF\u5F84\u5DF2\u590D\u5236", () => navigator.clipboard.writeText(native)));
      if (view2.topicId !== void 0) {
        buttons.push(run("\u6253\u5F00\u539F\u6587\u4EF6", "\u5DF2\u8BF7\u6C42\u6253\u5F00\u539F\u6587\u4EF6", () => openArtifact(view2.topicId, view2.path, false)));
        buttons.push(run("\u5728\u6587\u4EF6\u5939\u4E2D\u663E\u793A", "\u5DF2\u5728\u6587\u4EF6\u5939\u4E2D\u5B9A\u4F4D", () => openArtifact(view2.topicId, view2.path, true)));
      }
    }
    if (buttons.length === 0 && options2.notice === void 0) return void 0;
    return (0, import_react.createElement)(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
          padding: "9px 14px",
          borderTop: "1px solid rgba(127,127,127,.2)",
          background: "rgba(127,127,127,.04)"
        }
      },
      buttons,
      (0, import_react.createElement)("span", { style: { marginLeft: "auto", fontSize: 11, opacity: 0.65 } }, options2.notice ?? "")
    );
  }
  async function copyImage(src) {
    if (navigator.clipboard === void 0 || typeof ClipboardItem === "undefined") {
      throw new Error("\u5F53\u524D\u73AF\u5883\u4E0D\u652F\u6301\u590D\u5236\u56FE\u7247");
    }
    const response = await fetch(src);
    if (!response.ok) throw new Error(`\u8BFB\u53D6\u56FE\u7247\u5931\u8D25\uFF1A${response.status}`);
    const blob = await response.blob();
    let png = blob;
    if (blob.type !== "image/png") {
      const bitmap = await createImageBitmap(blob);
      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const context = canvas.getContext("2d");
      if (context === null) throw new Error("\u65E0\u6CD5\u8F6C\u6362\u56FE\u7247");
      context.drawImage(bitmap, 0, 0);
      png = await new Promise((resolve, reject) => {
        canvas.toBlob((candidate) => candidate === null ? reject(new Error("\u65E0\u6CD5\u8F6C\u6362\u56FE\u7247")) : resolve(candidate), "image/png");
      });
    }
    await navigator.clipboard.write([new ClipboardItem({ "image/png": png })]);
  }
  function fullPath(base, path) {
    if (base === void 0 || base === "") return path;
    const separator = base.includes("\\") ? "\\" : "/";
    return `${base.replace(/[\\/]+$/, "")}${separator}${path.replace(/[\\/]/g, separator)}`;
  }
  async function openArtifact(topicId, path, reveal) {
    const response = await fetch(`${config.routes}/open`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ topic_id: topicId, path, reveal })
    });
    if (!response.ok) {
      const text = await response.text().catch(() => "");
      let message = text === "" ? `${response.status}` : text;
      try {
        const parsed = JSON.parse(text);
        if (typeof parsed.error === "string") message = parsed.error;
      } catch {
      }
      throw new Error(message);
    }
  }
}
function artifactKind(detail, path) {
  const known = detail.artifact_details?.find((item) => item.path === path);
  if (known !== void 0) return known.kind;
  if (/\.(png|jpe?g|webp|gif|svg)$/i.test(path)) return "image";
  if (/\.html?$/i.test(path)) return "demo";
  if (/\.zip$/i.test(path)) return "archive";
  return "code";
}
function bundleUrl(topicId, round) {
  return `${config.routes}/bundle?id=${encodeURIComponent(topicId)}&round=${round}`;
}
function assetUrl(topicId, path) {
  return `${config.routes}/asset?id=${encodeURIComponent(topicId)}&path=${encodeURIComponent(path)}`;
}
function rawUrl(topicId, path) {
  const encoded = path.replace(/\\/g, "/").split("/").map(encodeURIComponent).join("/");
  return `${config.routes}/raw/${encodeURIComponent(topicId)}/${encoded}`;
}
function renderArtifacts(detail) {
  const artifacts = detail.artifacts ?? [];
  if (artifacts.length === 0) return void 0;
  if (!config.designMode) {
    return (0, import_react.createElement)(
      "div",
      { style: { marginTop: 10 } },
      (0, import_react.createElement)("div", { style: { fontWeight: 600, marginBottom: 4 } }, "\u5168\u90E8\u4EA7\u7269"),
      (0, import_react.createElement)(
        "div",
        { style: { display: "flex", gap: 6, flexWrap: "wrap" } },
        artifacts.map((path) => artifactChip(detail.topic_id, path))
      )
    );
  }
  const images = artifacts.filter((path) => artifactKind(detail, path) === "image");
  const demos = artifacts.filter((path) => artifactKind(detail, path) === "demo");
  const files = artifacts.filter((path) => artifactKind(detail, path) !== "image");
  return (0, import_react.createElement)(
    "div",
    { style: { marginTop: 14 } },
    images.length > 0 ? (0, import_react.createElement)(
      "div",
      {},
      (0, import_react.createElement)("div", { style: { fontWeight: 600, marginBottom: 6 } }, "\u5168\u90E8\u56FE\u7247"),
      (0, import_react.createElement)(
        "div",
        { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 8 } },
        images.map((path) => (0, import_react.createElement)("button", {
          key: path,
          onClick: () => openViewerImage(detail.topic_id, path),
          style: { padding: 0, border: "none", background: "transparent", cursor: "zoom-in", borderRadius: 8, overflow: "hidden" }
        }, (0, import_react.createElement)("img", {
          src: assetUrl(detail.topic_id, path),
          alt: path,
          style: { width: "100%", display: "block", borderRadius: 8, border: "1px solid rgba(127,127,127,.25)" }
        })))
      )
    ) : void 0,
    demos.length > 0 ? (0, import_react.createElement)(
      "div",
      { style: { marginTop: 12 } },
      (0, import_react.createElement)("div", { style: { fontWeight: 600, marginBottom: 6 } }, "\u524D\u7AEF demo"),
      demos.map((path) => (0, import_react.createElement)("iframe", {
        key: path,
        src: rawUrl(detail.topic_id, path),
        sandbox: "allow-scripts",
        title: path,
        style: { width: "100%", height: 420, border: "1px solid rgba(127,127,127,.25)", borderRadius: 8, background: "#fff" }
      }))
    ) : void 0,
    files.length > 0 ? (0, import_react.createElement)(
      "div",
      { style: { marginTop: 12 } },
      (0, import_react.createElement)("div", { style: { fontWeight: 600, marginBottom: 6 } }, "\u4EE3\u7801\u4E0E\u6587\u4EF6"),
      (0, import_react.createElement)(
        "div",
        { style: { display: "flex", gap: 6, flexWrap: "wrap" } },
        files.flatMap((path) => {
          const chips = [artifactChip(detail.topic_id, path)];
          if (artifactKind(detail, path) === "demo") {
            chips.push((0, import_react.createElement)("button", {
              key: `preview-${path}`,
              onClick: () => showViewer({
                kind: "frame",
                title: path.split("/").pop() ?? path,
                topicId: detail.topic_id,
                src: rawUrl(detail.topic_id, path),
                path
              }),
              style: chipStyle()
            }, `\u9884\u89C8 ${path.split("/").pop() ?? path}`));
          }
          return chips;
        })
      )
    ) : void 0,
    (0, import_react.createElement)("div", { style: { marginTop: 8, opacity: 0.6, fontSize: 11, wordBreak: "break-all" } }, artifacts.join("\u3001"))
  );
}
function renderGenerations(detail, rounds) {
  const generations = detail.generations !== void 0 && detail.generations.length > 0 ? detail.generations : [{ n: 1, createdAt: detail.created ?? "", reason: "\u521D\u59CB\u4EFB\u52A1" }];
  const groups = /* @__PURE__ */ new Map();
  for (const round of rounds) {
    const n = round.generation ?? 1;
    const list = groups.get(n) ?? [];
    list.push(round);
    groups.set(n, list);
  }
  for (const generation of generations) {
    if (!groups.has(generation.n)) groups.set(generation.n, []);
  }
  return [...generations].sort((left, right) => left.n - right.n).map((generation) => (0, import_react.createElement)(
    "div",
    { key: generation.n, style: { marginBottom: 20, maxWidth: 980 } },
    (0, import_react.createElement)(
      "div",
      { style: { display: "flex", gap: 10, alignItems: "baseline", flexWrap: "wrap", paddingBottom: 6, marginBottom: 8, borderBottom: "1px solid rgba(127,127,127,.18)" } },
      (0, import_react.createElement)("strong", { style: { fontSize: 13 } }, `\u7B2C ${generation.n} \u7248`),
      generation.reason !== void 0 && generation.reason !== "" ? (0, import_react.createElement)("span", { style: { fontSize: 11, opacity: 0.62, flex: 1, minWidth: 160 } }, generation.reason) : void 0,
      generation.createdAt !== "" ? (0, import_react.createElement)("span", { style: { fontSize: 11, opacity: 0.45 } }, formatTime(generation.createdAt)) : void 0,
      generation.rounds !== void 0 ? (0, import_react.createElement)(
        "span",
        { style: { fontSize: 11, opacity: 0.5, fontVariantNumeric: "tabular-nums" } },
        `${(groups.get(generation.n) ?? []).length}/${generation.rounds} \u8F6E`
      ) : void 0,
      generation.final !== void 0 ? (0, import_react.createElement)("button", {
        onClick: () => void openTopicFile(detail.topic_id, generation.final),
        style: chipStyle()
      }, "\u672C\u7248\u603B\u7ED3") : void 0
    ),
    (groups.get(generation.n) ?? []).length === 0 ? (0, import_react.createElement)("div", { style: { opacity: 0.55, fontSize: 12 } }, "\u7B49\u5F85\u63D0\u4EA4\u2026") : renderRoundTable(detail, groups.get(generation.n) ?? [], generation.n)
  ));
}
function renderRoundTable(detail, rounds, generation) {
  const header = ["\u8F6E\u6B21", "\u88C1\u51B3", "\u9644\u4EF6", "\u63D0\u4EA4", "\u5B8C\u6210", "\u91CD\u8BD5", "\u64CD\u4F5C"];
  return (0, import_react.createElement)(
    "div",
    { style: { overflowX: "auto" } },
    (0, import_react.createElement)(
      "table",
      { style: { width: "100%", borderCollapse: "collapse", fontSize: 12, tableLayout: "auto" } },
      (0, import_react.createElement)("thead", {}, (0, import_react.createElement)("tr", {}, header.map((label) => (0, import_react.createElement)("th", {
        key: label,
        style: {
          textAlign: "left",
          padding: "6px 8px",
          borderBottom: "1px solid rgba(127,127,127,.25)",
          fontSize: 11,
          fontWeight: 500,
          opacity: 0.55,
          whiteSpace: "nowrap"
        }
      }, label)))),
      (0, import_react.createElement)("tbody", {}, rounds.flatMap((round, index) => renderRoundRows(detail, round, `${generation}-${index + 1}`)))
    )
  );
}
function renderRoundRows(detail, round, label) {
  const prefix = `/round-${String(round.n).padStart(2, "0")}/`;
  const artifacts = round.artifacts ?? (detail.artifacts ?? []).filter((path) => path.includes(prefix));
  const attempts = round.attempts ?? 1;
  const verdict = round.verdict ?? (round.answeredAt !== void 0 ? "\u5DF2\u7B54\u590D" : "\u8FDB\u884C\u4E2D");
  const verdictColor = round.verdict === "accepted" ? "#5f9c7a" : round.verdict === "rejected" ? "#c26a6a" : round.verdict === "partial" ? "#c39a4a" : "#6f9fd0";
  const cell = (child, extra2 = {}) => (0, import_react.createElement)("td", {
    style: { padding: "8px", borderBottom: "1px solid rgba(127,127,127,.13)", verticalAlign: "top", ...extra2 }
  }, child);
  const main = (0, import_react.createElement)(
    "tr",
    { key: `round-${round.n}` },
    cell((0, import_react.createElement)("span", { style: { fontVariantNumeric: "tabular-nums", fontWeight: 600 } }, label), { whiteSpace: "nowrap" }),
    cell((0, import_react.createElement)("span", { style: { color: verdictColor } }, verdict), { whiteSpace: "nowrap" }),
    cell(String(round.files)),
    cell(round.submittedAt !== void 0 ? formatTime(round.submittedAt) : "\u2014", { whiteSpace: "nowrap", opacity: 0.7 }),
    cell(round.answeredAt !== void 0 ? formatTime(round.answeredAt) : ACTIVE.has(detail.status) ? "\u8FDB\u884C\u4E2D" : "\u2014", { whiteSpace: "nowrap", opacity: 0.7 }),
    cell(attempts > 1 ? String(attempts - 1) : "\u2014", { whiteSpace: "nowrap", opacity: attempts > 1 ? 0.9 : 0.45 }),
    cell((0, import_react.createElement)(
      "div",
      { style: { display: "flex", gap: 6, flexWrap: "wrap" } },
      (0, import_react.createElement)("button", { onClick: () => void openAnswer(detail.topic_id, round.n), style: chipStyle() }, "\u67E5\u770B\u56DE\u7B54"),
      artifacts.length > 0 ? (0, import_react.createElement)("a", {
        href: bundleUrl(detail.topic_id, round.n),
        download: `round-${String(round.n).padStart(2, "0")}.zip`,
        style: { ...chipStyle(), textDecoration: "none" }
      }, "\u4E0B\u8F7D ZIP") : void 0
    ), { whiteSpace: "nowrap" })
  );
  if (artifacts.length === 0) return [main];
  const images = artifacts.filter((path) => artifactKind(detail, path) === "image");
  const files = artifacts.filter((path) => artifactKind(detail, path) !== "image");
  const extra = (0, import_react.createElement)(
    "tr",
    { key: `artifacts-${round.n}` },
    (0, import_react.createElement)(
      "td",
      {
        colSpan: 7,
        style: { padding: "0 8px 10px", borderBottom: "1px solid rgba(127,127,127,.13)" }
      },
      (0, import_react.createElement)(
        "div",
        { style: { display: "flex", flexDirection: "column", gap: 8, paddingTop: 8 } },
        images.length > 0 ? (0, import_react.createElement)(
          "div",
          { style: { display: "flex", gap: 8, flexWrap: "wrap" } },
          images.map((path) => (0, import_react.createElement)("button", {
            key: path,
            onClick: () => openViewerImage(detail.topic_id, path),
            title: "\u67E5\u770B\u5927\u56FE",
            style: {
              padding: 0,
              border: "1px solid rgba(127,127,127,.22)",
              borderRadius: 8,
              background: "transparent",
              cursor: "zoom-in",
              overflow: "hidden"
            }
          }, (0, import_react.createElement)("img", {
            src: assetUrl(detail.topic_id, path),
            alt: path,
            style: { width: 148, height: 96, objectFit: "cover", display: "block" }
          })))
        ) : void 0,
        files.length > 0 ? (0, import_react.createElement)(
          "div",
          { style: { display: "flex", gap: 6, flexWrap: "wrap" } },
          files.flatMap((path) => {
            const chips = [artifactChip(detail.topic_id, path)];
            if (artifactKind(detail, path) === "demo") {
              chips.push((0, import_react.createElement)("button", {
                key: `preview-${path}`,
                onClick: () => showViewer({
                  kind: "frame",
                  title: path.split("/").pop() ?? path,
                  topicId: detail.topic_id,
                  src: rawUrl(detail.topic_id, path),
                  path
                }),
                style: chipStyle()
              }, `\u9884\u89C8 ${path.split("/").pop() ?? path}`));
            }
            return chips;
          })
        ) : void 0
      )
    )
  );
  return [main, extra];
}
function artifactChip(topicId, path) {
  const name = path.split("/").pop() ?? path;
  if (/\.(png|jpe?g|webp|gif|svg)$/i.test(path)) {
    return (0, import_react.createElement)("button", {
      key: path,
      onClick: () => openViewerImage(topicId, path),
      style: chipStyle(),
      title: "\u67E5\u770B\u5927\u56FE"
    }, name);
  }
  if (/\.zip$/i.test(path)) {
    return (0, import_react.createElement)("a", {
      key: path,
      href: assetUrl(topicId, path),
      download: name,
      style: { ...chipStyle(), textDecoration: "none" },
      title: "\u4E0B\u8F7D\u538B\u7F29\u5305"
    }, name);
  }
  if (/\.html?$/i.test(path)) {
    return (0, import_react.createElement)("button", {
      key: path,
      onClick: () => showViewer({ kind: "frame", title: name, topicId, src: rawUrl(topicId, path), path }),
      style: chipStyle(),
      title: "\u9884\u89C8 demo"
    }, `${name} \u2197`);
  }
  return (0, import_react.createElement)("button", {
    key: path,
    onClick: () => void openTopicFile(topicId, path),
    style: chipStyle(),
    title: "\u67E5\u770B\u6587\u4EF6"
  }, name);
}
function openViewerImage(topicId, path) {
  const name = path.split("/").pop() ?? path;
  showViewer({ kind: "image", title: name, topicId, src: assetUrl(topicId, path), path });
}
async function openAnswer(topicId, round) {
  try {
    const text = await fetchText(`${config.routes}/answer?id=${encodeURIComponent(topicId)}&round=${round}`);
    showViewer({ kind: "text", title: `\u7B2C ${round} \u8F6E\u56DE\u7B54`, topicId, text });
  } catch (cause) {
    showViewer({ kind: "text", title: "\u8BFB\u53D6\u56DE\u7B54\u5931\u8D25", topicId, text: cause instanceof Error ? cause.message : String(cause) });
  }
}
async function openTopicFile(topicId, path) {
  const name = path.split("/").pop() ?? path;
  try {
    const text = await fetchText(`${config.routes}/file?id=${encodeURIComponent(topicId)}&path=${encodeURIComponent(path)}`);
    showViewer({ kind: "text", title: name, topicId, text, path });
  } catch (cause) {
    showViewer({ kind: "text", title: name, topicId, text: cause instanceof Error ? cause.message : String(cause), path });
  }
}
async function fetchText(url) {
  const response = await fetch(url, { headers: { accept: "text/plain, text/markdown" } });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return await response.text();
}
function formatTime(value) {
  return value === void 0 ? "\u2014" : value.slice(0, 16).replace("T", " ");
}
function chipStyle() {
  return {
    padding: "2px 8px",
    borderRadius: 999,
    border: "1px solid rgba(127,127,127,.35)",
    background: "transparent",
    color: "inherit",
    cursor: "pointer",
    fontSize: 11,
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center"
  };
}
function buttonStyle() {
  return {
    padding: "4px 10px",
    borderRadius: 6,
    border: "1px solid rgba(127,127,127,.35)",
    background: "transparent",
    color: "inherit",
    cursor: "pointer",
    fontSize: 12
  };
}
function Icon({ kind }) {
  const svg = kind === "design" ? DESIGN_ICON : RESEARCH_ICON;
  return (0, import_react.createElement)("span", {
    "aria-hidden": true,
    style: { display: "inline-flex", width: 16, height: 16, lineHeight: 0, color: "inherit" },
    dangerouslySetInnerHTML: { __html: svg }
  });
}
function apply(ctx) {
  ctx.slots.inject("main", () => ctx.slots.register({ name: "main", key: config.panelId }, () => (0, import_react.createElement)(Panel)));
  ctx.slots.inject("sidebar.panellist", () => ctx.slots.register({ name: "sidebar.panellist", id: config.panelId, order: 21, label: () => config.label }, () => (0, import_react.createElement)(Icon, { kind: config.icon })));
  const disposeBadge = mountSidebarStatus({ label: config.label, routes: config.routes, panelId: config.panelId });
  if (typeof ctx.effect === "function") ctx.effect(() => disposeBadge, `${config.panelId}: sidebar status badge`);
}

// packages/research/client/index.tsx
configure({
  routes: "/chatgpt-pro-research",
  panelId: "chatgpt-pro-research",
  title: "ChatGPT Pro Research",
  label: "Pro Research",
  icon: "research",
  designMode: false
});
return module.exports;
} });
