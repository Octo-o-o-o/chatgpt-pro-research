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
var import_jsx_runtime = require("react/jsx-runtime");
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
var FILTERS = [
  { id: "all", label: "\u5168\u90E8" },
  { id: "active", label: "\u8FDB\u884C\u4E2D" },
  { id: "attention", label: "\u9700\u5904\u7406" },
  { id: "done", label: "\u5DF2\u7ED3\u675F" }
];
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
var STATUS_TONE = {
  draft: "muted",
  queued: "active",
  uploading: "active",
  submitted: "active",
  waiting: "active",
  answered: "active",
  adjudicating: "active",
  completed: "success",
  capped: "capped",
  reviewing: "review",
  stalled: "warn",
  failed: "error",
  cancelled: "muted"
};
var ACTIVE = /* @__PURE__ */ new Set(["queued", "uploading", "submitted", "waiting", "answered", "adjudicating"]);
var ATTENTION = /* @__PURE__ */ new Set(["capped", "reviewing", "stalled", "failed"]);
var DONE = /* @__PURE__ */ new Set(["completed", "cancelled"]);
var STALL_LABEL = {
  login: "\u767B\u5F55\u5931\u6548",
  upload: "\u6750\u6599\u4E0A\u4F20\u4E0D\u5B8C\u6574",
  timeout: "\u8D85\u65F6\u6216\u65E0\u8FDB\u5C55",
  ui: "\u9875\u9762\u7ED3\u6784\u53D8\u5316",
  config: "\u914D\u7F6E\u6216\u8BF7\u6C42\u53C2\u6570\u88AB\u62D2",
  worker: "\u6D4F\u89C8\u5668\u8FDB\u7A0B\u5D29\u6E83",
  unknown_submission: "\u63D0\u4EA4\u72B6\u6001\u672A\u77E5"
};
var showViewer = () => {
};
function toneOf(status) {
  return STATUS_TONE[status] ?? "muted";
}
function statusLabel(status) {
  return STATUS_LABEL[status] ?? status;
}
function attentionLabel(topic) {
  if (topic.status === "capped" || topic.status === "reviewing") return "\u5F85\u5904\u7406";
  if (topic.status === "stalled") return "\u5361\u4F4F";
  if (topic.status === "failed") return "\u5931\u8D25";
  return void 0;
}
function channelLabel(channel) {
  if (channel === void 0 || channel === "") return void 0;
  return channel === "api" ? "API \u751F\u56FE" : "\u7F51\u9875\u4F1A\u8BDD";
}
function formatTime(value) {
  return value === void 0 || value === "" ? "\u2014" : value.slice(0, 16).replace("T", " ");
}
function formatRelative(value) {
  if (value === void 0 || value === "") return "\u2014";
  const time = Date.now() - new Date(value).getTime();
  if (!Number.isFinite(time)) return formatTime(value);
  const abs = Math.abs(time);
  if (abs < 6e4) return "\u521A\u521A";
  if (abs < 36e5) return `${Math.floor(abs / 6e4)} \u5206\u949F\u524D`;
  if (abs < 864e5) return `${Math.floor(abs / 36e5)} \u5C0F\u65F6\u524D`;
  if (abs < 7 * 864e5) return `${Math.floor(abs / 864e5)} \u5929\u524D`;
  return value.slice(0, 10);
}
function artifactName(path) {
  return path.split("/").pop() ?? path;
}
function roundOf(path) {
  const match = path.match(/round-(\d+)/i);
  return match !== null ? Number(match[1]) : void 0;
}
function artifactDisplayName(path) {
  const round = roundOf(path);
  return round !== void 0 ? `R${round} \xB7 ${artifactName(path)}` : artifactName(path);
}
function artifactKind(detail, path) {
  const known = detail.artifact_details?.find((item) => item.path === path);
  if (known !== void 0) return known.kind;
  if (/\.(png|jpe?g|webp|gif|svg)$/i.test(path)) return "image";
  if (/\.html?$/i.test(path)) return "demo";
  if (/\.zip$/i.test(path)) return "archive";
  return "code";
}
function imageArtifacts(detail) {
  return detail.artifacts.filter((path) => artifactKind(detail, path) === "image").sort((left, right) => left.localeCompare(right));
}
function demoArtifacts(detail) {
  return detail.artifacts.filter((path) => artifactKind(detail, path) === "demo").sort((left, right) => left.localeCompare(right));
}
function fileArtifacts(detail) {
  return detail.artifacts.filter((path) => {
    const kind = artifactKind(detail, path);
    return kind !== "image" && kind !== "demo";
  }).sort((left, right) => left.localeCompare(right));
}
function generationList(detail) {
  const generations = detail.generations !== void 0 && detail.generations.length > 0 ? [...detail.generations] : [{ n: 1, createdAt: detail.created ?? "", reason: "\u521D\u59CB\u4EFB\u52A1" }];
  return generations.sort((left, right) => left.n - right.n);
}
function latestFinal(detail) {
  const finalDoc = detail.artifacts.find((path) => /(^|\/)final\.md$/i.test(path));
  if (finalDoc !== void 0) return finalDoc;
  const generations = [...generationList(detail)].reverse();
  for (const generation of generations) {
    if (generation.final !== void 0 && generation.final !== "") return generation.final;
  }
  return void 0;
}
function generationRounds(detail, generation) {
  return (detail.rounds_detail ?? []).filter((round) => (round.generation ?? 1) === generation).sort((left, right) => left.n - right.n);
}
function latestRound(detail) {
  return [...detail.rounds_detail ?? []].sort((left, right) => right.n - left.n)[0];
}
function roundArtifacts(detail, round) {
  if (round.artifacts !== void 0) return round.artifacts;
  const prefix = `/round-${String(round.n).padStart(2, "0")}/`;
  return (detail.artifacts ?? []).filter((path) => path.includes(prefix));
}
function generationLabel(generation, rounds) {
  const total = generation.rounds ?? rounds.length;
  return `${rounds.length}/${total} \u8F6E`;
}
function outcomeOf(round) {
  if (round.verdict === "accepted") return { label: "accepted", tone: "accepted" };
  if (round.verdict === "partial") return { label: "partial", tone: "partial" };
  if (round.verdict === "rejected") return { label: "rejected", tone: "rejected" };
  if (round.answeredAt !== void 0) return { label: "\u5DF2\u7B54\u590D", tone: "answered" };
  return { label: "\u8FDB\u884C\u4E2D", tone: "pending" };
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
async function copyText(text) {
  if (navigator.clipboard === void 0) throw new Error("\u5F53\u524D\u73AF\u5883\u4E0D\u652F\u6301\u526A\u8D34\u677F");
  await navigator.clipboard.writeText(text);
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
function assetUrl(topicId, path) {
  return `${config.routes}/asset?id=${encodeURIComponent(topicId)}&path=${encodeURIComponent(path)}`;
}
function rawUrl(topicId, path) {
  const encoded = path.replace(/\\/g, "/").split("/").map(encodeURIComponent).join("/");
  return `${config.routes}/raw/${encodeURIComponent(topicId)}/${encoded}`;
}
function bundleUrl(topicId, round) {
  return `${config.routes}/bundle?id=${encodeURIComponent(topicId)}&round=${round}`;
}
function openViewerImage(topicId, path) {
  showViewer({ kind: "image", title: artifactDisplayName(path), topicId, src: assetUrl(topicId, path), path });
}
async function openTopicFile(topicId, path) {
  const name = artifactName(path);
  try {
    const text = await fetchText(`${config.routes}/file?id=${encodeURIComponent(topicId)}&path=${encodeURIComponent(path)}`);
    showViewer({ kind: "text", title: name, topicId, text, path });
  } catch (cause) {
    showViewer({ kind: "text", title: name, topicId, text: cause instanceof Error ? cause.message : String(cause), path });
  }
}
async function openAnswer(topicId, round) {
  try {
    const text = await fetchText(`${config.routes}/answer?id=${encodeURIComponent(topicId)}&round=${round}`);
    showViewer({ kind: "text", title: `\u7B2C ${round} \u8F6E\u56DE\u7B54`, topicId, text });
  } catch (cause) {
    showViewer({ kind: "text", title: "\u8BFB\u53D6\u56DE\u7B54\u5931\u8D25", topicId, text: cause instanceof Error ? cause.message : String(cause) });
  }
}
async function fetchText(url) {
  const response = await fetch(url, { headers: { accept: "text/plain, text/markdown" } });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return await response.text();
}
function closeMenu(event) {
  event.currentTarget.closest("details")?.removeAttribute("open");
}
function Glyph({ name, size = 14 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true
  };
  switch (name) {
    case "search":
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { ...common, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "7", cy: "7", r: "4.2" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m10.3 10.3 3.2 3.2" })
      ] });
    case "chevron":
      return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { ...common, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m6 4 4 4-4 4" }) });
    case "file":
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { ...common, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M4 1.8h5l3 3v9.4H4z" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M9 1.8v3h3" })
      ] });
    case "image":
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { ...common, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { x: "2", y: "3", width: "12", height: "10", rx: "1.5" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "5.5", cy: "6.5", r: "1" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m3 12 3.5-3.5 2.5 2.5 2-2 2 2" })
      ] });
    case "demo":
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { ...common, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { x: "2", y: "3", width: "12", height: "10", rx: "1.5" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M2 6h12" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "4.2", cy: "4.5", r: ".45", fill: "currentColor", stroke: "none" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "5.8", cy: "4.5", r: ".45", fill: "currentColor", stroke: "none" })
      ] });
    case "copy":
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { ...common, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", { x: "5", y: "5", width: "8", height: "8", rx: "1" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M3 11V3h8" })
      ] });
    case "external":
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { ...common, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M9 3h4v4" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m13 3-6 6" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M11 9v3H3V4h3" })
      ] });
    case "more":
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { ...common, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "3.5", cy: "8", r: ".8", fill: "currentColor", stroke: "none" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "8", cy: "8", r: ".8", fill: "currentColor", stroke: "none" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "12.5", cy: "8", r: ".8", fill: "currentColor", stroke: "none" })
      ] });
    case "check":
      return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { ...common, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m3 8 3 3 7-7" }) });
    case "clock":
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { ...common, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "8", cy: "8", r: "5.5" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M8 4.5V8l2.3 1.4" })
      ] });
    case "alert":
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { ...common, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M8 2 14 13H2z" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M8 6v3" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", { cx: "8", cy: "11", r: ".55", fill: "currentColor", stroke: "none" })
      ] });
    case "folder":
      return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { ...common, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M2 4h5l1.5 2H14v7H2z" }) });
    case "download":
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { ...common, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M8 2v8" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m4.5 7 3.5 3.5L11.5 7" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M3 13h10" })
      ] });
    case "close":
      return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { ...common, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m4 4 8 8M12 4l-8 8" }) });
    case "arrow":
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", { ...common, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M3 8h10" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m9 4 4 4-4 4" })
      ] });
  }
}
function artifactGlyph(kind) {
  if (kind === "image") return "image";
  if (kind === "demo") return "demo";
  if (kind === "archive") return "download";
  return "file";
}
function StatusPill({ status }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dshpro-status", "data-tone": toneOf(status), children: statusLabel(status) });
}
var PANEL_CSS = `
.dshpro-root {
  --dshpro-accent: #4f6fd8;
  --dshpro-accent-fg: #fff;
  --dshpro-bg: var(--dsw-alias-bg-base, Canvas);
  --dshpro-panel: var(--dsw-alias-bg-layer-1, Canvas);
  --dshpro-panel-2: var(--dsw-alias-bg-module-platform, rgba(127,127,127,.06));
  --dshpro-text: var(--dsw-alias-label-primary, CanvasText);
  --dshpro-muted: var(--dsw-alias-label-secondary, rgba(127,127,127,.82));
  --dshpro-faint: var(--dsw-alias-label-tertiary, rgba(127,127,127,.62));
  --dshpro-line: var(--dsw-alias-border-l2, rgba(127,127,127,.22));
  --dshpro-line-strong: var(--dsw-alias-border-l3, rgba(127,127,127,.32));
  --dshpro-hover: var(--dsw-alias-interactive-bg-hover, rgba(127,127,127,.09));
  --dshpro-success: #2e7d32;
  --dshpro-error: #c62828;
  --dshpro-warn: #b45309;
  --dshpro-info: #356faf;
  --dshpro-capped: #6f3fa8;
  --dshpro-radius: 8px;
  display: flex;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  background: var(--dshpro-bg);
  color: var(--dshpro-text);
  font-family: var(--dsw-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei", sans-serif);
  font-size: 13px;
  line-height: 1.5;
}
.dshpro-root[data-plugin="design"] { --dshpro-accent: #b26a12; }
body[data-ds-dark-theme] .dshpro-root {
  --dshpro-accent-fg: #101114;
  --dshpro-success: #4ade80;
  --dshpro-error: #f87171;
  --dshpro-warn: #fbbf24;
  --dshpro-info: #93c5fd;
  --dshpro-capped: #c4a5ff;
}
body[data-ds-dark-theme] .dshpro-root[data-plugin="research"] { --dshpro-accent: #7f9cff; }
body[data-ds-dark-theme] .dshpro-root[data-plugin="design"] { --dshpro-accent: #d79a4f; }
.dshpro-root, .dshpro-root *, .dshpro-root *::before, .dshpro-root *::after { box-sizing: border-box; }
.dshpro-root button, .dshpro-root input, .dshpro-root textarea { font: inherit; color: inherit; }
.dshpro-root button { cursor: pointer; }
.dshpro-root [data-tone="success"] { --tone-color: var(--dshpro-success); }
.dshpro-root [data-tone="capped"] { --tone-color: var(--dshpro-capped); }
.dshpro-root [data-tone="review"] { --tone-color: var(--dshpro-info); }
.dshpro-root [data-tone="warn"] { --tone-color: var(--dshpro-warn); }
.dshpro-root [data-tone="error"] { --tone-color: var(--dshpro-error); }
.dshpro-root [data-tone="active"] { --tone-color: #6f8fbf; }
.dshpro-root [data-tone="muted"] { --tone-color: var(--dshpro-faint); }

.dshpro-list {
  width: 280px;
  flex: 0 0 280px;
  min-height: 0;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--dshpro-line);
  background: var(--dshpro-panel-2);
}
.dshpro-list-head { padding: 12px 12px 10px; border-bottom: 1px solid var(--dshpro-line); }
.dshpro-brand { display: flex; align-items: center; gap: 8px; min-width: 0; }
.dshpro-brand-mark {
  width: 27px; height: 27px; flex: none; display: grid; place-items: center;
  border: 1px solid color-mix(in srgb, var(--dshpro-accent) 30%, var(--dshpro-line));
  border-radius: 7px; background: color-mix(in srgb, var(--dshpro-accent) 11%, var(--dshpro-panel));
  color: var(--dshpro-accent); font-size: 12px; font-weight: 800;
}
.dshpro-brand-info { min-width: 0; flex: 1; }
.dshpro-brand-title { font-size: 13px; font-weight: 700; line-height: 1.3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.dshpro-brand-sub { margin-top: 1px; color: var(--dshpro-muted); font-size: 10.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.dshpro-count {
  flex: none; min-width: 22px; text-align: center; padding: 1px 6px;
  border: 1px solid var(--dshpro-line); border-radius: 999px;
  color: var(--dshpro-muted); font-size: 10px; font-variant-numeric: tabular-nums;
}
.dshpro-search {
  display: flex; align-items: center; gap: 6px; height: 30px; margin-top: 10px;
  padding: 0 8px; border: 1px solid var(--dshpro-line); border-radius: 6px;
  background: var(--dshpro-panel); color: var(--dshpro-muted);
}
.dshpro-search:focus-within { border-color: var(--dshpro-accent); box-shadow: 0 0 0 2px color-mix(in srgb, var(--dshpro-accent) 14%, transparent); }
.dshpro-search input { flex: 1; min-width: 0; height: 28px; padding: 0; border: 0; outline: 0; background: transparent; color: var(--dshpro-text); font-size: 12px; }
.dshpro-search input::placeholder { color: var(--dshpro-faint); }
.dshpro-filters { display: flex; gap: 3px; flex-wrap: wrap; margin-top: 7px; }
.dshpro-filter {
  display: inline-flex; align-items: center; gap: 4px; padding: 3px 6px;
  border: 1px solid transparent; border-radius: 5px; background: transparent;
  color: var(--dshpro-muted); font-size: 10.5px;
}
.dshpro-filter:hover { background: var(--dshpro-hover); }
.dshpro-filter.is-on { border-color: color-mix(in srgb, var(--dshpro-accent) 28%, var(--dshpro-line)); background: var(--dshpro-panel); color: var(--dshpro-text); }
.dshpro-filter span { color: var(--dshpro-faint); font-size: 9.5px; font-variant-numeric: tabular-nums; }
.dshpro-list-scroll { flex: 1; min-height: 0; overflow: auto; padding: 5px; scrollbar-width: thin; scrollbar-color: var(--dsw-alias-scrollbar-bg-l2, rgba(127,127,127,.35)) transparent; }
.dshpro-topic {
  display: block; position: relative; width: 100%; margin: 0 0 3px; padding: 8px 8px 8px 14px;
  border: 1px solid transparent; border-radius: 7px; background: transparent;
  color: var(--dshpro-text); text-align: left;
}
.dshpro-topic:hover { background: var(--dshpro-hover); }
.dshpro-topic.is-selected { background: color-mix(in srgb, var(--dshpro-accent) 10%, var(--dshpro-panel)); border-color: color-mix(in srgb, var(--dshpro-accent) 32%, var(--dshpro-line)); }
.dshpro-topic-bar {
  position: absolute; left: 0; top: 8px; bottom: 8px; width: 3px; border-radius: 0 3px 3px 0;
  background: var(--tone-color, var(--dshpro-faint)); opacity: .6;
}
.dshpro-topic.is-selected .dshpro-topic-bar { background: var(--dshpro-accent); opacity: 1; }
.dshpro-topic-title {
  display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden;
  font-size: 12.5px; font-weight: 650; line-height: 1.35; overflow-wrap: anywhere;
}
.dshpro-topic-meta {
  display: flex; align-items: center; flex-wrap: wrap; gap: 4px;
  margin-top: 4px; color: var(--dshpro-muted); font-size: 10.5px;
}
.dshpro-topic-meta .dshpro-sep { color: var(--dshpro-faint); opacity: .7; }
.dshpro-topic-tail { margin-left: auto; display: inline-flex; align-items: center; gap: 5px; }
.dshpro-topic-artifacts { display: inline-flex; align-items: center; gap: 2px; color: var(--dshpro-faint); font-size: 9.5px; }
.dshpro-dot { width: 7px; height: 7px; flex: none; border-radius: 999px; background: var(--tone-color, var(--dshpro-faint)); }
.dshpro-status-text { color: var(--tone-color, var(--dshpro-muted)); font-weight: 650; }
.dshpro-badge {
  display: inline-flex; align-items: center; padding: 1px 5px;
  border: 1px solid color-mix(in srgb, var(--tone-color) 38%, transparent);
  border-radius: 4px; background: color-mix(in srgb, var(--tone-color) 10%, transparent);
  color: var(--tone-color); font-size: 9.5px; font-weight: 650; white-space: nowrap;
}
.dshpro-list-empty { padding: 28px 16px; text-align: center; color: var(--dshpro-muted); }
.dshpro-list-empty .dshpro-empty-icon { margin: 0 auto 8px; color: var(--dshpro-faint); }
.dshpro-list-empty p { margin: 0; font-size: 12.5px; font-weight: 650; color: var(--dshpro-text); }
.dshpro-list-empty span { display: block; margin-top: 4px; font-size: 10.5px; line-height: 1.5; }
.dshpro-list-empty button { margin-top: 8px; }
.dshpro-list-error { margin: 8px; padding: 8px; border: 1px solid color-mix(in srgb, var(--dshpro-error) 30%, var(--dshpro-line)); border-radius: 6px; background: color-mix(in srgb, var(--dshpro-error) 7%, var(--dshpro-panel)); color: var(--dshpro-error); font-size: 10.5px; }
.dshpro-skeleton { border-radius: 4px; background: linear-gradient(90deg, var(--dshpro-hover), color-mix(in srgb, var(--dshpro-hover) 45%, transparent), var(--dshpro-hover)); background-size: 200% 100%; animation: dshpro-shimmer 1.4s ease-in-out infinite; }
@keyframes dshpro-shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }
.dshpro-list-skeleton { padding: 8px 8px 8px 17px; }

.dshpro-detail { flex: 1; min-width: 0; overflow: auto; padding: 14px 16px 36px; scrollbar-width: thin; scrollbar-color: var(--dsw-alias-scrollbar-bg-l2, rgba(127,127,127,.35)) transparent; }
.dshpro-error-banner {
  display: flex; align-items: center; gap: 8px; margin-bottom: 10px; padding: 8px 10px;
  border: 1px solid color-mix(in srgb, var(--dshpro-error) 35%, var(--dshpro-line)); border-radius: 7px;
  background: color-mix(in srgb, var(--dshpro-error) 8%, var(--dshpro-panel)); color: var(--dshpro-error); font-size: 11px;
}
.dshpro-head {
  position: sticky; top: 0; z-index: 2; margin-bottom: 10px; padding: 13px 14px;
  border: 1px solid var(--dshpro-line); border-radius: 9px;
  background: var(--dshpro-panel); box-shadow: 0 1px 0 color-mix(in srgb, var(--dshpro-text) 3%, transparent);
}
.dshpro-title-row { display: flex; align-items: flex-start; gap: 9px; flex-wrap: wrap; }
.dshpro-title { margin: 0; max-width: 900px; color: var(--dshpro-text); font-size: 18px; font-weight: 750; line-height: 1.35; overflow-wrap: anywhere; }
.dshpro-status { flex: none; padding: 2px 6px; border: 1px solid color-mix(in srgb, var(--tone-color) 50%, transparent); border-radius: 5px; color: var(--tone-color); font-size: 10px; font-weight: 700; line-height: 1.35; white-space: nowrap; }
.dshpro-meta { display: flex; flex-wrap: wrap; gap: 4px 12px; margin-top: 7px; color: var(--dshpro-muted); font-size: 11px; }
.dshpro-meta > span:not(:first-child)::before { content: "\xB7"; margin-right: 6px; color: var(--dshpro-faint); opacity: .7; }
.dshpro-path { display: flex; align-items: center; gap: 5px; min-width: 0; margin-top: 7px; color: var(--dshpro-faint); font-size: 10px; }
.dshpro-path span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-family: ui-monospace, SFMono-Regular, Consolas, monospace; }
.dshpro-icon-btn { display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; padding: 0; border: 1px solid transparent; border-radius: 4px; background: transparent; color: var(--dshpro-muted); }
.dshpro-icon-btn:hover { border-color: var(--dshpro-line); background: var(--dshpro-hover); color: var(--dshpro-text); }
.dshpro-actions { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-top: 11px; }
.dshpro-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 5px;
  min-height: 27px; padding: 4px 9px; border: 1px solid var(--dshpro-line);
  border-radius: 6px; background: var(--dshpro-panel); color: var(--dshpro-text);
  font-size: 11.5px; line-height: 1.2; text-decoration: none; white-space: nowrap;
}
.dshpro-btn:hover { background: var(--dshpro-hover); }
.dshpro-btn:disabled { opacity: .55; cursor: default; }
.dshpro-btn.primary { border-color: var(--dshpro-accent); background: var(--dshpro-accent); color: var(--dshpro-accent-fg); font-weight: 650; }
.dshpro-btn.primary:hover { filter: brightness(.96); }
.dshpro-btn.danger { border-color: color-mix(in srgb, var(--dshpro-error) 42%, var(--dshpro-line)); color: var(--dshpro-error); }
.dshpro-btn.ghost { border-color: transparent; background: transparent; color: var(--dshpro-muted); }
.dshpro-btn.ghost:hover { color: var(--dshpro-text); background: var(--dshpro-hover); }
.dshpro-btn.small { min-height: 23px; padding: 3px 7px; font-size: 10.5px; }
.dshpro-more { position: relative; margin-left: auto; }
.dshpro-more summary { list-style: none; }
.dshpro-more summary::-webkit-details-marker { display: none; }
.dshpro-menu {
  position: absolute; right: 0; top: calc(100% + 4px); z-index: 12; min-width: 160px;
  display: flex; flex-direction: column; gap: 1px; padding: 4px;
  border: 1px solid var(--dshpro-line); border-radius: 7px; background: var(--dshpro-panel);
  box-shadow: 0 10px 30px rgba(0,0,0,.18);
}
.dshpro-menu button { padding: 6px 8px; border: 0; border-radius: 4px; background: transparent; color: var(--dshpro-text); text-align: left; font-size: 11.5px; }
.dshpro-menu button:hover { background: var(--dshpro-hover); }

.dshpro-banner {
  display: flex; align-items: flex-start; gap: 8px; flex-wrap: wrap; margin-bottom: 10px; padding: 9px 11px;
  border: 1px solid color-mix(in srgb, var(--tone-color) 32%, var(--dshpro-line)); border-radius: 7px;
  background: color-mix(in srgb, var(--tone-color) 7%, var(--dshpro-panel)); color: var(--dshpro-muted); font-size: 11.5px;
}
.dshpro-banner strong { color: var(--tone-color); font-weight: 700; }
.dshpro-banner .dshpro-check-actions { display: flex; align-items: center; gap: 5px; flex-wrap: wrap; margin-left: auto; }
.dshpro-banner .dshpro-check-actions span { color: var(--dshpro-faint); font-size: 10.5px; }
.dshpro-tabs { display: flex; align-items: center; gap: 2px; margin: 0 0 10px; border-bottom: 1px solid var(--dshpro-line); overflow: auto; }
.dshpro-tab { padding: 8px 10px; border: 0; border-bottom: 2px solid transparent; background: transparent; color: var(--dshpro-muted); font-size: 12px; white-space: nowrap; }
.dshpro-tab:hover { color: var(--dshpro-text); }
.dshpro-tab.is-on { border-bottom-color: var(--dshpro-accent); color: var(--dshpro-text); font-weight: 700; }
.dshpro-tab em { margin-left: 4px; color: var(--dshpro-faint); font-style: normal; font-size: 9.5px; font-variant-numeric: tabular-nums; }
.dshpro-body { display: grid; grid-template-columns: minmax(0, 1fr) 276px; gap: 12px; align-items: start; }
.dshpro-main, .dshpro-rail { min-width: 0; }
.dshpro-card { margin-bottom: 12px; padding: 12px; border: 1px solid var(--dshpro-line); border-radius: var(--dshpro-radius); background: var(--dshpro-panel); min-width: 0; }
.dshpro-card-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 8px; }
.dshpro-card-title { font-size: 12.5px; font-weight: 700; line-height: 1.35; }
.dshpro-card-sub { margin-top: 1px; color: var(--dshpro-muted); font-size: 10.5px; }
.dshpro-muted { color: var(--dshpro-muted); }
.dshpro-faint { color: var(--dshpro-faint); }
.dshpro-card-link { border: 0; background: transparent; color: var(--dshpro-muted); font-size: 10.5px; }
.dshpro-card-link:hover { color: var(--dshpro-accent); }
.dshpro-empty-inline { padding: 14px 0; color: var(--dshpro-faint); font-size: 11.5px; text-align: center; }
.dshpro-empty-detail { display: flex; height: 100%; min-height: 260px; flex-direction: column; align-items: center; justify-content: center; gap: 7px; color: var(--dshpro-muted); text-align: center; }
.dshpro-empty-detail .dshpro-empty-mark { width: 40px; height: 40px; display: grid; place-items: center; border: 1px solid var(--dshpro-line); border-radius: 10px; background: var(--dshpro-panel-2); color: var(--dshpro-accent); }
.dshpro-empty-detail strong { color: var(--dshpro-text); font-size: 13px; }
.dshpro-empty-detail span { font-size: 11px; max-width: 320px; line-height: 1.5; }

.dshpro-final { display: flex; align-items: center; gap: 10px; padding: 10px; border: 1px solid color-mix(in srgb, var(--dshpro-accent) 28%, var(--dshpro-line)); border-radius: 8px; background: linear-gradient(120deg, color-mix(in srgb, var(--dshpro-accent) 9%, var(--dshpro-panel)), var(--dshpro-panel) 70%); }
.dshpro-final-icon { width: 34px; height: 38px; flex: none; display: grid; place-items: center; border: 1px solid color-mix(in srgb, var(--dshpro-accent) 25%, var(--dshpro-line)); border-radius: 6px; background: var(--dshpro-panel); color: var(--dshpro-accent); }
.dshpro-final-info { flex: 1; min-width: 0; }
.dshpro-final-title { font-size: 12px; font-weight: 700; }
.dshpro-final-path { margin-top: 1px; color: var(--dshpro-muted); font-size: 10px; font-family: ui-monospace, Consolas, monospace; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dshpro-final-desc { margin-top: 2px; color: var(--dshpro-faint); font-size: 10px; }

.dshpro-table-wrap { width: 100%; overflow-x: auto; }
.dshpro-table { width: 100%; border-collapse: collapse; font-size: 11px; }
.dshpro-table th { padding: 6px 7px; border-bottom: 1px solid var(--dshpro-line); background: var(--dshpro-panel-2); color: var(--dshpro-muted); font-size: 10px; font-weight: 600; text-align: left; white-space: nowrap; }
.dshpro-table td { padding: 7px; border-bottom: 1px solid color-mix(in srgb, var(--dshpro-line) 65%, transparent); vertical-align: top; }
.dshpro-table tr:last-child td { border-bottom: 0; }
.dshpro-table .dshpro-num { font-variant-numeric: tabular-nums; font-weight: 650; white-space: nowrap; }
.dshpro-table .dshpro-nowrap { white-space: nowrap; }
.dshpro-table .dshpro-dim { color: var(--dshpro-muted); }
.dshpro-verdict { font-weight: 650; }
.dshpro-verdict[data-verdict="accepted"] { color: var(--dshpro-success); }
.dshpro-verdict[data-verdict="partial"] { color: #b58a2b; }
.dshpro-verdict[data-verdict="rejected"] { color: var(--dshpro-error); }
.dshpro-verdict[data-verdict="answered"] { color: var(--dshpro-info); }
.dshpro-verdict[data-verdict="pending"] { color: var(--dshpro-faint); }
.dshpro-artifacts-cell { padding: 0 7px 9px; }
.dshpro-thumbs { display: flex; gap: 6px; flex-wrap: wrap; padding-top: 6px; }
.dshpro-thumb { width: 132px; height: 84px; padding: 0; overflow: hidden; border: 1px solid var(--dshpro-line); border-radius: 6px; background: var(--dshpro-panel-2); cursor: zoom-in; }
.dshpro-thumb img { width: 100%; height: 100%; display: block; object-fit: cover; }
.dshpro-thumb:hover { border-color: var(--dshpro-accent); }
.dshpro-chips { display: flex; gap: 5px; flex-wrap: wrap; padding-top: 6px; }
.dshpro-chip { display: inline-flex; align-items: center; gap: 3px; padding: 2px 6px; border: 1px solid var(--dshpro-line); border-radius: 4px; background: transparent; color: var(--dshpro-muted); font-size: 10px; text-decoration: none; }
.dshpro-chip:hover { border-color: var(--dshpro-accent); color: var(--dshpro-accent); }
.dshpro-round-card { margin-bottom: 12px; padding: 12px; border: 1px solid var(--dshpro-line); border-radius: var(--dshpro-radius); background: var(--dshpro-panel); }
.dshpro-round-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; margin-bottom: 8px; }
.dshpro-round-title { font-size: 12.5px; font-weight: 700; }
.dshpro-round-sub { margin-top: 2px; color: var(--dshpro-muted); font-size: 10.5px; }

.dshpro-gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 8px; }
.dshpro-art { position: relative; display: block; width: 100%; padding: 0; overflow: hidden; border: 1px solid var(--dshpro-line); border-radius: 7px; background: var(--dshpro-panel-2); aspect-ratio: 4 / 3; cursor: zoom-in; }
.dshpro-art img { width: 100%; height: 100%; display: block; object-fit: cover; }
.dshpro-art:hover { border-color: var(--dshpro-accent); }
.dshpro-art-label { position: absolute; left: 0; right: 0; bottom: 0; padding: 5px 7px; background: linear-gradient(0deg, rgba(0,0,0,.5), transparent); color: #fff; font-size: 9px; text-align: left; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dshpro-art-round { position: absolute; top: 4px; right: 4px; padding: 1px 3px; border-radius: 3px; background: rgba(15,17,21,.62); color: #fff; font-size: 8px; font-weight: 700; line-height: 1.3; }
.dshpro-mini-gallery { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px; }
.dshpro-mini-gallery .dshpro-art { aspect-ratio: 4 / 3; }

.dshpro-file-list { display: flex; flex-direction: column; }
.dshpro-file { display: flex; align-items: center; gap: 8px; min-width: 0; padding: 7px 0; border-top: 1px solid color-mix(in srgb, var(--dshpro-line) 65%, transparent); }
.dshpro-file:first-child { border-top: 0; }
.dshpro-file-icon { width: 29px; height: 31px; flex: none; display: grid; place-items: center; border: 1px solid color-mix(in srgb, var(--dshpro-accent) 20%, var(--dshpro-line)); border-radius: 5px; background: color-mix(in srgb, var(--dshpro-accent) 8%, var(--dshpro-panel)); color: var(--dshpro-accent); }
.dshpro-file-info { flex: 1; min-width: 0; }
.dshpro-file-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 11.5px; font-weight: 650; }
.dshpro-file-path { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--dshpro-faint); font-size: 9.5px; font-family: ui-monospace, Consolas, monospace; }
.dshpro-file-actions { display: flex; align-items: center; gap: 4px; flex: none; }
.dshpro-file-actions .dshpro-btn { min-height: 22px; padding: 2px 6px; font-size: 10px; }

.dshpro-demo { overflow: hidden; border: 1px solid var(--dshpro-line); border-radius: 8px; background: var(--dshpro-panel); }
.dshpro-demo-preview { border-bottom: 1px solid var(--dshpro-line); background: var(--dshpro-panel-2); }
.dshpro-demo-bar { display: flex; align-items: center; gap: 4px; padding: 6px 8px; border-bottom: 1px solid var(--dshpro-line); background: var(--dshpro-panel); color: var(--dshpro-faint); font-size: 9px; }
.dshpro-demo-bar i { width: 5px; height: 5px; border-radius: 999px; background: currentColor; opacity: .5; }
.dshpro-demo-bar em { margin-left: auto; max-width: 70%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-style: normal; }
.dshpro-demo-canvas { display: grid; place-items: center; min-height: 100px; background: linear-gradient(135deg, color-mix(in srgb, var(--dshpro-accent) 12%, var(--dshpro-panel)), var(--dshpro-panel-2) 62%, color-mix(in srgb, var(--dshpro-warn) 9%, var(--dshpro-panel))); color: var(--dshpro-muted); font-size: 10px; }
.dshpro-demo-meta { display: flex; align-items: center; gap: 8px; padding: 8px; }
.dshpro-demo-meta .dshpro-file-info { flex: 1; }
.dshpro-demo-actions { display: flex; gap: 4px; flex: none; }
.dshpro-meta-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 7px 10px; font-size: 10.5px; }
.dshpro-meta-grid span { display: block; color: var(--dshpro-faint); }
.dshpro-meta-grid b { display: block; margin-top: 1px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 550; color: var(--dshpro-muted); }

.dshpro-toast { position: fixed; right: 18px; bottom: 18px; z-index: 2147483100; max-width: min(420px, calc(100vw - 36px)); padding: 9px 12px; border-radius: 7px; background: var(--dshpro-text); color: var(--dshpro-panel); box-shadow: 0 10px 28px rgba(0,0,0,.25); font-size: 11.5px; line-height: 1.45; }
.dshpro-toast[data-kind="error"] { background: var(--dshpro-error); color: #fff; }
.dshpro-overlay { position: fixed; inset: 0; z-index: 2147482900; display: flex; align-items: center; justify-content: center; padding: 22px; background: rgba(0,0,0,.46); }
.dshpro-overlay.is-viewer { z-index: 2147483000; padding: 18px; }
.dshpro-modal-card { display: flex; flex-direction: column; width: min(920px, 94vw); max-height: 90vh; overflow: hidden; border: 1px solid var(--dshpro-line); border-radius: 10px; background: var(--dshpro-panel); color: var(--dshpro-text); box-shadow: 0 24px 80px rgba(0,0,0,.42); }
.dshpro-modal-card.is-dialog { width: min(520px, 94vw); }
.dshpro-modal-head { display: flex; align-items: center; gap: 8px; padding: 10px 12px; border-bottom: 1px solid var(--dshpro-line); }
.dshpro-modal-head .dshpro-modal-title { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 12.5px; font-weight: 700; }
.dshpro-modal-body { flex: 1; min-height: 0; overflow: auto; }
.dshpro-modal-body img { display: block; max-width: 100%; max-height: 70vh; margin: 0 auto; object-fit: contain; }
.dshpro-modal-body iframe { display: block; width: 100%; height: 70vh; border: 0; background: #fff; }
.dshpro-modal-body pre { margin: 0; padding: 14px; white-space: pre-wrap; word-break: break-word; font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 11.5px; line-height: 1.55; }
.dshpro-modal-foot { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; padding: 8px 12px; border-top: 1px solid var(--dshpro-line); background: var(--dshpro-panel-2); }
.dshpro-modal-note { margin-left: auto; color: var(--dshpro-muted); font-size: 10px; }
.dshpro-dialog-body { padding: 13px 14px; }
.dshpro-dialog-body label { display: block; margin-bottom: 6px; font-size: 11.5px; font-weight: 650; }
.dshpro-dialog-body p { margin: 0 0 8px; color: var(--dshpro-muted); font-size: 11px; line-height: 1.5; }
.dshpro-dialog-body textarea { width: 100%; min-height: 82px; resize: vertical; padding: 7px 9px; border: 1px solid var(--dshpro-line); border-radius: 6px; outline: 0; background: var(--dshpro-bg); color: var(--dshpro-text); font-size: 12px; line-height: 1.5; }
.dshpro-dialog-body textarea:focus { border-color: var(--dshpro-accent); box-shadow: 0 0 0 2px color-mix(in srgb, var(--dshpro-accent) 13%, transparent); }
.dshpro-dialog-row { display: flex; align-items: center; gap: 8px; margin-top: 9px; color: var(--dshpro-muted); font-size: 11px; }
.dshpro-dialog-row input { width: 62px; padding: 5px 7px; border: 1px solid var(--dshpro-line); border-radius: 5px; background: var(--dshpro-bg); color: var(--dshpro-text); }
.dshpro-dialog-foot { display: flex; justify-content: flex-end; gap: 6px; padding: 10px 14px; border-top: 1px solid var(--dshpro-line); background: var(--dshpro-panel-2); }
.dshpro-dialog-foot .dshpro-btn { min-height: 28px; padding: 4px 11px; }

@media (max-width: 1280px) {
  .dshpro-body { grid-template-columns: minmax(0, 1fr); }
  .dshpro-rail { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
  .dshpro-rail .dshpro-card { margin-bottom: 0; }
}
@media (max-width: 1040px) {
  .dshpro-list { width: 240px; flex-basis: 240px; }
  .dshpro-detail { padding: 12px 12px 30px; }
  .dshpro-title { font-size: 16.5px; }
}
@media (max-width: 1000px) {
  .dshpro-root { flex-direction: column; }
  .dshpro-list { width: 100%; flex-basis: auto; max-height: 250px; border-right: 0; border-bottom: 1px solid var(--dshpro-line); }
  .dshpro-list-scroll { max-height: 140px; }
  .dshpro-rail { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .dshpro-optional { display: none; }
  .dshpro-title { font-size: 15.5px; }
  .dshpro-gallery { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .dshpro-thumb { width: 108px; height: 70px; }
}
@media (prefers-reduced-motion: reduce) {
  .dshpro-skeleton { animation: none; }
}
`;
function ListSkeleton() {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: [0, 1, 2, 3].map((index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshpro-list-skeleton", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshpro-skeleton", style: { height: 12, width: `${72 - index * 6}%` } }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshpro-skeleton", style: { height: 9, width: "58%", marginTop: 7 } })
  ] }, index)) });
}
function DetailSkeleton() {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshpro-card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshpro-skeleton", style: { height: 22, width: "48%" } }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshpro-skeleton", style: { height: 11, width: "70%", marginTop: 10 } }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshpro-skeleton", style: { height: 11, width: "42%", marginTop: 7 } }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshpro-skeleton", style: { height: 28, width: "260px", marginTop: 14 } })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshpro-card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshpro-skeleton", style: { height: 13, width: "30%" } }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshpro-skeleton", style: { height: 120, width: "100%", marginTop: 12 } })
    ] })
  ] });
}
function EmptyDetail({ design }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshpro-empty-detail", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshpro-empty-mark", children: design ? "D" : "R" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: design ? "\u9009\u62E9\u5DE6\u4FA7\u7684\u8BBE\u8BA1\u4E3B\u9898" : "\u9009\u62E9\u5DE6\u4FA7\u7684\u7814\u7A76\u4E3B\u9898" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: design ? "\u5217\u8868\u91CC\u4F1A\u663E\u793A\u72B6\u6001\u3001\u8F6E\u6B21\u548C\u4EA7\u7269\uFF1B\u70B9\u5F00\u540E\u6709\u56FE\u7247\u3001demo \u548C\u6587\u4EF6\u3002" : "\u5217\u8868\u91CC\u4F1A\u663E\u793A\u72B6\u6001\u3001\u8F6E\u6B21\u548C\u4EA7\u7269\uFF1B\u70B9\u5F00\u540E\u6709\u8F6E\u6B21\u3001\u88C1\u51B3\u548C\u6700\u7EC8\u6587\u6863\u3002" })
  ] });
}
function FinalCard({ detail, path }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshpro-final", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshpro-final-icon", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Glyph, { name: "file", size: 17 }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshpro-final-info", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshpro-final-title", children: "\u672C\u7248\u603B\u7ED3" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshpro-final-path", title: path, children: artifactName(path) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshpro-final-desc", children: "\u6700\u7EC8\u4EA4\u4ED8\u6587\u6863 \xB7 \u70B9\u51FB\u67E5\u770B\u5168\u6587" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dshpro-btn small", onClick: () => {
      void openTopicFile(detail.topic_id, path);
    }, children: "\u67E5\u770B" })
  ] });
}
function ArtifactRow({ detail, path }) {
  const kind = artifactKind(detail, path);
  const name = artifactName(path);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshpro-file", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshpro-file-icon", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Glyph, { name: artifactGlyph(kind), size: 15 }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshpro-file-info", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshpro-file-name", title: path, children: name }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshpro-file-path", title: path, children: path })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshpro-file-actions", children: [
      kind === "image" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dshpro-btn small", onClick: () => openViewerImage(detail.topic_id, path), children: "\u67E5\u770B" }),
      kind === "demo" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dshpro-btn small", onClick: () => showViewer({ kind: "frame", title: name, topicId: detail.topic_id, src: rawUrl(detail.topic_id, path), path }), children: "\u9884\u89C8" }),
      kind === "archive" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", { className: "dshpro-btn small", href: assetUrl(detail.topic_id, path), download: name, children: "\u4E0B\u8F7D" }),
      (kind === "code" || kind === "file") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dshpro-btn small", onClick: () => {
        void openTopicFile(detail.topic_id, path);
      }, children: "\u67E5\u770B" })
    ] })
  ] });
}
function ArtifactLink({ detail, path }) {
  const kind = artifactKind(detail, path);
  const name = artifactName(path);
  if (kind === "image") {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dshpro-chip", onClick: () => openViewerImage(detail.topic_id, path), children: name });
  }
  if (kind === "demo") {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { type: "button", className: "dshpro-chip", onClick: () => showViewer({ kind: "frame", title: name, topicId: detail.topic_id, src: rawUrl(detail.topic_id, path), path }), children: [
      name,
      " \u2197"
    ] });
  }
  if (kind === "archive") {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", { className: "dshpro-chip", href: assetUrl(detail.topic_id, path), download: name, children: name });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dshpro-chip", onClick: () => {
    void openTopicFile(detail.topic_id, path);
  }, children: name });
}
function RoundTable({ detail, rounds, generation }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshpro-table-wrap", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", { className: "dshpro-table", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "\u8F6E\u6B21" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "\u88C1\u51B3" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "dshpro-optional", children: "\u9644\u4EF6" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "\u63D0\u4EA4" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "\u5B8C\u6210" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "dshpro-optional", children: "\u91CD\u8BD5" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "\u64CD\u4F5C" })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rounds.map((round, index) => {
      const label = `${generation}-${index + 1}`;
      const artifacts = roundArtifacts(detail, round);
      const images = artifacts.filter((path) => artifactKind(detail, path) === "image");
      const files = artifacts.filter((path) => artifactKind(detail, path) !== "image");
      const outcome = outcomeOf(round);
      const attempts = round.attempts ?? 1;
      return [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: "dshpro-num", children: label }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dshpro-verdict", "data-verdict": outcome.tone, children: outcome.label }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: "dshpro-optional", children: round.files }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: "dshpro-nowrap dshpro-dim", children: formatTime(round.submittedAt) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: "dshpro-nowrap dshpro-dim", children: round.answeredAt !== void 0 ? formatTime(round.answeredAt) : ACTIVE.has(detail.status) ? "\u8FDB\u884C\u4E2D" : "\u2014" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: "dshpro-optional dshpro-dim", children: attempts > 1 ? attempts - 1 : "\u2014" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { style: { display: "flex", gap: 4, flexWrap: "wrap" }, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dshpro-btn small", onClick: () => {
              void openAnswer(detail.topic_id, round.n);
            }, children: "\u67E5\u770B\u56DE\u7B54" }),
            artifacts.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", { className: "dshpro-btn small", href: bundleUrl(detail.topic_id, round.n), download: `round-${String(round.n).padStart(2, "0")}.zip`, children: "\u4E0B\u8F7D ZIP" })
          ] }) })
        ] }, `round-${round.n}`),
        artifacts.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { className: "dshpro-artifacts-cell", colSpan: 7, children: [
          images.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshpro-thumbs", children: images.map((path) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dshpro-thumb", title: artifactDisplayName(path), onClick: () => openViewerImage(detail.topic_id, path), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", { src: assetUrl(detail.topic_id, path), alt: artifactDisplayName(path), loading: "lazy" }) }, path)) }),
          files.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshpro-chips", children: files.map((path) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArtifactLink, { detail, path }, path)) })
        ] }) }, `artifacts-${round.n}`) : null
      ];
    }) })
  ] }) });
}
function RoundsView({ detail }) {
  const generations = generationList(detail);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
    generations.map((generation) => {
      const rounds = generationRounds(detail, generation.n);
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "dshpro-round-card", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshpro-round-head", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshpro-round-title", children: [
              "\u7B2C ",
              generation.n,
              " \u7248"
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshpro-round-sub", children: [
              generation.reason !== void 0 && generation.reason !== "" ? `${generation.reason} \xB7 ` : "",
              formatTime(generation.createdAt),
              " \xB7 ",
              generationLabel(generation, rounds)
            ] })
          ] }),
          generation.final !== void 0 && generation.final !== "" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dshpro-btn small", onClick: () => {
            void openTopicFile(detail.topic_id, generation.final);
          }, children: "\u672C\u7248\u603B\u7ED3" })
        ] }),
        rounds.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoundTable, { detail, rounds, generation: generation.n }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshpro-empty-inline", children: "\u7B49\u5F85\u63D0\u4EA4\u2026" })
      ] }, generation.n);
    }),
    generations.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshpro-empty-inline", children: "\u8FD8\u6CA1\u6709\u63D0\u4EA4\u8BB0\u5F55\u3002" })
  ] });
}
function ResearchOverview({ detail, onTab }) {
  const generations = generationList(detail);
  const latest = generations[generations.length - 1];
  const rounds = latest !== void 0 ? generationRounds(detail, latest.n) : [];
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "dshpro-card", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshpro-card-head", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshpro-card-title", children: latest !== void 0 ? `\u7B2C ${latest.n} \u7248` : "\u6700\u8FD1\u8F6E\u6B21" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshpro-card-sub", children: latest !== void 0 ? generationLabel(latest, rounds) : "\u5C1A\u65E0\u8F6E\u6B21" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dshpro-card-link", onClick: () => onTab("rounds"), children: "\u5168\u90E8\u8F6E\u6B21" })
    ] }),
    rounds.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoundTable, { detail, rounds, generation: latest?.n ?? 1 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshpro-empty-inline", children: "\u8FD8\u6CA1\u6709\u63D0\u4EA4\u8BB0\u5F55\u3002" })
  ] }) });
}
function DemoCard({ detail, path }) {
  const name = artifactName(path);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshpro-demo", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshpro-demo-preview", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshpro-demo-bar", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: name })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshpro-demo-canvas", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "\u5355\u6587\u4EF6 HTML demo" }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshpro-demo-meta", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshpro-file-info", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshpro-file-name", title: path, children: name }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshpro-file-path", children: "\u53EF\u9884\u89C8\u3001\u53EF\u65B0\u7A97\u53E3\u6253\u5F00" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshpro-demo-actions", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dshpro-btn small", onClick: () => showViewer({ kind: "frame", title: name, topicId: detail.topic_id, src: rawUrl(detail.topic_id, path), path }), children: "\u9884\u89C8" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dshpro-btn small", onClick: () => {
          window.open(rawUrl(detail.topic_id, path), "_blank", "noopener,noreferrer");
        }, children: "\u65B0\u7A97\u53E3" })
      ] })
    ] })
  ] });
}
function DesignOverview({ detail, onTab }) {
  const images = imageArtifacts(detail);
  const round = latestRound(detail);
  const roundPrefix = round !== void 0 ? `/round-${String(round.n).padStart(2, "0")}/` : void 0;
  const latestImages = roundPrefix !== void 0 ? images.filter((path) => path.includes(roundPrefix)) : [];
  const ordered = [...latestImages, ...images.filter((path) => !latestImages.includes(path))];
  const showImages = ordered.slice(0, 9);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "dshpro-card", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshpro-card-head", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshpro-card-title", children: [
          "\u56FE\u7247 ",
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "dshpro-faint", children: [
            "(",
            images.length,
            ")"
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshpro-card-sub", children: [
          round !== void 0 ? `\u7B2C ${round.n} \u8F6E ${latestImages.length} \u5F20\u4F18\u5148` : "\u6309\u8F6E\u6B21\u6392\u5217",
          "\uFF1B\u70B9\u51FB\u7F29\u7565\u56FE\u67E5\u770B\u5927\u56FE\u3002"
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dshpro-card-link", onClick: () => onTab("artifacts"), children: "\u5168\u90E8\u56FE\u7247" })
    ] }),
    showImages.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshpro-gallery", children: showImages.map((path) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { type: "button", className: "dshpro-art", title: artifactDisplayName(path), onClick: () => openViewerImage(detail.topic_id, path), children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", { src: assetUrl(detail.topic_id, path), alt: artifactDisplayName(path), loading: "lazy" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dshpro-art-label", children: artifactDisplayName(path) })
    ] }, path)) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshpro-empty-inline", children: "\u8FD8\u6CA1\u6709\u56FE\u7247\u4EA7\u7269\u3002" })
  ] }) });
}
function ArtifactsView({ detail }) {
  const final = latestFinal(detail);
  if (!config.designMode) {
    const groups = /* @__PURE__ */ new Map();
    for (const path of detail.artifacts) {
      if (path === final) continue;
      const match = path.match(/round-(\d+)/i);
      const key = match !== null ? `\u7B2C ${Number(match[1])} \u8F6E` : "\u4E3B\u9898\u6587\u4EF6";
      const list = groups.get(key) ?? [];
      list.push(path);
      groups.set(key, list);
    }
    const entries = [...groups.entries()].sort((left, right) => {
      const leftNumber = Number(left[0].match(/\d+/)?.[0] ?? 999);
      const rightNumber = Number(right[0].match(/\d+/)?.[0] ?? 999);
      return leftNumber - rightNumber;
    });
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
      final !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "dshpro-card", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshpro-card-head", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshpro-card-title", children: "\u6700\u7EC8\u6587\u6863" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FinalCard, { detail, path: final })
      ] }),
      entries.map(([label, paths]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "dshpro-card", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshpro-card-head", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshpro-card-title", children: label }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "dshpro-faint", style: { fontSize: 10 }, children: [
            paths.length,
            " \u4E2A\u6587\u4EF6"
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshpro-file-list", children: paths.map((path) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArtifactRow, { detail, path }, path)) })
      ] }, label)),
      detail.artifacts.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshpro-card", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshpro-empty-inline", children: "\u8FD8\u6CA1\u6709\u4EA7\u7269\u3002" }) })
    ] });
  }
  const images = imageArtifacts(detail);
  const demos = demoArtifacts(detail);
  const files = fileArtifacts(detail);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
    images.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "dshpro-card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshpro-card-head", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshpro-card-title", children: [
        "\u5168\u90E8\u56FE\u7247 ",
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "dshpro-faint", children: [
          "(",
          images.length,
          ")"
        ] })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshpro-gallery", children: images.map((path) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { type: "button", className: "dshpro-art", title: artifactDisplayName(path), onClick: () => openViewerImage(detail.topic_id, path), children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", { src: assetUrl(detail.topic_id, path), alt: artifactDisplayName(path), loading: "lazy" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dshpro-art-label", children: artifactDisplayName(path) })
      ] }, path)) })
    ] }),
    demos.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "dshpro-card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshpro-card-head", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshpro-card-title", children: [
        "\u524D\u7AEF demo ",
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "dshpro-faint", children: [
          "(",
          demos.length,
          ")"
        ] })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: demos.map((path) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DemoCard, { detail, path }, path)) })
    ] }),
    files.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "dshpro-card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshpro-card-head", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshpro-card-title", children: [
        "\u4EE3\u7801\u4E0E\u6587\u4EF6 ",
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "dshpro-faint", children: [
          "(",
          files.length,
          ")"
        ] })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshpro-file-list", children: files.map((path) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArtifactRow, { detail, path }, path)) })
    ] }),
    detail.artifacts.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshpro-card", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshpro-empty-inline", children: "\u8FD8\u6CA1\u6709\u4EA7\u7269\u3002" }) })
  ] });
}
function MetaCard({ detail }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "dshpro-card", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshpro-card-head", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshpro-card-title", children: "\u4E3B\u9898\u4FE1\u606F" }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshpro-meta-grid", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "\u7C7B\u578B" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: detail.type === "design" ? "\u8BBE\u8BA1" : "\u7814\u7A76" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "\u901A\u9053" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: channelLabel(detail.channel) ?? "\u2014" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "\u6A21\u578B" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: detail.model !== void 0 && detail.model !== "" ? detail.model : "\u2014" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "\u5B58\u50A8" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: detail.store === "local" ? "\u672C\u673A" : "\u9879\u76EE" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "\u521B\u5EFA" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: formatTime(detail.created) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "\u66F4\u65B0" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: formatTime(detail.updated) })
      ] })
    ] })
  ] });
}
function Rail({ detail, onTab }) {
  const final = latestFinal(detail);
  const images = imageArtifacts(detail);
  const demos = demoArtifacts(detail);
  const files = fileArtifacts(detail);
  if (config.designMode) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", { className: "dshpro-rail", children: [
      demos.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "dshpro-card", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshpro-card-head", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshpro-card-title", children: "\u5F53\u524D demo" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DemoCard, { detail, path: demos[0] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "dshpro-card", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshpro-card-head", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshpro-card-title", children: [
            "\u5168\u90E8\u56FE\u7247 ",
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "dshpro-faint", children: [
              "(",
              images.length,
              ")"
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dshpro-card-link", onClick: () => onTab("artifacts"), children: "\u67E5\u770B" })
        ] }),
        images.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshpro-mini-gallery", children: images.slice(0, 6).map((path) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { type: "button", className: "dshpro-art", title: artifactDisplayName(path), onClick: () => openViewerImage(detail.topic_id, path), children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", { src: assetUrl(detail.topic_id, path), alt: artifactDisplayName(path), loading: "lazy" }),
          roundOf(path) !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "dshpro-art-round", children: [
            "R",
            roundOf(path)
          ] })
        ] }, path)) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshpro-empty-inline", children: "\u8FD8\u6CA1\u6709\u56FE\u7247\u3002" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "dshpro-card", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshpro-card-head", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshpro-card-title", children: [
            "\u4EE3\u7801\u4E0E\u6587\u4EF6 ",
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "dshpro-faint", children: [
              "(",
              files.length,
              ")"
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dshpro-card-link", onClick: () => onTab("artifacts"), children: "\u67E5\u770B" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshpro-file-list", children: [
          files.slice(0, 4).map((path) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArtifactRow, { detail, path }, path)),
          files.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshpro-empty-inline", children: "\u8FD8\u6CA1\u6709\u6587\u4EF6\u3002" })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetaCard, { detail })
    ] });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", { className: "dshpro-rail", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "dshpro-card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshpro-card-head", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshpro-card-title", children: "\u6700\u7EC8\u6587\u6863" }) }),
      final !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FinalCard, { detail, path: final }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshpro-empty-inline", children: "\u8FD8\u6CA1\u6709 final.md\u3002" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "dshpro-card", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshpro-card-head", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshpro-card-title", children: [
          "\u5168\u90E8\u4EA7\u7269 ",
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "dshpro-faint", children: [
            "(",
            detail.artifacts.length,
            ")"
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dshpro-card-link", onClick: () => onTab("artifacts"), children: "\u67E5\u770B" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshpro-file-list", children: [
        detail.artifacts.slice(0, 5).map((path) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArtifactRow, { detail, path }, path)),
        detail.artifacts.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshpro-empty-inline", children: "\u8FD8\u6CA1\u6709\u4EA7\u7269\u3002" })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetaCard, { detail })
  ] });
}
function ViewerModal({ view, basePath, onClose }) {
  const [notice, setNotice] = (0, import_react.useState)(void 0);
  (0, import_react.useEffect)(() => {
    setNotice(void 0);
  }, [view]);
  const run = (task, success) => {
    setNotice("\u5904\u7406\u4E2D\u2026");
    void task().then(() => setNotice(success)).catch((error) => setNotice(error instanceof Error ? error.message : String(error)));
  };
  const path = view.path;
  const native = path !== void 0 ? fullPath(basePath, path) : void 0;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshpro-overlay is-viewer", onClick: onClose, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshpro-modal-card", role: "dialog", "aria-modal": "true", "aria-label": view.title, onClick: (event) => event.stopPropagation(), children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshpro-modal-head", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshpro-modal-title", title: view.title, children: view.title }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dshpro-icon-btn", onClick: onClose, "aria-label": "\u5173\u95ED", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Glyph, { name: "close", size: 15 }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshpro-modal-body", children: [
      view.kind === "image" && view.src !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", { src: view.src, alt: view.title }),
      view.kind === "frame" && view.src !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", { src: view.src, sandbox: "allow-scripts", title: view.title }),
      view.kind === "text" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", { children: view.text ?? "" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshpro-modal-foot", children: [
      view.kind === "image" && view.src !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dshpro-btn small", onClick: () => run(() => copyImage(view.src), "\u56FE\u7247\u5DF2\u590D\u5236\u5230\u526A\u8D34\u677F"), children: "\u590D\u5236\u56FE\u7247" }),
      native !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dshpro-btn small", onClick: () => run(() => copyText(native), "\u6587\u4EF6\u8DEF\u5F84\u5DF2\u590D\u5236"), children: "\u590D\u5236\u8DEF\u5F84" }),
      view.kind === "frame" && view.src !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dshpro-btn small", onClick: () => {
        window.open(view.src, "_blank", "noopener,noreferrer");
      }, children: "\u65B0\u7A97\u53E3\u6253\u5F00" }),
      native !== void 0 && view.topicId !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dshpro-btn small", onClick: () => run(() => openArtifact(view.topicId, path, false), "\u5DF2\u8BF7\u6C42\u6253\u5F00\u539F\u6587\u4EF6"), children: "\u6253\u5F00\u539F\u6587\u4EF6" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dshpro-btn small", onClick: () => run(() => openArtifact(view.topicId, path, true), "\u5DF2\u5728\u6587\u4EF6\u5939\u4E2D\u5B9A\u4F4D"), children: "\u5728\u6587\u4EF6\u5939\u4E2D\u663E\u793A" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dshpro-btn small", onClick: onClose, children: "\u5173\u95ED" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dshpro-modal-note", children: notice ?? "" })
    ] })
  ] }) });
}
function ActionDialog({
  dialog,
  designMode,
  busy,
  regenNote,
  continueNote,
  continueDesigns,
  checkNote,
  onRegenNote,
  onContinueNote,
  onContinueDesigns,
  onCheckNote,
  onClose,
  onSubmit
}) {
  const title = dialog.kind === "regenerate" ? "\u91CD\u65B0\u751F\u6210" : dialog.kind === "continue" ? "\u7EE7\u7EED\u4E00\u8F6E" : "\u4EBA\u5DE5\u6838\u5BF9";
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshpro-overlay", onClick: onClose, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshpro-modal-card is-dialog", role: "dialog", "aria-modal": "true", "aria-label": title, onClick: (event) => event.stopPropagation(), children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshpro-modal-head", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshpro-modal-title", children: title }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dshpro-icon-btn", onClick: onClose, "aria-label": "\u5173\u95ED", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Glyph, { name: "close", size: 15 }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshpro-dialog-body", children: [
      dialog.kind === "regenerate" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { htmlFor: "dshpro-regen", children: "\u4E0D\u6EE1\u610F\u7684\u5730\u65B9 / \u65B0\u8981\u6C42" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "\u53EF\u7559\u7A7A\u76F4\u63A5\u6362\u4E00\u7248\uFF1B\u63D0\u4EA4\u540E\u4FDD\u7559\u5DF2\u6709\u8F6E\u6B21\u3002" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", { id: "dshpro-regen", value: regenNote, onChange: (event) => onRegenNote(event.target.value), placeholder: "\u4F8B\u5982\uFF1A\u4FDD\u7559\u7248\u5F0F\uFF0C\u53EA\u6539\u914D\u8272\uFF1B\u6807\u9898\u5FC5\u987B\u51FA\u73B0\u2026\u2026\uFF1B\u4E0D\u8981\u518D\u7528\u2026\u2026" })
      ] }),
      dialog.kind === "continue" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { htmlFor: "dshpro-continue", children: "\u8FD9\u4E00\u8F6E\u53EA\u8865\u5145\u4EC0\u4E48" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "\u4E00\u6B21\u7EE7\u7EED\u53EA\u8FFD\u52A0\u4E00\u8F6E\uFF0C\u4E0D\u4F1A\u987A\u5E26\u8DD1\u5B8C\u5269\u4F59\u4E0A\u9650\u3002" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", { id: "dshpro-continue", value: continueNote, onChange: (event) => onContinueNote(event.target.value), placeholder: "\u4F8B\u5982\uFF1A\u53EA\u67E5\u90E8\u7F72\u98CE\u9669\uFF1B\u53EA\u6539\u914D\u8272\uFF0C\u4FDD\u7559\u7248\u5F0F" }),
        designMode && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshpro-dialog-row", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "\u672C\u8F6E\u65B9\u5411\u6570" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { type: "number", min: 1, max: 6, value: continueDesigns, onChange: (event) => onContinueDesigns(event.target.value), placeholder: "3" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "1\u20136" })
        ] })
      ] }),
      dialog.kind === "check" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { htmlFor: "dshpro-check", children: "\u6838\u5BF9\u4F9D\u636E\uFF08\u5FC5\u586B\uFF09" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
          "\u7ED3\u8BBA\uFF1A",
          dialog.conclusion === "submitted" ? "\u5DF2\u63D0\u4EA4" : dialog.conclusion === "not_submitted" ? "\u672A\u63D0\u4EA4" : "\u9700\u91CD\u5F00",
          "\u3002\u5199\u4E00\u4E0B\u4F60\u5728\u6D4F\u89C8\u5668\u91CC\u770B\u5230\u7684\u4F9D\u636E\uFF0C\u65B9\u4FBF\u8FFD\u6EAF\u3002"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", { id: "dshpro-check", value: checkNote, onChange: (event) => onCheckNote(event.target.value), placeholder: "\u4F8B\u5982\uFF1A\u8F93\u5165\u6846\u91CC\u80FD\u770B\u5230\u6D88\u606F\u3001\u9644\u4EF6\u5361\u7247\u9F50\u5168\uFF1B\u6216\u9875\u9762\u505C\u5728 about:blank" })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshpro-dialog-foot", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dshpro-btn", onClick: onClose, children: "\u53D6\u6D88" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dshpro-btn primary", onClick: onSubmit, disabled: busy, children: busy ? "\u5904\u7406\u4E2D\u2026" : dialog.kind === "regenerate" ? "\u63D0\u4EA4\u91CD\u65B0\u751F\u6210" : dialog.kind === "continue" ? "\u63D0\u4EA4\u7EE7\u7EED" : "\u63D0\u4EA4\u6838\u5BF9" })
    ] })
  ] }) });
}
function TopicItem({
  topic,
  selected,
  design,
  onSelect
}) {
  const tone = toneOf(topic.status);
  const badge = attentionLabel(topic);
  const stall = topic.stall_reason !== null ? STALL_LABEL[topic.stall_reason] ?? topic.stall_reason : void 0;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "button",
    {
      type: "button",
      className: `dshpro-topic${selected ? " is-selected" : ""}`,
      "data-tone": tone,
      "data-topic-id": topic.topic_id,
      onClick: onSelect,
      title: topic.title,
      "aria-current": selected ? "true" : void 0,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dshpro-topic-bar" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dshpro-topic-title", children: topic.title }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "dshpro-topic-meta", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dshpro-dot", "data-tone": tone }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dshpro-status-text", "data-tone": tone, children: statusLabel(topic.status) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dshpro-sep", children: "\xB7" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: design ? "\u8BBE\u8BA1" : "\u7814\u7A76" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dshpro-sep", children: "\xB7" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
            topic.rounds,
            "/",
            topic.rounds_cap,
            " \u8F6E"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dshpro-sep", children: "\xB7" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatRelative(topic.updated) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "dshpro-topic-tail", children: [
            topic.artifacts.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "dshpro-topic-artifacts", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Glyph, { name: "image", size: 11 }),
              topic.artifacts.length
            ] }),
            badge !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dshpro-badge", "data-tone": tone, children: badge }),
            stall !== void 0 && badge === void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dshpro-badge", "data-tone": "warn", title: stall, children: stall })
          ] })
        ] })
      ]
    }
  );
}
function Panel() {
  const [topics, setTopics] = (0, import_react.useState)([]);
  const [selected, setSelected] = (0, import_react.useState)(void 0);
  const [detail, setDetail] = (0, import_react.useState)(void 0);
  const [error, setError] = (0, import_react.useState)(void 0);
  const [notice, setNotice] = (0, import_react.useState)(void 0);
  const [query, setQuery] = (0, import_react.useState)("");
  const [filter, setFilter] = (0, import_react.useState)("all");
  const [tab, setTab] = (0, import_react.useState)("overview");
  const [listLoading, setListLoading] = (0, import_react.useState)(false);
  const [detailLoading, setDetailLoading] = (0, import_react.useState)(false);
  const [dialog, setDialog] = (0, import_react.useState)(void 0);
  const [busy, setBusy] = (0, import_react.useState)(false);
  const [regenNote, setRegenNote] = (0, import_react.useState)("");
  const [continueNote, setContinueNote] = (0, import_react.useState)("");
  const [continueDesigns, setContinueDesigns] = (0, import_react.useState)("");
  const [checkNote, setCheckNote] = (0, import_react.useState)("");
  const [viewer, setViewer] = (0, import_react.useState)(void 0);
  showViewer = setViewer;
  (0, import_react.useEffect)(() => {
    if (notice === void 0) return;
    const timer = setTimeout(() => setNotice(void 0), 4e3);
    return () => clearTimeout(timer);
  }, [notice]);
  (0, import_react.useEffect)(() => {
    if (viewer === void 0 && dialog === void 0) return;
    const onKey = (event) => {
      if (event.key !== "Escape") return;
      if (viewer !== void 0) setViewer(void 0);
      else setDialog(void 0);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [viewer, dialog]);
  const loadList = async () => {
    setListLoading(true);
    try {
      const data = await getJson(`${config.routes}/topics`);
      setTopics(data.topics);
      setError(void 0);
      setSelected((current2) => current2 ?? data.topics[0]?.topic_id);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setListLoading(false);
    }
  };
  const loadDetail = async (id) => {
    setDetailLoading(true);
    try {
      const data = await getJson(`${config.routes}/topic?id=${encodeURIComponent(id)}`);
      setDetail(data.topic);
      setError(void 0);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setDetailLoading(false);
    }
  };
  (0, import_react.useEffect)(() => {
    void loadList();
    const timer = setInterval(() => {
      void loadList();
    }, POLL_MS2);
    return () => clearInterval(timer);
  }, []);
  (0, import_react.useEffect)(() => {
    if (selected === void 0) return;
    void loadDetail(selected);
    const timer = setInterval(() => {
      void loadDetail(selected);
    }, POLL_MS2);
    return () => clearInterval(timer);
  }, [selected]);
  (0, import_react.useEffect)(() => {
    if (selected === void 0 || detail === void 0) return;
    const listed = topics.find((topic) => topic.topic_id === selected);
    if (listed !== void 0 && listed.status !== detail.status) void loadDetail(selected);
  }, [topics, selected, detail]);
  (0, import_react.useEffect)(() => {
    const refresh2 = () => {
      if (selected !== void 0) void loadDetail(selected);
      void loadList();
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") refresh2();
    };
    window.addEventListener("focus", refresh2);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("focus", refresh2);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [selected]);
  (0, import_react.useEffect)(() => {
    setTab("overview");
    setDialog(void 0);
    setViewer(void 0);
    if (selected === void 0) return;
    const reveal = () => {
      const row = document.querySelector(`[data-topic-id="${selected}"]`);
      row?.scrollIntoView({ block: "nearest" });
    };
    reveal();
    window.addEventListener("resize", reveal);
    return () => window.removeEventListener("resize", reveal);
  }, [selected]);
  const act = async (action, conclusion, note) => {
    const target = detail?.topic_id;
    if (selected === void 0 || target === void 0 || target !== selected) {
      setNotice({ kind: "error", text: "\u4E3B\u9898\u6B63\u5728\u5207\u6362\uFF0C\u8BF7\u7B49\u8BE6\u60C5\u52A0\u8F7D\u5B8C\u6210\u540E\u518D\u64CD\u4F5C" });
      return false;
    }
    try {
      const result = await postAction({ action, topic_id: target, ...conclusion !== void 0 ? { conclusion } : {}, ...note !== void 0 ? { note } : {} });
      const wake = result.topic?.wake;
      if (action === "accept") {
        setDetail((current2) => current2 === void 0 ? current2 : { ...current2, status: "completed" });
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
      } else if (action === "human_check") {
        setNotice({ kind: "ok", text: "\u4EBA\u5DE5\u6838\u5BF9\u5DF2\u8BB0\u5F55" });
      } else {
        setNotice({ kind: "ok", text: action === "regenerate" ? "\u5DF2\u63D0\u4EA4\u91CD\u65B0\u751F\u6210" : `\u5DF2\u6267\u884C\uFF1A${action}` });
      }
      setDialog(void 0);
      await loadDetail(target);
      await loadList();
      return true;
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : String(cause);
      setError(void 0);
      setNotice({ kind: "error", text: message });
      return false;
    }
  };
  const runPanelAction = async (action) => {
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
  };
  const submitRegenerate = async () => {
    const target = detail?.topic_id;
    if (selected === void 0 || target === void 0 || target !== selected) {
      setNotice({ kind: "error", text: "\u4E3B\u9898\u6B63\u5728\u5207\u6362\uFF0C\u8BF7\u7B49\u8BE6\u60C5\u52A0\u8F7D\u5B8C\u6210\u540E\u518D\u64CD\u4F5C" });
      return;
    }
    try {
      await postAction({ action: "regenerate", topic_id: target, note: regenNote.trim() });
      setNotice({ kind: "ok", text: "\u5DF2\u63D0\u4EA4\u91CD\u65B0\u751F\u6210" });
      setDetail((current2) => current2 === void 0 ? current2 : { ...current2, status: "queued" });
      setDialog(void 0);
      setRegenNote("");
      await loadDetail(target);
      await loadList();
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : String(cause);
      setError(void 0);
      setNotice({ kind: "error", text: message });
    }
  };
  const submitContinue = async () => {
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
      setDetail((current2) => current2 === void 0 ? current2 : { ...current2, status: "queued" });
      setDialog(void 0);
      setContinueNote("");
      setContinueDesigns("");
      await loadDetail(target);
      await loadList();
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : String(cause);
      setError(void 0);
      setNotice({ kind: "error", text: message });
    }
  };
  const submitHumanCheck = async () => {
    if (dialog === void 0 || dialog.kind !== "check") return;
    const note = checkNote.trim();
    if (note === "") {
      setNotice({ kind: "error", text: "\u8BF7\u586B\u5199\u6838\u5BF9\u4F9D\u636E" });
      return;
    }
    const ok = await act("human_check", dialog.conclusion, note);
    if (ok) setCheckNote("");
  };
  const submitDialog = () => {
    if (dialog === void 0 || busy) return;
    setBusy(true);
    const task = dialog.kind === "regenerate" ? submitRegenerate() : dialog.kind === "continue" ? submitContinue() : submitHumanCheck();
    void task.finally(() => setBusy(false));
  };
  const openRegenerate = () => {
    setRegenNote("");
    setDialog({ kind: "regenerate" });
  };
  const openContinue = () => {
    setContinueNote("");
    setContinueDesigns("");
    setDialog({ kind: "continue" });
  };
  const openCheck = (conclusion) => {
    setCheckNote("");
    setDialog({ kind: "check", conclusion });
  };
  const current = detail !== void 0 && detail.topic_id === selected ? detail : void 0;
  const hasArtifacts = (current?.artifacts.length ?? 0) > 0;
  const canAccept = current !== void 0 && (current.status === "capped" || current.status === "reviewing" && (current.review_from === "capped" || hasArtifacts) || (current.status === "failed" || current.status === "stalled") && hasArtifacts);
  const canRegenerate = current !== void 0 && (current.status === "completed" || current.status === "capped" || current.status === "reviewing" || current.status === "failed" || current.status === "stalled");
  const canContinue = current !== void 0 && (current.status === "completed" || current.status === "capped" || current.status === "reviewing" || current.status === "failed" || current.status === "stalled");
  const canReview = current !== void 0 && (current.status === "capped" || current.status === "reviewing" || (current.status === "failed" || current.status === "stalled") && hasArtifacts);
  const canReviewCancel = current !== void 0 && current.status === "reviewing";
  const canWake = current !== void 0 && current.status === "completed";
  const canCancel = current !== void 0 && ACTIVE.has(current.status);
  const canResume = current !== void 0 && (current.status === "stalled" || current.status === "failed");
  const acceptLabel = current !== void 0 && (current.status === "capped" || current.status === "reviewing") ? "\u63A5\u53D7\u7ED3\u679C" : "\u63A5\u53D7\u5DF2\u6709\u4EA7\u7269";
  let primary;
  if (current !== void 0) {
    if (canResume) primary = { label: "\u6062\u590D\u8FD0\u884C", run: () => {
      void act("resume");
    } };
    else if (canAccept) primary = { label: acceptLabel, run: () => {
      void act("accept");
    } };
    else if (current.status === "completed" && canContinue) primary = { label: "\u7EE7\u7EED\u4E00\u8F6E", run: openContinue };
  }
  const secondary = [];
  if (current !== void 0) {
    if (canContinue && primary?.label !== "\u7EE7\u7EED\u4E00\u8F6E") secondary.push({ label: "\u7EE7\u7EED\u4E00\u8F6E", run: openContinue });
    if (canRegenerate && primary?.label !== "\u91CD\u65B0\u751F\u6210") secondary.push({ label: "\u91CD\u65B0\u751F\u6210", run: openRegenerate });
    if (canReview) secondary.push({ label: current.status === "reviewing" ? "\u518D\u6B21\u63D0\u9192\u539F\u4F1A\u8BDD" : "\u8BF7\u539F\u4F1A\u8BDD\u5224\u65AD", run: () => {
      void act("review");
    } });
    if (canReviewCancel) secondary.push({ label: "\u64A4\u56DE\u5224\u65AD\u8BF7\u6C42", run: () => {
      void act("review_cancel");
    } });
    if (canWake) secondary.push({ label: "\u5524\u9192\u539F\u4F1A\u8BDD", run: () => {
      void act("wake");
    } });
    if (canAccept && primary?.label !== acceptLabel) secondary.push({ label: acceptLabel, run: () => {
      void act("accept");
    } });
  }
  const counts = (0, import_react.useMemo)(() => {
    const count = (statuses) => topics.filter((topic) => statuses.has(topic.status)).length;
    return {
      all: topics.length,
      active: topics.filter((topic) => topic.status === "draft" || ACTIVE.has(topic.status)).length,
      attention: count(ATTENTION),
      done: count(DONE)
    };
  }, [topics]);
  const filtered = (0, import_react.useMemo)(() => {
    const text = query.trim().toLowerCase();
    const base = topics.filter((topic) => {
      if (text !== "" && !topic.title.toLowerCase().includes(text)) return false;
      if (filter === "active") return topic.status === "draft" || ACTIVE.has(topic.status);
      if (filter === "attention") return ATTENTION.has(topic.status);
      if (filter === "done") return DONE.has(topic.status);
      return true;
    });
    return [...base].sort((left, right) => (right.updated ?? "").localeCompare(left.updated ?? ""));
  }, [topics, query, filter]);
  const copyPath = async () => {
    if (current?.path === void 0 || current.path === "") return;
    try {
      await copyText(current.path);
      setNotice({ kind: "ok", text: "\u4E3B\u9898\u8DEF\u5F84\u5DF2\u590D\u5236" });
    } catch (cause) {
      setNotice({ kind: "error", text: cause instanceof Error ? cause.message : String(cause) });
    }
  };
  const refresh = () => {
    if (selected !== void 0) void loadDetail(selected);
    void loadList();
  };
  const hasBanner = current !== void 0 && (current.status === "capped" || current.status === "reviewing" || current.status === "stalled" || current.status === "failed" || current.status === "draft" || ACTIVE.has(current.status));
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshpro-root", "data-plugin": config.designMode ? "design" : "research", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { "data-dsh-pro-panel": true, dangerouslySetInnerHTML: { __html: PANEL_CSS } }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", { className: "dshpro-list", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshpro-list-head", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshpro-brand", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dshpro-brand-mark", children: config.designMode ? "D" : "R" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshpro-brand-info", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshpro-brand-title", children: config.title }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshpro-brand-sub", children: config.designMode ? "\u8BBE\u8BA1\u4EFB\u52A1 \xB7 \u56FE\u7247\u4E0E demo" : "\u7814\u7A76\u4EFB\u52A1 \xB7 \u8F6E\u6B21\u4E0E\u6587\u6863" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dshpro-count", children: topics.length })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "dshpro-search", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Glyph, { name: "search", size: 13 }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { value: query, onChange: (event) => setQuery(event.target.value), placeholder: "\u641C\u7D22\u4E3B\u9898\u2026", "aria-label": "\u641C\u7D22\u4E3B\u9898" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshpro-filters", children: FILTERS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          "button",
          {
            type: "button",
            "aria-pressed": filter === item.id,
            className: `dshpro-filter${filter === item.id ? " is-on" : ""}`,
            onClick: () => setFilter(item.id),
            children: [
              item.label,
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: counts[item.id] })
            ]
          },
          item.id
        )) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshpro-list-scroll", "aria-busy": listLoading, children: [
        error !== void 0 && topics.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshpro-list-error", children: [
          "\u52A0\u8F7D\u5931\u8D25\uFF1A",
          error,
          " ",
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dshpro-card-link", onClick: () => {
            void loadList();
          }, children: "\u91CD\u8BD5" })
        ] }),
        listLoading && topics.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListSkeleton, {}) : topics.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshpro-list-empty", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshpro-empty-icon", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Glyph, { name: config.designMode ? "image" : "file", size: 24 }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: config.designMode ? "\u8FD8\u6CA1\u6709\u8BBE\u8BA1\u4EFB\u52A1" : "\u8FD8\u6CA1\u6709\u7814\u7A76\u4EFB\u52A1" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: config.designMode ? "\u5728\u4F1A\u8BDD\u91CC\u7528 /gpt-image-design \u5F00\u59CB\u3002" : "\u5728\u4F1A\u8BDD\u91CC\u7528 /pro-research \u5F00\u59CB\u3002" })
        ] }) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshpro-list-empty", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "\u6CA1\u6709\u5339\u914D\u7684\u4E3B\u9898" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "\u6362\u4E2A\u5173\u952E\u8BCD\uFF0C\u6216\u6E05\u9664\u7B5B\u9009\u3002" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dshpro-btn small", onClick: () => {
            setQuery("");
            setFilter("all");
          }, children: "\u6E05\u9664" })
        ] }) : filtered.map((topic) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          TopicItem,
          {
            topic,
            selected: topic.topic_id === selected,
            design: config.designMode,
            onSelect: () => {
              markTopicSeen(config.panelId, topic.topic_id, topic.updated);
              setSelected(topic.topic_id);
            }
          },
          topic.topic_id
        ))
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { className: "dshpro-detail", children: [
      error !== void 0 && topics.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshpro-error-banner", role: "alert", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Glyph, { name: "alert", size: 13 }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
          "\u63A5\u53E3\u9519\u8BEF\uFF1A",
          error
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dshpro-card-link", style: { marginLeft: "auto" }, onClick: refresh, children: "\u91CD\u8BD5" })
      ] }),
      selected === void 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyDetail, { design: config.designMode }) : current === void 0 ? detailLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailSkeleton, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyDetail, { design: config.designMode }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { className: "dshpro-head", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshpro-title-row", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { className: "dshpro-title", children: current.title }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: current.status })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshpro-meta", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
              current.rounds,
              "/",
              current.rounds_cap,
              " \u8F6E"
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: current.type === "design" ? "\u8BBE\u8BA1" : "\u7814\u7A76" }),
            channelLabel(current.channel) !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: channelLabel(current.channel) }),
            current.model !== void 0 && current.model !== "" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: current.model }),
            current.designs != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
              "\u6BCF\u8F6E ",
              current.designs,
              " \u4E2A\u65B9\u5411"
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
              "\u66F4\u65B0 ",
              formatRelative(current.updated)
            ] })
          ] }),
          current.stop_reason !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshpro-card-sub", style: { marginTop: 6 }, children: [
            "\u505C\u6B62\u4F9D\u636E\uFF1A",
            current.stop_reason
          ] }),
          (current.judge_enabled === false || current.judge_enabled === void 0 && (current.stop_reason ?? "").includes("\u672A\u914D\u7F6E\u88C1\u51B3\u6A21\u578B")) && current.status === "capped" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshpro-card-sub", style: { marginTop: 6, color: "var(--dshpro-warn)" }, children: "\u5F53\u524D\u6CA1\u6709\u53EF\u7528\u7684\u81EA\u52A8\u88C1\u51B3\u6A21\u578B\uFF1A\u8DD1\u6EE1\u8F6E\u6B21\u540E\u8FDB\u5165\u5F85\u63A5\u53D7\u3002" }),
          current.path !== void 0 && current.path !== "" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshpro-path", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Glyph, { name: "folder", size: 12 }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { title: current.path, children: current.path }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dshpro-icon-btn", title: "\u590D\u5236\u8DEF\u5F84", "aria-label": "\u590D\u5236\u4E3B\u9898\u8DEF\u5F84", onClick: () => {
              void copyPath();
            }, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Glyph, { name: "copy", size: 12 }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshpro-actions", children: [
            primary !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dshpro-btn primary", onClick: primary.run, children: primary.label }),
            secondary.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dshpro-btn", onClick: item.run, children: item.label }, item.label)),
            canCancel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dshpro-btn danger", onClick: () => {
              void act("cancel");
            }, children: "\u53D6\u6D88\u8FD0\u884C" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", { className: "dshpro-more", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", { className: "dshpro-btn", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Glyph, { name: "more", size: 13 }),
                " \u66F4\u591A"
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshpro-menu", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", onClick: (event) => {
                  closeMenu(event);
                  void runPanelAction("probe");
                }, children: "\u81EA\u68C0" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", onClick: (event) => {
                  closeMenu(event);
                  void runPanelAction("login");
                }, children: "\u767B\u5F55" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", onClick: (event) => {
                  closeMenu(event);
                  void copyPath();
                }, children: "\u590D\u5236\u4E3B\u9898\u8DEF\u5F84" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", onClick: (event) => {
                  closeMenu(event);
                  refresh();
                }, children: "\u5237\u65B0" })
              ] })
            ] })
          ] })
        ] }),
        hasBanner && current !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshpro-banner", "data-tone": current.status === "stalled" || current.status === "failed" ? "error" : current.status === "capped" ? "warn" : current.status === "reviewing" ? "review" : "active", children: [
          current.status === "stalled" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "\u5361\u4F4F\u4E86" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
              STALL_LABEL[current.stall_reason ?? ""] ?? "\u9700\u8981\u4EBA\u5DE5\u68C0\u67E5",
              "\uFF1B\u68C0\u67E5\u5171\u4EAB Chrome \u73B0\u573A\u540E\u6062\u590D\uFF0C\u6216\u505A\u4EBA\u5DE5\u6838\u5BF9\u3002"
            ] })
          ] }),
          current.status === "failed" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "\u8FD0\u884C\u5931\u8D25" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "\u53EF\u6062\u590D\u8FD0\u884C\uFF0C\u6216\u63A5\u53D7\u5DF2\u6709\u4EA7\u7269\u3002" })
          ] }),
          current.status === "capped" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "\u5DF2\u8FBE\u5230\u8F6E\u6B21\u4E0A\u9650" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "\u68C0\u67E5\u4EA7\u7269\u540E\u63A5\u53D7\u7ED3\u679C\uFF0C\u6216\u7EE7\u7EED\u4E00\u8F6E\u3002" })
          ] }),
          current.status === "reviewing" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "\u5F85\u539F\u4F1A\u8BDD\u5224\u65AD" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "\u7ED3\u679C\u5DF2\u4EA4\u7ED9\u53D1\u8D77\u4F1A\u8BDD\uFF1B\u53EF\u4EE5\u63A5\u53D7\u7ED3\u679C\uFF0C\u6216\u64A4\u56DE\u5224\u65AD\u8BF7\u6C42\u3002" })
          ] }),
          ACTIVE.has(current.status) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "\u6B63\u5728\u8FD0\u884C" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
              statusLabel(current.status),
              " \xB7 \u6BCF 3 \u79D2\u5237\u65B0"
            ] })
          ] }),
          current.status === "draft" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "\u8349\u7A3F" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "\u7B49\u5F85\u786E\u8BA4\u540E\u5F00\u59CB\u3002" })
          ] }),
          current.status === "stalled" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshpro-check-actions", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "\u4EBA\u5DE5\u6838\u5BF9" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dshpro-btn small", onClick: () => openCheck("submitted"), children: "\u5DF2\u63D0\u4EA4" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dshpro-btn small", onClick: () => openCheck("not_submitted"), children: "\u672A\u63D0\u4EA4" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", className: "dshpro-btn small", onClick: () => openCheck("reopen"), children: "\u9700\u91CD\u5F00" })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", { className: "dshpro-tabs", role: "tablist", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { type: "button", role: "tab", "aria-selected": tab === "overview", className: `dshpro-tab${tab === "overview" ? " is-on" : ""}`, onClick: () => setTab("overview"), children: "\u6982\u89C8" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { type: "button", role: "tab", "aria-selected": tab === "rounds", className: `dshpro-tab${tab === "rounds" ? " is-on" : ""}`, onClick: () => setTab("rounds"), children: [
            "\u8F6E\u6B21",
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: current.rounds })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", { type: "button", role: "tab", "aria-selected": tab === "artifacts", className: `dshpro-tab${tab === "artifacts" ? " is-on" : ""}`, onClick: () => setTab("artifacts"), children: [
            "\u4EA7\u7269",
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: current.artifacts.length })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshpro-body", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "dshpro-main", children: [
            tab === "overview" && (config.designMode ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DesignOverview, { detail: current, onTab: setTab }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResearchOverview, { detail: current, onTab: setTab })),
            tab === "rounds" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoundsView, { detail: current }),
            tab === "artifacts" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArtifactsView, { detail: current })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rail, { detail: current, onTab: setTab })
        ] })
      ] })
    ] }),
    dialog !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      ActionDialog,
      {
        dialog,
        designMode: config.designMode,
        busy,
        regenNote,
        continueNote,
        continueDesigns,
        checkNote,
        onRegenNote: setRegenNote,
        onContinueNote: setContinueNote,
        onContinueDesigns: setContinueDesigns,
        onCheckNote: setCheckNote,
        onClose: () => setDialog(void 0),
        onSubmit: submitDialog
      }
    ),
    viewer !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ViewerModal, { view: viewer, basePath: current?.path, onClose: () => setViewer(void 0) }),
    notice !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "dshpro-toast", "data-kind": notice.kind, role: notice.kind === "error" ? "alert" : "status", children: notice.text })
  ] });
}
function Icon({ kind }) {
  const svg = kind === "design" ? DESIGN_ICON : RESEARCH_ICON;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "dshpro-sidebar-icon", "aria-hidden": "true", style: { display: "inline-flex", width: 16, height: 16, lineHeight: 0, color: "inherit" }, dangerouslySetInnerHTML: { __html: svg } });
}
function apply(ctx) {
  ctx.slots.inject("main", () => ctx.slots.register({ name: "main", key: config.panelId }, () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {})));
  ctx.slots.inject("sidebar.panellist", () => ctx.slots.register({ name: "sidebar.panellist", id: config.panelId, order: 21, label: () => config.label }, () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { kind: config.icon })));
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
