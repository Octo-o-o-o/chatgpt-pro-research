// chatgpt-pro-research — built from packages/research/src/index.ts

// packages/research/src/plugin.ts
import { spawn } from "node:child_process";
import { randomUUID as randomUUID7 } from "node:crypto";
import { homedir } from "node:os";
import { dirname as dirname4, extname as extname3, isAbsolute as isAbsolute5, join as join5, resolve as resolve6 } from "node:path";
import { mkdir as mkdir4, readFile as readFile6, rename as rename3, writeFile as writeFile3 } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import z from "@deepseek-ai/schemastery";
import { defineTool } from "@deepseek-ai/dsh-tools";
import { BlockAssembler, createUserMessage } from "@deepseek-ai/dsh-llm";

// packages/core/src/types.ts
var TransportError = class extends Error {
  failure;
  submissionState;
  answerIncomplete;
  constructor(message, failure, options) {
    super(message, options);
    this.name = "TransportError";
    this.failure = failure;
    this.submissionState = options?.submissionState;
    this.answerIncomplete = options?.answerIncomplete;
  }
};
function isTransportError(error) {
  if (error === null || typeof error !== "object") return false;
  const value = error;
  return value.name === "TransportError" && typeof value.message === "string" && ["login", "upload", "ui", "network", "worker", "timeout", "config"].includes(value.failure ?? "");
}

// packages/core/src/config.ts
var DEFAULT_SECRET_GLOBS = [
  ".env",
  ".env.*",
  "*.pem",
  "*.key",
  "id_rsa*",
  ".npmrc",
  ".credentials*",
  "**/secrets/**"
];
function defaultConfig(home) {
  return {
    channel: "web",
    image: {
      baseUrl: "https://api.openai.com/v1",
      apiKey: "",
      model: "gpt-image-1",
      size: "auto",
      quality: "auto",
      format: "png",
      auth: "bearer",
      editMode: "auto",
      timeoutSeconds: 300
    },
    model: "prefer-pro",
    rounds: 3,
    designs: 3,
    stallMinutes: 45,
    maxRoundMinutes: 90,
    store: "project",
    autoStart: false,
    autoReview: true,
    notify: "stall-only",
    maxFiles: 12,
    maxTotalMB: 24,
    secretGlobs: [...DEFAULT_SECRET_GLOBS],
    rawAnswers: "local",
    rawAnswersDir: `${home}/raw`,
    judgeProvider: "",
    judgeModel: "",
    browser: { profileDir: `${home}/browser`, headless: false }
  };
}
var ROUND_MIN = 1;
var ROUND_MAX = 10;
var IMAGE_FORMATS = ["png", "jpeg", "webp"];
function isLoopbackHost(hostname) {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, "");
  return host === "localhost" || host === "127.0.0.1" || host === "::1" || host.endsWith(".localhost");
}
function assertImageApiConfig(image, options) {
  let url;
  try {
    url = new URL(image.baseUrl.trim());
  } catch {
    throw new Error("imageBaseUrl must be an absolute URL, for example https://api.openai.com/v1");
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("imageBaseUrl must use http or https");
  }
  if (url.protocol === "http:" && !isLoopbackHost(url.hostname)) {
    throw new Error("imageBaseUrl must use https unless it points at localhost/loopback");
  }
  if (image.model.trim() === "") throw new Error("imageModel is required for the api channel");
  if (!IMAGE_FORMATS.includes(image.format)) throw new Error("imageFormat must be png, jpeg or webp");
  if (image.auth !== "bearer" && image.auth !== "api-key") throw new Error("imageAuth must be bearer or api-key");
  if (image.editMode !== "auto" && image.editMode !== "off") throw new Error("imageEdit must be auto or off");
  if (!Number.isInteger(image.timeoutSeconds) || image.timeoutSeconds < 10 || image.timeoutSeconds > 3600) {
    throw new Error("imageTimeoutSeconds must be an integer between 10 and 3600");
  }
  if (options?.requireKey === true && image.apiKey.trim() === "") {
    throw new Error("imageApiKey is empty: set it in the plugin settings or export GPT_IMAGE_API_KEY");
  }
}
function cardRounds(config, card) {
  const rounds = card.rounds ?? config.rounds;
  if (!Number.isInteger(rounds) || rounds < ROUND_MIN || rounds > ROUND_MAX) {
    throw new Error(`rounds must be an integer between ${ROUND_MIN} and ${ROUND_MAX}`);
  }
  return rounds;
}

// packages/core/src/state.ts
var TRANSITIONS = {
  draft: ["queued", "stalled", "cancelled"],
  queued: ["uploading", "adjudicating", "stalled", "capped", "failed", "cancelled"],
  uploading: ["submitted", "stalled", "failed", "cancelled"],
  submitted: ["waiting", "stalled", "failed", "cancelled"],
  waiting: ["answered", "stalled", "failed", "cancelled"],
  answered: ["adjudicating", "stalled", "failed", "cancelled"],
  adjudicating: ["queued", "completed", "capped", "reviewing", "stalled", "failed", "cancelled"],
  completed: ["queued"],
  capped: ["queued", "reviewing", "completed", "cancelled"],
  reviewing: ["queued", "answered", "completed", "capped", "stalled", "failed", "cancelled"],
  stalled: ["queued", "waiting", "reviewing", "failed", "completed", "cancelled"],
  failed: ["queued", "waiting", "reviewing", "stalled", "completed", "cancelled"],
  cancelled: []
};
function canTransition(from, to) {
  return TRANSITIONS[from].includes(to);
}
var STATUSES = Object.keys(TRANSITIONS);
function assertTransition(from, to) {
  if (!canTransition(from, to)) {
    throw new Error(`illegal status transition: ${from} -> ${to}`);
  }
}

// packages/core/src/slug.ts
import { createHash, randomBytes } from "node:crypto";
function shortHash(value, length = 4) {
  return createHash("sha256").update(value).digest("hex").slice(0, length);
}
function newTopicId(seed) {
  return `topic-${shortHash(`${seed}:${Date.now()}:${randomBytes(8).toString("hex")}`, 10)}`;
}
function slugifyTitle(title) {
  const ascii = title.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48).replace(/-+$/g, "");
  const letters = ascii.replace(/[^a-z]/g, "");
  const readable = ascii.length >= 5 && letters.length >= 3;
  return readable ? ascii : `topic-${shortHash(title)}`;
}

// packages/core/src/materials.ts
import { createHash as createHash2 } from "node:crypto";
import { readFile, realpath, stat } from "node:fs/promises";
import { isAbsolute, relative, resolve, sep } from "node:path";
var SECRET_CONTENT = [
  ["private-key", /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
  ["aws-access-key", /\bAKIA[0-9A-Z]{16}\b/],
  ["github-token", /\bgh[pousr]_[A-Za-z0-9]{20,}\b/],
  ["github-pat", /\bgithub_pat_[A-Za-z0-9_]{20,}\b/],
  ["openai-key", /\bsk-[A-Za-z0-9_-]{20,}\b/],
  ["slack-token", /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/],
  ["google-api-key", /\bAIza[0-9A-Za-z_-]{35}\b/]
];
function globToRegExp(glob) {
  const normalized = glob.replace(/\\/g, "/");
  let out = "^";
  for (let i2 = 0; i2 < normalized.length; i2 += 1) {
    const char = normalized[i2];
    if (char === "*") {
      if (normalized[i2 + 1] === "*") {
        i2 += 1;
        if (normalized[i2 + 1] === "/") {
          i2 += 1;
          out += "(?:.*/)?";
        } else {
          out += ".*";
        }
      } else {
        out += "[^/]*";
      }
    } else if (char === "?") {
      out += "[^/]";
    } else if ("\\^$.|+()[]{}".includes(char ?? "")) {
      out += `\\${char}`;
    } else {
      out += char;
    }
  }
  out += "$";
  return new RegExp(out);
}
function isSecretPath(relativePath, globs) {
  const normalized = relativePath.replace(/\\/g, "/");
  return globs.some((glob) => {
    const pattern = glob.includes("/") ? glob : `**/${glob}`;
    return globToRegExp(pattern).test(normalized);
  });
}
function findSecret(text) {
  for (const [name2, pattern] of SECRET_CONTENT) {
    if (pattern.test(text)) return name2;
  }
  return void 0;
}
async function buildManifest(root, relativePaths, reasons, secretGlobs = []) {
  const refs = [];
  if (relativePaths.length === 0) return refs;
  const normalizedRoot = resolve(root);
  const realRoot = await realpath(normalizedRoot);
  for (const relativePath of relativePaths) {
    if (isAbsolute(relativePath)) throw new Error(`material path must be relative: ${relativePath}`);
    const normalized = relativePath.replace(/\\/g, "/");
    if (normalized.split("/").includes("..")) throw new Error(`material path escapes the workspace: ${relativePath}`);
    const absolute = resolve(normalizedRoot, normalized);
    if (absolute !== normalizedRoot && !absolute.startsWith(`${normalizedRoot}${sep}`)) {
      throw new Error(`material path escapes the workspace: ${relativePath}`);
    }
    if (isSecretPath(normalized, secretGlobs)) {
      throw new Error(`material path matches a secret pattern: ${relativePath}`);
    }
    const source = await realpath(absolute);
    const realRelative = relative(realRoot, source);
    if (realRelative === ".." || realRelative.startsWith(`..${sep}`) || isAbsolute(realRelative)) {
      throw new Error(`material path escapes the workspace: ${relativePath}`);
    }
    if (isSecretPath(realRelative, secretGlobs)) {
      throw new Error(`material path matches a secret pattern: ${relativePath}`);
    }
    const info = await stat(source);
    if (!info.isFile()) throw new Error(`material is not a file: ${relativePath}`);
    const bytes = await readFile(source);
    const text = bytes.toString("utf8");
    const secret = findSecret(text);
    if (secret !== void 0) throw new Error(`material contains a ${secret}: ${relativePath}`);
    refs.push({
      path: relative(normalizedRoot, absolute).replace(/\\/g, "/"),
      // Keep the display/manifest name, but stage the verified canonical file,
      // never a link which can be retargeted after the security checks above.
      source,
      bytes: info.size,
      sha256: createHash2("sha256").update(bytes).digest("hex"),
      ...reasons?.[relativePath] !== void 0 ? { reason: reasons[relativePath] } : {}
    });
  }
  return refs;
}
function assertMaterialLimits(refs, maxFiles, maxTotalMB) {
  if (refs.length > maxFiles) throw new Error(`too many materials: ${refs.length} > ${maxFiles}`);
  const total = refs.reduce((sum, ref) => sum + ref.bytes, 0);
  if (total > maxTotalMB * 1024 * 1024) {
    throw new Error(`materials exceed ${maxTotalMB} MB`);
  }
}

// packages/core/src/store.ts
import { appendFile, mkdir as mkdir2, readFile as readFile2, readdir, realpath as realpath3, rename as rename2, rm as rm2, writeFile as writeFile2 } from "node:fs/promises";
import { createHash as createHash4, randomUUID as randomUUID2 } from "node:crypto";
import { basename as basename2, dirname as dirname2, isAbsolute as isAbsolute3, join as join3, relative as relative3, resolve as resolve3, sep as sep3 } from "node:path";

// node_modules/fflate/esm/index.mjs
import { createRequire } from "module";
var require2 = createRequire("/");
var _a;
var Worker;
var isMarkedAsUntransferable;
try {
  _a = require2("worker_threads"), Worker = _a.Worker, isMarkedAsUntransferable = _a.isMarkedAsUntransferable;
} catch (e) {
}
var u8 = Uint8Array;
var u16 = Uint16Array;
var i32 = Int32Array;
var fleb = new u8([
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  1,
  1,
  1,
  2,
  2,
  2,
  2,
  3,
  3,
  3,
  3,
  4,
  4,
  4,
  4,
  5,
  5,
  5,
  5,
  0,
  /* unused */
  0,
  0,
  /* impossible */
  0
]);
var fdeb = new u8([
  0,
  0,
  0,
  0,
  1,
  1,
  2,
  2,
  3,
  3,
  4,
  4,
  5,
  5,
  6,
  6,
  7,
  7,
  8,
  8,
  9,
  9,
  10,
  10,
  11,
  11,
  12,
  12,
  13,
  13,
  /* unused */
  0,
  0
]);
var clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
var freb = function(eb, start) {
  var b = new u16(31);
  for (var i2 = 0; i2 < 31; ++i2) {
    b[i2] = start += 1 << eb[i2 - 1];
  }
  var r = new i32(b[30]);
  for (var i2 = 1; i2 < 30; ++i2) {
    for (var j = b[i2]; j < b[i2 + 1]; ++j) {
      r[j] = j - b[i2] << 5 | i2;
    }
  }
  return { b, r };
};
var _a = freb(fleb, 2);
var fl = _a.b;
var revfl = _a.r;
fl[28] = 258, revfl[258] = 28;
var _b = freb(fdeb, 0);
var fd = _b.b;
var revfd = _b.r;
var rev = new u16(32768);
for (i = 0; i < 32768; ++i) {
  x = (i & 43690) >> 1 | (i & 21845) << 1;
  x = (x & 52428) >> 2 | (x & 13107) << 2;
  x = (x & 61680) >> 4 | (x & 3855) << 4;
  rev[i] = ((x & 65280) >> 8 | (x & 255) << 8) >> 1;
}
var x;
var i;
var hMap = (function(cd, mb, r) {
  var s = cd.length;
  var i2 = 0;
  var l = new u16(mb);
  for (; i2 < s; ++i2) {
    if (cd[i2])
      ++l[cd[i2] - 1];
  }
  var le = new u16(mb);
  for (i2 = 1; i2 < mb; ++i2) {
    le[i2] = le[i2 - 1] + l[i2 - 1] << 1;
  }
  var co;
  if (r) {
    co = new u16(1 << mb);
    var rvb = 15 - mb;
    for (i2 = 0; i2 < s; ++i2) {
      if (cd[i2]) {
        var sv = i2 << 4 | cd[i2];
        var r_1 = mb - cd[i2];
        var v = le[cd[i2] - 1]++ << r_1;
        for (var m = v | (1 << r_1) - 1; v <= m; ++v) {
          co[rev[v] >> rvb] = sv;
        }
      }
    }
  } else {
    co = new u16(s);
    for (i2 = 0; i2 < s; ++i2) {
      if (cd[i2]) {
        co[i2] = rev[le[cd[i2] - 1]++] >> 15 - cd[i2];
      }
    }
  }
  return co;
});
var flt = new u8(288);
for (i = 0; i < 144; ++i)
  flt[i] = 8;
var i;
for (i = 144; i < 256; ++i)
  flt[i] = 9;
var i;
for (i = 256; i < 280; ++i)
  flt[i] = 7;
var i;
for (i = 280; i < 288; ++i)
  flt[i] = 8;
var i;
var fdt = new u8(32);
for (i = 0; i < 32; ++i)
  fdt[i] = 5;
var i;
var flm = /* @__PURE__ */ hMap(flt, 9, 0);
var flrm = /* @__PURE__ */ hMap(flt, 9, 1);
var fdm = /* @__PURE__ */ hMap(fdt, 5, 0);
var fdrm = /* @__PURE__ */ hMap(fdt, 5, 1);
var max = function(a) {
  var m = a[0];
  for (var i2 = 1; i2 < a.length; ++i2) {
    if (a[i2] > m)
      m = a[i2];
  }
  return m;
};
var bits = function(d, p, m) {
  var o = p / 8 | 0;
  return (d[o] | d[o + 1] << 8) >> (p & 7) & m;
};
var bits16 = function(d, p) {
  var o = p / 8 | 0;
  return (d[o] | d[o + 1] << 8 | d[o + 2] << 16) >> (p & 7);
};
var shft = function(p) {
  return (p + 7) / 8 | 0;
};
var slc = function(v, s, e) {
  if (s == null || s < 0)
    s = 0;
  if (e == null || e > v.length)
    e = v.length;
  return new u8(v.subarray(s, e));
};
var ec = [
  "unexpected EOF",
  "invalid block type",
  "invalid length/literal",
  "invalid distance",
  "stream finished",
  "no stream handler",
  ,
  // determined by compression function
  "no callback",
  "invalid UTF-8 data",
  "extra field too long",
  "date not in range 1980-2099",
  "filename too long",
  "stream finishing",
  "invalid zip data"
  // determined by unknown compression method
];
var err = function(ind, msg, nt) {
  var e = new Error(msg || ec[ind]);
  e.code = ind;
  if (Error.captureStackTrace)
    Error.captureStackTrace(e, err);
  if (!nt)
    throw e;
  return e;
};
var inflt = function(dat, st, buf, dict) {
  var sl = dat.length, dl = dict ? dict.length : 0;
  if (!sl || st.f && !st.l)
    return buf || new u8(0);
  var noBuf = !buf;
  var resize = noBuf || st.i != 2;
  var noSt = st.i;
  if (noBuf)
    buf = new u8(sl * 3);
  var cbuf = function(l2) {
    var bl = buf.length;
    if (l2 > bl) {
      var nbuf = new u8(Math.max(bl * 2, l2));
      nbuf.set(buf);
      buf = nbuf;
    }
  };
  var final = st.f || 0, pos = st.p || 0, bt = st.b || 0, lm = st.l, dm = st.d, lbt = st.m, dbt = st.n;
  var tbts = sl * 8;
  do {
    if (!lm) {
      final = bits(dat, pos, 1);
      var type = bits(dat, pos + 1, 3);
      pos += 3;
      if (!type) {
        var s = shft(pos) + 4, l = dat[s - 4] | dat[s - 3] << 8, t = s + l;
        if (t > sl) {
          if (noSt)
            err(0);
          break;
        }
        if (resize)
          cbuf(bt + l);
        buf.set(dat.subarray(s, t), bt);
        st.b = bt += l, st.p = pos = t * 8, st.f = final;
        continue;
      } else if (type == 1)
        lm = flrm, dm = fdrm, lbt = 9, dbt = 5;
      else if (type == 2) {
        var hLit = bits(dat, pos, 31) + 257, hcLen = bits(dat, pos + 10, 15) + 4;
        var tl = hLit + bits(dat, pos + 5, 31) + 1;
        pos += 14;
        var ldt = new u8(tl);
        var clt = new u8(19);
        for (var i2 = 0; i2 < hcLen; ++i2) {
          clt[clim[i2]] = bits(dat, pos + i2 * 3, 7);
        }
        pos += hcLen * 3;
        var clb = max(clt), clbmsk = (1 << clb) - 1;
        var clm = hMap(clt, clb, 1);
        for (var i2 = 0; i2 < tl; ) {
          var r = clm[bits(dat, pos, clbmsk)];
          pos += r & 15;
          var s = r >> 4;
          if (s < 16) {
            ldt[i2++] = s;
          } else {
            var c = 0, n = 0;
            if (s == 16)
              n = 3 + bits(dat, pos, 3), pos += 2, c = ldt[i2 - 1];
            else if (s == 17)
              n = 3 + bits(dat, pos, 7), pos += 3;
            else if (s == 18)
              n = 11 + bits(dat, pos, 127), pos += 7;
            while (n--)
              ldt[i2++] = c;
          }
        }
        var lt = ldt.subarray(0, hLit), dt = ldt.subarray(hLit);
        lbt = max(lt);
        dbt = max(dt);
        lm = hMap(lt, lbt, 1);
        dm = hMap(dt, dbt, 1);
      } else
        err(1);
      if (pos > tbts) {
        if (noSt)
          err(0);
        break;
      }
    }
    if (resize)
      cbuf(bt + 131072);
    var lms = (1 << lbt) - 1, dms = (1 << dbt) - 1;
    var lpos = pos;
    for (; ; lpos = pos) {
      var c = lm[bits16(dat, pos) & lms], sym = c >> 4;
      pos += c & 15;
      if (pos > tbts) {
        if (noSt)
          err(0);
        break;
      }
      if (!c)
        err(2);
      if (sym < 256)
        buf[bt++] = sym;
      else if (sym == 256) {
        lpos = pos, lm = null;
        break;
      } else {
        var add = sym - 254;
        if (sym > 264) {
          var i2 = sym - 257, b = fleb[i2];
          add = bits(dat, pos, (1 << b) - 1) + fl[i2];
          pos += b;
        }
        var d = dm[bits16(dat, pos) & dms], dsym = d >> 4;
        if (!d)
          err(3);
        pos += d & 15;
        var dt = fd[dsym];
        if (dsym > 3) {
          var b = fdeb[dsym];
          dt += bits16(dat, pos) & (1 << b) - 1, pos += b;
        }
        if (pos > tbts) {
          if (noSt)
            err(0);
          break;
        }
        if (resize)
          cbuf(bt + 131072);
        var end = bt + add;
        if (bt < dt) {
          var shift = dl - dt, dend = Math.min(dt, end);
          if (shift + bt < 0)
            err(3);
          for (; bt < dend; ++bt)
            buf[bt] = dict[shift + bt];
        }
        for (; bt < end; ++bt)
          buf[bt] = buf[bt - dt];
      }
    }
    st.l = lm, st.p = lpos, st.b = bt, st.f = final;
    if (lm)
      final = 1, st.m = lbt, st.d = dm, st.n = dbt;
  } while (!final);
  return bt != buf.length && noBuf ? slc(buf, 0, bt) : buf.subarray(0, bt);
};
var wbits = function(d, p, v) {
  v <<= p & 7;
  var o = p / 8 | 0;
  d[o] |= v;
  d[o + 1] |= v >> 8;
};
var wbits16 = function(d, p, v) {
  v <<= p & 7;
  var o = p / 8 | 0;
  d[o] |= v;
  d[o + 1] |= v >> 8;
  d[o + 2] |= v >> 16;
};
var hTree = function(d, mb) {
  var t = [];
  for (var i2 = 0; i2 < d.length; ++i2) {
    if (d[i2])
      t.push({ s: i2, f: d[i2] });
  }
  var s = t.length;
  var t2 = t.slice();
  if (!s)
    return { t: et, l: 0 };
  if (s == 1) {
    var v = new u8(t[0].s + 1);
    v[t[0].s] = 1;
    return { t: v, l: 1 };
  }
  t.sort(function(a, b) {
    return a.f - b.f;
  });
  t.push({ s: -1, f: 25001 });
  var l = t[0], r = t[1], i0 = 0, i1 = 1, i22 = 2;
  t[0] = { s: -1, f: l.f + r.f, l, r };
  while (i1 != s - 1) {
    l = t[t[i0].f < t[i22].f ? i0++ : i22++];
    r = t[i0 != i1 && t[i0].f < t[i22].f ? i0++ : i22++];
    t[i1++] = { s: -1, f: l.f + r.f, l, r };
  }
  var maxSym = t2[0].s;
  for (var i2 = 1; i2 < s; ++i2) {
    if (t2[i2].s > maxSym)
      maxSym = t2[i2].s;
  }
  var tr = new u16(maxSym + 1);
  var mbt = ln(t[i1 - 1], tr, 0);
  if (mbt > mb) {
    var i2 = 0, dt = 0;
    var lft = mbt - mb, cst = 1 << lft;
    t2.sort(function(a, b) {
      return tr[b.s] - tr[a.s] || a.f - b.f;
    });
    for (; i2 < s; ++i2) {
      var i2_1 = t2[i2].s;
      if (tr[i2_1] > mb) {
        dt += cst - (1 << mbt - tr[i2_1]);
        tr[i2_1] = mb;
      } else
        break;
    }
    dt >>= lft;
    while (dt > 0) {
      var i2_2 = t2[i2].s;
      if (tr[i2_2] < mb)
        dt -= 1 << mb - tr[i2_2]++ - 1;
      else
        ++i2;
    }
    for (; i2 >= 0 && dt; --i2) {
      var i2_3 = t2[i2].s;
      if (tr[i2_3] == mb) {
        --tr[i2_3];
        ++dt;
      }
    }
    mbt = mb;
  }
  return { t: new u8(tr), l: mbt };
};
var ln = function(n, l, d) {
  return n.s == -1 ? Math.max(ln(n.l, l, d + 1), ln(n.r, l, d + 1)) : l[n.s] = d;
};
var lc = function(c) {
  var s = c.length;
  while (s && !c[--s])
    ;
  var cl = new u16(++s);
  var cli = 0, cln = c[0], cls = 1;
  var w = function(v) {
    cl[cli++] = v;
  };
  for (var i2 = 1; i2 <= s; ++i2) {
    if (c[i2] == cln && i2 != s)
      ++cls;
    else {
      if (!cln && cls > 2) {
        for (; cls > 138; cls -= 138)
          w(32754);
        if (cls > 2) {
          w(cls > 10 ? cls - 11 << 5 | 28690 : cls - 3 << 5 | 12305);
          cls = 0;
        }
      } else if (cls > 3) {
        w(cln), --cls;
        for (; cls > 6; cls -= 6)
          w(8304);
        if (cls > 2)
          w(cls - 3 << 5 | 8208), cls = 0;
      }
      while (cls--)
        w(cln);
      cls = 1;
      cln = c[i2];
    }
  }
  return { c: cl.subarray(0, cli), n: s };
};
var clen = function(cf, cl) {
  var l = 0;
  for (var i2 = 0; i2 < cl.length; ++i2)
    l += cf[i2] * cl[i2];
  return l;
};
var wfblk = function(out, pos, dat) {
  var s = dat.length;
  var o = shft(pos + 2);
  out[o] = s & 255;
  out[o + 1] = s >> 8;
  out[o + 2] = out[o] ^ 255;
  out[o + 3] = out[o + 1] ^ 255;
  for (var i2 = 0; i2 < s; ++i2)
    out[o + i2 + 4] = dat[i2];
  return (o + 4 + s) * 8;
};
var wblk = function(dat, out, final, syms, lf, df, eb, li, bs, bl, p) {
  wbits(out, p++, final);
  ++lf[256];
  var _a2 = hTree(lf, 15), dlt = _a2.t, mlb = _a2.l;
  var _b2 = hTree(df, 15), ddt = _b2.t, mdb = _b2.l;
  var _c = lc(dlt), lclt = _c.c, nlc = _c.n;
  var _d = lc(ddt), lcdt = _d.c, ndc = _d.n;
  var lcfreq = new u16(19);
  for (var i2 = 0; i2 < lclt.length; ++i2)
    ++lcfreq[lclt[i2] & 31];
  for (var i2 = 0; i2 < lcdt.length; ++i2)
    ++lcfreq[lcdt[i2] & 31];
  var _e = hTree(lcfreq, 7), lct = _e.t, mlcb = _e.l;
  var nlcc = 19;
  for (; nlcc > 4 && !lct[clim[nlcc - 1]]; --nlcc)
    ;
  var flen = bl + 5 << 3;
  var ftlen = clen(lf, flt) + clen(df, fdt) + eb;
  var dtlen = clen(lf, dlt) + clen(df, ddt) + eb + 14 + 3 * nlcc + clen(lcfreq, lct) + 2 * lcfreq[16] + 3 * lcfreq[17] + 7 * lcfreq[18];
  if (bs >= 0 && flen <= ftlen && flen <= dtlen)
    return wfblk(out, p, dat.subarray(bs, bs + bl));
  var lm, ll, dm, dl;
  wbits(out, p, 1 + (dtlen < ftlen)), p += 2;
  if (dtlen < ftlen) {
    lm = hMap(dlt, mlb, 0), ll = dlt, dm = hMap(ddt, mdb, 0), dl = ddt;
    var llm = hMap(lct, mlcb, 0);
    wbits(out, p, nlc - 257);
    wbits(out, p + 5, ndc - 1);
    wbits(out, p + 10, nlcc - 4);
    p += 14;
    for (var i2 = 0; i2 < nlcc; ++i2)
      wbits(out, p + 3 * i2, lct[clim[i2]]);
    p += 3 * nlcc;
    var lcts = [lclt, lcdt];
    for (var it = 0; it < 2; ++it) {
      var clct = lcts[it];
      for (var i2 = 0; i2 < clct.length; ++i2) {
        var len = clct[i2] & 31;
        wbits(out, p, llm[len]), p += lct[len];
        if (len > 15)
          wbits(out, p, clct[i2] >> 5 & 127), p += clct[i2] >> 12;
      }
    }
  } else {
    lm = flm, ll = flt, dm = fdm, dl = fdt;
  }
  for (var i2 = 0; i2 < li; ++i2) {
    var sym = syms[i2];
    if (sym > 255) {
      var len = sym >> 18 & 31;
      wbits16(out, p, lm[len + 257]), p += ll[len + 257];
      if (len > 7)
        wbits(out, p, sym >> 23 & 31), p += fleb[len];
      var dst = sym & 31;
      wbits16(out, p, dm[dst]), p += dl[dst];
      if (dst > 3)
        wbits16(out, p, sym >> 5 & 8191), p += fdeb[dst];
    } else {
      wbits16(out, p, lm[sym]), p += ll[sym];
    }
  }
  wbits16(out, p, lm[256]);
  return p + ll[256];
};
var deo = /* @__PURE__ */ new i32([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]);
var et = /* @__PURE__ */ new u8(0);
var dflt = function(dat, lvl, plvl, pre, post, st) {
  var s = st.z || dat.length;
  var o = new u8(pre + s + 5 * (1 + Math.ceil(s / 7e3)) + post);
  var w = o.subarray(pre, o.length - post);
  var lst = st.l;
  var pos = (st.r || 0) & 7;
  if (lvl) {
    if (pos)
      w[0] = st.r >> 3;
    var opt = deo[lvl - 1];
    var n = opt >> 13, c = opt & 8191;
    var msk_1 = (1 << plvl) - 1;
    var prev = st.p || new u16(32768), head = st.h || new u16(msk_1 + 1);
    var bs1_1 = Math.ceil(plvl / 3), bs2_1 = 2 * bs1_1;
    var hsh = function(i3) {
      return (dat[i3] ^ dat[i3 + 1] << bs1_1 ^ dat[i3 + 2] << bs2_1) & msk_1;
    };
    var syms = new i32(25e3);
    var lf = new u16(288), df = new u16(32);
    var lc_1 = 0, eb = 0, i2 = st.i || 0, li = 0, wi = st.w || 0, bs = 0;
    for (; i2 + 2 < s; ++i2) {
      var hv = hsh(i2);
      var imod = i2 & 32767, pimod = head[hv];
      prev[imod] = pimod;
      head[hv] = imod;
      if (wi <= i2) {
        var rem = s - i2;
        if ((lc_1 > 7e3 || li > 24576) && (rem > 423 || !lst)) {
          pos = wblk(dat, w, 0, syms, lf, df, eb, li, bs, i2 - bs, pos);
          li = lc_1 = eb = 0, bs = i2;
          for (var j = 0; j < 286; ++j)
            lf[j] = 0;
          for (var j = 0; j < 30; ++j)
            df[j] = 0;
        }
        var l = 2, d = 0, ch_1 = c, dif = imod - pimod & 32767;
        if (rem > 2 && hv == hsh(i2 - dif)) {
          var maxn = Math.min(n, rem) - 1;
          var maxd = Math.min(32767, i2);
          var ml = Math.min(258, rem);
          while (dif <= maxd && --ch_1 && imod != pimod) {
            if (dat[i2 + l] == dat[i2 + l - dif]) {
              var nl = 0;
              for (; nl < ml && dat[i2 + nl] == dat[i2 + nl - dif]; ++nl)
                ;
              if (nl > l) {
                l = nl, d = dif;
                if (nl > maxn)
                  break;
                var mmd = Math.min(dif, nl - 2);
                var md = 0;
                for (var j = 0; j < mmd; ++j) {
                  var ti = i2 - dif + j & 32767;
                  var pti = prev[ti];
                  var cd = ti - pti & 32767;
                  if (cd > md)
                    md = cd, pimod = ti;
                }
              }
            }
            imod = pimod, pimod = prev[imod];
            dif += imod - pimod & 32767;
          }
        }
        if (d) {
          syms[li++] = 268435456 | revfl[l] << 18 | revfd[d];
          var lin = revfl[l] & 31, din = revfd[d] & 31;
          eb += fleb[lin] + fdeb[din];
          ++lf[257 + lin];
          ++df[din];
          wi = i2 + l;
          ++lc_1;
        } else {
          syms[li++] = dat[i2];
          ++lf[dat[i2]];
        }
      }
    }
    for (i2 = Math.max(i2, wi); i2 < s; ++i2) {
      syms[li++] = dat[i2];
      ++lf[dat[i2]];
    }
    pos = wblk(dat, w, lst, syms, lf, df, eb, li, bs, i2 - bs, pos);
    if (!lst) {
      st.r = pos & 7 | w[pos / 8 | 0] << 3;
      pos -= 7;
      st.h = head, st.p = prev, st.i = i2, st.w = wi;
    }
  } else {
    for (var i2 = st.w || 0; i2 < s + lst; i2 += 65535) {
      var e = i2 + 65535;
      if (e >= s) {
        w[pos / 8 | 0] = lst;
        e = s;
      }
      pos = wfblk(w, pos + 1, dat.subarray(i2, e));
    }
    st.i = s;
  }
  return slc(o, 0, pre + shft(pos) + post);
};
var crct = /* @__PURE__ */ (function() {
  var t = new Int32Array(256);
  for (var i2 = 0; i2 < 256; ++i2) {
    var c = i2, k = 9;
    while (--k)
      c = (c & 1 && -306674912) ^ c >>> 1;
    t[i2] = c;
  }
  return t;
})();
var crc = function() {
  var c = -1;
  return {
    p: function(d) {
      var cr = c;
      for (var i2 = 0; i2 < d.length; ++i2)
        cr = crct[cr & 255 ^ d[i2]] ^ cr >>> 8;
      c = cr;
    },
    d: function() {
      return ~c;
    }
  };
};
var dopt = function(dat, opt, pre, post, st) {
  if (!st) {
    st = { l: 1 };
    if (opt.dictionary) {
      var dict = opt.dictionary.subarray(-32768);
      var newDat = new u8(dict.length + dat.length);
      newDat.set(dict);
      newDat.set(dat, dict.length);
      dat = newDat;
      st.w = dict.length;
    }
  }
  return dflt(dat, opt.level == null ? 6 : opt.level, opt.mem == null ? st.l ? Math.ceil(Math.max(8, Math.min(13, Math.log(dat.length))) * 1.5) : 20 : 12 + opt.mem, pre, post, st);
};
var mrg = function(a, b) {
  var o = {};
  for (var k in a)
    o[k] = a[k];
  for (var k in b)
    o[k] = b[k];
  return o;
};
var b2 = function(d, b) {
  return d[b] | d[b + 1] << 8;
};
var b4 = function(d, b) {
  return (d[b] | d[b + 1] << 8 | d[b + 2] << 16 | d[b + 3] << 24) >>> 0;
};
var b8 = function(d, b) {
  return b4(d, b) + b4(d, b + 4) * 4294967296;
};
var wbytes = function(d, b, v) {
  for (; v; ++b)
    d[b] = v, v >>>= 8;
};
function deflateSync(data, opts) {
  return dopt(data, opts || {}, 0, 0);
}
var Inflate = /* @__PURE__ */ (function() {
  function Inflate2(opts, cb) {
    if (typeof opts == "function")
      cb = opts, opts = {};
    this.ondata = cb;
    var dict = opts && opts.dictionary && opts.dictionary.subarray(-32768);
    this.s = { i: 0, b: dict ? dict.length : 0 };
    this.o = new u8(32768);
    this.p = new u8(0);
    if (dict)
      this.o.set(dict);
  }
  Inflate2.prototype.e = function(c) {
    if (!this.ondata)
      err(5);
    if (this.d)
      err(4);
    if (!this.p.length)
      this.p = c;
    else if (c.length) {
      var n = new u8(this.p.length + c.length);
      n.set(this.p), n.set(c, this.p.length), this.p = n;
    }
  };
  Inflate2.prototype.c = function(final) {
    this.s.i = +(this.d = final || false);
    var bts = this.s.b;
    var dt = inflt(this.p, this.s, this.o);
    this.ondata(slc(dt, bts, this.s.b), this.d);
    this.o = slc(dt, this.s.b - 32768), this.s.b = this.o.length;
    this.p = slc(this.p, this.s.p / 8 | 0), this.s.p &= 7;
  };
  Inflate2.prototype.push = function(chunk, final) {
    this.e(chunk), this.c(final);
  };
  return Inflate2;
})();
var fltn = function(d, p, t, o) {
  for (var k in d) {
    var val = d[k], n = p + k, op = o;
    if (Array.isArray(val))
      op = mrg(o, val[1]), val = val[0];
    if (ArrayBuffer.isView(val))
      t[n] = [val, op];
    else {
      t[n += "/"] = [new u8(0), op];
      fltn(val, n, t, o);
    }
  }
};
var te = typeof TextEncoder != "undefined" && /* @__PURE__ */ new TextEncoder();
var td = typeof TextDecoder != "undefined" && /* @__PURE__ */ new TextDecoder();
var tds = 0;
try {
  td.decode(et, { stream: true });
  tds = 1;
} catch (e) {
}
var dutf8 = function(d) {
  for (var r = "", i2 = 0; ; ) {
    var c = d[i2++];
    var eb = (c > 127) + (c > 223) + (c > 239);
    if (i2 + eb > d.length)
      return { s: r, r: slc(d, i2 - 1) };
    if (!eb)
      r += String.fromCharCode(c);
    else if (eb == 3) {
      c = ((c & 15) << 18 | (d[i2++] & 63) << 12 | (d[i2++] & 63) << 6 | d[i2++] & 63) - 65536, r += String.fromCharCode(55296 | c >> 10, 56320 | c & 1023);
    } else if (eb & 1)
      r += String.fromCharCode((c & 31) << 6 | d[i2++] & 63);
    else
      r += String.fromCharCode((c & 15) << 12 | (d[i2++] & 63) << 6 | d[i2++] & 63);
  }
};
function strToU8(str, latin1) {
  if (latin1) {
    var ar_1 = new u8(str.length);
    for (var i2 = 0; i2 < str.length; ++i2)
      ar_1[i2] = str.charCodeAt(i2);
    return ar_1;
  }
  if (te)
    return te.encode(str);
  var l = str.length;
  var ar = new u8(str.length + (str.length >> 1));
  var ai = 0;
  var w = function(v) {
    ar[ai++] = v;
  };
  for (var i2 = 0; i2 < l; ++i2) {
    if (ai + 5 > ar.length) {
      var n = new u8(ai + 8 + (l - i2 << 1));
      n.set(ar);
      ar = n;
    }
    var c = str.charCodeAt(i2);
    if (c < 128 || latin1)
      w(c);
    else if (c < 2048)
      w(192 | c >> 6), w(128 | c & 63);
    else if (c > 55295 && c < 57344)
      c = 65536 + (c & 1023 << 10) | str.charCodeAt(++i2) & 1023, w(240 | c >> 18), w(128 | c >> 12 & 63), w(128 | c >> 6 & 63), w(128 | c & 63);
    else
      w(224 | c >> 12), w(128 | c >> 6 & 63), w(128 | c & 63);
  }
  return slc(ar, 0, ai);
}
function strFromU8(dat, latin1) {
  if (latin1) {
    var r = "";
    for (var i2 = 0; i2 < dat.length; i2 += 16384)
      r += String.fromCharCode.apply(null, dat.subarray(i2, i2 + 16384));
    return r;
  } else if (td) {
    return td.decode(dat);
  } else {
    var _a2 = dutf8(dat), s = _a2.s, r = _a2.r;
    if (r.length)
      err(8);
    return s;
  }
}
var z64hs = function(d, b, l, z2, sc, su, off) {
  var nsc = sc == 4294967295, nsu = su == 4294967295, noff = off == 4294967295, e = b + l;
  var nf = nsc + nsu + noff;
  if (z2 && nf) {
    for (; b + 4 < e; b += 4 + b2(d, b + 2)) {
      if (b2(d, b) == 1) {
        return [
          nsc ? b8(d, b + 4 + 8 * nsu) : sc,
          nsu ? b8(d, b + 4) : su,
          noff ? b8(d, b + 4 + 8 * (nsu + nsc)) : off,
          1
        ];
      }
    }
    if (z2 < 2)
      err(13);
  }
  return [sc, su, off, 0];
};
var exfl = function(ex) {
  var le = 0;
  if (ex) {
    for (var k in ex) {
      var l = ex[k].length;
      if (l > 65535)
        err(9);
      le += l + 4;
    }
  }
  return le;
};
var wzh = function(d, b, f, fn, u, c, ce, co) {
  var fl2 = fn.length, ex = f.extra, col = co && co.length;
  var exl = exfl(ex);
  wbytes(d, b, ce != null ? 33639248 : 67324752), b += 4;
  if (ce != null)
    d[b++] = 20, d[b++] = f.os;
  d[b] = 20, b += 2;
  d[b++] = f.flag << 1 | (c < 0 && 8), d[b++] = u && 8;
  d[b++] = f.compression & 255, d[b++] = f.compression >> 8;
  var dt = new Date(f.mtime == null ? Date.now() : f.mtime), y = dt.getFullYear() - 1980;
  if (y < 0 || y > 119)
    err(10);
  wbytes(d, b, y << 25 | dt.getMonth() + 1 << 21 | dt.getDate() << 16 | dt.getHours() << 11 | dt.getMinutes() << 5 | dt.getSeconds() >> 1), b += 4;
  if (c != -1) {
    wbytes(d, b, f.crc);
    wbytes(d, b + 4, c < 0 ? -c - 2 : c);
    wbytes(d, b + 8, f.size);
  }
  wbytes(d, b + 12, fl2);
  wbytes(d, b + 14, exl), b += 16;
  if (ce != null) {
    wbytes(d, b, col);
    wbytes(d, b + 6, f.attrs);
    wbytes(d, b + 10, ce), b += 14;
  }
  d.set(fn, b);
  b += fl2;
  if (exl) {
    for (var k in ex) {
      var exf = ex[k], l = exf.length;
      wbytes(d, b, +k);
      wbytes(d, b + 2, l);
      d.set(exf, b + 4), b += 4 + l;
    }
  }
  if (col)
    d.set(co, b), b += col;
  return b;
};
var wzf = function(o, b, c, d, e) {
  wbytes(o, b, 101010256);
  wbytes(o, b + 8, c);
  wbytes(o, b + 10, c);
  wbytes(o, b + 12, d);
  wbytes(o, b + 16, e);
};
function zipSync(data, opts) {
  if (!opts)
    opts = {};
  var r = {};
  var files = [];
  fltn(data, "", r, opts);
  var o = 0;
  var tot = 0;
  for (var fn in r) {
    var _a2 = r[fn], file = _a2[0], p = _a2[1];
    var compression = p.level == 0 ? 0 : 8;
    var f = strToU8(fn), s = f.length;
    var com = p.comment, m = com && strToU8(com), ms = m && m.length;
    var exl = exfl(p.extra);
    if (s > 65535)
      err(11);
    var d = compression ? deflateSync(file, p) : file, l = d.length;
    var c = crc();
    c.p(file);
    files.push(mrg(p, {
      size: file.length,
      crc: c.d(),
      c: d,
      f,
      m,
      u: s != fn.length || m && com.length != ms,
      o,
      compression
    }));
    o += 30 + s + exl + l;
    tot += 76 + 2 * (s + exl) + (ms || 0) + l;
  }
  var out = new u8(tot + 22), oe = o, cdl = tot - o;
  for (var i2 = 0; i2 < files.length; ++i2) {
    var f = files[i2];
    wzh(out, f.o, f, f.f, f.u, f.c.length);
    var badd = 30 + f.f.length + exfl(f.extra);
    out.set(f.c, f.o + badd);
    wzh(out, o, f, f.f, f.u, f.c.length, f.o, f.m), o += 16 + badd + (f.m ? f.m.length : 0);
  }
  wzf(out, o, files.length, cdl, oe);
  return out;
}
var UnzipPassThrough = /* @__PURE__ */ (function() {
  function UnzipPassThrough2() {
  }
  UnzipPassThrough2.prototype.push = function(chunk, final) {
    this.ondata(null, chunk, final);
  };
  UnzipPassThrough2.compression = 0;
  return UnzipPassThrough2;
})();
var UnzipInflate = /* @__PURE__ */ (function() {
  function UnzipInflate2() {
    var _this = this;
    this.i = new Inflate(function(dat, final) {
      _this.ondata(null, dat, final);
    });
  }
  UnzipInflate2.prototype.push = function(chunk, final) {
    try {
      this.i.push(chunk, final);
    } catch (e) {
      this.ondata(e, null, final);
    }
  };
  UnzipInflate2.compression = 8;
  return UnzipInflate2;
})();
var Unzip = /* @__PURE__ */ (function() {
  function Unzip2(cb) {
    this.onfile = cb;
    this.k = [];
    this.o = {
      0: UnzipPassThrough
    };
    this.p = et;
  }
  Unzip2.prototype.push = function(chunk, final) {
    var _this = this;
    if (!this.onfile)
      err(5);
    if (!this.p)
      err(4);
    if (this.c > 0) {
      var len = Math.min(this.c, chunk.length);
      var toAdd = chunk.subarray(0, len);
      this.c -= len;
      if (this.d)
        this.d.push(toAdd, !this.c);
      else
        this.k[0].push(toAdd);
      chunk = chunk.subarray(len);
      if (chunk.length)
        return this.push(chunk, final);
    } else {
      var f = 0, i2 = 0, is = void 0, buf = void 0;
      if (!this.p.length)
        buf = chunk;
      else if (!chunk.length)
        buf = this.p;
      else {
        buf = new u8(this.p.length + chunk.length);
        buf.set(this.p), buf.set(chunk, this.p.length);
      }
      var l = buf.length, oc = this.c, add = oc && this.d;
      var _loop_2 = function() {
        var sig = b4(buf, i2);
        if (sig == 67324752) {
          f = 1, is = i2;
          this_1.d = null;
          this_1.c = 0;
          var bf = b2(buf, i2 + 6), cmp_1 = b2(buf, i2 + 8), u = bf & 2048, dd = bf & 8, fnl = b2(buf, i2 + 26), es = b2(buf, i2 + 28);
          if (l > i2 + 30 + fnl + es) {
            var chks_3 = [];
            this_1.k.unshift(chks_3);
            f = 2;
            var lsc = b4(buf, i2 + 18), lsu = b4(buf, i2 + 22);
            var fn_1 = strFromU8(buf.subarray(i2 + 30, i2 += 30 + fnl), !u);
            var _a2 = z64hs(buf, i2, es, 2, lsc, lsu, 0), sc_1 = _a2[0], su_1 = _a2[1], z64 = _a2[3];
            if (dd)
              sc_1 = -1 - z64;
            i2 += es;
            this_1.c = sc_1;
            var d_1;
            var file_1 = {
              name: fn_1,
              compression: cmp_1,
              start: function() {
                if (!file_1.ondata)
                  err(5);
                if (!sc_1)
                  file_1.ondata(null, et, true);
                else {
                  var ctr = _this.o[cmp_1];
                  if (!ctr)
                    file_1.ondata(err(14, "unknown compression type " + cmp_1, 1), null, false);
                  d_1 = sc_1 < 0 ? new ctr(fn_1) : new ctr(fn_1, sc_1, su_1);
                  d_1.ondata = function(err2, dat3, final2) {
                    file_1.ondata(err2, dat3, final2);
                  };
                  for (var _i = 0, chks_4 = chks_3; _i < chks_4.length; _i++) {
                    var dat2 = chks_4[_i];
                    d_1.push(dat2, false);
                  }
                  if (_this.k[0] == chks_3 && _this.c)
                    _this.d = d_1;
                  else
                    d_1.push(et, true);
                }
              },
              terminate: function() {
                if (d_1 && d_1.terminate)
                  d_1.terminate();
              }
            };
            if (sc_1 >= 0)
              file_1.size = sc_1, file_1.originalSize = su_1;
            this_1.onfile(file_1);
          }
          return "break";
        } else if (oc) {
          if (sig == 134695760) {
            is = i2 += 12 + (oc == -2 && 8), f = 3, this_1.c = 0;
            return "break";
          } else if (sig == 33639248) {
            is = i2 -= 4, f = 3, this_1.c = 0;
            return "break";
          }
        }
      };
      var this_1 = this;
      for (; i2 < l - 4; ++i2) {
        var state_1 = _loop_2();
        if (state_1 === "break")
          break;
      }
      this.p = et;
      if (oc < 0) {
        var dat = f ? buf.subarray(0, is - 12 - (oc == -2 && 8) - (b4(buf, is - 16) == 134695760 && 4)) : buf.subarray(0, i2);
        if (add)
          add.push(dat, !!f);
        else
          this.k[+(f == 2)].push(dat);
      }
      if (f & 2)
        return this.push(buf.subarray(i2), final);
      this.p = buf.subarray(i2);
    }
    if (final) {
      if (this.c)
        err(13);
      this.p = null;
    }
  };
  Unzip2.prototype.register = function(decoder) {
    this.o[decoder.compression] = decoder;
  };
  return Unzip2;
})();

// packages/core/src/report.ts
import { createHash as createHash3, randomUUID } from "node:crypto";
import { lstat as lstat2, open as open2, rename, rm, stat as stat2, writeFile } from "node:fs/promises";
import { join as join2 } from "node:path";

// packages/core/src/files.ts
import { lstat, mkdir, open, realpath as realpath2 } from "node:fs/promises";
import { basename, dirname, isAbsolute as isAbsolute2, join, relative as relative2, resolve as resolve2, sep as sep2 } from "node:path";
var FileSizeLimitError = class extends Error {
  constructor(maxBytes) {
    super(`file exceeds ${maxBytes} byte limit`);
    this.maxBytes = maxBytes;
    this.name = "FileSizeLimitError";
  }
  maxBytes;
};
function contains(root, path) {
  const suffix = relative2(root, path);
  return suffix === "" || !isAbsolute2(suffix) && suffix !== ".." && !suffix.startsWith(`..${sep2}`);
}
async function resolveContainedPath(root, path) {
  const normalized = path.replace(/\\/g, "/");
  if (isAbsolute2(path) || normalized.split("/").includes("..")) throw new Error("file path escapes its authorized directory");
  const original = resolve2(root, normalized);
  if (!contains(resolve2(root), original)) throw new Error("file path escapes its authorized directory");
  const [canonicalRoot, canonical] = await Promise.all([realpath2(root), realpath2(original)]);
  if (!contains(canonicalRoot, canonical)) throw new Error("file path escapes its authorized directory");
  return canonical;
}
async function resolveWritablePath(root, path) {
  const normalized = path.replace(/\\/g, "/");
  const absoluteRoot = resolve2(root);
  const original = resolve2(root, normalized);
  if (isAbsolute2(path) || normalized.split("/").includes("..") || original === absoluteRoot || !contains(absoluteRoot, original)) {
    throw new Error("file path escapes its writable directory");
  }
  await mkdir(absoluteRoot, { recursive: true });
  const canonicalRoot = await realpath2(absoluteRoot);
  let parent = canonicalRoot;
  const parents = relative2(absoluteRoot, dirname(original)).split(sep2).filter(Boolean);
  for (const part of parents) {
    const next = join(parent, part);
    try {
      await mkdir(next);
    } catch (error) {
      if (error.code !== "EEXIST") throw error;
    }
    parent = await realpath2(next);
    if (!contains(canonicalRoot, parent)) throw new Error("file path escapes its writable directory");
    if (!(await lstat(parent)).isDirectory()) throw new Error("file parent must be a directory");
  }
  const target = join(parent, basename(original));
  try {
    const info = await lstat(target);
    if (info.isSymbolicLink() || info.nlink > 1) throw new Error("file link escapes its writable directory");
    if (!info.isFile()) throw new Error("file must be a regular file");
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  return target;
}
async function readBounded(root, path, maxBytes, prefix) {
  if (!Number.isSafeInteger(maxBytes) || maxBytes < 0) throw new Error("invalid file byte limit");
  const canonical = await resolveContainedPath(root, path);
  const file = await open(canonical, "r");
  try {
    const info = await file.stat();
    if (!info.isFile()) throw new Error("file must be a regular file");
    if (!prefix && info.size > maxBytes) throw new FileSizeLimitError(maxBytes);
    const chunks = [];
    let total = 0;
    const capacity = prefix ? maxBytes : maxBytes + 1;
    while (total < capacity) {
      const chunk = Buffer.allocUnsafe(Math.min(64 * 1024, capacity - total));
      const { bytesRead } = await file.read(chunk, 0, chunk.length, null);
      if (bytesRead === 0) break;
      total += bytesRead;
      if (!prefix && total > maxBytes) throw new FileSizeLimitError(maxBytes);
      chunks.push(chunk.subarray(0, bytesRead));
    }
    return Buffer.concat(chunks, total);
  } finally {
    await file.close();
  }
}
function readContainedFile(root, path, maxBytes) {
  return readBounded(root, path, maxBytes, false);
}
function readContainedPrefix(root, path, maxBytes) {
  return readBounded(root, path, maxBytes, true);
}

// packages/core/src/report.ts
async function assertReportFiles(dir) {
  for (const name2 of ["report.md", "design.md"]) {
    const file = await lstat2(join2(dir, name2)).catch((error) => {
      if (error.code === "ENOENT") return void 0;
      throw error;
    });
    if (file !== void 0 && (!file.isFile() || file.isSymbolicLink())) throw new Error("report must be a regular file, not a link");
  }
}
async function writeReport(dir, loadTopic, draft) {
  if (typeof draft.markdown !== "string" || draft.markdown.trim() === "" || Buffer.byteLength(draft.markdown) > 256 * 1024) {
    throw new Error("report markdown must contain 1\u2013262144 UTF-8 bytes");
  }
  if (draft.markdown.includes("dsh-pro-report:")) throw new Error("report coverage is generated by the plugin; omit the provenance header");
  if (typeof draft.expectedRevision !== "string" || !/^(?:[a-f0-9]{64})?$/.test(draft.expectedRevision)) throw new Error("expected_revision must be the current report revision or an empty string");
  const lockPath = join2(dir, ".report.lock");
  const lock = await open2(lockPath, "wx").catch((error) => {
    if (error.code === "EEXIST") throw new Error("report is being written; retry after the current writer finishes");
    throw error;
  });
  const temp = join2(dir, `.report-${randomUUID()}.tmp`);
  try {
    await assertReportFiles(dir);
    const topic = await loadTopic();
    const last = topic.rounds.at(-1);
    if (!Number.isInteger(draft.generation) || !Number.isInteger(draft.throughRound) || draft.generation !== (topic.generations?.at(-1)?.n ?? 1) || last?.n !== draft.throughRound || last.answeredAt === void 0 || (last.generation ?? 1) !== draft.generation || (topic.runThrough ?? last.n) > last.n || ["queued", "uploading", "submitted", "waiting", "answered", "adjudicating"].includes(topic.status)) {
      throw new Error("report coverage must match the latest answered round of a stopped topic; read status and evidence again");
    }
    const before = await readReportInfo(dir, topic);
    if ((before?.revision ?? "") !== draft.expectedRevision) throw new Error("report revision changed; read_report before updating");
    const path = topic.type === "design" ? "design.md" : "report.md";
    const header = `<!-- dsh-pro-report: ${JSON.stringify({ generation: draft.generation, throughRound: draft.throughRound })} -->`;
    await writeFile(temp, `${header}
${draft.markdown.trim()}
`, { encoding: "utf8", flag: "wx" });
    const latest = await loadTopic();
    if (JSON.stringify(latest) !== JSON.stringify(topic)) throw new Error("topic changed; read status and evidence again");
    await assertReportFiles(dir);
    if (((await readReportInfo(dir, latest))?.revision ?? "") !== draft.expectedRevision) throw new Error("report revision changed; read_report before updating");
    await rename(temp, join2(dir, path));
    return await readReportInfo(dir, latest);
  } finally {
    await rm(temp, { force: true });
    await lock.close();
    await rm(lockPath, { force: true });
  }
}
async function readReportInfo(dir, topic) {
  let path = topic.type === "design" ? "design.md" : "report.md";
  let text;
  let updated;
  try {
    try {
      text = (await readContainedFile(dir, path, 1024 * 1024)).toString("utf8");
    } catch (error) {
      if (path !== "design.md" || error.code !== "ENOENT") throw error;
      path = "report.md";
      text = (await readContainedFile(dir, path, 1024 * 1024)).toString("utf8");
    }
    updated = (await stat2(join2(dir, path))).mtime.toISOString();
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
  const info = {
    path,
    revision: createHash3("sha256").update(text).digest("hex"),
    updated,
    status: "unknown"
  };
  const header = /^\s*<!--\s*dsh-pro-report:\s*(\{[^\r\n]*\})\s*-->/.exec(text);
  if (header === null) return info;
  try {
    const meta = JSON.parse(header[1]);
    const round = topic.rounds.find((item) => item.n === meta.throughRound);
    if (!Number.isInteger(meta.generation) || !Number.isInteger(meta.throughRound) || round?.answeredAt === void 0 || (round.generation ?? 1) !== meta.generation) return info;
    info.generation = meta.generation;
    info.throughRound = meta.throughRound;
    const last = topic.rounds.at(-1);
    info.status = meta.generation === (topic.generations?.at(-1)?.n ?? 1) && last?.n === meta.throughRound && (topic.runThrough ?? last.n) <= last.n && !["queued", "uploading", "submitted", "waiting", "answered", "adjudicating"].includes(topic.status) && updated >= round.answeredAt ? "current" : "stale";
  } catch {
  }
  return info;
}

// packages/core/src/store.ts
function pad(n) {
  return String(n).padStart(2, "0");
}
function artifactFileName(value) {
  const base = value.split(/[\\/]/).pop() ?? "artifact";
  return base.replace(/[^\w.-]/g, "_").slice(0, 100) || "artifact";
}
function artifactRelativePath(value) {
  const parts = value.replace(/\\/g, "/").split("/").filter((part) => part !== "" && part !== "." && part !== "..").map((part) => part.replace(/[^\w.-]/g, "_").slice(0, 60)).filter((part) => part !== "").slice(-4);
  return parts.length > 0 ? parts.join("/") : "artifact";
}
function isHtmlSource(text) {
  return /^\s*(?:<!doctype\s+html|<html[\s>])/i.test(text.slice(0, 512));
}
function assertTopicShape(value, id) {
  const topic = value;
  const fail = (field) => {
    throw new Error(`corrupt topic ${id}: invalid ${field}`);
  };
  if (topic === null || typeof topic !== "object") fail("topic");
  if (topic.schema !== 1) fail("schema");
  if (typeof topic.id !== "string" || !/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,127}$/.test(topic.id)) fail("id");
  if (typeof topic.title !== "string") fail("title");
  if (topic.type !== "research" && topic.type !== "design") fail("type");
  if (!STATUSES.includes(topic.status)) fail("status");
  if (typeof topic.updated !== "string" || topic.updated === "") {
    const created = topic.created;
    if (typeof created === "string" && created !== "") topic.updated = created;
    else fail("updated");
  }
  if (!Number.isInteger(topic.roundsCap) || topic.roundsCap < 1) fail("roundsCap");
  if (!Array.isArray(topic.rounds)) fail("rounds");
  if (typeof topic.channel !== "string") fail("channel");
  if (!Array.isArray(topic.successCriteria)) fail("successCriteria");
  if (!Array.isArray(topic.artifacts)) fail("artifacts");
}
function extensionForLanguage(language) {
  switch (language.toLowerCase()) {
    case "html":
    case "htm":
      return "html";
    case "tsx":
    case "typescriptreact":
      return "tsx";
    case "jsx":
      return "jsx";
    case "css":
      return "css";
    case "js":
    case "javascript":
      return "js";
    case "json":
      return "json";
    case "md":
    case "markdown":
      return "md";
    default:
      return "txt";
  }
}
function sanitizeSegment(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "project";
}
async function replaceFile(temp, target) {
  for (let attempt = 1; ; attempt += 1) {
    try {
      await rename2(temp, target);
      return;
    } catch (error) {
      const code = error.code;
      const retriable = code === "EPERM" || code === "EACCES" || code === "EBUSY";
      if (!retriable || attempt >= 8) throw error;
      await new Promise((resolve7) => setTimeout(resolve7, 10 * attempt));
    }
  }
}
function isMissing(error) {
  return error.code === "ENOENT";
}
var ZIP_MAX_FILES = 100;
var ZIP_MAX_BYTES = 50 * 1024 * 1024;
function concatBytes(chunks) {
  const out = new Uint8Array(chunks.reduce((sum, chunk) => sum + chunk.length, 0));
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.length;
  }
  return out;
}
function inflateArchive(bytes) {
  const files = [];
  let total = 0;
  let capped = false;
  try {
    const unzip = new Unzip();
    unzip.register(UnzipInflate);
    unzip.register(UnzipPassThrough);
    unzip.onfile = (file) => {
      if (capped) return;
      if (files.length >= ZIP_MAX_FILES) {
        capped = true;
        return;
      }
      if ((file.originalSize ?? 0) > ZIP_MAX_BYTES - total) {
        capped = true;
        return;
      }
      const chunks = [];
      let size = 0;
      let drop = false;
      file.ondata = (error, chunk, final) => {
        if (error !== null || drop) {
          drop = true;
          chunks.length = 0;
          return;
        }
        if (chunk !== null && chunk.length > 0) {
          size += chunk.length;
          if (size > ZIP_MAX_BYTES || total + size > ZIP_MAX_BYTES) {
            drop = true;
            capped = true;
            chunks.length = 0;
            return;
          }
          chunks.push(chunk.slice());
        }
        if (final) {
          files.push([file.name, concatBytes(chunks)]);
          total += size;
        }
      };
      file.start();
    };
    unzip.push(bytes, true);
  } catch {
    return void 0;
  }
  return files;
}
var ResearchStore = class {
  dirs = /* @__PURE__ */ new Map();
  options;
  constructor(options) {
    this.options = options;
  }
  rootDir() {
    if (this.options.mode === "local") {
      const projectRoot = this.options.projectRoot !== void 0 && this.options.projectRoot !== "" ? resolve3(this.options.projectRoot) : process.cwd();
      return join3(this.options.localRoot, "projects", this.projectSlug(projectRoot));
    }
    if (this.options.projectRoot === void 0 || this.options.projectRoot === "") {
      throw new Error("project store requires a project root");
    }
    return join3(this.options.projectRoot, "docs", this.options.docsSubdir ?? "research");
  }
  rawTopicDir(topicId) {
    if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,127}$/.test(topicId)) throw new Error("invalid topic id");
    return join3(this.options.rawDir, topicId);
  }
  projectSlug(projectRoot) {
    const base = sanitizeSegment(projectRoot.split(/[\\/]/).filter(Boolean).pop() ?? "project");
    return `${base}-${shortHash(projectRoot)}`;
  }
  async writablePath(path) {
    const absolute = resolve3(path);
    const inside = (root) => {
      const rel = relative3(resolve3(root), absolute);
      return rel !== "" && !isAbsolute3(rel) && rel !== ".." && !rel.startsWith(`..${sep3}`);
    };
    for (const [id, dir] of this.dirs) {
      if (inside(dir)) return await resolveWritablePath(await this.dirOf(id), relative3(dir, absolute));
    }
    for (const root of [this.options.rawDir, join3(this.options.localRoot, "sessions"), this.rootDir()]) {
      if (inside(root)) return await resolveWritablePath(root, relative3(resolve3(root), absolute));
    }
    throw new Error("file path escapes its writable store");
  }
  async atomic(path, content) {
    const target = await this.writablePath(path);
    const temp = `${target}.tmp-${randomUUID2()}`;
    let created = false;
    try {
      await writeFile2(temp, content, { flag: "wx" });
      created = true;
      await replaceFile(temp, target);
    } finally {
      if (created) await rm2(temp, { force: true }).catch(() => void 0);
    }
  }
  async appendJsonLine(path, value) {
    await appendFile(await this.writablePath(path), `${JSON.stringify(value)}
`, "utf8");
  }
  /** Append one auditable event; callers may treat this as best-effort. */
  async appendEvent(topic, event) {
    const dir = await this.dirOf(topic.id);
    await this.appendJsonLine(join3(dir, "events.ndjson"), { at: (/* @__PURE__ */ new Date()).toISOString(), ...event });
  }
  /**
   * The id is written into topic.json, the registry, raw-answer paths and
   * session locators; a duplicate silently merges two topics. Ten hex chars
   * make this rare, and the scan keeps it correct even if two creates race or
   * an old record already occupies the value.
   */
  async uniqueTopicId(title) {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const id = newTopicId(title);
      if (!await this.topicIdExists(id)) return id;
    }
    return `topic-${randomUUID2().replace(/-/g, "").slice(0, 12)}`;
  }
  async topicIdExists(id) {
    if (this.dirs.has(id)) return true;
    await this.list().catch(() => []);
    return this.dirs.has(id);
  }
  async uniqueDir(slug, id) {
    const root = this.rootDir();
    await mkdir2(root, { recursive: true });
    for (let attempt = 0; ; attempt += 1) {
      const candidate = attempt === 0 ? slug : `${slug}-${shortHash(`${id}:${attempt}`)}`;
      const dir = join3(root, candidate);
      try {
        await mkdir2(dir);
        return dir;
      } catch (error) {
        if (error.code !== "EEXIST") throw error;
      }
    }
  }
  async create(card, roundsCap, model, channel) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const id = await this.uniqueTopicId(card.title);
    const topic = {
      schema: 1,
      id,
      title: card.title,
      type: card.type,
      parent: card.parent ?? null,
      created: now,
      updated: now,
      status: "draft",
      roundsCap,
      ...card.designs !== void 0 ? { designs: card.designs } : {},
      generations: [{ n: 1, createdAt: now, rounds: roundsCap, reason: "\u521D\u59CB\u4EFB\u52A1" }],
      rounds: [],
      channel,
      model,
      successCriteria: [...card.successCriteria],
      artifacts: []
    };
    const dir = await this.uniqueDir(slugifyTitle(card.title), id);
    this.dirs.set(id, dir);
    const materials = await this.stageMaterials(dir, card.materials);
    await this.atomic(join3(dir, "topic.json"), `${JSON.stringify(topic, null, 2)}
`);
    await this.atomic(join3(dir, "rounds", "00-question.md"), `# ${card.title}

## \u7814\u7A76\u95EE\u9898

${card.question}

## \u6210\u529F\u5224\u636E

${card.successCriteria.map((item) => `- ${item}`).join("\n")}

## \u4EFB\u52A1

${card.brief}
`);
    await this.atomic(join3(dir, "materials", "manifest.json"), `${JSON.stringify({ materials }, null, 2)}
`);
    return { topic, dir };
  }
  /**
   * Copy source files into `<topic>/materials/` and verify the copied bytes
   * against the manifest digest. The manifest stores relative paths only.
   */
  async stageMaterials(dir, refs) {
    const staged = [];
    const topicRoot = await realpath3(dir);
    const materialsDir = join3(dir, "materials");
    await mkdir2(materialsDir, { recursive: true });
    const root = await realpath3(materialsDir);
    if (!root.startsWith(`${topicRoot}${sep3}`)) throw new Error("material directory escapes the topic");
    for (const ref of refs) {
      if (ref.source === void 0 || ref.source === "") {
        staged.push(ref);
        continue;
      }
      const safePath = ref.path.replace(/\\/g, "/");
      if (isAbsolute3(safePath) || safePath.split("/").includes("..")) {
        throw new Error(`material path escapes the topic: ${ref.path}`);
      }
      await resolveWritablePath(materialsDir, safePath);
      const copied = await readContainedFile(dirname2(ref.source), basename2(ref.source), ref.bytes).catch((error) => {
        if (error instanceof FileSizeLimitError) throw new Error(`material changed while staging: ${ref.path}`);
        throw error;
      });
      const digest = createHash4("sha256").update(copied).digest("hex");
      if (copied.byteLength !== ref.bytes || digest !== ref.sha256) throw new Error(`material changed while staging: ${ref.path}`);
      await this.atomic(join3(materialsDir, safePath), copied);
      staged.push({ ...ref, path: safePath, source: ref.path });
    }
    return staged;
  }
  async save(topic) {
    const dir = await this.dirOf(topic.id);
    topic.updated = (/* @__PURE__ */ new Date()).toISOString();
    await this.atomic(join3(dir, "topic.json"), `${JSON.stringify(topic, null, 2)}
`);
  }
  async list() {
    const root = this.rootDir();
    let entries;
    try {
      entries = await readdir(root, { withFileTypes: true });
    } catch {
      return [];
    }
    const topics = [];
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const dir = join3(root, entry.name);
      try {
        const parsed = JSON.parse((await readContainedFile(dir, "topic.json", 1024 * 1024)).toString("utf8"));
        assertTopicShape(parsed, entry.name);
        this.dirs.set(parsed.id, dir);
        topics.push(parsed);
      } catch {
      }
    }
    return topics.sort((a, b) => b.updated.localeCompare(a.updated));
  }
  async load(id) {
    const dir = await this.dirOf(id);
    const parsed = JSON.parse((await readContainedFile(dir, "topic.json", 1024 * 1024)).toString("utf8"));
    assertTopicShape(parsed, id);
    return parsed;
  }
  async dirOf(id) {
    let dir = this.dirs.get(id);
    if (dir === void 0) {
      const found = (await this.list()).find((topic) => topic.id === id);
      if (found === void 0) throw new Error(`unknown topic: ${id}`);
      dir = this.dirs.get(id);
    }
    if (dir === void 0) throw new Error(`topic directory missing: ${id}`);
    const [root, canonical] = await Promise.all([realpath3(this.rootDir()), realpath3(dir)]);
    if (dirname2(canonical) !== root || relative3(this.rootDir(), dir) !== relative3(root, canonical)) {
      throw new Error("topic directory escapes its store");
    }
    return dir;
  }
  /** A delivery action is scoped to the caller's project and this known topic. */
  async reportDir(id, cwd) {
    if (await realpath3(cwd) !== await realpath3(this.options.projectRoot ?? process.cwd())) throw new Error("report topic belongs to another workspace");
    const root = await realpath3(this.rootDir());
    const original = await this.dirOf(id);
    const dir = await realpath3(original);
    if (dirname2(dir) !== root || relative3(this.rootDir(), original) !== relative3(root, dir)) throw new Error("report topic directory escapes its store");
    await assertReportFiles(dir);
    return dir;
  }
  async readReport(id, cwd) {
    const dir = await this.reportDir(id, cwd);
    const report = await readReportInfo(dir, await this.load(id));
    return { report, markdown: report === null ? null : (await readContainedFile(dir, report.path, 1024 * 1024)).toString("utf8") };
  }
  async writeReport(id, cwd, draft) {
    const dir = await this.reportDir(id, cwd);
    return await writeReport(dir, async () => {
      if (await this.reportDir(id, cwd) !== dir) throw new Error("report directory changed");
      return await this.load(id);
    }, draft);
  }
  async readRound(id, cwd, round) {
    const dir = await this.reportDir(id, cwd);
    const topic = await this.load(id);
    const record = topic.rounds.find((item) => item.n === round);
    if (!Number.isInteger(round) || record?.answeredAt === void 0) throw new Error("round must name an answered round of this topic");
    return {
      round: record,
      question: await this.readQuestion(topic, round),
      answer: await this.readAnswer(topic, round),
      verdict: await readContainedFile(dir, `rounds/${pad(round)}-verdict.md`, 1024 * 1024).then((bytes) => bytes.toString("utf8")).catch((error) => {
        if (isMissing(error)) return null;
        throw error;
      })
    };
  }
  async writeQuestion(topic, round, text) {
    const dir = await this.dirOf(topic.id);
    await this.atomic(join3(dir, "rounds", `${pad(round)}-question.md`), text);
  }
  async readQuestion(topic, round) {
    try {
      const dir = await this.dirOf(topic.id);
      return (await readContainedFile(dir, `rounds/${pad(round)}-question.md`, 2e6)).toString("utf8");
    } catch (error) {
      if (isMissing(error)) return void 0;
      throw new Error(`cannot read question for round ${round}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  /** Resolve one manifest path and refuse anything outside the staged tree. */
  async stagedMaterialPath(materialsRoot, path) {
    const rel = isAbsolute3(path) ? relative3(materialsRoot, resolve3(path)) : path;
    if (rel === "" || rel.replace(/\\/g, "/").split("/").includes("..") || isAbsolute3(rel)) {
      throw new Error(`material manifest path escapes the topic: ${path}`);
    }
    return await resolveContainedPath(materialsRoot, rel);
  }
  async readMaterialPaths(topic) {
    let raw;
    let manifestRead = false;
    try {
      const dir = await this.dirOf(topic.id);
      raw = (await readContainedFile(dir, "materials/manifest.json", 1024 * 1024)).toString("utf8");
      manifestRead = true;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed.materials)) throw new Error("manifest materials is not an array");
      const materialsRoot = await resolveContainedPath(dir, "materials");
      return await Promise.all(parsed.materials.map((item) => item.path).filter((path) => typeof path === "string" && path !== "").map((path) => this.stagedMaterialPath(materialsRoot, path)));
    } catch (error) {
      if (!manifestRead && isMissing(error)) return [];
      throw new Error(`cannot read material manifest: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  /** Merge new material references into the topic manifest (follow-up rounds). */
  async addMaterials(topic, refs) {
    if (refs.length === 0) return [];
    const dir = await this.dirOf(topic.id);
    const file = join3(dir, "materials", "manifest.json");
    let existing = [];
    try {
      const parsed = JSON.parse(await readFile2(file, "utf8"));
      if (!Array.isArray(parsed.materials)) throw new Error("manifest materials is not an array");
      existing = parsed.materials;
    } catch (error) {
      if (!isMissing(error)) {
        throw new Error(`cannot merge material manifest: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    const byPath = new Map(existing.map((item) => [item.source ?? item.path, item]));
    const staged = await this.stageMaterials(dir, refs);
    for (const ref of staged) byPath.set(ref.source ?? ref.path, ref);
    await this.atomic(file, `${JSON.stringify({ materials: [...byPath.values()] }, null, 2)}
`);
    return staged;
  }
  /** Materials introduced by one follow-up round (empty means "no delta"). */
  async writeRoundMaterials(topic, round, refs) {
    const dir = await this.dirOf(topic.id);
    await this.atomic(join3(dir, "rounds", `${pad(round)}-materials.json`), `${JSON.stringify({ materials: refs }, null, 2)}
`);
  }
  async readRoundMaterials(topic, round) {
    let manifestRead = false;
    try {
      const dir = await this.dirOf(topic.id);
      const raw = await readContainedFile(dir, `rounds/${pad(round)}-materials.json`, 1024 * 1024);
      manifestRead = true;
      const parsed = JSON.parse(raw.toString("utf8"));
      if (!Array.isArray(parsed.materials)) throw new Error("round materials is not an array");
      const materialsRoot = await resolveContainedPath(dir, "materials");
      return await Promise.all(parsed.materials.map(async (item) => ({
        ...item,
        path: await this.stagedMaterialPath(materialsRoot, item.path)
      })));
    } catch (error) {
      if (!manifestRead && isMissing(error)) return void 0;
      throw new Error(`cannot read round ${round} materials: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  /** Conversation locator stays local even when the topic is project-stored. */
  async writeLocator(topicId, locator) {
    await this.atomic(join3(this.options.localRoot, "sessions", `${topicId}.json`), `${JSON.stringify(locator, null, 2)}
`);
  }
  async readLocator(topicId) {
    try {
      const parsed = JSON.parse(await readFile2(join3(this.options.localRoot, "sessions", `${topicId}.json`), "utf8"));
      if (typeof parsed.conversationUrl !== "string" || parsed.conversationUrl === "") {
        throw new Error("locator conversationUrl is missing");
      }
      return parsed;
    } catch (error) {
      if (isMissing(error)) return void 0;
      throw new Error(`cannot read session locator for ${topicId}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  async writeAnswer(topic, round, answer) {
    const hash = createHash4("sha256").update(answer, "utf8").digest("hex");
    await this.atomic(join3(this.rawTopicDir(topic.id), `${pad(round)}-answer.md`), answer);
    if (this.options.rawAnswers === "repo" && this.options.mode === "project") {
      const dir = await this.dirOf(topic.id);
      await this.atomic(join3(dir, "rounds", `${pad(round)}-answer.md`), answer);
    }
    return hash;
  }
  /** Persist images, code blocks and downloadable archives under `<topic>/artifacts/round-NN/`. */
  async writeArtifacts(topic, round, fetched) {
    const images = fetched.images ?? [];
    const blocks = fetched.codeBlocks ?? [];
    const archives = fetched.archives ?? [];
    if (images.length === 0 && blocks.length === 0 && archives.length === 0) return [];
    const dir = await this.dirOf(topic.id);
    const base = join3(dir, "artifacts", `round-${pad(round)}`);
    const added = [];
    for (const [index, image] of images.entries()) {
      const name2 = artifactFileName(image.name ?? `image-${pad(index + 1)}.png`);
      const target = join3(base, name2);
      await this.atomic(target, Buffer.from(image.base64, "base64"));
      added.push(relative3(dir, target).replace(/\\/g, "/"));
    }
    const used = /* @__PURE__ */ new Set();
    for (const [index, block] of blocks.entries()) {
      const guessed = extensionForLanguage(block.language);
      const extension = guessed === "txt" && isHtmlSource(block.text) ? "html" : guessed;
      const hinted = block.name === void 0 || block.name.trim() === "" ? "" : artifactRelativePath(block.name.trim());
      const withExtension = hinted === "" ? `code-${pad(index + 1)}.${extension}` : /\.[a-z0-9]+$/i.test(hinted) ? hinted : `${hinted}.${extension}`;
      let name2 = withExtension;
      let suffix = 1;
      while (used.has(name2.toLowerCase())) {
        suffix += 1;
        name2 = `${withExtension.replace(/\.[a-z0-9]+$/i, "")}-${suffix}${/\.[a-z0-9]+$/i.exec(withExtension)?.[0] ?? ""}`;
      }
      used.add(name2.toLowerCase());
      const target = join3(base, name2);
      await this.atomic(target, block.text);
      added.push(relative3(dir, target).replace(/\\/g, "/"));
    }
    for (const [index, archive] of archives.entries()) {
      const bytes = Buffer.from(archive.base64, "base64");
      if (bytes.length === 0) continue;
      const archiveName = artifactFileName(archive.name === "" ? `archive-${pad(index + 1)}.zip` : archive.name);
      const zipName = archiveName.toLowerCase().endsWith(".zip") ? archiveName : `${archiveName}.zip`;
      const target = join3(base, zipName);
      await this.atomic(target, bytes);
      added.push(relative3(dir, target).replace(/\\/g, "/"));
      let entries;
      try {
        entries = inflateArchive(new Uint8Array(bytes));
      } catch {
        continue;
      }
      if (entries === void 0) continue;
      const rootName = zipName.replace(/\.zip$/i, "");
      const valid = entries.filter(([entry, data]) => {
        const normalized = entry.replace(/\\/g, "/");
        return !normalized.endsWith("/") && !normalized.startsWith("/") && !isAbsolute3(normalized) && !normalized.split("/").includes("..") && !normalized.startsWith("__MACOSX/") && data.length > 0;
      });
      const topLevel = new Set(valid.map(([entry]) => entry.replace(/\\/g, "/").split("/")[0]));
      const useRoot = topLevel.size > 1 || valid.some(([entry]) => !entry.replace(/\\/g, "/").includes("/"));
      for (const [entry, data] of valid) {
        const normalized = entry.replace(/\\/g, "/");
        const nested = join3(base, useRoot ? rootName : "", normalized);
        await this.atomic(nested, data);
        added.push(relative3(dir, nested).replace(/\\/g, "/"));
      }
    }
    for (const artifact of added) {
      if (!topic.artifacts.includes(artifact)) topic.artifacts.push(artifact);
    }
    return added;
  }
  /** Build a downloadable zip for one round without touching the topic files. */
  async bundleRound(topic, round) {
    const dir = await this.dirOf(topic.id);
    const prefix = `artifacts/round-${pad(round)}/`;
    const base = await resolveContainedPath(dir, prefix);
    const files = /* @__PURE__ */ Object.create(null);
    const limit = 100 * 1024 * 1024;
    let total = 0;
    for (const path of topic.artifacts) {
      if (!path.startsWith(prefix)) continue;
      let bytes;
      try {
        bytes = await readContainedFile(base, path.slice(prefix.length), limit - total);
      } catch (error) {
        if (isMissing(error)) continue;
        if (error instanceof FileSizeLimitError) throw new Error("round artifacts exceed 100 MB");
        throw error;
      }
      total += bytes.length;
      files[path.slice(prefix.length)] = bytes;
    }
    if (Object.keys(files).length === 0) throw new Error(`round ${round} has no artifacts to bundle`);
    const zipped = zipSync(files, { level: 6 });
    return { name: `round-${pad(round)}.zip`, bytes: Buffer.from(zipped) };
  }
  /**
   * Delete every persisted byte of a topic: the topic directory, its raw
   * answers and its session locator. Callers must refuse active statuses
   * before invoking this.
   */
  async remove(topic) {
    const dir = await this.dirOf(topic.id);
    await rm2(dir, { recursive: true, force: true });
    await rm2(this.rawTopicDir(topic.id), { recursive: true, force: true });
    await rm2(join3(this.options.localRoot, "sessions", `${topic.id}.json`), { force: true });
    this.dirs.delete(topic.id);
  }
  async readAnswer(topic, round) {
    this.rawTopicDir(topic.id);
    const candidates = [{ root: this.options.rawDir, path: `${topic.id}/${pad(round)}-answer.md` }];
    if (this.options.rawAnswers === "repo" && this.options.mode === "project") {
      candidates.push({ root: await this.dirOf(topic.id), path: `rounds/${pad(round)}-answer.md` });
    }
    for (const candidate of candidates) {
      try {
        return (await readContainedFile(candidate.root, candidate.path, 16 * 1024 * 1024)).toString("utf8");
      } catch (error) {
        if (!isMissing(error)) throw error;
      }
    }
    return void 0;
  }
  async writeVerdict(topic, round, text) {
    const dir = await this.dirOf(topic.id);
    await this.atomic(join3(dir, "rounds", `${pad(round)}-verdict.md`), text);
  }
  async writeReceipt(topic, round, receipt) {
    const dir = await this.dirOf(topic.id);
    await this.atomic(join3(dir, "receipts", `${pad(round)}.json`), `${JSON.stringify(receipt, null, 2)}
`);
    await this.appendJsonLine(join3(dir, "receipts", "history.ndjson"), {
      at: (/* @__PURE__ */ new Date()).toISOString(),
      round,
      receipt
    });
  }
  /** Merge the answer hash/timestamp into the existing receipt without losing submit fields. */
  async patchReceipt(topic, round, patch) {
    const existing = await this.readReceipt(topic, round);
    if (existing === void 0) return void 0;
    const next = { ...existing, ...patch };
    await this.writeReceipt(topic, round, next);
    return next;
  }
  async writeFinal(topic, text) {
    const dir = await this.dirOf(topic.id);
    await this.atomic(join3(dir, "final.md"), text);
    if (!topic.artifacts.includes("final.md")) topic.artifacts.push("final.md");
    if (topic.generations === void 0) {
      topic.generations = [{ n: 1, createdAt: topic.created, reason: "\u521D\u59CB\u4EFB\u52A1" }];
    }
    const generation = topic.generations.at(-1)?.n ?? topic.rounds.at(-1)?.generation ?? 1;
    const relative4 = `finals/attempt-${pad(generation)}.md`;
    await this.atomic(join3(dir, relative4), text);
    const record = topic.generations.find((item) => item.n === generation);
    if (record !== void 0) record.final = relative4;
  }
  async readFinal(topic) {
    try {
      return (await readContainedFile(await this.dirOf(topic.id), "final.md", 2e6)).toString("utf8");
    } catch (error) {
      if (isMissing(error)) return void 0;
      throw error;
    }
  }
  async writeHumanCheck(topic, check) {
    const dir = await this.dirOf(topic.id);
    await this.atomic(join3(dir, "human-check.json"), `${JSON.stringify(check, null, 2)}
`);
    await this.appendJsonLine(join3(dir, "human-checks.ndjson"), check);
  }
  async readReceipt(topic, round) {
    try {
      const dir = await this.dirOf(topic.id);
      return JSON.parse(await readFile2(join3(dir, "receipts", `${pad(round)}.json`), "utf8"));
    } catch {
      return void 0;
    }
  }
  async index() {
    const topics = await this.list();
    const entries = topics.map((topic) => ({
      id: topic.id,
      title: topic.title,
      type: topic.type,
      status: topic.status,
      rounds: topic.rounds.length,
      parent: topic.parent,
      updated: topic.updated,
      ...topic.artifacts.includes("final.md") ? { artifact: "final.md" } : {}
    }));
    const file = { schema: 1, updated: (/* @__PURE__ */ new Date()).toISOString(), topics: entries };
    await mkdir2(this.rootDir(), { recursive: true });
    await this.atomic(join3(this.rootDir(), "index.json"), `${JSON.stringify(file, null, 2)}
`);
    return file;
  }
  materialManifest(entries) {
    return `${JSON.stringify({ materials: entries }, null, 2)}
`;
  }
};

// packages/core/src/engine.ts
import { createHash as createHash6, randomUUID as randomUUID3 } from "node:crypto";

// packages/core/src/judge.ts
function assertCompletion(criteria, result) {
  if (!result.done) return;
  const normalize = (text) => text.trim().replace(/\s+/g, " ");
  const expected = criteria.map(normalize);
  const findings = result.criteria ?? [];
  const actual = findings.map((item) => normalize(item.criterion));
  if (result.verdict !== "accepted" || expected.length === 0 || new Set(expected).size !== expected.length || findings.length !== expected.length || new Set(actual).size !== actual.length || actual.some((item) => !expected.includes(item)) || findings.some((item) => item.status !== "met" || !item.evidence?.trim())) {
    throw new Error("\u5B8C\u6210\u58F0\u660E\u4E0E\u5224\u636E\u8BC1\u636E\u4E0D\u4E00\u81F4\uFF1A\u5FC5\u987B\u9010\u6761\u5BF9\u5E94\u539F\u5224\u636E\u3001\u65E0\u7F3A\u9879\u6216\u91CD\u590D\uFF0C\u4E14\u5168\u90E8\u6EE1\u8DB3\u5E76\u63D0\u4F9B\u4F9D\u636E");
  }
}

// packages/core/src/base-image.ts
import { createHash as createHash5 } from "node:crypto";
import { readFile as readFile3, realpath as realpath4 } from "node:fs/promises";
import { extname, isAbsolute as isAbsolute4, join as join4, resolve as resolve4, sep as sep4 } from "node:path";
function assertRaster(bytes, path) {
  const ext = extname(path).toLowerCase();
  const png = ext === ".png" && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  const jpg = /^\.jpe?g$/.test(ext) && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  const webp = ext === ".webp" && bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP";
  if (!png && !jpg && !webp) throw new Error("\u5E95\u56FE\u5FC5\u987B\u662F\u6709\u6548\u7684 PNG\u3001JPEG \u6216 WebP \u56FE\u7247");
}
async function verifyStagedBaseImage(topicDir, ref) {
  const topicRoot = await realpath4(topicDir);
  const root = await realpath4(join4(topicDir, "materials"));
  if (!root.startsWith(`${topicRoot}${sep4}`)) throw new Error("\u5E95\u56FE\u6750\u6599\u76EE\u5F55\u8D85\u51FA\u4E3B\u9898\u76EE\u5F55\uFF0C\u505C\u6B62\u53D1\u9001");
  const path = await realpath4(ref.path);
  if (!path.startsWith(`${root}${sep4}`)) throw new Error("\u5E95\u56FE\u6750\u6599\u8DEF\u5F84\u8D85\u51FA\u4E3B\u9898\u76EE\u5F55\uFF0C\u505C\u6B62\u53D1\u9001");
  const bytes = await readFile3(path);
  if (createHash5("sha256").update(bytes).digest("hex") !== ref.sha256) throw new Error("\u5E95\u56FE\u6750\u6599\u5DF2\u53D8\u5316\uFF0C\u505C\u6B62\u53D1\u9001");
  assertRaster(bytes, path);
}
async function baseImageMaterial(dir, topic, path) {
  if (topic.type !== "design" || isAbsolute4(path) || path.includes("\\") || path.split("/").includes("..") || !path.startsWith("artifacts/") || !topic.artifacts.includes(path) || !topic.rounds.some((round) => round.artifacts?.includes(path))) {
    throw new Error("\u5E95\u56FE\u5FC5\u987B\u662F\u5F53\u524D\u8BBE\u8BA1\u4E3B\u9898\u5DF2\u8BB0\u5F55\u7684\u56FE\u7247\u4EA7\u7269");
  }
  const root = await realpath4(resolve4(dir));
  const source = await realpath4(resolve4(dir, path));
  if (!source.startsWith(`${root}${sep4}`)) throw new Error("\u5E95\u56FE\u8DEF\u5F84\u8D85\u51FA\u4E3B\u9898\u76EE\u5F55");
  const bytes = await readFile3(source);
  const ext = extname(path).toLowerCase();
  assertRaster(bytes, path);
  const sha2563 = createHash5("sha256").update(bytes).digest("hex");
  return { path: `edit-base/${sha2563}${ext}`, source, bytes: bytes.byteLength, sha256: sha2563, reason: `\u4FEE\u6539\u5E95\u56FE\uFF1A${path}` };
}

// packages/core/src/engine.ts
function isAbort(error) {
  return error instanceof Error && (error.name === "AbortError" || error.message === "aborted");
}
function requestHash(input) {
  return createHash6("sha256").update(JSON.stringify({
    brief: input.brief,
    files: [...input.files],
    model: input.model,
    designs: input.designs ?? null
  })).digest("hex");
}
function latestDispatchedRound(topic) {
  return [...topic.rounds].reverse().find((round) => round.submissionId !== void 0 || round.dispatch !== void 0);
}
function hasUnobservedDispatch(round) {
  return round?.dispatch !== void 0 && round.submissionId === void 0;
}
function latestSubmission(topic) {
  return [...topic.rounds].reverse().find((round) => round.submissionId !== void 0);
}
var ResearchEngine = class {
  queue = [];
  active;
  runs = /* @__PURE__ */ new Map();
  nextBrief = /* @__PURE__ */ new Map();
  disposed = false;
  options;
  now;
  constructor(options) {
    this.options = options;
    this.now = options.now ?? (() => Date.now());
  }
  async start(card) {
    this.validateCard(card);
    const rounds = cardRounds(this.options.config, card);
    const { topic } = await this.options.store.create(
      card,
      rounds,
      card.model ?? this.options.config.model,
      this.options.config.channel
    );
    await this.transition(topic, "queued");
    this.enqueue(topic.id);
    return topic;
  }
  async list() {
    return this.options.store.list();
  }
  async status(id) {
    return this.options.store.load(id);
  }
  async cancel(id) {
    this.queue = this.queue.filter((queued) => queued !== id);
    const run = this.runs.get(id);
    run?.controller.abort();
    const topic = await this.options.store.load(id);
    if (run !== void 0) {
      const last2 = latestSubmission(topic);
      if (last2?.submissionId !== void 0) await this.cancelSubmission(last2.submissionId);
      await Promise.race([
        run.promise.then(() => void 0, () => void 0),
        new Promise((resolve7) => {
          const timer = setTimeout(resolve7, 9e4);
          timer.unref?.();
        })
      ]);
      return await this.options.store.load(id).catch(() => topic);
    }
    if (topic.status === "completed" || topic.status === "cancelled") return topic;
    delete topic.reviewFrom;
    delete topic.reviewStopReason;
    delete topic.reviewStallReason;
    delete topic.stopReason;
    const last = latestSubmission(topic);
    if (last?.submissionId !== void 0 && last.answeredAt === void 0) {
      await this.cancelSubmission(last.submissionId);
    }
    await this.transition(topic, "cancelled");
    return topic;
  }
  assertChannel(topic) {
    const topicChannel = topic.channel === "api" ? "api" : "web";
    if (topicChannel !== this.options.config.channel) {
      throw new Error(`\u4E3B\u9898\u5C5E\u4E8E ${topicChannel} \u901A\u9053\uFF0C\u5F53\u524D\u8BBE\u7F6E\u4E3A ${this.options.config.channel}\uFF1B\u8BF7\u5207\u56DE\u539F\u901A\u9053\u6216\u65B0\u5EFA\u4E3B\u9898`);
    }
  }
  async resume(id) {
    const topic = await this.options.store.load(id);
    this.assertChannel(topic);
    const resumable = topic.status === "stalled" || topic.status === "failed" || topic.status === "answered" || topic.status === "adjudicating" || topic.status === "reviewing" && topic.reviewFrom === "answered";
    if (!resumable) {
      throw new Error(`topic ${id} is ${topic.status}, not resumable`);
    }
    const last = topic.rounds[topic.rounds.length - 1];
    if (last !== void 0 && last.answeredAt !== void 0 && last.verdict === void 0 && last.judgeSkippedAt === void 0) {
      if (topic.status === "stalled" || topic.status === "failed" || topic.status === "adjudicating" || topic.status === "reviewing") {
        delete topic.reviewFrom;
        delete topic.reviewStopReason;
        await this.transition(topic, "queued");
      }
      this.enqueue(id);
      return topic;
    }
    if (last?.answeredAt !== void 0 && (last.verdict !== void 0 || last.judgeSkippedAt !== void 0)) {
      if (topic.status === "answered") await this.transition(topic, "adjudicating");
      delete topic.reviewFrom;
      delete topic.reviewStopReason;
      delete topic.reviewStallReason;
      await this.transition(topic, "queued");
      this.enqueue(id);
      return topic;
    }
    if (last?.submissionState === "not_sent" && last.submissionId === void 0 && last.dispatch === void 0) {
      await this.transition(topic, "queued");
      this.enqueue(id);
      return topic;
    }
    const round = latestDispatchedRound(topic);
    if (topic.channel === "api" && round !== void 0 && round.answeredAt === void 0 && round.submissionId !== void 0) {
      const probe = await this.options.transport.poll({ submissionId: round.submissionId, timeoutMs: 1e3 });
      if (probe.state === "unknown") {
        throw new Error("API \u751F\u56FE\u8BF7\u6C42\u5728\u91CD\u542F\u540E\u5DF2\u4E22\u5931\uFF0C\u65E0\u6CD5\u63A5\u7BA1\uFF1B\u8BF7\u63A5\u53D7\u5DF2\u6709\u4EA7\u7269\u3001\u91CD\u65B0\u751F\u6210\u6216\u53D6\u6D88");
      }
      await this.transition(topic, "waiting");
      this.enqueue(id);
      return topic;
    }
    if (hasUnobservedDispatch(round)) {
      if (this.options.transport.reattach === void 0) {
        throw new Error("\u4E0A\u4E00\u8F6E\u53EF\u80FD\u5DF2\u7ECF\u63D0\u4EA4\uFF0C\u4F46\u5F53\u524D\u901A\u9053\u65E0\u6CD5\u91CD\u65B0\u9644\u7740\uFF1B\u8BF7\u4EBA\u5DE5\u6838\u5BF9\u540E\u7528\u201C\u672A\u63D0\u4EA4\u201D\u91CD\u5F00\uFF0C\u907F\u514D\u91CD\u590D\u53D1\u9001");
      }
      const attached = await this.tryAttach(topic);
      if (!attached) {
        throw new Error("\u65E0\u6CD5\u786E\u8BA4\u4E0A\u4E00\u8F6E\u662F\u5426\u5DF2\u7ECF\u63D0\u4EA4\uFF1B\u8BF7\u4EBA\u5DE5\u6838\u5BF9\u540E\u7528\u201C\u672A\u63D0\u4EA4\u201D\u91CD\u5F00\uFF0C\u907F\u514D\u91CD\u590D\u53D1\u9001");
      }
      await this.transition(topic, "waiting");
      if (!this.runs.has(id)) this.enqueue(id);
      return topic;
    }
    if (round !== void 0 && this.options.transport.reattach !== void 0) {
      const attached = await this.tryAttach(topic);
      if (!attached) {
        throw new Error("\u65E0\u6CD5\u786E\u8BA4\u4E0A\u4E00\u8F6E\u662F\u5426\u5DF2\u7ECF\u63D0\u4EA4\uFF1B\u8BF7\u4EBA\u5DE5\u6838\u5BF9\u540E\u7528\u201C\u672A\u63D0\u4EA4\u201D\u91CD\u5F00\uFF0C\u907F\u514D\u91CD\u590D\u53D1\u9001");
      }
      await this.transition(topic, "waiting");
      if (!this.runs.has(id)) this.enqueue(id);
      return topic;
    }
    await this.transition(topic, "queued");
    this.enqueue(id);
    return topic;
  }
  /**
   * Re-open the stored conversation and verify the prompt is present. Returns
   * false when the round was never sent, so callers can ask for human review
   * instead of duplicating it.
   */
  async tryAttach(topic) {
    const round = latestDispatchedRound(topic);
    if (round === void 0) return false;
    const locator = await this.options.store.readLocator(topic.id);
    if (locator === void 0) return false;
    const transport = this.options.transport;
    if (transport.reattach === void 0) return false;
    const brief = await this.options.store.readQuestion(topic, round.n) ?? "";
    const result = await transport.reattach({
      topicId: topic.id,
      round: round.n,
      conversationUrl: locator.conversationUrl,
      brief
    });
    if (!result.attached || result.submissionId === void 0) return false;
    round.submissionId = result.submissionId;
    if (round.dispatch !== void 0) round.dispatch.observedAt = (/* @__PURE__ */ new Date()).toISOString();
    await this.options.store.save(topic);
    return true;
  }
  /**
   * After a host restart the browser map is empty but the topic still carries
   * the round's submission id. Re-open the stored conversation, verify the
   * prompt is really there, and adopt it instead of blindly resubmitting.
   */
  async reattach(id) {
    const topic = await this.options.store.load(id);
    this.assertChannel(topic);
    if (topic.status !== "waiting" && topic.status !== "submitted") {
      throw new Error(`topic ${id} is ${topic.status}, not waiting`);
    }
    const last = topic.rounds[topic.rounds.length - 1];
    if (last !== void 0 && last.answeredAt !== void 0 && last.verdict === void 0 && last.judgeSkippedAt === void 0) {
      if (topic.status === "submitted") await this.transition(topic, "waiting");
      if (topic.status === "waiting") await this.transition(topic, "answered");
      this.enqueue(id);
      return topic;
    }
    const attached = await this.tryAttach(topic);
    if (!attached) {
      await this.transition(topic, "stalled", {
        stallReason: "unknown_submission",
        stopReason: "DSH \u91CD\u542F\u540E\u65E0\u6CD5\u786E\u8BA4\u8FD9\u4E00\u8F6E\u662F\u5426\u5DF2\u63D0\u4EA4\uFF1B\u8BF7\u6838\u5BF9\u4F1A\u8BDD\u540E\u518D\u6062\u590D"
      });
      return topic;
    }
    if (topic.status !== "waiting") await this.transition(topic, "waiting");
    if (!this.runs.has(id)) this.enqueue(id);
    return topic;
  }
  /** Human accepts a capped/reviewing or artifact-bearing failed/stalled result. */
  async accept(id) {
    const topic = await this.options.store.load(id);
    if (topic.status === "completed") {
      if (topic.acceptedAt === void 0) {
        topic.acceptedAt = (/* @__PURE__ */ new Date()).toISOString();
        await this.options.store.save(topic);
      }
      return topic;
    }
    const withArtifacts = (topic.status === "failed" || topic.status === "stalled") && topic.artifacts.length > 0;
    const reviewingFrom = topic.status === "reviewing" ? topic.reviewFrom ?? "capped" : void 0;
    const reviewingAcceptable = reviewingFrom !== void 0 && (reviewingFrom === "capped" || reviewingFrom === "answered" || topic.artifacts.length > 0);
    if (topic.status !== "capped" && !reviewingAcceptable && !withArtifacts) {
      throw new Error(`topic ${id} is ${topic.status}; only capped/reviewing or failed/stalled with artifacts can be accepted`);
    }
    delete topic.reviewFrom;
    delete topic.reviewStopReason;
    delete topic.reviewStallReason;
    delete topic.runThrough;
    delete topic.nextDesigns;
    delete topic.nextBaseArtifact;
    const existing = await this.options.store.readFinal(topic);
    const text = existing !== void 0 && this.matchesFinalCoverage(topic, existing) ? `${existing.replace(/^- 状态：.*$/m, "- \u72B6\u6001\uFF1Acompleted").trimEnd()}
- \u4EBA\u5DE5\u63A5\u53D7\uFF1A${(/* @__PURE__ */ new Date()).toISOString()}
` : this.finalDocument(topic, void 0, "\u4EBA\u5DE5\u63A5\u53D7\u7ED3\u679C", "completed");
    const accepted = text.includes("\uFF08\u672A\u751F\u6210\u6458\u8981\uFF1B\u89C1\u5404\u8F6E\u88C1\u51B3\u4E0E\u539F\u59CB\u7B54\u590D\uFF09") ? `${text}- \u4EBA\u5DE5\u63A5\u53D7\u8BF4\u660E\uFF1A\u672A\u751F\u6210\u81EA\u52A8\u6458\u8981\uFF0C\u7ED3\u8BBA\u89C1\u539F\u59CB\u7B54\u590D\u3002
` : text;
    topic.acceptedAt = (/* @__PURE__ */ new Date()).toISOString();
    await this.options.store.writeFinal(topic, accepted);
    await this.transition(topic, "completed", { stopReason: "\u4EBA\u5DE5\u63A5\u53D7\u7ED3\u679C" });
    this.emit({ type: "finished", topicId: topic.id, status: "completed" });
    return topic;
  }
  /** Move a capped/failed/stalled topic to "waiting for the originating agent to judge". */
  async markReviewing(id) {
    const topic = await this.options.store.load(id);
    if (topic.status === "reviewing") return topic;
    if (topic.status !== "capped" && topic.status !== "failed" && topic.status !== "stalled") {
      throw new Error(`topic ${id} is ${topic.status}; only capped/failed/stalled can be handed to review`);
    }
    topic.reviewFrom = topic.status;
    topic.reviewStopReason = topic.stopReason;
    topic.reviewStallReason = topic.stallReason;
    await this.transition(topic, "reviewing", { stopReason: "\u7B49\u5F85\u539F\u4F1A\u8BDD\u5224\u65AD\uFF1B\u63A5\u53D7\u3001\u7EE7\u7EED\u6216\u91CD\u65B0\u751F\u6210\u540E\u7ED3\u675F" });
    return topic;
  }
  /** Return a reviewing topic to the queue it came from. */
  async cancelReview(id) {
    const topic = await this.options.store.load(id);
    if (topic.status === "capped") return topic;
    if (topic.status !== "reviewing") throw new Error(`topic ${id} is ${topic.status}; only reviewing can return to its previous state`);
    const target = topic.reviewFrom ?? "capped";
    const previousReason = topic.reviewStopReason;
    const previousStall = topic.reviewStallReason;
    delete topic.reviewFrom;
    delete topic.reviewStopReason;
    delete topic.reviewStallReason;
    await this.transition(topic, target, {
      ...previousStall !== void 0 ? { stallReason: previousStall } : {},
      stopReason: previousReason ?? "\u539F\u4F1A\u8BDD\u5224\u65AD\u8BF7\u6C42\u5DF2\u64A4\u56DE\uFF1B\u7B49\u5F85\u4EBA\u5DE5\u5904\u7406"
    });
    return topic;
  }
  /** Mark an interrupted active topic for human review without resubmitting. */
  async interrupt(id, reason) {
    const topic = await this.options.store.load(id);
    if (topic.status === "completed" || topic.status === "capped" || topic.status === "reviewing" || topic.status === "cancelled") return topic;
    if (topic.status === "stalled") return topic;
    await this.transition(topic, "stalled", { stallReason: "unknown_submission", stopReason: reason });
    return topic;
  }
  /**
   * Start a new retained generation (a "version") rather than appending a
   * round to the current one. Failed rounds without an answer are retried in
   * place; finished topics get a fresh generation.
   */
  /**
   * Each version gets its own round budget, so a regeneration can run as many
   * rounds as the initial task did instead of stopping after a single round.
   */
  generationBudget(topic) {
    const configured = topic.generations?.[0]?.rounds ?? this.options.config.rounds;
    return Number.isInteger(configured) && configured >= 1 ? configured : 1;
  }
  async regenerate(id, brief, reason, materials) {
    const topic = await this.options.store.load(id);
    this.assertChannel(topic);
    if (brief.trim() === "") throw new Error("brief is required");
    const recoverable = topic.status === "failed" || topic.status === "stalled";
    const last = topic.rounds[topic.rounds.length - 1];
    if (recoverable && last !== void 0 && last.answeredAt === void 0) {
      return await this.continue(id, brief, materials);
    }
    const finished = topic.status === "completed" || topic.status === "capped" || topic.status === "reviewing" || recoverable;
    if (!finished) throw new Error(`topic ${id} is ${topic.status}; regenerate needs a terminal topic`);
    if (topic.generations === void 0) {
      topic.generations = [{ n: 1, createdAt: topic.created, rounds: this.generationBudget(topic), reason: "\u521D\u59CB\u4EFB\u52A1" }];
    }
    if (topic.generations.length === 1 && topic.generations[0]?.final === void 0) {
      const previous = await this.options.store.readFinal(topic);
      if (previous !== void 0) await this.options.store.writeFinal(topic, previous);
    }
    const budget = this.generationBudget(topic);
    const generation = (topic.generations.at(-1)?.n ?? 1) + 1;
    topic.generations.push({
      n: generation,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      rounds: budget,
      reason: reason.trim() || "\u7528\u6237\u91CD\u65B0\u751F\u6210"
    });
    const next = topic.rounds.length + 1;
    topic.roundsCap = Math.max(topic.roundsCap, next + budget - 1);
    topic.runThrough = next + budget - 1;
    delete topic.nextDesigns;
    delete topic.nextBaseArtifact;
    delete topic.nextBrief;
    delete topic.acceptedAt;
    await this.options.store.writeQuestion(topic, next, brief);
    const staged = await this.options.store.addMaterials(topic, materials ?? []);
    await this.options.store.writeRoundMaterials(topic, next, staged);
    if (last?.answeredAt !== void 0 && last.verdict === void 0) last.judgeSkippedAt = (/* @__PURE__ */ new Date()).toISOString();
    delete topic.reviewFrom;
    delete topic.reviewStopReason;
    delete topic.reviewStallReason;
    delete topic.stopReason;
    await this.transition(topic, "queued");
    this.enqueue(id);
    return topic;
  }
  /**
   * Explicit follow-up on a finished topic: one more round with a new brief.
   * The round limit grows when the follow-up would exceed it, because this is
   * the user-confirmed "+1 round" the design requires.
   */
  async continue(id, brief, materials, designs, baseArtifact) {
    const topic = await this.options.store.load(id);
    this.assertChannel(topic);
    if (brief.trim() === "") throw new Error("brief is required");
    if (designs !== void 0 && (!Number.isInteger(designs) || designs < 1 || designs > 6)) {
      throw new Error("designs must be an integer between 1 and 6");
    }
    const finished = topic.status === "completed" || topic.status === "capped" || topic.status === "reviewing";
    const recoverable = topic.status === "failed" || topic.status === "stalled";
    if (!finished && !recoverable) {
      throw new Error(`topic ${id} is ${topic.status}; only completed/capped/reviewing or failed/stalled topics accept a follow-up`);
    }
    const last = topic.rounds[topic.rounds.length - 1];
    const retryCurrent = recoverable && last !== void 0 && last.answeredAt === void 0;
    if (retryCurrent && hasUnobservedDispatch(last)) {
      throw new Error("\u4E0A\u4E00\u8F6E\u53EF\u80FD\u5DF2\u7ECF\u53D1\u9001\uFF1B\u8BF7\u5148\u4EBA\u5DE5\u6838\u5BF9\uFF0C\u786E\u8BA4\u201C\u672A\u63D0\u4EA4\u201D\u540E\u518D\u7EE7\u7EED\uFF0C\u907F\u514D\u91CD\u590D\u53D1\u9001");
    }
    const next = retryCurrent ? last.n : topic.rounds.length + 1;
    if (baseArtifact !== void 0 && (topic.type !== "design" || materials?.length !== 1)) {
      throw new Error("\u5B9A\u5411\u4FEE\u6539\u5FC5\u987B\u63D0\u4F9B\u4E14\u4EC5\u63D0\u4F9B\u4E00\u5F20\u5E95\u56FE");
    }
    if (retryCurrent) {
      if (baseArtifact !== void 0) last.baseArtifact = baseArtifact;
      else delete last.baseArtifact;
    } else if (baseArtifact !== void 0) topic.nextBaseArtifact = baseArtifact;
    else delete topic.nextBaseArtifact;
    if (retryCurrent) {
      topic.runThrough = topic.runThrough ?? topic.roundsCap;
      if (last.submissionId !== void 0) {
        await this.cancelSubmission(last.submissionId);
      }
      delete last.submissionId;
      delete last.fingerprint;
      delete last.submittedAt;
      delete last.verdict;
      delete last.done;
      delete last.dispatch;
    } else {
      if (next > topic.roundsCap) topic.roundsCap = next;
      topic.runThrough = next;
    }
    if (topic.type === "design" && designs !== void 0) {
      if (retryCurrent) {
        last.designs = designs;
        delete topic.nextDesigns;
      } else topic.nextDesigns = designs;
    } else delete topic.nextDesigns;
    if (baseArtifact !== void 0) topic.runThrough = next;
    delete topic.nextBrief;
    delete topic.acceptedAt;
    await this.options.store.writeQuestion(topic, next, brief);
    const staged = await this.options.store.addMaterials(topic, materials ?? []);
    await this.options.store.writeRoundMaterials(topic, next, staged);
    if (last?.answeredAt !== void 0 && last.verdict === void 0) last.judgeSkippedAt = (/* @__PURE__ */ new Date()).toISOString();
    delete topic.reviewFrom;
    delete topic.reviewStopReason;
    delete topic.reviewStallReason;
    delete topic.stopReason;
    await this.transition(topic, "queued");
    this.enqueue(id);
    return topic;
  }
  async humanCheck(id, conclusion, note) {
    const topic = await this.options.store.load(id);
    this.assertChannel(topic);
    if (topic.status !== "stalled" && topic.status !== "failed") throw new Error(`topic ${id} is ${topic.status}, not stalled or failed`);
    if (topic.status === "failed") {
      await this.transition(topic, "stalled", { stallReason: "unknown_submission", stopReason: topic.stopReason });
    }
    const check = { at: (/* @__PURE__ */ new Date()).toISOString(), conclusion, note };
    topic.humanCheck = check;
    await this.options.store.writeHumanCheck(topic, check);
    if (conclusion === "submitted") {
      const last = topic.rounds[topic.rounds.length - 1];
      if (last === void 0 || last.dispatch === void 0 && last.submissionId === void 0) {
        throw new Error("\u8FD9\u4E00\u8F6E\u6CA1\u6709\u4EFB\u4F55\u63D0\u4EA4\u8BB0\u5F55\u53EF\u6838\u5BF9\uFF1B\u8BF7\u6539\u7528\u201C\u672A\u63D0\u4EA4\u201D\u91CD\u5F00");
      }
      if (last.answeredAt !== void 0 && last.verdict === void 0) {
        await this.transition(topic, "queued");
        this.enqueue(id);
        return topic;
      }
      if (hasUnobservedDispatch(last) && this.options.transport.reattach === void 0) {
        throw new Error("\u8FD9\u4E2A\u901A\u9053\u65E0\u6CD5\u786E\u8BA4\u5DF2\u53D1\u9001\u7684\u6D88\u606F\uFF1B\u8BF7\u4FDD\u7559\u73B0\u573A\uFF0C\u4F7F\u7528\u201C\u672A\u63D0\u4EA4\u201D\u91CD\u5F00\u6216\u63A5\u53D7\u5DF2\u6709\u4EA7\u7269");
      }
      if (this.options.transport.reattach !== void 0) {
        const attached = await this.tryAttach(topic);
        if (!attached) {
          throw new Error("\u65E0\u6CD5\u5728\u539F\u4F1A\u8BDD\u91CC\u786E\u8BA4\u8FD9\u4E00\u8F6E\u7684 prompt\uFF1B\u8BF7\u6838\u5BF9\u540E\u7528\u201C\u672A\u63D0\u4EA4\u201D\u91CD\u5F00\uFF0C\u907F\u514D\u91CD\u590D\u53D1\u9001");
        }
      } else if (last.submissionId !== void 0) {
        const probe = await this.options.transport.poll({ submissionId: last.submissionId, timeoutMs: 1e3 }).catch(() => void 0);
        if (probe?.state === "unknown") {
          throw new Error("\u8BE5\u901A\u9053\u7684\u8BF7\u6C42\u5DF2\u4E0D\u5728\u8FD0\u884C\uFF08\u5BBF\u4E3B\u53EF\u80FD\u91CD\u542F\u8FC7\uFF09\uFF0C\u65E0\u6CD5\u63A5\u7BA1\u6838\u5BF9\uFF1B\u8BF7\u7528\u201C\u672A\u63D0\u4EA4\u201D\u91CD\u5F00\u6216\u63A5\u53D7\u5DF2\u6709\u4EA7\u7269");
        }
      }
      await this.transition(topic, "waiting");
      this.enqueue(id);
    } else if (conclusion === "not_submitted") {
      const last = topic.rounds[topic.rounds.length - 1];
      if (last !== void 0) {
        delete last.submissionId;
        delete last.fingerprint;
        delete last.submittedAt;
        delete last.dispatch;
      }
      await this.transition(topic, "queued");
      this.enqueue(id);
    } else {
      await this.transition(topic, "failed", { stopReason: "\u4EBA\u5DE5\u6838\u5BF9\u5224\u5B9A\u9700\u8981\u91CD\u5F00\uFF1B\u8BF7\u91CD\u65B0\u751F\u6210\u6216\u7EE7\u7EED" });
    }
    return topic;
  }
  /**
   * Release this engine when its plugin fiber is disposed. Aborting the runs
   * stops polling; their failure path persists `cancelled`, so a later host
   * start does not resurrect a task this host deliberately stopped. New
   * enqueues are refused after disposal.
   */
  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.queue.length = 0;
    this.active?.controller.abort();
    for (const run of this.runs.values()) run.controller.abort();
    this.runs.clear();
    this.nextBrief.clear();
  }
  /**
   * Wait for the aborted run to persist its final status before the caller
   * releases the transport. Bounded because a submit can be inside a
   * transport-level wait; the run still settles afterwards.
   */
  async settle(timeoutMs = 1e4) {
    const active = this.active;
    if (active === void 0) return;
    await Promise.race([
      active.promise.then(() => void 0, () => void 0),
      new Promise((resolve7) => {
        const timer = setTimeout(resolve7, timeoutMs);
        timer.unref?.();
      })
    ]);
  }
  /** Wait until the queue and the active run are both empty (tests, shutdown). */
  async drain() {
    while (this.active !== void 0 || this.queue.length > 0) {
      if (this.active !== void 0) {
        await this.active.promise;
      } else {
        await new Promise((resolve7) => setTimeout(resolve7, 0));
      }
    }
  }
  validateCard(card) {
    if (card.title.trim() === "") throw new Error("title is required");
    if (card.question.trim() === "") throw new Error("question is required");
    if (card.successCriteria.length === 0) throw new Error("successCriteria is required");
    if (card.brief.trim() === "") throw new Error("brief is required");
    if (card.materials.length > this.options.config.maxFiles) {
      throw new Error(`too many materials: ${card.materials.length} > ${this.options.config.maxFiles}`);
    }
  }
  enqueue(id) {
    if (this.disposed || this.runs.has(id) || this.queue.includes(id)) return;
    this.queue.push(id);
    void this.pump();
  }
  async pump() {
    if (this.disposed || this.active !== void 0) return;
    const id = this.queue.shift();
    if (id === void 0) return;
    const controller = new AbortController();
    const promise = this.runTopic(id, controller.signal).catch((error) => {
      this.options.onError?.(error);
    }).finally(() => {
      this.runs.delete(id);
      if (this.active?.controller === controller) this.active = void 0;
      void this.pump();
    });
    this.active = { controller, promise };
    this.runs.set(id, this.active);
  }
  async runTopic(id, signal) {
    try {
      let topic = await this.options.store.load(id);
      while (true) {
        if (signal.aborted) throw new DOMException("aborted", "AbortError");
        if (topic.status === "cancelled" || topic.status === "completed" || topic.status === "capped" || topic.status === "reviewing") return;
        const last = topic.rounds[topic.rounds.length - 1];
        if (last !== void 0 && last.answeredAt !== void 0 && last.verdict === void 0 && last.judgeSkippedAt === void 0) {
          await this.adjudicate(topic, last, signal);
          if (signal.aborted) throw new DOMException("aborted", "AbortError");
          topic = await this.options.store.load(id);
          if (topic.status === "completed" || topic.status === "capped" || topic.status === "reviewing") return;
          continue;
        }
        const pending = last !== void 0 && last.answeredAt === void 0 ? last : void 0;
        const n = pending !== void 0 ? pending.n : topic.rounds.length + 1;
        const effectiveCap = topic.runThrough ?? topic.roundsCap;
        if (pending === void 0 && n > effectiveCap) {
          await this.finishCapped(topic, "\u8FBE\u5230\u8F6E\u6B21\u4E0A\u9650", signal);
          return;
        }
        let round = pending ?? topic.rounds.find((item) => item.n === n);
        if (round === void 0) {
          round = { n, files: 0, attempts: 0, generation: topic.generations?.at(-1)?.n ?? 1 };
          const requestedDesigns = topic.nextDesigns ?? topic.designs;
          if (topic.type === "design" && requestedDesigns !== void 0) round.designs = requestedDesigns;
          delete topic.nextDesigns;
          if (topic.nextBaseArtifact !== void 0) round.baseArtifact = topic.nextBaseArtifact;
          delete topic.nextBaseArtifact;
          topic.rounds.push(round);
          const stored = n === 1 ? await this.options.store.readQuestion(topic, 0) : await this.options.store.readQuestion(topic, n);
          const brief = stored ?? this.followUpBrief(topic);
          if (n === 1 || stored === void 0) await this.options.store.writeQuestion(topic, n, brief);
          await this.transition(topic, "uploading");
        }
        if (round.submissionId === void 0) {
          if (round.generation === void 0) round.generation = topic.generations?.at(-1)?.n ?? 1;
          if (topic.status !== "uploading") await this.transition(topic, "uploading");
          await this.submitRound(topic, round, signal);
        } else if (topic.status === "queued") {
          await this.transition(topic, "uploading");
          await this.transition(topic, "submitted");
        }
        if (topic.status !== "waiting") await this.transition(topic, "waiting");
        const fetched = await this.waitAnswer(round, signal);
        if (fetched === void 0) return;
        const hasPayload = fetched.answer.trim() !== "" || (fetched.images?.length ?? 0) > 0 || (fetched.codeBlocks?.length ?? 0) > 0 || (fetched.archives?.length ?? 0) > 0;
        if (!hasPayload) {
          throw new TransportError("the transport returned an empty answer with no artifacts", "ui");
        }
        const answerHash = await this.options.store.writeAnswer(topic, n, fetched.answer);
        const written = await this.options.store.writeArtifacts(topic, n, fetched);
        if (written.length > 0) {
          round.artifacts = [.../* @__PURE__ */ new Set([...round.artifacts ?? [], ...written])];
        }
        round.answeredAt = (/* @__PURE__ */ new Date()).toISOString();
        await this.transition(topic, "answered");
        await this.options.store.patchReceipt(topic, n, {
          answerSha256: answerHash,
          answeredAt: round.answeredAt
        }).catch(() => void 0);
        await this.options.store.appendEvent(topic, {
          type: "answered",
          round: n,
          answerSha256: answerHash
        }).catch(() => void 0);
        this.emit({ type: "answered", topicId: topic.id, round: n });
        topic = await this.options.store.load(id);
      }
    } catch (error) {
      await this.handleFailure(id, error, signal);
    }
  }
  async cancelSubmission(submissionId) {
    const cancel = this.options.transport.cancelSubmission;
    if (cancel === void 0) return;
    await cancel.call(this.options.transport, submissionId).catch(() => void 0);
  }
  async submitRound(topic, round, signal) {
    if (signal.aborted) throw new DOMException("aborted", "AbortError");
    if (round.dispatch !== void 0 && round.submissionId === void 0) {
      throw new TransportError("previous dispatch was never observed; human check is required before any resend", "ui");
    }
    const brief = await this.options.store.readQuestion(topic, round.n);
    if (brief === void 0) {
      throw new TransportError(`question file is missing for round ${round.n}; refusing to send an empty prompt`, "ui");
    }
    const locator = await this.options.store.readLocator(topic.id);
    const allFiles = await this.options.store.readMaterialPaths(topic);
    let files = allFiles;
    let fallbackFiles;
    let editBase;
    if (round.baseArtifact !== void 0) {
      const delta = await this.options.store.readRoundMaterials(topic, round.n);
      if (delta?.length !== 1) throw new Error("\u5E95\u56FE\u6750\u6599\u7F3A\u5931\uFF0C\u505C\u6B62\u53D1\u9001");
      if (topic.channel === "api" && this.options.config.image.editMode === "off") throw new Error("\u56FE\u7247\u7F16\u8F91\u5DF2\u5173\u95ED\uFF0C\u505C\u6B62\u5E95\u56FE\u4FEE\u6539");
      await verifyStagedBaseImage(await this.options.store.dirOf(topic.id), delta[0]);
      editBase = { sha256: delta[0].sha256 };
      files = delta.map((item) => item.path);
      fallbackFiles = files;
    } else if (locator !== void 0 && round.n > 1) {
      const delta = await this.options.store.readRoundMaterials(topic, round.n);
      files = (delta ?? []).map((item) => item.path);
      fallbackFiles = allFiles;
    }
    round.files = files.length;
    round.attempts = (round.attempts ?? 0) + 1;
    const intent = {
      attemptId: randomUUID3(),
      at: (/* @__PURE__ */ new Date()).toISOString(),
      requestHash: requestHash({
        brief,
        files,
        model: topic.model,
        ...(round.designs ?? topic.designs) !== void 0 ? { designs: round.designs ?? topic.designs } : {}
      })
    };
    round.dispatch = intent;
    delete round.submissionState;
    await this.options.store.save(topic);
    let result;
    try {
      result = await this.options.transport.submit({
        topicId: topic.id,
        round: round.n,
        brief,
        files,
        ...fallbackFiles !== void 0 ? { fallbackFiles } : {},
        ...editBase !== void 0 ? { editBase } : {},
        model: topic.model,
        ...(round.designs ?? topic.designs) !== void 0 ? { designs: round.designs ?? topic.designs } : {},
        session: locator ?? null,
        signal
      });
    } catch (error) {
      round.submissionState = isTransportError(error) && error.submissionState === "not_sent" ? "not_sent" : "unknown";
      await this.options.store.appendEvent(topic, {
        type: "submit_failed",
        round: round.n,
        dispatch: intent,
        submissionState: round.submissionState,
        failure: isTransportError(error) ? error.failure : "unknown",
        message: error instanceof Error ? error.message : String(error)
      });
      if (round.submissionState === "not_sent") delete round.dispatch;
      await this.options.store.save(topic);
      throw error;
    }
    round.dispatch = { ...intent, observedAt: (/* @__PURE__ */ new Date()).toISOString() };
    round.files = result.attachments.length;
    await this.options.store.writeLocator(topic.id, {
      conversationUrl: result.conversationUrl,
      profileDir: this.options.config.browser.profileDir,
      lastFingerprint: result.fingerprint
    });
    round.submissionId = result.submissionId;
    round.fingerprint = result.fingerprint;
    round.submittedAt = (/* @__PURE__ */ new Date()).toISOString();
    await this.options.store.writeReceipt(topic, round.n, {
      n: round.n,
      submissionId: result.submissionId,
      fingerprint: result.fingerprint,
      conversationUrl: result.conversationUrl,
      attachments: result.attachments,
      ...result.model !== void 0 ? { model: result.model } : {},
      submittedAt: round.submittedAt
    });
    await this.transition(topic, "submitted");
  }
  async waitAnswer(round, signal) {
    const submissionId = round.submissionId;
    if (submissionId === void 0) throw new Error("round has no submission");
    const deadline = this.now() + this.options.config.maxRoundMinutes * 6e4;
    let stallDeadline = this.now() + this.options.config.stallMinutes * 6e4;
    let diagnostic = "";
    while (this.now() < deadline) {
      if (signal.aborted) throw new DOMException("aborted", "AbortError");
      if (this.now() > stallDeadline) {
        throw new TransportError(`no progress for ${this.options.config.stallMinutes} minutes${diagnostic}`, "timeout");
      }
      const polled = await this.options.transport.poll({
        submissionId,
        timeoutMs: this.options.pollIntervalMs ?? 6e4,
        signal
      });
      if (polled.diagnostic !== void 0) diagnostic = ` (${polled.diagnostic})`;
      if (polled.state === "answered") {
        if (signal.aborted) throw new DOMException("aborted", "AbortError");
        let lastError;
        for (let attempt = 1; attempt <= 3; attempt += 1) {
          try {
            return await this.options.transport.fetch({ submissionId });
          } catch (error) {
            lastError = error;
            if (signal.aborted) throw new DOMException("aborted", "AbortError");
            if (attempt < 3) await new Promise((resolve7) => setTimeout(resolve7, 500));
          }
        }
        if (isTransportError(lastError) && lastError.answerIncomplete === true) continue;
        const fingerprint = polled.answer ?? "";
        if (fingerprint.startsWith("image:") || fingerprint.startsWith("code:")) {
          throw new TransportError(
            "the answer contains images/code but its assets could not be read; parked for review instead of saving an empty answer",
            "ui",
            { cause: lastError }
          );
        }
        if (polled.answer !== void 0 && polled.answer.trim() !== "") return { answer: polled.answer };
        throw lastError ?? new TransportError("the transport reported an answer it could not return", "ui");
      }
      if (polled.state === "unknown") throw new TransportError("page state is unknown", "ui");
      if (polled.progress === true) stallDeadline = this.now() + this.options.config.stallMinutes * 6e4;
    }
    throw new TransportError(`no completed answer before maxRoundMinutes${diagnostic}`, "timeout");
  }
  async adjudicate(topic, round, signal) {
    signal.throwIfAborted();
    const answer = await this.options.store.readAnswer(topic, round.n);
    signal.throwIfAborted();
    if (answer === void 0) {
      throw new TransportError("answer file is missing for adjudication", "ui");
    }
    await this.transition(topic, "adjudicating", void 0, signal);
    signal.throwIfAborted();
    const question = await this.options.store.readQuestion(topic, round.n) ?? "";
    signal.throwIfAborted();
    const input = { topic, round: round.n, answer, criteria: topic.successCriteria, question, signal };
    let result;
    try {
      result = await this.options.judge(input);
      signal.throwIfAborted();
      assertCompletion(input.criteria, result);
    } catch (first) {
      signal.throwIfAborted();
      try {
        result = await this.options.judge(input);
        signal.throwIfAborted();
        assertCompletion(input.criteria, result);
      } catch (second) {
        signal.throwIfAborted();
        await this.parkJudgeFailure(topic, round, second ?? first, signal);
        return;
      }
    }
    signal.throwIfAborted();
    delete round.judgeError;
    const visualReview = topic.type === "design" && result.done;
    if (visualReview) result = { ...result, done: false, reason: `${result.reason}\uFF1B\u6587\u672C\u5224\u636E\u901A\u8FC7\uFF0C\u56FE\u7247\u89C6\u89C9\u6548\u679C\u5F85\u4EBA\u5DE5\u786E\u8BA4` };
    await this.options.store.writeVerdict(topic, round.n, this.verdictDocument(round, result));
    signal.throwIfAborted();
    round.verdict = result.verdict;
    round.done = result.done;
    await this.options.store.appendEvent(topic, {
      type: "verdict",
      round: round.n,
      verdict: result.verdict,
      done: result.done
    }).catch(() => void 0);
    signal.throwIfAborted();
    this.emit({ type: "round", topicId: topic.id, round: round.n, verdict: result.verdict });
    if (result.done) {
      delete topic.runThrough;
      delete topic.nextDesigns;
      signal.throwIfAborted();
      await this.options.store.writeFinal(topic, this.finalDocument(topic, result.summary, result.reason, "completed"));
      signal.throwIfAborted();
      await this.transition(topic, "completed", { stopReason: result.reason }, signal);
      signal.throwIfAborted();
      this.emit({ type: "finished", topicId: topic.id, status: "completed" });
      return;
    }
    if (visualReview || round.n >= (topic.runThrough ?? topic.roundsCap)) {
      delete topic.runThrough;
      delete topic.nextDesigns;
      signal.throwIfAborted();
      await this.options.store.writeFinal(topic, this.finalDocument(topic, result.summary, result.reason, "capped"));
      signal.throwIfAborted();
      await this.transition(topic, "capped", { stopReason: result.reason }, signal);
      signal.throwIfAborted();
      this.emit({ type: "finished", topicId: topic.id, status: "capped" });
      return;
    }
    this.nextBrief.set(topic.id, result.nextBrief);
    if (result.nextBrief !== void 0 && result.nextBrief.trim() !== "") topic.nextBrief = result.nextBrief;
    else delete topic.nextBrief;
    await this.transition(topic, "queued", void 0, signal);
  }
  verdictDocument(round, result) {
    const cell = (value) => value.replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
    const rows = (result.criteria ?? []).map((item) => {
      const label = item.status === "met" ? "\u6EE1\u8DB3" : item.status === "partial" ? "\u90E8\u5206\u6EE1\u8DB3" : item.status === "unmet" ? "\u672A\u6EE1\u8DB3" : "\u8BC1\u636E\u4E0D\u8DB3";
      return `| ${cell(item.criterion)} | ${label} | ${cell(item.evidence ?? "")} |`;
    });
    return [
      `# \u7B2C ${round.n} \u8F6E\u88C1\u51B3`,
      "",
      `- \u7ED3\u8BBA\uFF1A${result.verdict}`,
      `- \u505C\u6B62\uFF1A${result.done ? "\u662F" : "\u5426"}`,
      `- \u7406\u7531\uFF1A${result.reason}`,
      "",
      "## \u5224\u636E",
      "",
      ...rows.length > 0 ? ["| \u5224\u636E | \u72B6\u6001 | \u4F9D\u636E |", "|---|---|---|", ...rows] : ["\u88C1\u51B3\u6CA1\u6709\u8FD4\u56DE\u9010\u6761\u5224\u65AD\uFF1B\u8BF7\u5BF9\u7167\u6210\u529F\u5224\u636E\u4EBA\u5DE5\u590D\u6838\u3002"],
      "",
      "## \u6458\u8981",
      "",
      result.summary,
      ""
    ].join("\n");
  }
  /**
   * The judge failed after an answer landed. Keep the answer, record why, and
   * park in `reviewing` (reviewFrom=answered) instead of failing the topic.
   * Accept/continue/regenerate/resume all remain available from that state.
   */
  async parkJudgeFailure(topic, round, error, signal) {
    signal.throwIfAborted();
    const message = error instanceof Error ? error.message : String(error);
    round.judgeError = message;
    const cell = (value) => value.replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
    const verdictText = [
      `# \u7B2C ${round.n} \u8F6E\u88C1\u51B3`,
      "",
      "- \u7ED3\u8BBA\uFF1A\u672A\u5B8C\u6210\u81EA\u52A8\u88C1\u51B3",
      "- \u505C\u6B62\uFF1A\u5426",
      `- \u9519\u8BEF\uFF1A${message}`,
      "",
      "## \u5224\u636E",
      "",
      "| \u5224\u636E | \u72B6\u6001 | \u4F9D\u636E |",
      "|---|---|---|",
      ...topic.successCriteria.map((item) => `| ${cell(item)} | \u8BC1\u636E\u4E0D\u8DB3 | \u81EA\u52A8\u88C1\u51B3\u5931\u8D25\uFF0C\u672A\u4EA7\u51FA\u9010\u6761\u5224\u65AD |`),
      "",
      "## \u4E0B\u4E00\u6B65",
      "",
      "\u7B54\u590D\u4E0E\u4EA7\u7269\u5DF2\u7ECF\u4FDD\u7559\u3002\u8BF7\u5BBF\u4E3B\u6216\u4EBA\u5DE5\u6309\u6210\u529F\u5224\u636E\u590D\u6838\uFF1A",
      "",
      "- \u6EE1\u8DB3\uFF1A`accept`\uFF1B",
      "- \u9700\u8981\u6539\u8FDB\uFF1A`regenerate`\uFF1B",
      "- \u53EA\u8865\u5145\u4E00\u8F6E\uFF1A`continue`\uFF1B",
      "- \u4FEE\u590D `judgeProvider` / `judgeModel` \u540E\uFF1A`resume` \u91CD\u8BD5\u81EA\u52A8\u88C1\u51B3\u3002",
      ""
    ].join("\n");
    await this.options.store.writeVerdict(topic, round.n, verdictText);
    signal.throwIfAborted();
    await this.options.store.appendEvent(topic, {
      type: "judge_failed",
      round: round.n,
      message
    }).catch(() => void 0);
    signal.throwIfAborted();
    topic.reviewFrom = "answered";
    topic.reviewStopReason = `\u81EA\u52A8\u88C1\u51B3\u5931\u8D25\uFF1A${message}`;
    delete topic.reviewStallReason;
    await this.transition(topic, "reviewing", { stopReason: `\u81EA\u52A8\u88C1\u51B3\u5931\u8D25\uFF1A${message}` }, signal);
    signal.throwIfAborted();
    this.emit({ type: "judge_failed", topicId: topic.id, round: round.n, message });
  }
  followUpBrief(topic) {
    const stored = this.nextBrief.get(topic.id) ?? topic.nextBrief;
    if (stored !== void 0 && stored.trim() !== "") return stored;
    const last = topic.rounds[topic.rounds.length - 1];
    if (topic.type === "design") {
      return [
        `\u7EE7\u7EED\u4E3B\u9898\u300C${topic.title}\u300D\uFF0C\u7ED9\u51FA\u4E0E\u4E0A\u4E00\u8F6E\u660E\u663E\u4E0D\u540C\u7684\u65B0\u65B9\u5411\uFF1B\u82E5\u4E0A\u4E00\u8F6E\u53EA\u90E8\u5206\u6EE1\u8DB3\u5224\u636E\uFF0C\u5C31\u5728\u4FDD\u7559\u5DF2\u786E\u8BA4\u90E8\u5206\u7684\u524D\u63D0\u4E0B\u4FEE\u8BA2\u3002\u4E0D\u8981\u91CD\u590D\u5DF2\u786E\u8BA4\u7684\u65B9\u6848\u3002`,
        "",
        `\u672C\u8F6E\u8BF7\u751F\u6210 ${topic.designs ?? 3} \u4E2A\u53EF\u533A\u5206\u7684\u8BBE\u8BA1\u65B9\u5411\uFF0C\u6BCF\u4E2A\u65B9\u5411\u5355\u72EC\u4E00\u5F20\u56FE\uFF1B\u9700\u8981\u524D\u7AEF\u65F6\u7ED9\u4E00\u4E2A\u53EF\u8FD0\u884C\u7684\u5355\u6587\u4EF6 HTML demo\u3002`,
        "",
        "## \u6210\u529F\u5224\u636E",
        ...topic.successCriteria.map((item) => `- ${item}`),
        "",
        last?.verdict !== void 0 ? `\u4E0A\u4E00\u8F6E\u88C1\u51B3\uFF1A${last.verdict}` : "\u4E0A\u4E00\u8F6E\u88C1\u51B3\uFF1A\u672A\u8BB0\u5F55"
      ].join("\n");
    }
    return [
      `\u7EE7\u7EED\u4E3B\u9898\u300C${topic.title}\u300D\uFF0C\u53EA\u8865\u5145\u672A\u51B3\u90E8\u5206\uFF0C\u4E0D\u8981\u91CD\u590D\u5DF2\u786E\u8BA4\u7ED3\u8BBA\u3002`,
      "",
      "## \u6210\u529F\u5224\u636E",
      ...topic.successCriteria.map((item) => `- ${item}`),
      "",
      last?.verdict !== void 0 ? `\u4E0A\u4E00\u8F6E\u88C1\u51B3\uFF1A${last.verdict}` : "\u4E0A\u4E00\u8F6E\u88C1\u51B3\uFF1A\u672A\u8BB0\u5F55"
    ].join("\n");
  }
  async finishCapped(topic, reason, signal) {
    signal.throwIfAborted();
    delete topic.runThrough;
    delete topic.nextDesigns;
    await this.options.store.writeFinal(topic, this.finalDocument(topic, void 0, reason, "capped"));
    signal.throwIfAborted();
    await this.transition(topic, "capped", { stopReason: reason }, signal);
    signal.throwIfAborted();
    this.emit({ type: "finished", topicId: topic.id, status: "capped" });
  }
  finalCoverage(topic) {
    return { generation: topic.generations?.at(-1)?.n ?? 1, throughRound: topic.rounds.at(-1)?.n ?? 0 };
  }
  matchesFinalCoverage(topic, text) {
    const header = /^<!-- dsh-pro-final: (\{[^\r\n]*\}) -->\r?\n/.exec(text);
    if (header === null) return false;
    try {
      const coverage = JSON.parse(header[1]);
      const current = this.finalCoverage(topic);
      return coverage.generation === current.generation && coverage.throughRound === current.throughRound;
    } catch {
      return false;
    }
  }
  finalDocument(topic, summary, stopReason, status) {
    const rows = topic.rounds.map(
      (round) => `| ${round.n} | ${round.verdict ?? "\u672A\u88C1\u51B3"} | ${round.files} | ${round.submittedAt ?? "\u672A\u63D0\u4EA4"} | ${round.answeredAt ?? "\u672A\u5B8C\u6210"} |`
    );
    return [
      `<!-- dsh-pro-final: ${JSON.stringify(this.finalCoverage(topic))} -->`,
      `# ${topic.title}`,
      "",
      `- \u72B6\u6001\uFF1A${status}`,
      `- \u505C\u6B62\u4F9D\u636E\uFF1A${stopReason}`,
      `- \u901A\u9053\uFF1A${topic.channel}`,
      `- \u8F6E\u6B21\uFF1A${topic.rounds.length}/${topic.roundsCap}`,
      "",
      "## \u6210\u529F\u5224\u636E",
      "",
      ...topic.successCriteria.map((item) => `- ${item}`),
      "",
      "## \u7ED3\u8BBA\u6458\u8981",
      "",
      summary ?? "\uFF08\u672A\u751F\u6210\u6458\u8981\uFF1B\u89C1\u5404\u8F6E\u88C1\u51B3\u4E0E\u539F\u59CB\u7B54\u590D\uFF09",
      "",
      "## \u8F6E\u6B21",
      "",
      "| \u8F6E | \u88C1\u51B3 | \u6587\u4EF6 | \u63D0\u4EA4\u65F6\u95F4 | \u5B8C\u6210\u65F6\u95F4 |",
      "|---|---|---|---|---|",
      ...rows,
      "",
      "## \u4EA7\u7269",
      "",
      ...topic.artifacts.length > 0 ? topic.artifacts.map((item) => `- \`${item}\``) : ["- \uFF08\u65E0\u4EA7\u7269\uFF09"],
      "",
      "## \u539F\u59CB\u7B54\u590D",
      "",
      `\u539F\u59CB\u7B54\u590D\u4FDD\u5B58\u5728 \`rawAnswersDir/${topic.id}/\`\uFF1B\u662F\u5426\u968F\u4ED3\u5E93\u4FDD\u5B58\u7531 \`rawAnswers\` \u914D\u7F6E\u51B3\u5B9A\u3002`,
      ""
    ].join("\n");
  }
  ownsAbortedRun(id, signal) {
    return signal.aborted && (this.runs.get(id)?.controller.signal === signal || this.active?.controller.signal === signal);
  }
  async handleFailure(id, error, signal) {
    if (isAbort(error) || signal.aborted) {
      const cancelled = await this.options.store.load(id).catch(() => void 0);
      const ownsCancellation = this.ownsAbortedRun(id, signal);
      if (cancelled !== void 0 && cancelled.status !== "cancelled" && (ownsCancellation || !["completed", "capped", "reviewing"].includes(cancelled.status))) {
        delete cancelled.reviewFrom;
        delete cancelled.reviewStopReason;
        delete cancelled.reviewStallReason;
        delete cancelled.stopReason;
        const last = latestSubmission(cancelled);
        if (last?.submissionId !== void 0) {
          await this.cancelSubmission(last.submissionId);
        }
        await this.transition(cancelled, "cancelled", void 0, signal);
      }
      return;
    }
    const topic = await this.options.store.load(id);
    if (topic.status === "completed" || topic.status === "cancelled") return;
    if (isTransportError(error)) {
      if (error.failure === "worker") {
        await this.transition(topic, "failed", { stopReason: error.message });
        return;
      }
      const reason = error.failure === "login" || error.failure === "upload" || error.failure === "ui" || error.failure === "config" ? error.failure : "timeout";
      await this.transition(topic, "stalled", { stallReason: reason, stopReason: error.message });
      return;
    }
    await this.transition(topic, "failed", {
      stopReason: error instanceof Error ? error.message : String(error)
    });
  }
  async transition(topic, next, extra, runSignal) {
    if (next !== "cancelled") runSignal?.throwIfAborted();
    const retractCompletion = topic.status === "completed" && next === "cancelled" && runSignal !== void 0 && this.ownsAbortedRun(topic.id, runSignal);
    if (!retractCompletion) assertTransition(topic.status, next);
    topic.status = next;
    if (extra?.stallReason !== void 0) topic.stallReason = extra.stallReason;
    if (extra?.stopReason !== void 0) topic.stopReason = extra.stopReason;
    if (extra?.stopReason === void 0 && (next === "queued" || next === "uploading" || next === "submitted" || next === "waiting" || next === "answered" || next === "adjudicating")) {
      delete topic.stopReason;
    }
    if (next !== "stalled") delete topic.stallReason;
    await this.options.store.save(topic);
    if (next !== "cancelled") runSignal?.throwIfAborted();
    await this.options.store.appendEvent(topic, {
      type: "status",
      status: next,
      ...extra?.stallReason !== void 0 ? { reason: extra.stallReason } : {},
      ...extra?.stopReason !== void 0 ? { stopReason: extra.stopReason } : {}
    }).catch(() => void 0);
    if (next !== "cancelled") runSignal?.throwIfAborted();
    this.emit({
      type: "status",
      topicId: topic.id,
      status: next,
      ...extra?.stallReason !== void 0 ? { reason: extra.stallReason } : {}
    });
  }
  emit(event) {
    this.options.onEvent?.(event);
  }
};

// packages/transport/src/chatgpt.ts
import { createHash as createHash7, randomUUID as randomUUID4 } from "node:crypto";
import { mkdir as mkdir3, readFile as readFile4 } from "node:fs/promises";
import { chromium } from "playwright-core";

// packages/transport/src/selectors.ts
var SELECTORS = {
  turn: '[data-talvt-turn-state], [data-testid^="conversation-turn"], article',
  composer: [
    'div[contenteditable="true"][role="textbox"]',
    'div[contenteditable="true"][data-virtualkeyboard="true"]',
    'form div[contenteditable="true"]',
    "#prompt-textarea",
    'textarea[data-id="root"]'
  ].join(", "),
  sendButton: [
    'button[aria-label="\u53D1\u9001"]',
    'button[aria-label="\u53D1\u9001\u63D0\u793A"]',
    'button[aria-label="\u53D1\u9001\u6D88\u606F"]',
    'button[aria-label="Send"]',
    'button[aria-label="Send message"]',
    'button[aria-label="Send prompt"]',
    '[data-testid="send-button"]',
    'button[data-testid="composer-send-button"]'
  ].join(", "),
  stopButton: [
    'button[aria-label="\u505C\u6B62"]',
    'button[aria-label="\u505C\u6B62\u751F\u6210"]',
    'button[aria-label="\u505C\u6B62\u6D41\u5F0F\u4F20\u8F93"]',
    'button[aria-label="Stop"]',
    'button[aria-label="Stop generating"]',
    'button[aria-label="Stop streaming"]',
    '[data-testid="stop-button"]',
    '[data-testid="composer-stop-button"]'
  ].join(", "),
  copyButton: [
    'button[aria-label="\u590D\u5236"]',
    'button[aria-label="Copy"]',
    'button[aria-label="\u590D\u5236\u56FE\u50CF"]',
    'button[aria-label="Copy image"]',
    '[data-testid="copy-turn-action-button"]'
  ].join(", "),
  assistantMessage: [
    '[data-markdown-text-style="assistant-message"]',
    '[data-message-author-role="assistant"]',
    '[data-testid="generated-image-gallery"]'
  ].join(", "),
  userMessage: [
    '[data-message-author-role="user"]',
    '[data-markdown-text-style="user-message"]',
    '[data-user-message-bubble="true"]'
  ].join(", "),
  // The composer has several file inputs (camera, photos, videos). The general
  // attachment input is the one without an `accept` filter; the camera input
  // rejects multiple files.
  fileInput: [
    'input[type="file"][aria-label="\u9644\u52A0\u6587\u4EF6"]',
    'input[type="file"][aria-label*="Attach" i]:not([capture])',
    'form input[type="file"][multiple]:not([accept]):not([capture])',
    'input[type="file"][multiple]:not([accept]):not([capture])'
  ].join(", "),
  modelPicker: [
    'button[aria-label*="\u9009\u62E9 ChatGPT \u6A21\u578B"]',
    'button[aria-label*="\u6A21\u578B"]',
    '[data-testid="model-switcher-dropdown-button"]'
  ].join(", "),
  loginLink: 'a[href*="auth/login"], button[data-testid="login-button"]'
};

// packages/transport/src/completion.ts
function advanceCompletion(previous, text, streaming) {
  if (streaming || text === "") {
    return { lastText: previous.lastText, stable: 0, answered: false };
  }
  if (text === previous.lastText) {
    const stable = previous.stable + 1;
    return { lastText: text, stable, answered: stable >= 2 };
  }
  return { lastText: text, stable: 1, answered: false };
}

// packages/transport/src/assets.ts
function parseDataUrlImage(source) {
  const match = /^data:([^;,]+);base64,(.*)$/s.exec(source);
  if (match === null) return void 0;
  const mime = match[1];
  const base64 = match[2];
  if (mime === void 0 || base64 === void 0) return void 0;
  return { mime, base64: base64.replace(/\s/g, "") };
}
function detectImageMime(bytes) {
  if (bytes.length >= 8 && bytes[0] === 137 && bytes[1] === 80 && bytes[2] === 78 && bytes[3] === 71) return "image/png";
  if (bytes.length >= 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return "image/jpeg";
  if (bytes.length >= 12 && String.fromCharCode(...bytes.subarray(0, 4)) === "RIFF" && String.fromCharCode(...bytes.subarray(8, 12)) === "WEBP") return "image/webp";
  if (bytes.length >= 6 && String.fromCharCode(...bytes.subarray(0, 3)) === "GIF" && bytes[3] === 56) return "image/gif";
  return void 0;
}
var MAX_IMAGE_ASSET_BYTES = 50 * 1024 * 1024;

// packages/transport/src/serialize.ts
var SerialGate = class {
  tail = Promise.resolve();
  exec(task) {
    const run = this.tail.then(task, task);
    this.tail = run.then(() => void 0, () => void 0);
    return run;
  }
};

// packages/transport/src/page-state.ts
async function firstVisible(page, selector, timeoutMs) {
  const locator = page.locator(selector).filter({ visible: true }).first();
  try {
    await locator.waitFor({ state: "visible", timeout: timeoutMs });
    return locator;
  } catch {
    return void 0;
  }
}
async function readUserTurns(page) {
  return await page.evaluate((selector) => {
    const nodes = [...document.querySelectorAll(selector)];
    return nodes.filter((node) => !nodes.some((parent) => parent !== node && parent.contains(node))).map((node) => node.innerText.trim());
  }, SELECTORS.userMessage);
}
async function readTurnState(page, baseline, userBaseline) {
  return await page.evaluate(({ selectors, baseline: baseline2, userBaseline: userBaseline2 }) => {
    const visible = (node) => {
      const style = getComputedStyle(node);
      return style.display !== "none" && style.visibility !== "hidden" && node.getClientRects().length > 0;
    };
    const all = [...document.querySelectorAll(selectors.assistantMessage)];
    const userNodes = [...document.querySelectorAll(selectors.userMessage)];
    const users = userNodes.filter((node) => !userNodes.some((parent) => parent !== node && parent.contains(node)));
    const prompt = userBaseline2 === void 0 ? void 0 : users[userBaseline2];
    const nextUser = userBaseline2 === void 0 ? void 0 : users[userBaseline2 + 1];
    const candidates = all.slice(baseline2).filter((node) => node.closest(selectors.userMessage) === null && (prompt === void 0 || (prompt.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0) && (nextUser === void 0 || (node.compareDocumentPosition(nextUser) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0));
    const messages = candidates.filter((node) => !candidates.some((parent) => parent !== node && parent.contains(node)));
    const last = messages.at(-1);
    const root = last?.closest(selectors.turn) ?? last;
    const errorRoot = prompt?.closest(selectors.turn) ?? root;
    const renderFailed = errorRoot !== void 0 && errorRoot !== null && [...errorRoot.querySelectorAll("[data-dil-render-failed]")].some((node) => visible(node) && node.closest(`${selectors.userMessage}, pre, code`) === null && (nextUser === void 0 || (node.compareDocumentPosition(nextUser) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0));
    const streaming = [...document.querySelectorAll(selectors.stopButton)].some(visible) || root !== void 0 && [...root.querySelectorAll('[aria-busy="true"], [data-is-streaming="true"]')].some(visible) || root?.matches('[aria-busy="true"], [data-is-streaming="true"]') === true;
    const terminal = root !== void 0 && [...root.querySelectorAll(selectors.copyButton)].some((button) => {
      if (!visible(button) || button.closest("pre, code") !== null) return false;
      if (button.closest(selectors.userMessage) !== null) return false;
      if (button.getAttribute("data-testid") === "copy-turn-action-button") return true;
      for (let parent = button.parentElement; parent !== null && parent !== root; parent = parent.parentElement) {
        if (parent.querySelector("pre, code") !== null) return false;
      }
      return root !== last && !messages.some((message) => message.contains(button));
    });
    return {
      // A gallery's Edit button is UI, not an assistant's answer.
      text: messages.filter((node) => !node.matches('[data-testid="generated-image-gallery"]')).map((node) => node.innerText.trim()).filter(Boolean).join("\n\n"),
      streaming,
      ...renderFailed ? { renderFailed: true } : {},
      terminal: !streaming && terminal && (!root?.hasAttribute("data-talvt-turn-state") || root.getAttribute("data-talvt-turn-state") === "complete"),
      assistantCount: all.length,
      messageIndex: last === void 0 ? -1 : all.indexOf(last)
    };
  }, { selectors: SELECTORS, baseline, userBaseline });
}

// packages/transport/src/chatgpt.ts
var CHROME_CHANNEL = "chrome";
function sha256(value) {
  return createHash7("sha256").update(value, "utf8").digest("hex");
}
function normalizePrompt(text) {
  return text.replace(/```[\s\S]*?```/g, " ").replace(/[#>*_`|~]/g, " ").replace(/\s+/g, " ").trim();
}
function briefMarkers(brief) {
  const text = normalizePrompt(brief);
  if (text === "") return [];
  const sentences = text.split(/[。！？!?；;\n]/).map((item) => item.trim()).filter((item) => item.length >= 8);
  const candidates = [.../* @__PURE__ */ new Set([...sentences, text])].sort((left, right) => right.length - left.length).map((item) => item.slice(0, 80));
  return candidates.slice(0, 3);
}
function extensionFor(mime) {
  if (mime.includes("jpeg")) return "jpg";
  if (mime.includes("webp")) return "webp";
  if (mime.includes("gif")) return "gif";
  if (mime.includes("svg")) return "svg";
  return "png";
}
function isAborted(signal) {
  return signal?.aborted === true;
}
var ChatGptWebTransport = class {
  context;
  launching;
  submissions = /* @__PURE__ */ new Map();
  /** One visible tab per topic so later rounds update the same conversation. */
  topicPages = /* @__PURE__ */ new Map();
  options;
  /**
   * Serializes submit/reattach across every engine that shares this transport
   * (both plugins, every project root). Poll/fetch/cancel stay concurrent.
   * The worst-case wait behind one submit is bounded by its own timeouts.
   */
  gate = new SerialGate();
  constructor(options) {
    this.options = options;
  }
  get appUrl() {
    return this.options.appUrl ?? "https://chatgpt.com/";
  }
  async ensureContext() {
    if (this.context !== void 0) return this.context;
    if (this.launching !== void 0) return this.launching;
    this.launching = this.launchContext();
    try {
      return await this.launching;
    } finally {
      this.launching = void 0;
    }
  }
  async launchContext() {
    await mkdir3(this.options.profileDir, { recursive: true });
    const base = {
      headless: this.options.headless ?? false,
      acceptDownloads: true,
      viewport: { width: 1440, height: 960 },
      args: ["--disable-blink-features=AutomationControlled"]
    };
    try {
      const context = await chromium.launchPersistentContext(this.options.profileDir, { ...base, channel: CHROME_CHANNEL });
      context.on("close", () => {
        if (this.context === context) this.context = void 0;
      });
      this.context = context;
      return context;
    } catch (error) {
      throw new TransportError(
        `cannot launch Google Chrome with profile ${this.options.profileDir}; install Google Chrome (the web channel has no Edge/Chromium fallback). ${error instanceof Error ? error.message : String(error)}`,
        "worker",
        { cause: error }
      );
    }
  }
  async probe() {
    const context = await this.ensureContext();
    const page = await context.newPage();
    try {
      await page.goto(this.appUrl, { waitUntil: "domcontentloaded", timeout: 6e4 });
      const composer = await firstVisible(page, SELECTORS.composer, 2e4);
      if (composer === void 0) {
        const login = await firstVisible(page, SELECTORS.loginLink, 2e3);
        return {
          ok: false,
          loggedIn: false,
          model: "",
          available: [],
          reason: login === void 0 ? "composer not found; the page may still be loading or its UI changed" : "not logged in: the ChatGPT login link is visible"
        };
      }
      const model = await this.readModel(page);
      return { ok: true, loggedIn: true, model, available: model === "" ? [] : [model] };
    } catch (error) {
      throw new TransportError(`probe failed: ${error instanceof Error ? error.message : String(error)}`, "network", { cause: error });
    } finally {
      await page.close().catch(() => void 0);
    }
  }
  /** Interactive first login: opens the window and waits for the composer. */
  async login(timeoutMs = this.options.loginTimeoutMs ?? 3e5) {
    const context = await this.ensureContext();
    const page = await context.newPage();
    await page.goto(this.appUrl, { waitUntil: "domcontentloaded", timeout: 6e4 });
    const composer = await firstVisible(page, SELECTORS.composer, timeoutMs);
    if (composer === void 0) {
      throw new TransportError("login was not completed before the timeout", "login");
    }
    await page.close();
    return { ok: true };
  }
  /** Wait until the message list stops growing (old history may load after DOM ready). */
  async settleMessages(page) {
    let previous = -1;
    for (let attempt = 0; attempt < 10; attempt += 1) {
      const count = await page.locator(SELECTORS.assistantMessage).count().catch(() => 0);
      if (count === previous) return;
      previous = count;
      await page.waitForTimeout(300);
    }
  }
  /**
   * A submit is only accepted when something new appeared after the click:
   * preferably a new user turn matching the brief, otherwise a new assistant
   * turn (some DOM versions hide the user role). This is what prevents the
   * previous answer from being mistaken for the current round.
   */
  async waitForNewTurn(page, userBaseline, assistantBaseline, brief, timeoutMs = 6e4) {
    const markers = briefMarkers(brief);
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      const users = await readUserTurns(page);
      const userCount = users.length;
      if (userCount > userBaseline) {
        const text = normalizePrompt(users[userCount - 1] ?? "");
        if (markers.length === 0 || markers.some((marker) => text.includes(marker))) return true;
      }
      const assistantCount = await page.locator(SELECTORS.assistantMessage).count().catch(() => 0);
      if (assistantCount > assistantBaseline) return true;
      await page.waitForTimeout(500);
    }
    return false;
  }
  /**
   * For a cold reattach: locate the user turn that matches this round and count
   * the assistant nodes that precede it. The after-turn assistant (if already
   * present) is included by poll/fetch, bounded by the next user turn.
   * An ambiguous prompt match (shared boilerplate across rounds) is
   * refused rather than guessed.
   */
  async baselinesForPrompt(page, brief) {
    const markers = briefMarkers(brief);
    if (markers.length === 0) return void 0;
    const result = await page.evaluate(({ userSelector, assistantSelector, markers: markers2 }) => {
      const userNodes = [...document.querySelectorAll(userSelector)];
      const users = userNodes.filter((node) => !userNodes.some((parent) => parent !== node && parent.contains(node)));
      const matches = users.filter((node) => {
        const text = (node.textContent ?? "").replace(/```[\s\S]*?```/g, " ").replace(/[#>*_`|~]/g, " ").replace(/\s+/g, " ").trim();
        return markers2.some((marker) => text.includes(marker));
      });
      if (matches.length !== 1) return void 0;
      const target = matches[0];
      const assistants = [...document.querySelectorAll(assistantSelector)];
      return {
        assistant: assistants.filter((node) => (node.compareDocumentPosition(target) & 4) !== 0).length,
        user: users.indexOf(target)
      };
    }, { userSelector: SELECTORS.userMessage, assistantSelector: SELECTORS.assistantMessage, markers });
    return result === void 0 ? void 0 : { assistantBaseline: result.assistant, userBaseline: result.user };
  }
  async submit(request) {
    if (isAborted(request.signal)) throw new DOMException("aborted", "AbortError");
    return await this.gate.exec(() => this.submitNow(request));
  }
  async submitNow(request) {
    if (isAborted(request.signal)) throw new DOMException("aborted", "AbortError");
    let page;
    let sendAttempted = false;
    try {
      const context = await this.ensureContext();
      const existing = this.topicPages.get(request.topicId);
      page = existing !== void 0 && !existing.isClosed() ? existing : await context.newPage();
      this.topicPages.set(request.topicId, page);
      const target = request.session?.conversationUrl ?? this.appUrl;
      let reused = request.session?.conversationUrl !== void 0;
      if (page.url() !== target) await page.goto(target, { waitUntil: "domcontentloaded", timeout: 6e4 });
      let composer = await firstVisible(page, SELECTORS.composer, 3e4);
      if (composer === void 0 && reused) {
        reused = false;
        await page.goto(this.appUrl, { waitUntil: "domcontentloaded", timeout: 6e4 });
        composer = await firstVisible(page, SELECTORS.composer, 3e4);
      }
      if (composer === void 0) throw new TransportError("composer not found; the session is probably logged out", "login");
      await this.settleMessages(page);
      await this.waitForReady(page, request.signal);
      const assistantBaseline = await page.locator(SELECTORS.assistantMessage).count().catch(() => 0);
      const userBaseline = (await readUserTurns(page)).length;
      if (isAborted(request.signal)) throw new DOMException("aborted", "AbortError");
      const model = await this.selectModel(page, request.model);
      const attachmentsToSend = reused ? request.files : request.fallbackFiles ?? request.files;
      if (attachmentsToSend.length > 0) {
        const input = page.locator(SELECTORS.fileInput).first();
        try {
          await input.setInputFiles(attachmentsToSend, { timeout: 6e4 });
        } catch (error) {
          throw new TransportError(`cannot attach materials: ${error instanceof Error ? error.message : String(error)}`, "upload", { cause: error });
        }
        await this.waitForAttachmentCards(page, attachmentsToSend);
      }
      if (isAborted(request.signal)) throw new DOMException("aborted", "AbortError");
      await composer.fill(request.brief);
      const send = await firstVisible(page, SELECTORS.sendButton, 15e3);
      if (send === void 0) {
        const composerText = await composer.inputValue().catch(() => composer.innerText()).catch(() => "");
        const state = await readTurnState(page, assistantBaseline);
        if (process.env.DSH_PRO_DEBUG === "1") {
          console.error("dsh-pro: send button not found", JSON.stringify({ composerChars: composerText.length, streaming: state.streaming }));
        }
        throw new TransportError(`send button not found (composer ${composerText.length} chars; streaming=${state.streaming}); message was not sent; browser kept open for inspection`, "ui");
      }
      const enabledDeadline = Date.now() + 12e4;
      while (!await send.isEnabled()) {
        if (isAborted(request.signal)) throw new DOMException("aborted", "AbortError");
        if (Date.now() >= enabledDeadline) {
          throw new TransportError("send button stayed disabled; attachments or the page may still be processing; message was not sent", attachmentsToSend.length > 0 ? "upload" : "ui");
        }
        await page.waitForTimeout(250);
      }
      if ((await readTurnState(page, assistantBaseline)).streaming) {
        throw new TransportError("previous response is still generating; follow-up was not sent", "ui");
      }
      if (isAborted(request.signal)) throw new DOMException("aborted", "AbortError");
      sendAttempted = true;
      await send.click();
      const conversationUrl = await this.waitForConversationUrl(page, 2e4);
      const newTurn = await this.waitForNewTurn(page, userBaseline, assistantBaseline, request.brief);
      if (!newTurn) {
        throw new TransportError("send did not produce a new user/assistant turn; the click may not have been accepted", "ui");
      }
      const attachments = attachmentsToSend.map((file) => file.split(/[\\/]/).pop() ?? file);
      const submissionId = randomUUID4();
      const fingerprint = sha256(`${conversationUrl}
${request.brief}
${attachments.join("\n")}`);
      this.submissions.set(submissionId, {
        page,
        request,
        startedAt: Date.now(),
        lastText: "",
        stable: 0,
        assistantBaseline,
        userBaseline
      });
      return { submissionId, fingerprint, attachments, conversationUrl, model };
    } catch (error) {
      if (error instanceof Error && (error.name === "AbortError" || error.message === "aborted")) {
        await page?.close().catch(() => void 0);
        throw error;
      }
      throw new TransportError(
        isTransportError(error) ? error.message : `submit failed: ${error instanceof Error ? error.message : String(error)}`,
        isTransportError(error) ? error.failure : "network",
        { cause: error, submissionState: sendAttempted ? "unknown" : "not_sent" }
      );
    }
  }
  /**
   * Adopt an already-sent round after a restart. The prompt text is the proof:
   * if it is not in the stored conversation, this round was never submitted.
   */
  async reattach(request) {
    return await this.gate.exec(() => this.reattachNow(request));
  }
  async reattachNow(request) {
    const context = await this.ensureContext();
    const existing = this.topicPages.get(request.topicId);
    const page = existing !== void 0 && !existing.isClosed() ? existing : await context.newPage();
    this.topicPages.set(request.topicId, page);
    try {
      if (page.url() !== request.conversationUrl) await page.goto(request.conversationUrl, { waitUntil: "domcontentloaded", timeout: 6e4 });
      const composer = await firstVisible(page, SELECTORS.composer, 3e4);
      if (composer === void 0) return { attached: false };
      await this.settleMessages(page);
      const baselines = await this.baselinesForPrompt(page, request.brief);
      if (baselines === void 0) return { attached: false };
      const submissionId = randomUUID4();
      this.submissions.set(submissionId, {
        page,
        request: {
          topicId: request.topicId,
          round: request.round,
          brief: request.brief,
          files: [],
          model: "",
          session: { conversationUrl: request.conversationUrl, profileDir: this.options.profileDir }
        },
        startedAt: Date.now(),
        lastText: "",
        stable: 0,
        assistantBaseline: baselines.assistantBaseline,
        userBaseline: baselines.userBaseline
      });
      return { attached: true, submissionId };
    } catch (error) {
      throw new TransportError(
        `reattach failed: ${error instanceof Error ? error.message : String(error)}`,
        "network",
        { cause: error }
      );
    }
  }
  async poll(request) {
    const submission = this.submissions.get(request.submissionId);
    if (submission === void 0) return { state: "unknown" };
    if (isAborted(request.signal)) throw new DOMException("aborted", "AbortError");
    const page = submission.page;
    if (page.isClosed()) return { state: "unknown" };
    const deadline = Date.now() + Math.max(1e3, request.timeoutMs);
    let progressed = false;
    let diagnostic = "";
    try {
      while (Date.now() < deadline) {
        if (isAborted(request.signal)) throw new DOMException("aborted", "AbortError");
        if (page.isClosed()) return { state: "unknown" };
        const state = await readTurnState(page, submission.assistantBaseline, submission.userBaseline);
        if (state.renderFailed) throw new TransportError("ChatGPT \u65E0\u6CD5\u52A0\u8F7D\u6B64\u56DE\u590D\uFF1B\u539F\u4F1A\u8BDD\u5DF2\u4FDD\u7559\uFF0C\u8BF7\u68C0\u67E5\u7F51\u9875\u540E\u6062\u590D\uFF0C\u95EE\u9898\u4E0D\u4F1A\u81EA\u52A8\u91CD\u53D1", "ui");
        diagnostic = `assistantBlocks=${state.assistantCount - submission.assistantBaseline}; answerChars=${state.text.length}; streaming=${state.streaming}; terminal=${state.terminal}`;
        const streaming = state.streaming;
        if (streaming) progressed = true;
        const text = streaming ? "" : state.text || await this.richAnswerText(page, submission.assistantBaseline, state.messageIndex);
        const next = advanceCompletion(
          { lastText: submission.lastText, stable: submission.stable },
          text,
          streaming
        );
        if (next.lastText !== submission.lastText) progressed = true;
        submission.lastText = next.lastText;
        submission.stable = next.stable;
        if (next.answered && state.terminal) {
          return { state: "answered", answer: next.lastText };
        }
        await page.waitForTimeout(3e3);
      }
      return { state: "waiting", diagnostic, ...progressed ? { progress: true } : {} };
    } catch (error) {
      if (isAborted(request.signal)) throw error;
      if (page.isClosed()) return { state: "unknown" };
      if (isTransportError(error)) throw error;
      throw new TransportError(
        `poll failed: ${error instanceof Error ? error.message : String(error)}`,
        "network",
        { cause: error }
      );
    }
  }
  async fetch(request) {
    const submission = this.submissions.get(request.submissionId);
    if (submission === void 0) throw new TransportError("unknown submission", "ui");
    if (submission.page.isClosed()) throw new TransportError("conversation page is closed", "ui");
    const page = submission.page;
    const state = await readTurnState(page, submission.assistantBaseline, submission.userBaseline);
    if (state.renderFailed) throw new TransportError("ChatGPT \u65E0\u6CD5\u52A0\u8F7D\u6B64\u56DE\u590D\uFF1B\u8BF7\u68C0\u67E5\u539F\u4F1A\u8BDD\u540E\u6062\u590D", "ui");
    if (!state.terminal) throw new TransportError("answer completion is not confirmed; keep waiting for this turn to finish", "ui", { answerIncomplete: true });
    const answer = state.text;
    const images = await this.collectImages(page, submission.assistantBaseline, state.messageIndex);
    const codeBlocks = await this.collectCodeBlocks(page, submission.assistantBaseline, state.messageIndex);
    const archives = await this.collectArchives(page, submission.assistantBaseline, state.messageIndex);
    if (answer === "" && images.length === 0 && codeBlocks.length === 0 && archives.length === 0) {
      throw new TransportError("no new assistant answer for this round", "ui");
    }
    return {
      answer,
      ...images.length > 0 ? { images } : {},
      ...codeBlocks.length > 0 ? { codeBlocks } : {},
      ...archives.length > 0 ? { archives } : {}
    };
  }
  /** Large images in the answer; blob URLs are read in-page, https through cookies. */
  async collectImages(page, baseline, messageIndex) {
    const sources = await page.evaluate(({ selector, turnSelector, userSelector, baseline: baseline2, messageIndex: messageIndex2 }) => {
      const seen = /* @__PURE__ */ new Set();
      const out = [];
      const messages = [...document.querySelectorAll(selector)];
      if (messages.length <= baseline2) return out;
      const last = messages[messageIndex2];
      const root = last?.closest(turnSelector) ?? last;
      if (root === null || root === void 0) return out;
      for (const image of root.querySelectorAll("img")) {
        const element = image;
        if (element.naturalWidth < 300 || element.naturalHeight < 300) continue;
        if (element.closest("form") !== null || element.closest(userSelector) !== null) continue;
        if (element.src !== "" && !seen.has(element.src)) {
          seen.add(element.src);
          out.push(element.src);
        }
      }
      return out;
    }, { selector: SELECTORS.assistantMessage, turnSelector: SELECTORS.turn, userSelector: SELECTORS.userMessage, baseline, messageIndex });
    const images = [];
    for (const [index, source] of sources.slice(0, 8).entries()) {
      try {
        if (source.startsWith("data:")) {
          const parsed = parseDataUrlImage(source);
          if (parsed === void 0) continue;
          const bytes = Buffer.from(parsed.base64, "base64");
          if (bytes.byteLength < 2e4 || bytes.byteLength > MAX_IMAGE_ASSET_BYTES) continue;
          images.push({
            name: `image-${String(index + 1).padStart(2, "0")}.${extensionFor(parsed.mime)}`,
            mime: parsed.mime,
            base64: parsed.base64
          });
          continue;
        }
        if (source.startsWith("blob:")) {
          const dataUrl = await page.evaluate(async (src) => {
            const response = await fetch(src);
            const blob = await response.blob();
            if (blob.size > 50 * 1024 * 1024) return "";
            return await new Promise((resolve7, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve7(String(reader.result));
              reader.onerror = () => reject(reader.error);
              reader.readAsDataURL(blob);
            });
          }, source);
          const match = /^data:([^;,]+);base64,(.*)$/s.exec(dataUrl);
          if (match === null) continue;
          const mime = match[1];
          const base64 = match[2].replace(/\s/g, "");
          if (Buffer.from(base64, "base64").byteLength > MAX_IMAGE_ASSET_BYTES) continue;
          images.push({
            name: `image-${String(index + 1).padStart(2, "0")}.${extensionFor(mime)}`,
            mime,
            base64
          });
        } else {
          const response = await page.request.get(source);
          if (!response.ok()) continue;
          const declared = Number(response.headers()["content-length"] ?? "");
          if (Number.isFinite(declared) && declared > MAX_IMAGE_ASSET_BYTES) continue;
          const bytes = await response.body();
          if (bytes.byteLength > MAX_IMAGE_ASSET_BYTES || bytes.byteLength < 1024) continue;
          const headerMime = (response.headers()["content-type"] ?? "").split(";")[0]?.trim() ?? "";
          const mime = detectImageMime(bytes) ?? (headerMime.startsWith("image/") ? headerMime : void 0);
          if (mime === void 0) continue;
          images.push({
            name: `image-${String(index + 1).padStart(2, "0")}.${extensionFor(mime)}`,
            mime,
            base64: bytes.toString("base64")
          });
        }
      } catch {
      }
    }
    return images;
  }
  async collectCodeBlocks(page, baseline, messageIndex) {
    return await page.evaluate(({ selector, turnSelector, userSelector, baseline: baseline2, messageIndex: messageIndex2 }) => {
      const messages = [...document.querySelectorAll(selector)];
      if (messages.length <= baseline2) return [];
      const last = messages[messageIndex2];
      const root = last?.closest(turnSelector) ?? last;
      if (root === null || root === void 0) return [];
      const filePattern = /([\w.-]+\.(?:html?|css|jsx?|tsx?|json|md|py|vue|svelte|sh|ya?ml))/i;
      const nameOf = (code) => {
        const pre = code.closest("pre");
        const header = pre?.parentElement;
        const candidates = [
          code.getAttribute("data-filename"),
          code.getAttribute("data-file-name"),
          pre?.getAttribute("data-filename"),
          pre?.getAttribute("data-file-name"),
          pre?.getAttribute("title"),
          header?.querySelector('[data-filename], [data-file-name], [class*="filename" i]')?.textContent ?? "",
          (pre?.previousElementSibling?.textContent ?? "").trim(),
          (code.textContent ?? "").split("\n")[0] ?? ""
        ];
        for (const candidate of candidates) {
          if (candidate == null || candidate === "") continue;
          const match = filePattern.exec(candidate);
          if (match !== null) return match[1] ?? "";
        }
        return "";
      };
      return [...root.querySelectorAll("pre code")].filter((code) => code.closest("form") === null && code.closest(userSelector) === null).slice(0, 20).map((code) => ({
        language: /language-([\w-]+)/.exec(code.className)?.[1] ?? "",
        name: nameOf(code),
        text: code.textContent ?? ""
      })).filter((block) => block.text.trim() !== "");
    }, { selector: SELECTORS.assistantMessage, turnSelector: SELECTORS.turn, userSelector: SELECTORS.userMessage, baseline, messageIndex });
  }
  /** Download zip links rendered in the assistant answer (code interpreter downloads). */
  async collectArchives(page, baseline, messageIndex) {
    const links = await page.evaluate(({ selector, turnSelector, userSelector, baseline: baseline2, messageIndex: messageIndex2 }) => {
      const messages = [...document.querySelectorAll(selector)];
      if (messages.length <= baseline2) return [];
      const last = messages[messageIndex2];
      const root = last?.closest(turnSelector) ?? last;
      if (root === null || root === void 0) return [];
      const controls = [...root.querySelectorAll('a[href], button, [role="button"]')].filter((element) => element.closest("form") === null && element.closest(userSelector) === null);
      const picked = [];
      for (const control of controls) {
        const element = control;
        const href = element instanceof HTMLAnchorElement ? element.href : "";
        const label = (element.getAttribute("download") ?? element.textContent ?? "").trim();
        const context = (element.closest("div, li, article")?.textContent ?? "").slice(0, 300);
        const downloadable = label.toLowerCase().includes(".zip") || href.toLowerCase().includes(".zip") || /download|下载|zip/i.test(label) && context.toLowerCase().includes(".zip");
        if (!downloadable) continue;
        const marker = `[data-dsh-zip="${picked.length}"]`;
        element.setAttribute("data-dsh-zip", String(picked.length));
        picked.push({
          href,
          label,
          marker,
          local: href === "" || !/^(?:https?|blob|data):/i.test(href)
        });
        if (picked.length >= 3) break;
      }
      return picked;
    }, { selector: SELECTORS.assistantMessage, turnSelector: SELECTORS.turn, userSelector: SELECTORS.userMessage, baseline, messageIndex });
    const archives = [];
    for (const link of links) {
      try {
        let encoded = "";
        let name2 = (link.label !== "" ? link.label : link.href.split("/").pop() ?? "archive.zip").replace(/[^\w.-]/g, "_");
        if (link.local) {
          const [download] = await Promise.all([
            page.waitForEvent("download", { timeout: 1e4 }),
            page.locator(link.marker).click()
          ]);
          const temp = await download.path();
          if (temp === null) throw new Error("download had no local file");
          const bytes = await readFile4(temp);
          if (bytes.length > 50 * 1024 * 1024) throw new Error("zip is larger than 50 MB");
          encoded = bytes.toString("base64");
          name2 = download.suggestedFilename().replace(/[^\w.-]/g, "_");
        } else {
          encoded = await page.evaluate(async (href) => {
            const response = await fetch(href);
            if (!response.ok) throw new Error(`zip download failed: ${response.status}`);
            const bytes = new Uint8Array(await response.arrayBuffer());
            if (bytes.byteLength > 50 * 1024 * 1024) throw new Error("zip is larger than 50 MB");
            let binary = "";
            for (let index = 0; index < bytes.length; index += 32768) {
              binary += String.fromCharCode(...bytes.subarray(index, index + 32768));
            }
            return btoa(binary);
          }, link.href);
        }
        archives.push({ name: name2.endsWith(".zip") ? name2 : `${name2}.zip`, base64: String(encoded) });
      } catch {
      }
    }
    await page.evaluate(() => document.querySelectorAll("[data-dsh-zip]").forEach((node) => node.removeAttribute("data-dsh-zip"))).catch(() => void 0);
    return archives;
  }
  async cancelSubmission(submissionId) {
    const submission = this.submissions.get(submissionId);
    if (submission === void 0) return;
    this.submissions.delete(submissionId);
    for (const [topicId, page] of this.topicPages) {
      if (page === submission.page) this.topicPages.delete(topicId);
    }
    await submission.page.close().catch(() => void 0);
  }
  async cancel() {
    const pages = /* @__PURE__ */ new Set([
      ...[...this.submissions.values()].map((submission) => submission.page),
      ...this.topicPages.values()
    ]);
    for (const page of pages) {
      await page.close().catch(() => void 0);
    }
    this.submissions.clear();
    this.topicPages.clear();
  }
  async close() {
    await this.cancel();
    await this.context?.close().catch(() => void 0);
    this.context = void 0;
  }
  async waitForConversationUrl(page, timeoutMs) {
    const isConversation = (value) => {
      try {
        const url = new URL(value);
        return /^\/c\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(url.pathname);
      } catch {
        return false;
      }
    };
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      const url = page.url();
      if (isConversation(url)) return url;
      if (this.options.appUrl !== void 0) return url;
      await page.waitForTimeout(500);
    }
    throw new TransportError("new conversation URL was not observed; the message may not have been sent", "ui");
  }
  async readModel(page) {
    const picker = await firstVisible(page, SELECTORS.modelPicker, 2e3);
    if (picker === void 0) return "";
    return (await picker.innerText().catch(() => "")).trim();
  }
  async selectModel(page, model) {
    const wanted = model.trim();
    if (wanted === "" || /^auto$/i.test(wanted)) return await this.readModel(page);
    const preferPro = /^prefer-pro$/i.test(wanted);
    const requested = preferPro ? "pro" : wanted;
    const picker = await firstVisible(page, SELECTORS.modelPicker, 2e3);
    const hint = "set model=prefer-pro in the plugin settings and start a new topic to prefer Pro when available and otherwise use the current model (existing topics keep their model)";
    if (picker === void 0) {
      if (preferPro) return "";
      throw new TransportError(`cannot verify requested ChatGPT model: ${wanted}; message was not sent; ${hint}`, "ui");
    }
    const pattern = /^pro$/i.test(requested) ? /\bpro\b/i : /^thinking$/i.test(requested) ? /pro|思考|thinking/i : new RegExp(requested.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    const current = (await picker.innerText()).trim();
    const upgradeLabel = /upgrade|unlock|subscribe|升级|解锁|订阅|购买/i;
    if (pattern.test(current) && !upgradeLabel.test(current)) return current;
    let availableOption = false;
    try {
      await picker.click({ timeout: 3e3 });
      const options = page.locator('[role="menuitem"], [role="menuitemradio"], [role="option"]').filter({ hasText: pattern }).filter({ visible: true });
      await options.first().waitFor({ state: "visible", timeout: 3e3 }).catch(() => void 0);
      for (const option of await options.all()) {
        if (!await option.isEnabled()) continue;
        const available = await option.evaluate((node) => {
          const disabled = node.closest('[aria-disabled="true"], [data-disabled]:not([data-disabled="false"]), [data-locked="true"]');
          const label = `${node.textContent ?? ""} ${node.getAttribute("aria-label") ?? ""} ${node.getAttribute("title") ?? ""}`;
          const upgrade = /upgrade|unlock|subscribe|升级|解锁|订阅|购买/i.test(label);
          const upgradeLink = 'a[href*="upgrade" i], a[href*="pricing" i], a[href*="subscribe" i]';
          return disabled === null && !upgrade && !node.matches(upgradeLink) && node.querySelector(upgradeLink) === null;
        });
        if (!available) continue;
        availableOption = true;
        await option.click({ timeout: 3e3 });
        break;
      }
    } catch (error) {
      throw new TransportError(`cannot select requested ChatGPT model ${requested}; message was not sent; ${hint}`, "ui", { cause: error });
    } finally {
      await page.keyboard.press("Escape").catch(() => void 0);
    }
    const selected = await this.readModel(page);
    if (preferPro && !availableOption) return selected;
    if (!pattern.test(selected) || upgradeLabel.test(selected)) throw new TransportError(`requested ChatGPT model ${requested} was not selected (observed: ${selected || "unknown"}); message was not sent; ${hint}`, "ui");
    return selected;
  }
  async waitForReady(page, signal) {
    const deadline = Date.now() + (this.options.readyTimeoutMs ?? 6e4);
    do {
      if (isAborted(signal)) throw new DOMException("aborted", "AbortError");
      const count = await page.locator(SELECTORS.assistantMessage).count();
      const users = (await readUserTurns(page)).length;
      const state = await readTurnState(page, Math.max(0, count - 1), users - 1);
      if (!state.streaming && (count === 0 && users === 0 || state.terminal)) return;
      await page.waitForTimeout(500);
    } while (Date.now() < deadline);
    throw new TransportError("previous response is still generating or its completion cannot be verified; follow-up was not sent; wait for completion and resume", "ui");
  }
  async waitForAttachmentCards(page, files) {
    for (const file of files) {
      const name2 = file.split(/[\\/]/).pop() ?? file;
      const stem = name2.replace(/\.[^.]+$/, "");
      const needle = stem.length >= 3 ? stem : name2;
      const card = page.locator("form").getByText(needle, { exact: false }).first();
      try {
        await card.waitFor({ state: "visible", timeout: 12e4 });
      } catch (error) {
        throw new TransportError(`attachment card missing for ${name2}`, "upload", { cause: error });
      }
    }
  }
  async richAnswerText(page, baseline, messageIndex) {
    const fingerprint = await page.evaluate(({ selector, turnSelector, userSelector, baseline: baseline2, messageIndex: messageIndex2 }) => {
      const messages = [...document.querySelectorAll(selector)];
      if (messages.length <= baseline2) return { images: [], codeLength: 0 };
      const last = messages[messageIndex2];
      const root = last?.closest(turnSelector) ?? last;
      if (root === null || root === void 0) return { images: [], codeLength: 0 };
      const images = [...root.querySelectorAll("img")].filter((image) => image.naturalWidth >= 300 && image.closest(userSelector) === null).map((image) => `${image.naturalWidth}x${image.naturalHeight}`);
      const codeLength = [...root.querySelectorAll("pre code")].filter((code) => code.closest("form") === null && code.closest(userSelector) === null).reduce((sum, code) => sum + (code.textContent?.length ?? 0), 0);
      return { images, codeLength };
    }, { selector: SELECTORS.assistantMessage, turnSelector: SELECTORS.turn, userSelector: SELECTORS.userMessage, baseline, messageIndex });
    if (fingerprint.images.length > 0) return `image:${fingerprint.images.length}:${fingerprint.images.join(",")}`;
    return fingerprint.codeLength > 0 ? `code:${fingerprint.codeLength}` : "";
  }
};

// packages/transport/src/openai-images.ts
import { createHash as createHash8, randomUUID as randomUUID5 } from "node:crypto";
import { readFile as readFile5 } from "node:fs/promises";
import { basename as basename3, extname as extname2 } from "node:path";

// packages/transport/src/response-body.ts
var ResponseBodyLimitError = class extends Error {
  constructor(limit) {
    super(`response body exceeds ${limit} bytes`);
    this.limit = limit;
    this.name = "ResponseBodyLimitError";
  }
  limit;
};
async function readResponseBody(response, limit, signal) {
  const declared = Number(response.headers.get("content-length") ?? "");
  if (signal?.aborted || Number.isFinite(declared) && declared > limit) {
    void response.body?.cancel().catch(() => void 0);
    signal?.throwIfAborted();
    throw new ResponseBodyLimitError(limit);
  }
  if (response.body === null) return Buffer.alloc(0);
  const reader = response.body.getReader();
  const chunks = [];
  let tail;
  let used = 0;
  let total = 0;
  const onAbort = () => {
    void reader.cancel(signal?.reason).catch(() => void 0);
  };
  signal?.addEventListener("abort", onAbort, { once: true });
  if (signal?.aborted) onAbort();
  try {
    while (true) {
      signal?.throwIfAborted();
      const { done, value } = await reader.read();
      signal?.throwIfAborted();
      if (done) break;
      total += value.byteLength;
      if (total > limit) throw new ResponseBodyLimitError(limit);
      for (let offset = 0; offset < value.byteLength; ) {
        if (tail === void 0 || used === tail.byteLength) {
          tail = Buffer.allocUnsafe(Math.min(64 * 1024, limit));
          chunks.push(tail);
          used = 0;
        }
        const count = Math.min(value.byteLength - offset, tail.byteLength - used);
        tail.set(value.subarray(offset, offset + count), used);
        used += count;
        offset += count;
      }
    }
    if (tail !== void 0) chunks[chunks.length - 1] = tail.subarray(0, used);
    return Buffer.concat(chunks, total);
  } catch (error) {
    void reader.cancel(error).catch(() => void 0);
    throw error;
  } finally {
    signal?.removeEventListener("abort", onAbort);
    reader.releaseLock();
  }
}

// packages/transport/src/openai-images.ts
var MAX_IMAGES = 6;
var MAX_REFERENCES = 4;
var MAX_REFERENCE_BYTES = 25 * 1024 * 1024;
var MAX_IMAGE_BYTES = 50 * 1024 * 1024;
var MAX_BASE64_CHARS = Math.ceil(MAX_IMAGE_BYTES * 4 / 3) + 4096;
var MAX_IMAGE_JSON_BYTES = MAX_BASE64_CHARS + 64 * 1024;
var MAX_MODELS_JSON_BYTES = 1024 * 1024;
var MAX_ERROR_BYTES = 8 * 1024;
var MIN_IMAGE_BYTES = 1024;
var IMAGE_EXTENSIONS = /* @__PURE__ */ new Set([".png", ".jpg", ".jpeg", ".webp"]);
function isLoopbackHost2(hostname) {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, "");
  return host === "localhost" || host === "127.0.0.1" || host === "::1" || host.endsWith(".localhost");
}
function sha2562(value) {
  return createHash8("sha256").update(value, "utf8").digest("hex");
}
function pad2(n) {
  return String(n).padStart(2, "0");
}
function clampCount(value) {
  if (value === void 0 || !Number.isFinite(value)) return 1;
  return Math.max(1, Math.min(MAX_IMAGES, Math.floor(value)));
}
function extensionFor2(mime) {
  if (mime.includes("jpeg") || mime.includes("jpg")) return "jpg";
  if (mime.includes("webp")) return "webp";
  return "png";
}
function mimeForFormat(format) {
  return format === "jpeg" ? "image/jpeg" : format === "webp" ? "image/webp" : "image/png";
}
function isRateLimited(error) {
  return error instanceof TransportError && error.failure === "timeout" && /429|限流/.test(error.message);
}
function delay(ms, signal) {
  return new Promise((resolve7, reject) => {
    const onAbort = () => {
      clearTimeout(timer);
      reject(new DOMException("aborted", "AbortError"));
    };
    const timer = setTimeout(() => {
      signal.removeEventListener("abort", onAbort);
      resolve7();
    }, ms);
    timer.unref?.();
    if (signal.aborted) onAbort();
    else signal.addEventListener("abort", onAbort, { once: true });
  });
}
function isAborted2(signal) {
  return signal?.aborted === true;
}
function isAbortLike(error) {
  return error instanceof Error && (error.name === "AbortError" || error.message === "aborted");
}
function isTimeoutLike(error) {
  return error instanceof Error && error.name === "TimeoutError";
}
function messageOf(error) {
  return error instanceof Error ? error.message : String(error);
}
function redact(text, apiKey) {
  const escaped = JSON.stringify(apiKey).slice(1, -1);
  let encoded = "";
  try {
    encoded = encodeURIComponent(apiKey);
  } catch {
  }
  const variants = /* @__PURE__ */ new Set([apiKey, encoded, escaped, JSON.stringify(escaped).slice(1, -1)]);
  let safe = text;
  for (const value of [...variants].sort((left, right) => right.length - left.length)) {
    if (value !== "") safe = safe.split(value).join("***");
  }
  return safe.replace(/sk-[A-Za-z0-9_-]{8,}/g, "sk-***").replace(/(Bearer\s+)[A-Za-z0-9._~+/=-]{8,}/gi, "$1***").replace(/(api-key["'\s:=]+)[A-Za-z0-9._~+/=-]{8,}/gi, "$1***").replace(/\bAIza[0-9A-Za-z_-]{35}\b/g, "AIza***").replace(/\bgh[pousr]_[A-Za-z0-9]{20,}\b/g, "***").replace(/(https?:\/\/[^\s"'<>?#]+)\?[^\s"'<>]*/gi, "$1?***").replace(/(https?:\/\/)[^/\s@]+@/gi, "$1***@").slice(0, 800);
}
function abortable(promise, signal) {
  let listener;
  const aborted = new Promise((resolve7) => {
    if (signal === void 0) return;
    if (signal.aborted) {
      resolve7("aborted");
      return;
    }
    listener = () => resolve7("aborted");
    signal.addEventListener("abort", listener, { once: true });
  });
  return {
    promise: Promise.race([promise, aborted]),
    dispose: () => {
      if (listener !== void 0) signal?.removeEventListener("abort", listener);
    }
  };
}
function modelIds(body) {
  const data = body?.data;
  if (!Array.isArray(data)) return [];
  const ids = [];
  for (const item of data) {
    if (typeof item === "string") ids.push(item);
    else if (item !== null && typeof item === "object" && typeof item.id === "string") {
      ids.push(item.id);
    }
  }
  return ids;
}
var OpenAIImageTransport = class {
  jobs = /* @__PURE__ */ new Map();
  fetchImpl;
  options;
  constructor(options) {
    this.fetchImpl = options.fetchImpl ?? fetch;
    this.options = {
      baseUrl: options.baseUrl.trim().replace(/\/+$/, ""),
      apiKey: options.apiKey.trim(),
      model: options.model.trim(),
      size: (options.size ?? "auto").trim(),
      quality: (options.quality ?? "auto").trim(),
      format: options.format ?? "png",
      auth: options.auth ?? "bearer",
      editMode: options.editMode ?? "auto",
      timeoutMs: options.timeoutMs ?? 3e5,
      count: options.count ?? 1
    };
  }
  /** Fail fast, before anything billable, with an actionable message. */
  assertReady() {
    let url;
    try {
      url = new URL(this.options.baseUrl);
    } catch {
      throw new TransportError("imageBaseUrl \u4E0D\u662F\u5408\u6CD5 URL\uFF08\u793A\u4F8B\uFF1Ahttps://api.openai.com/v1\uFF09", "config");
    }
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new TransportError("imageBaseUrl \u5FC5\u987B\u4EE5 http:// \u6216 https:// \u5F00\u5934", "config");
    }
    if (url.protocol === "http:" && !isLoopbackHost2(url.hostname)) {
      throw new TransportError("imageBaseUrl \u53EA\u6709\u672C\u673A\u56DE\u73AF\u5730\u5740\u5141\u8BB8 http\uFF1B\u8FDC\u7A0B\u670D\u52A1\u5546\u8BF7\u7528 https", "config");
    }
    if (url.username !== "" || url.password !== "") {
      throw new TransportError("imageBaseUrl \u4E0D\u5141\u8BB8 URL \u5185\u5D4C\u51ED\u636E\uFF1B\u8BF7\u4F7F\u7528 imageApiKey", "config");
    }
    if (this.options.apiKey === "") {
      throw new TransportError("imageApiKey \u4E3A\u7A7A\uFF1A\u5728\u63D2\u4EF6\u8BBE\u7F6E\u91CC\u586B\u5199\uFF0C\u6216\u8BBE\u7F6E\u73AF\u5883\u53D8\u91CF GPT_IMAGE_API_KEY", "config");
    }
    if (this.options.model === "") throw new TransportError("imageModel \u4E3A\u7A7A", "config");
    if (!["png", "jpeg", "webp"].includes(this.options.format)) throw new TransportError("imageFormat \u5FC5\u987B\u4E3A png / jpeg / webp", "config");
    if (!["bearer", "api-key"].includes(this.options.auth)) throw new TransportError("imageAuth \u5FC5\u987B\u4E3A bearer / api-key", "config");
    if (!["auto", "off"].includes(this.options.editMode)) throw new TransportError("imageEdit \u5FC5\u987B\u4E3A auto / off", "config");
    if (!Number.isSafeInteger(this.options.timeoutMs) || this.options.timeoutMs <= 0 || this.options.timeoutMs > 36e5) {
      throw new TransportError("imageTimeoutSeconds \u5FC5\u987B\u4E3A\u6B63\u6570\u4E14\u4E0D\u8D85\u8FC7 3600 \u79D2", "config");
    }
  }
  origin() {
    try {
      return new URL(this.options.baseUrl).origin;
    } catch {
      return "api";
    }
  }
  endpoint(kind) {
    const base = this.options.baseUrl;
    let url;
    try {
      url = new URL(base);
    } catch {
      return `${base}/images/${kind}`;
    }
    if (/\/images\/(generations|edits)$/.test(url.pathname)) {
      url.pathname = url.pathname.replace(/\/images\/(generations|edits)$/, `/images/${kind}`);
      return url.toString();
    }
    url.pathname = `${url.pathname.replace(/\/+$/, "")}/images/${kind}`;
    return url.toString();
  }
  authHeaders() {
    if (this.options.apiKey === "") return {};
    return this.options.auth === "api-key" ? { "api-key": this.options.apiKey } : { authorization: `Bearer ${this.options.apiKey}` };
  }
  headers() {
    return { accept: "application/json", ...this.authHeaders() };
  }
  signalFor(parent) {
    return AbortSignal.any([parent, AbortSignal.timeout(this.options.timeoutMs)]);
  }
  redact(text) {
    return redact(text, this.options.apiKey);
  }
  httpError(status, body) {
    const detail = body === "" ? "" : ` \u54CD\u5E94\uFF1A${this.redact(body)}`;
    if (status === 401 || status === 403) {
      return new TransportError(`\u751F\u56FE API \u9274\u6743\u5931\u8D25\uFF08HTTP ${status}\uFF09\u3002\u68C0\u67E5 imageApiKey / imageAuth\u3002${detail}`, "login");
    }
    if (status === 429) {
      return new TransportError(`\u751F\u56FE API \u9650\u6D41\uFF08HTTP 429\uFF09\uFF0C\u53EF\u7A0D\u540E\u6062\u590D\u91CD\u8BD5\u3002${detail}`, "timeout");
    }
    if (status >= 500) {
      return new TransportError(`\u751F\u56FE API \u670D\u52A1\u7AEF\u9519\u8BEF\uFF08HTTP ${status}\uFF09\uFF0C\u53EF\u7A0D\u540E\u6062\u590D\u91CD\u8BD5\u3002${detail}`, "network");
    }
    return new TransportError(`\u751F\u56FE API \u62D2\u7EDD\u4E86\u8BF7\u6C42\uFF08HTTP ${status}\uFF09\uFF0C\u68C0\u67E5 imageBaseUrl / imageModel / \u53C2\u6570\u3002${detail}`, "config");
  }
  /** Never forward a key or replay a billable POST through a redirect. */
  async request(url, init) {
    let response;
    try {
      init.signal?.throwIfAborted();
      response = await this.fetchImpl(url, { ...init, redirect: "error" });
      if (init.signal?.aborted) {
        void response.body?.cancel().catch(() => void 0);
        init.signal.throwIfAborted();
      }
    } catch (error) {
      throw this.networkError(error);
    }
    if (response.status >= 300 && response.status < 400) {
      void response.body?.cancel().catch(() => void 0);
      throw new TransportError("\u751F\u56FE API \u8FD4\u56DE\u91CD\u5B9A\u5411\uFF1B\u4E3A\u4FDD\u62A4\u5BC6\u94A5\u4E0E\u907F\u514D\u91CD\u653E\u4ED8\u8D39\u8BF7\u6C42\uFF0C\u5DF2\u505C\u6B62\u81EA\u52A8\u8DF3\u8F6C", "config");
    }
    return response;
  }
  async readJson(response, limit, signal) {
    let bytes;
    try {
      bytes = await readResponseBody(response, limit, signal ?? void 0);
    } catch (error) {
      if (error instanceof ResponseBodyLimitError) {
        throw new TransportError(`\u751F\u56FE API JSON \u54CD\u5E94\u8D85\u8FC7 ${limit} \u5B57\u8282\u4E0A\u9650\uFF0C\u5DF2\u505C\u6B62\u8BFB\u53D6`, "config");
      }
      throw this.networkError(error);
    }
    let value;
    try {
      value = JSON.parse(bytes.toString("utf8"));
    } catch {
      throw new TransportError("\u751F\u56FE API \u8FD4\u56DE\u7684\u4E0D\u662F JSON", "config");
    }
    if (value === null || typeof value !== "object" || Array.isArray(value)) {
      throw new TransportError("\u751F\u56FE API \u8FD4\u56DE\u7684 JSON \u5FC5\u987B\u4E3A\u5BF9\u8C61", "config");
    }
    return value;
  }
  async readErrorBody(response, signal) {
    try {
      return (await readResponseBody(response, MAX_ERROR_BYTES, signal ?? void 0)).toString("utf8");
    } catch (error) {
      if (error instanceof ResponseBodyLimitError) return `\u9519\u8BEF\u6B63\u6587\u8D85\u8FC7 ${MAX_ERROR_BYTES} \u5B57\u8282\u4E0A\u9650\uFF0C\u5DF2\u505C\u6B62\u8BFB\u53D6`;
      throw this.networkError(error);
    }
  }
  async requestJson(url, init) {
    const response = await this.request(url, init);
    if (!response.ok) throw this.httpError(response.status, await this.readErrorBody(response, init.signal));
    return await this.readJson(response, MAX_IMAGE_JSON_BYTES, init.signal);
  }
  networkError(error) {
    if (isTimeoutLike(error)) {
      return new TransportError(`\u5355\u5F20\u56FE\u7247\u8D85\u8FC7 ${Math.round(this.options.timeoutMs / 1e3)} \u79D2\u4ECD\u672A\u8FD4\u56DE`, "timeout");
    }
    if (isAbortLike(error)) throw new DOMException("aborted", "AbortError");
    const cause = error instanceof Error ? error.cause : void 0;
    if (/redirect/i.test(messageOf(error)) || cause instanceof Error && /redirect/i.test(cause.message)) {
      return new TransportError("\u751F\u56FE API \u8BF7\u6C42\u9047\u5230\u91CD\u5B9A\u5411\uFF1B\u4E3A\u4FDD\u62A4\u5BC6\u94A5\u4E0E\u907F\u514D\u91CD\u653E\u4ED8\u8D39\u8BF7\u6C42\uFF0C\u5DF2\u505C\u6B62\u81EA\u52A8\u8DF3\u8F6C", "config");
    }
    return new TransportError(`\u65E0\u6CD5\u8FDE\u63A5\u751F\u56FE API\uFF08${this.origin()}\uFF09\uFF1A${this.redact(messageOf(error))}`, "network");
  }
  modelsUrl() {
    const base = this.options.baseUrl;
    let url;
    try {
      url = new URL(base);
    } catch {
      return `${base}/models`;
    }
    if (/\/images\/(generations|edits)$/.test(url.pathname)) {
      url.pathname = `${url.pathname.replace(/\/images\/(generations|edits)$/, "")}/models`;
    } else {
      url.pathname = `${url.pathname.replace(/\/+$/, "")}/models`;
    }
    return url.toString();
  }
  async probe() {
    const model = this.options.model;
    if (this.options.apiKey === "") {
      return { ok: false, loggedIn: false, model, available: [], reason: "\u672A\u914D\u7F6E imageApiKey\uFF08\u6216\u73AF\u5883\u53D8\u91CF GPT_IMAGE_API_KEY\uFF09" };
    }
    try {
      this.assertReady();
      const signal = AbortSignal.timeout(2e4);
      const response = await this.request(this.modelsUrl(), {
        method: "GET",
        headers: this.headers(),
        signal
      });
      try {
        if (response.status === 401 || response.status === 403) {
          return { ok: false, loggedIn: false, model, available: [], reason: `\u9274\u6743\u5931\u8D25\uFF08HTTP ${response.status}\uFF09\uFF0C\u68C0\u67E5 imageApiKey / imageAuth` };
        }
        if (response.status === 404 || response.status === 405) {
          return { ok: true, loggedIn: true, model, available: [], reason: "\u670D\u52A1\u5546\u672A\u63D0\u4F9B /models\uFF0C\u65E0\u6CD5\u9884\u68C0\uFF1B\u76F4\u63A5\u751F\u56FE\u4F1A\u66B4\u9732\u6A21\u578B\u540D\u95EE\u9898" };
        }
        if (!response.ok) {
          return { ok: false, loggedIn: false, model, available: [], reason: `\u9884\u68C0\u5931\u8D25\uFF08HTTP ${response.status}\uFF09` };
        }
        const body = await this.readJson(response, MAX_MODELS_JSON_BYTES, signal);
        const available = modelIds(body);
        const missing = available.length > 0 && !available.includes(model);
        return {
          ok: true,
          loggedIn: true,
          model,
          available,
          ...missing ? { reason: `\u6A21\u578B ${model} \u4E0D\u5728\u670D\u52A1\u5546\u5217\u8868\u91CC\uFF1B\u82E5\u62A5 404 \u8BF7\u6539 imageModel` } : {}
        };
      } finally {
        void response.body?.cancel().catch(() => void 0);
      }
    } catch (error) {
      const reason = error instanceof TransportError && error.failure === "timeout" ? `\u9884\u68C0\u8D85\u65F6\uFF08${this.origin()}\uFF09` : messageOf(error);
      return { ok: false, loggedIn: false, model, available: [], reason: this.redact(reason) };
    }
  }
  async submit(request) {
    this.assertReady();
    if (isAborted2(request.signal)) throw new DOMException("aborted", "AbortError");
    const count = clampCount(request.designs ?? this.options.count);
    const references = await this.referenceImages(request.files);
    if (request.editBase !== void 0) {
      if (this.options.editMode === "off") throw new TransportError("\u56FE\u7247\u7F16\u8F91\u5DF2\u5173\u95ED\uFF0C\u505C\u6B62\u5E95\u56FE\u4FEE\u6539", "config");
      if (request.files.length !== 1 || references.length !== 1 || count !== 1) {
        throw new TransportError("\u5E95\u56FE\u4FEE\u6539\u9700\u8981\u4E00\u5F20\u6709\u6548\u7684 PNG\u3001JPEG \u6216 WebP\uFF08\u4E0D\u8D85\u8FC7 25MB\uFF09\uFF0C\u4E14\u53EA\u80FD\u751F\u6210\u4E00\u4E2A\u65B9\u5411\uFF1B\u4E0D\u4F1A\u9000\u56DE\u666E\u901A\u751F\u56FE", "upload");
      }
      if (createHash8("sha256").update(references[0].bytes).digest("hex") !== request.editBase.sha256) {
        throw new TransportError("\u5E95\u56FE\u6750\u6599\u5DF2\u53D8\u5316\uFF0C\u505C\u6B62\u53D1\u9001", "upload");
      }
    }
    if (isAborted2(request.signal)) throw new DOMException("aborted", "AbortError");
    const prompt = this.basePrompt(request);
    const controller = new AbortController();
    const onAbort = () => controller.abort();
    request.signal?.addEventListener("abort", onAbort, { once: true });
    if (isAborted2(request.signal)) controller.abort();
    const id = randomUUID5();
    const job = { request, count, controller, completed: 0, reported: 0 };
    const generated = this.generate(job, prompt, references).finally(() => request.signal?.removeEventListener("abort", onAbort));
    job.settled = generated.then(() => void 0, () => void 0);
    void generated.then(
      (result) => {
        job.result = result;
      },
      (error) => {
        job.error = error;
      }
    );
    this.jobs.set(id, job);
    return {
      submissionId: id,
      fingerprint: sha2562([
        this.options.baseUrl,
        this.options.model,
        this.options.size,
        this.options.quality,
        String(count),
        prompt,
        ...references.map((reference) => reference.name)
      ].join("\n")),
      attachments: references.map((reference) => reference.name),
      conversationUrl: `api://${this.origin()}/${encodeURIComponent(this.options.model)}`
    };
  }
  async poll(request) {
    const job = this.jobs.get(request.submissionId);
    if (job === void 0) return { state: "unknown" };
    if (isAborted2(request.signal)) throw new DOMException("aborted", "AbortError");
    const raced = abortable(job.settled, request.signal);
    let timer;
    try {
      const outcome = await Promise.race([
        raced.promise,
        new Promise((resolve7) => {
          timer = setTimeout(() => resolve7("timeout"), Math.max(1e3, request.timeoutMs));
          timer.unref?.();
        })
      ]);
      if (outcome === "aborted") throw new DOMException("aborted", "AbortError");
      if (outcome === "timeout") {
        const progressed = job.completed > job.reported;
        job.reported = job.completed;
        return progressed ? { state: "waiting", progress: true } : { state: "waiting" };
      }
      if (job.error !== void 0) {
        this.jobs.delete(request.submissionId);
        throw job.error;
      }
      return { state: "answered", answer: job.result?.answer ?? "" };
    } finally {
      if (timer !== void 0) clearTimeout(timer);
      raced.dispose();
    }
  }
  async fetch(request) {
    const job = this.jobs.get(request.submissionId);
    if (job === void 0) {
      throw new TransportError("API \u751F\u56FE\u4EFB\u52A1\u5DF2\u4E22\u5931\uFF08DSH \u53EF\u80FD\u91CD\u542F\u8FC7\uFF09\uFF1B\u8FD9\u4E00\u8F6E\u4E0D\u4F1A\u81EA\u52A8\u91CD\u53D1", "config");
    }
    if (job.error !== void 0) {
      this.jobs.delete(request.submissionId);
      throw job.error;
    }
    if (job.result === void 0) throw new TransportError("API \u56FE\u7247\u8FD8\u6CA1\u751F\u6210\u5B8C", "ui");
    const result = job.result;
    this.jobs.delete(request.submissionId);
    return result;
  }
  /** Abort every in-flight request; the engine records the round as cancelled. */
  async cancelSubmission(submissionId) {
    const job = this.jobs.get(submissionId);
    if (job === void 0) return;
    job.controller.abort();
    await job.settled;
    if (this.jobs.get(submissionId) === job) this.jobs.delete(submissionId);
  }
  async cancel() {
    const jobs = [...this.jobs.values()];
    for (const job of jobs) job.controller.abort();
    await Promise.all(jobs.map((job) => job.settled));
  }
  dispose() {
    void this.cancel();
    this.jobs.clear();
  }
  basePrompt(request) {
    return request.brief.trim();
  }
  directionPrompt(base, index, count, references) {
    const parts = [base];
    if (count > 1) {
      parts.push(`---
\u672C\u6B21\u53EA\u751F\u6210\u7B2C ${index + 1} \u4E2A\u65B9\u5411\uFF08\u5171 ${count} \u4E2A\uFF09\u3002\u6784\u56FE\u3001\u914D\u8272\u4E0E\u5B57\u4F53\u6C14\u8D28\u8981\u548C\u5176\u4ED6\u65B9\u5411\u660E\u663E\u4E0D\u540C\uFF1B\u53EA\u8F93\u51FA\u8FD9\u4E00\u5F20\u56FE\uFF0C\u4E0D\u8981\u62FC\u56FE\u3001\u4E0D\u8981\u4E5D\u5BAB\u683C\u3002`);
    }
    if (references > 0) {
      parts.push(`\u968F\u9644 ${references} \u5F20\u53C2\u8003\u56FE\uFF1A\u6309\u4EFB\u52A1\u7EA6\u675F\u4F7F\u7528\u5176\u4E2D\u7684\u54C1\u724C\u5143\u7D20\u4E0E\u7248\u5F0F\uFF0C\u4E0D\u8981\u7167\u6284\u4E0E\u4EFB\u52A1\u65E0\u5173\u7684\u5185\u5BB9\u3002`);
    }
    return parts.join("\n\n");
  }
  bodyFor(prompt) {
    const body = { model: this.options.model, prompt, n: 1 };
    if (this.options.size !== "" && this.options.size !== "auto") body.size = this.options.size;
    if (this.options.quality !== "" && this.options.quality !== "auto") body.quality = this.options.quality;
    if (this.options.format !== "png") body.output_format = this.options.format;
    if (/^dall-e/i.test(this.options.model)) body.response_format = "b64_json";
    return body;
  }
  async generateOne(job, direction, references) {
    try {
      return references.length > 0 ? await this.edit(direction, references, job.controller.signal) : await this.generation(direction, job.controller.signal);
    } catch (error) {
      if (!isRateLimited(error) || job.controller.signal.aborted) throw error;
      await delay(2e3, job.controller.signal);
      return references.length > 0 ? await this.edit(direction, references, job.controller.signal) : await this.generation(direction, job.controller.signal);
    }
  }
  async generate(job, prompt, references) {
    const request = job.request;
    const results = Array.from({ length: job.count });
    const prompts = [];
    const failures = [];
    let firstError;
    let fatal;
    let next = 0;
    const worker = async () => {
      try {
        while (true) {
          if (job.controller.signal.aborted) throw new DOMException("aborted", "AbortError");
          const index = next;
          next += 1;
          if (index >= job.count) return;
          const direction = this.directionPrompt(prompt, index, job.count, references.length);
          prompts[index] = direction;
          try {
            const produced = await this.generateOne(job, direction, references);
            results[index] = produced;
            job.completed += 1;
          } catch (error) {
            if (job.controller.signal.aborted || isAbortLike(error)) throw error;
            if (error instanceof TransportError && (error.failure === "login" || error.failure === "config" || error.failure === "worker")) {
              throw error;
            }
            if (firstError === void 0) firstError = error;
            failures.push(`\u7B2C ${index + 1} \u4E2A\u65B9\u5411\u5931\u8D25\uFF1A${this.redact(messageOf(error))}`);
          }
        }
      } catch (error) {
        fatal ??= { error };
        job.controller.abort();
        throw error;
      }
    };
    const lanes = Array.from({ length: Math.min(2, job.count) }, () => worker());
    await Promise.allSettled(lanes);
    if (fatal !== void 0) throw fatal.error;
    if (job.controller.signal.aborted) throw new DOMException("aborted", "AbortError");
    const images = results.flatMap((result) => result ?? []);
    if (images.length === 0) {
      if (firstError instanceof TransportError) throw firstError;
      throw new TransportError(
        `\u4E00\u8F6E\u90FD\u6CA1\u6709\u751F\u6210\u6210\u529F\uFF1A${failures.join("\uFF1B") || messageOf(firstError)}`,
        "network"
      );
    }
    images.forEach((image, index) => {
      image.name = `image-${pad2(index + 1)}.${extensionFor2(image.mime)}`;
    });
    return {
      answer: this.answerText(request, job.count, images, failures, prompts, references),
      images
    };
  }
  async generation(prompt, signal) {
    const body = await this.requestJson(this.endpoint("generations"), {
      method: "POST",
      headers: { ...this.headers(), "content-type": "application/json" },
      body: JSON.stringify(this.bodyFor(prompt)),
      signal: this.signalFor(signal)
    });
    return await this.collect(body, signal);
  }
  async edit(prompt, references, signal) {
    const form = new FormData();
    form.set("model", this.options.model);
    form.set("prompt", prompt);
    form.set("n", "1");
    if (this.options.size !== "" && this.options.size !== "auto") form.set("size", this.options.size);
    if (this.options.quality !== "" && this.options.quality !== "auto") form.set("quality", this.options.quality);
    if (this.options.format !== "png") form.set("output_format", this.options.format);
    if (/^dall-e/i.test(this.options.model)) form.set("response_format", "b64_json");
    for (const reference of references) {
      const copy = new Uint8Array(reference.bytes.byteLength);
      copy.set(reference.bytes);
      form.append("image[]", new Blob([copy], { type: reference.mime }), reference.name);
    }
    const requestSignal = this.signalFor(signal);
    const response = await this.request(this.endpoint("edits"), {
      method: "POST",
      headers: this.authHeaders(),
      body: form,
      signal: requestSignal
    });
    if (!response.ok) {
      const detail = this.redact(await this.readErrorBody(response, requestSignal));
      if (response.status === 400 || response.status === 404 || response.status === 422) {
        throw new TransportError(
          `\u53C2\u8003\u56FE\u63A5\u53E3 /images/edits \u88AB\u62D2\uFF08HTTP ${response.status}\uFF09\uFF1A${detail}\u3002\u82E5\u8BE5\u670D\u52A1\u5546\u6216\u6A21\u578B\u4E0D\u652F\u6301\u53C2\u8003\u56FE\uFF0C\u628A imageEdit \u8BBE\u4E3A off \u518D\u8BD5\u3002`,
          "config"
        );
      }
      throw this.httpError(response.status, detail);
    }
    const body = await this.readJson(response, MAX_IMAGE_JSON_BYTES, requestSignal);
    return await this.collect(body, signal);
  }
  async collect(body, signal) {
    const raw = Array.isArray(body.data) ? body.data : Array.isArray(body.images) ? body.images : [];
    if (raw.length === 0) {
      const detail = typeof body.error === "string" ? body.error : JSON.stringify(body).slice(0, 300);
      throw new TransportError(`\u751F\u56FE API \u6CA1\u6709\u8FD4\u56DE\u56FE\u7247\uFF1A${this.redact(detail)}`, "config");
    }
    if (raw.length > 1) {
      throw new TransportError("\u751F\u56FE API \u6BCF\u4E2A\u65B9\u5411\u4EC5\u8BF7\u6C42\u4E00\u5F20\u56FE\u7247\uFF0C\u4F46\u54CD\u5E94\u8D85\u8FC7 1 \u4E2A\u56FE\u7247\u6761\u76EE\u4E0A\u9650", "config");
    }
    signal.throwIfAborted();
    const images = [];
    for (const item of raw) {
      if (typeof item === "string") {
        images.push(/^https?:\/\//i.test(item) ? await this.download(item, signal) : this.decodeBase64(item));
        continue;
      }
      const payload = item !== null && typeof item === "object" ? item : {};
      const encoded = typeof payload.b64_json === "string" ? payload.b64_json : typeof payload.base64 === "string" ? payload.base64 : void 0;
      if (encoded !== void 0) {
        const parsed = this.decodeBase64(encoded);
        images.push(parsed);
        continue;
      }
      if (typeof payload.url === "string" && payload.url !== "") {
        images.push(await this.download(payload.url, signal));
        continue;
      }
      throw new TransportError("\u751F\u56FE API \u8FD4\u56DE\u4E86\u65E2\u6CA1\u6709 b64_json \u4E5F\u6CA1\u6709 url \u7684\u6761\u76EE", "config");
    }
    return images;
  }
  decodeBase64(value) {
    const match = /^data:([^;,]+);base64,(.*)$/s.exec(value.trim());
    const mime = match?.[1] ?? mimeForFormat(this.options.format);
    const base64 = (match?.[2] ?? value).replace(/\s+/g, "");
    if (base64.length > MAX_BASE64_CHARS) {
      throw new TransportError(`\u751F\u56FE API \u8FD4\u56DE\u7684 base64 \u8D85\u8FC7 ${Math.round(MAX_IMAGE_BYTES / 1024 / 1024)}MB \u4E0A\u9650`, "config");
    }
    const bytes = Buffer.from(base64, "base64");
    if (bytes.byteLength < MIN_IMAGE_BYTES) {
      throw new TransportError(`\u751F\u56FE API \u8FD4\u56DE\u7684\u56FE\u7247\u8FC7\u5C0F\uFF08${bytes.byteLength} \u5B57\u8282\uFF09\uFF0C\u6309\u5931\u8D25\u5904\u7406`, "network");
    }
    if (bytes.byteLength > MAX_IMAGE_BYTES) {
      throw new TransportError(`\u751F\u56FE API \u8FD4\u56DE\u7684\u56FE\u7247\u8D85\u8FC7 ${Math.round(MAX_IMAGE_BYTES / 1024 / 1024)}MB \u4E0A\u9650`, "config");
    }
    return { mime: detectImageMime(bytes) ?? mime, base64 };
  }
  async readImageBody(response, signal) {
    try {
      return await readResponseBody(response, MAX_IMAGE_BYTES, signal);
    } catch (error) {
      if (error instanceof ResponseBodyLimitError) {
        throw new TransportError(`\u4E0B\u8F7D\u7684\u56FE\u7247\u8D85\u8FC7 ${Math.round(MAX_IMAGE_BYTES / 1024 / 1024)}MB \u4E0A\u9650`, "config");
      }
      throw this.networkError(error);
    }
  }
  async download(url, signal) {
    let target;
    try {
      target = new URL(url, this.options.baseUrl);
    } catch {
      throw new TransportError(`\u751F\u56FE API \u8FD4\u56DE\u4E86\u975E\u6CD5\u56FE\u7247\u5730\u5740\uFF1A${this.redact(url.split("?")[0] ?? "")}`, "config");
    }
    if (target.protocol !== "https:" && !(target.protocol === "http:" && (isLoopbackHost2(target.hostname) || target.origin === this.origin()))) {
      throw new TransportError("\u751F\u56FE API \u8FD4\u56DE\u4E86\u975E https \u7684\u56FE\u7247\u5730\u5740\uFF1B\u53EA\u5141\u8BB8 https \u6216\u672C\u673A/\u540C\u6E90\u5730\u5740", "config");
    }
    if (target.username !== "" || target.password !== "") {
      throw new TransportError("\u751F\u56FE API \u8FD4\u56DE\u7684\u56FE\u7247\u5730\u5740\u5305\u542B\u5185\u5D4C\u51ED\u636E\uFF0C\u5DF2\u505C\u6B62\u4E0B\u8F7D", "config");
    }
    const sameOrigin = target.origin === this.origin();
    const requestSignal = this.signalFor(signal);
    const response = await this.request(target.toString(), {
      method: "GET",
      headers: sameOrigin ? this.authHeaders() : { accept: "image/*" },
      signal: requestSignal
    });
    if (!response.ok) {
      void response.body?.cancel().catch(() => void 0);
      throw new TransportError(`\u4E0B\u8F7D\u751F\u6210\u56FE\u7247\u5931\u8D25\uFF08HTTP ${response.status}\uFF09`, "network");
    }
    const bytes = await this.readImageBody(response, requestSignal);
    if (bytes.byteLength < MIN_IMAGE_BYTES) {
      throw new TransportError(`\u4E0B\u8F7D\u5230\u7684\u56FE\u7247\u8FC7\u5C0F\uFF08${bytes.byteLength} \u5B57\u8282\uFF09\uFF0C\u6309\u5931\u8D25\u5904\u7406`, "network");
    }
    const headerMime = (response.headers.get("content-type") ?? "").split(";")[0]?.trim() ?? "";
    const mime = detectImageMime(bytes) ?? (headerMime.startsWith("image/") ? headerMime : void 0);
    if (mime === void 0) {
      throw new TransportError("\u751F\u56FE API \u8FD4\u56DE\u7684\u56FE\u7247\u5730\u5740\u5185\u5BB9\u4E0D\u662F\u56FE\u7247\uFF08\u65E0 magic bytes \u4E14 content-type \u975E image/*\uFF09", "config");
    }
    return { mime, base64: bytes.toString("base64") };
  }
  async referenceImages(files) {
    if (this.options.editMode === "off") return [];
    const references = [];
    for (const file of files) {
      if (references.length >= MAX_REFERENCES) break;
      if (!IMAGE_EXTENSIONS.has(extname2(file).toLowerCase())) continue;
      let bytes;
      try {
        bytes = await readFile5(file);
      } catch (error) {
        throw new TransportError(`\u8BFB\u53D6\u53C2\u8003\u56FE\u5931\u8D25\uFF1A${this.redact(basename3(file))}\uFF08${this.redact(messageOf(error))}\uFF09`, "upload");
      }
      if (bytes.byteLength > MAX_REFERENCE_BYTES) continue;
      const mime = detectImageMime(bytes);
      if (mime === void 0) continue;
      references.push({ name: basename3(file), mime, bytes });
    }
    return references;
  }
  answerText(request, count, images, failures, prompts, references) {
    const ignored = request.files.length - references.length;
    const lines = [
      `# API \u751F\u56FE \xB7 \u7B2C ${request.round} \u8F6E`,
      "",
      "- \u901A\u9053\uFF1Aapi\uFF08OpenAI \u517C\u5BB9\u751F\u56FE\u63A5\u53E3\uFF09",
      `- \u6A21\u578B\uFF1A${this.options.model}`,
      `- \u5C3A\u5BF8\uFF1A${this.options.size || "auto"} \xB7 \u8D28\u91CF\uFF1A${this.options.quality || "auto"} \xB7 \u683C\u5F0F\uFF1A${this.options.format}`,
      `- \u7ED3\u679C\uFF1A${images.length} \u5F20 / \u8BF7\u6C42 ${count} \u4E2A\u65B9\u5411`,
      references.length > 0 ? `- \u53C2\u8003\u56FE\uFF1A${references.map((reference) => reference.name).join("\u3001")}\uFF08/images/edits\uFF09` : "- \u53C2\u8003\u56FE\uFF1A\u65E0",
      ignored > 0 && this.options.editMode === "off" ? `- \u5FFD\u7565\u6750\u6599\uFF1A${ignored} \u4E2A\uFF08imageEdit=off\uFF09` : void 0,
      ignored > 0 && this.options.editMode !== "off" ? `- \u5FFD\u7565\u6750\u6599\uFF1A${ignored} \u4E2A\uFF08\u975E\u56FE\u7247\u3001\u8D85\u8FC7 25MB\u3001\u6269\u5C55\u540D\u4E0D\u662F png/jpg/webp\uFF0C\u6216\u8D85\u51FA 4 \u5F20\u53C2\u8003\u56FE\u4E0A\u9650\uFF1BAPI \u901A\u9053\u8BFB\u4E0D\u4E86\u6587\u672C\u6750\u6599\uFF09` : void 0,
      "",
      "## \u63D0\u793A\u8BCD",
      "",
      ...prompts.flatMap((prompt, index) => [`### \u65B9\u5411 ${index + 1}`, "", prompt, ""]),
      failures.length > 0 ? "## \u5931\u8D25" : void 0,
      failures.length > 0 ? "" : void 0,
      ...failures.map((failure) => `- ${failure}`),
      failures.length > 0 ? "" : void 0,
      "## \u8BF4\u660E",
      "",
      "API \u901A\u9053\u53EA\u4EA7\u51FA\u56FE\u7247\uFF1BHTML demo \u9700\u8981\u7F51\u9875\u4F1A\u8BDD\u901A\u9053\uFF0C\u6216\u7531 DSH agent \u57FA\u4E8E\u8FD9\u4E9B\u56FE\u53E6\u884C\u751F\u6210\u3002",
      ""
    ];
    return lines.filter((line) => line !== void 0).join("\n");
  }
};

// packages/transport/src/shared.ts
import { mkdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { randomUUID as randomUUID6 } from "node:crypto";
import { dirname as dirname3, resolve as resolve5 } from "node:path";
var REGISTRY = /* @__PURE__ */ Symbol.for("dsh-pro.transport.shared.v1");
function registry() {
  const holder = globalThis;
  const existing = holder[REGISTRY];
  if (existing instanceof Map) return existing;
  const created = /* @__PURE__ */ new Map();
  holder[REGISTRY] = created;
  return created;
}
function isAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return error.code === "EPERM";
  }
}
function acquireProfileLock(profileDir) {
  const file = `${resolve5(profileDir)}.dsh-pro.lock`;
  mkdirSync(dirname3(file), { recursive: true });
  const token = randomUUID6();
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      writeFileSync(file, `${JSON.stringify({ pid: process.pid, token, startedAt: (/* @__PURE__ */ new Date()).toISOString() })}
`, { flag: "wx" });
      return { file, token };
    } catch (error) {
      if (error.code !== "EEXIST") throw error;
      let owner;
      try {
        owner = JSON.parse(readFileSync(file, "utf8"));
      } catch {
      }
      if (owner !== void 0 && Number.isInteger(owner.pid) && owner.pid !== process.pid && isAlive(owner.pid)) {
        throw new TransportError(
          `Chrome profile is already owned by process ${owner.pid}: ${resolve5(profileDir)}`,
          "config"
        );
      }
      try {
        unlinkSync(file);
      } catch {
      }
    }
  }
  throw new TransportError(`cannot acquire the Chrome profile lease: ${resolve5(profileDir)}`, "config");
}
function releaseProfileLock(file, token) {
  try {
    const owner = JSON.parse(readFileSync(file, "utf8"));
    if (owner.token !== token) return;
    unlinkSync(file);
  } catch {
  }
}
function acquireSharedTransport(options, create = () => new ChatGptWebTransport(options)) {
  const key = resolve5(options.profileDir);
  const slots = registry();
  let slot = slots.get(key);
  if (slot === void 0) {
    const lease = acquireProfileLock(key);
    let transport;
    try {
      transport = create();
    } catch (error) {
      releaseProfileLock(lease.file, lease.token);
      throw error;
    }
    slot = { transport, refs: 0, lockFile: lease.file, token: lease.token };
    slots.set(key, slot);
  }
  slot.refs += 1;
  const target = slot;
  let released = false;
  return {
    transport: target.transport,
    release: () => {
      if (released) return;
      released = true;
      target.refs -= 1;
      if (target.refs > 0) return;
      if (slots.get(key) === target) slots.delete(key);
      void target.transport.close().finally(() => releaseProfileLock(target.lockFile, target.token));
    }
  };
}

// packages/research/src/preview.ts
var PREVIEW_ESCAPE_MESSAGE = "dsh-pro:preview-escape";
function previewHtml(html) {
  const bridge = `<script>window.addEventListener('keydown',function(event){if(event.key==='Escape'){event.preventDefault();parent.postMessage({type:'${PREVIEW_ESCAPE_MESSAGE}'},'*')}},true)</script>`;
  const doctype = html.match(/^\s*<!doctype[^>]*>/i);
  const offset = doctype?.[0].length ?? 0;
  return html.slice(0, offset) + bridge + html.slice(offset);
}

// packages/research/src/plugin.ts
var MAX_ARTIFACT_BYTES = 100 * 1024 * 1024;
var MAX_PREVIEW_BYTES = 2e6;
var baseFields = {
  rounds: z.number().step(1).min(1).max(10).default(3).description("\u6BCF\u4E3B\u9898\u9ED8\u8BA4\u8F6E\u6B21\u4E0A\u9650\uFF081\u201310\uFF09\u3002"),
  designs: z.number().step(1).min(1).max(6).default(3).description("\u8BBE\u8BA1\u63D2\u4EF6\u6BCF\u8F6E\u751F\u6210\u7684\u65B9\u5411/\u56FE\u7247\u6570\uFF081\u20136\uFF09\u3002"),
  model: z.string().default("prefer-pro").description("ChatGPT \u7F51\u9875\u6A21\u578B\uFF1Aprefer-pro\uFF08\u9ED8\u8BA4\uFF0C\u4F18\u5148 Pro\uFF0C\u4E0D\u53EF\u7528\u5219\u6CBF\u7528\u9875\u9762\u5F53\u524D\u6A21\u578B\uFF09\uFF1Bauto \u4FDD\u7559\u5F53\u524D\u6A21\u578B\uFF1Bpro\u3001thinking \u7B49\u6307\u5B9A\u6A21\u578B\u987B\u53EF\u7528\u3002"),
  store: z.string().default("project").description("\u7814\u7A76\u8BB0\u5F55\u4F4D\u7F6E\uFF1Aproject\uFF08\u4ED3\u5E93 docs/research\uFF09\u6216 local\uFF08DSH \u672C\u673A\uFF09\u3002"),
  autoStart: z.boolean().default(false).description("\u7814\u7A76\u5361\u662F\u5426\u8DF3\u8FC7\u70B9\u51FB\u76F4\u63A5\u5F00\u8DD1\u3002"),
  autoReview: z.boolean().default(true).description("capped \u540E\u5524\u9192\u539F\u4F1A\u8BDD\u68C0\u67E5\u4EA7\u7269\uFF0C\u51B3\u5B9A\u63A5\u53D7\u6216\u7EE7\u7EED\uFF1B\u65E0\u539F\u4F1A\u8BDD\u65F6\u53EA\u663E\u793A\u5F85\u63A5\u53D7\u3002"),
  notify: z.string().default("stall-only").description("\u901A\u77E5\u7B56\u7565\uFF1Astall-only \u53EA\u5728\u5361\u4F4F\u65F6\u63D0\u9192\uFF0Call \u5B8C\u6210\u4E5F\u63D0\u9192\u3002"),
  stallMinutes: z.number().step(1).min(1).default(45).description("\u65E0\u8FDB\u5C55\u5224\u5B9A\u5206\u949F\u6570\uFF1B\u751F\u6210\u4E2D\u4E0D\u8BA1\u65F6\u3002"),
  maxRoundMinutes: z.number().step(1).min(1).default(90).description("\u5355\u8F6E\u5899\u949F\u4E0A\u9650\uFF08\u5206\u949F\uFF09\u3002"),
  maxFiles: z.number().step(1).min(1).default(12).description("\u5355\u8F6E\u9644\u4EF6\u6570\u91CF\u4E0A\u9650\u3002"),
  maxTotalMB: z.number().default(24).description("\u5355\u8F6E\u9644\u4EF6\u603B\u5927\u5C0F\uFF08MB\uFF09\u3002"),
  rawAnswers: z.string().default("local").description("\u539F\u59CB\u7B54\u590D\u4FDD\u5B58\u4F4D\u7F6E\uFF1Alocal\uFF08\u672C\u673A\u76EE\u5F55\uFF09\u6216 repo\uFF08\u968F\u9879\u76EE\uFF09\u3002\u516C\u5F00\u4ED3\u5E93\u8BF7\u7528 local\u3002"),
  rawAnswersDir: z.string().default("").description("local \u6A21\u5F0F\u7684\u539F\u6587\u76EE\u5F55\uFF1B\u7559\u7A7A\u7528 ~/.dsh/<\u63D2\u4EF6\u76EE\u5F55>/raw\uFF08\u7814\u7A76\u4E3A chatgpt-pro-research\uFF0C\u8BBE\u8BA1\u4E3A gpt-image-design\uFF09\u3002"),
  headless: z.boolean().default(false).description("\u65E0\u5934\u6A21\u5F0F\u4EC5\u5EFA\u8BAE\u7528\u4E8E\u81EA\u68C0\uFF1B\u9996\u6B21\u767B\u5F55\u5FC5\u987B\u6709\u5934\u3002"),
  judgeProvider: z.string().default("").description("\u81EA\u52A8\u88C1\u51B3\u7684 LLM provider\uFF1B\u7559\u7A7A\u81EA\u52A8\u4F7F\u7528\u5F53\u524D DSH \u9ED8\u8BA4\u6A21\u578B\uFF0C\u586B off \u53EF\u5173\u95ED\u3002"),
  judgeModel: z.string().default("").description("\u81EA\u52A8\u88C1\u51B3\u7684 model\uFF1B\u7559\u7A7A\u81EA\u52A8\u4F7F\u7528\u5F53\u524D DSH \u9ED8\u8BA4\u6A21\u578B\uFF1B\u4E0E provider \u540C\u65F6\u586B\u5199\u53EF\u8986\u76D6\u3002")
};
var Config = z.object(baseFields);
var DesignConfig = z.object({
  ...baseFields,
  channel: z.string().default("web").description("\u751F\u56FE\u901A\u9053\uFF1Aweb\uFF08ChatGPT \u7F51\u9875\u4F1A\u8BDD\uFF09\u6216 api\uFF08OpenAI \u517C\u5BB9\u751F\u56FE API\uFF09\u3002"),
  imageBaseUrl: z.string().default("https://api.openai.com/v1").description("API \u901A\u9053\u7684 base URL\uFF0C\u542B\u7248\u672C\u524D\u7F00\uFF0C\u4F8B\u5982 https://api.openai.com/v1\u3002"),
  imageApiKey: z.string().default("").description("API \u901A\u9053\u7684 key\uFF1B\u7559\u7A7A\u5219\u8BFB\u73AF\u5883\u53D8\u91CF GPT_IMAGE_API_KEY\u3002\u53EA\u5B58\u672C\u673A\u914D\u7F6E\uFF0C\u4E0D\u8981\u5199\u8FDB\u4ED3\u5E93\u3002"),
  imageModel: z.string().default("gpt-image-1").description("API \u901A\u9053\u7684\u751F\u56FE\u6A21\u578B\u540D\uFF0C\u4F8B\u5982 gpt-image-1\u3001dall-e-3 \u6216\u670D\u52A1\u5546\u6A21\u578B\u540D\u3002"),
  imageSize: z.string().default("auto").description("\u56FE\u7247\u5C3A\u5BF8\uFF1Aauto \u6216 1024x1024 / 1536x1024 / 1024x1536\u3002"),
  imageQuality: z.string().default("auto").description("\u8D28\u91CF\uFF1Aauto / low / medium / high\uFF08\u670D\u52A1\u5546\u652F\u6301\u65F6\u751F\u6548\uFF09\u3002"),
  imageFormat: z.string().default("png").description("\u8F93\u51FA\u683C\u5F0F\uFF1Apng / jpeg / webp\u3002"),
  imageAuth: z.string().default("bearer").description("\u9274\u6743\u5934\uFF1Abearer\uFF08Authorization: Bearer\uFF09\u6216 api-key\uFF08Azure \u98CE\u683C\uFF09\u3002"),
  imageEdit: z.string().default("auto").description("\u6750\u6599\u4E2D\u7684\u56FE\u7247\u662F\u5426\u4F5C\u4E3A\u53C2\u8003\u56FE\u53D1\u7ED9 /images/edits\uFF1Aauto / off\u3002"),
  imageTimeoutSeconds: z.number().step(1).min(10).max(3600).default(300).description("\u5355\u5F20\u56FE\u7247\u7684\u751F\u6210/\u4E0B\u8F7D\u8D85\u65F6\uFF08\u79D2\uFF0C10\u20133600\uFF09\u3002")
});
function homeDir() {
  return process.env.DSH_HOME ?? join5(homedir(), ".dsh");
}
function externalOpenCommand(platform, target) {
  if (platform === "win32") return { command: "explorer.exe", args: [target] };
  if (platform === "darwin") return { command: "open", args: [target] };
  return { command: "xdg-open", args: [target] };
}
function externalRevealCommand(platform, target) {
  if (platform === "win32") return { command: "explorer.exe", args: [`/select,${target}`] };
  if (platform === "darwin") return { command: "open", args: ["-R", target] };
  return { command: "xdg-open", args: [dirname4(target)] };
}
function mimeFor(path) {
  switch (extname3(path).toLowerCase()) {
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".svg":
      return "image/svg+xml";
    case ".html":
    case ".htm":
      return "text/html; charset=utf-8";
    case ".css":
      return "text/css; charset=utf-8";
    case ".js":
      return "text/javascript; charset=utf-8";
    case ".json":
      return "application/json; charset=utf-8";
    case ".zip":
      return "application/zip";
    case ".woff2":
      return "font/woff2";
    case ".woff":
      return "font/woff";
    case ".ttf":
      return "font/ttf";
    case ".otf":
      return "font/otf";
    case ".ico":
      return "image/x-icon";
    case ".wasm":
      return "application/wasm";
    case ".mp4":
      return "video/mp4";
    case ".webm":
      return "video/webm";
    case ".mp3":
      return "audio/mpeg";
    case ".md":
    case ".markdown":
      return "text/markdown; charset=utf-8";
    case ".txt":
      return "text/plain; charset=utf-8";
    case ".ts":
    case ".tsx":
    case ".jsx":
      return "text/plain; charset=utf-8";
    default:
      return "application/octet-stream";
  }
}
function imageFormatOf(value, fallback) {
  return value === void 0 || value.trim() === "" ? fallback : value;
}
function imageAuthOf(value) {
  return value === void 0 || value.trim() === "" ? "bearer" : value;
}
function imageEditOf(value) {
  return value === void 0 || value.trim() === "" ? "auto" : value;
}
function clampInt(value, min, max2, fallback) {
  if (!Number.isFinite(value) || value < min) return fallback;
  return Math.min(max2, Math.round(value));
}
function resolveImageConfig(base, config) {
  const settingsKey = (config?.imageApiKey ?? "").trim();
  const envKey = (process.env.GPT_IMAGE_API_KEY ?? "").trim();
  return {
    baseUrl: (config?.imageBaseUrl ?? "").trim() !== "" ? config.imageBaseUrl.trim() : base.baseUrl,
    apiKey: settingsKey !== "" ? settingsKey : envKey,
    model: (config?.imageModel ?? "").trim() !== "" ? config.imageModel.trim() : base.model,
    size: (config?.imageSize ?? "").trim() !== "" ? config.imageSize.trim() : base.size,
    quality: (config?.imageQuality ?? "").trim() !== "" ? config.imageQuality.trim() : base.quality,
    format: imageFormatOf(config?.imageFormat, base.format),
    auth: imageAuthOf(config?.imageAuth),
    editMode: imageEditOf(config?.imageEdit),
    timeoutSeconds: config?.imageTimeoutSeconds ?? base.timeoutSeconds
  };
}
function resolvePluginConfig(spec2, config) {
  const base = defaultConfig(join5(homeDir(), spec2.homeSubdir));
  base.browser = { ...base.browser, profileDir: join5(homeDir(), "pro-research", "browser") };
  const design = spec2.topicType === "design";
  const channel = design && config?.channel === "api" ? "api" : "web";
  const merged = {
    ...base,
    channel,
    image: design ? resolveImageConfig(base.image, config) : base.image,
    ...config?.rounds !== void 0 ? { rounds: config.rounds } : {},
    ...config?.designs !== void 0 ? { designs: config.designs } : {},
    ...config?.model !== void 0 ? { model: config.model } : {},
    ...config?.store === "local" || config?.store === "project" ? { store: config.store } : {},
    ...config?.autoStart !== void 0 ? { autoStart: config.autoStart } : {},
    ...config?.autoReview !== void 0 ? { autoReview: config.autoReview } : {},
    ...config?.notify === "all" || config?.notify === "stall-only" ? { notify: config.notify } : {},
    ...config?.stallMinutes !== void 0 ? { stallMinutes: config.stallMinutes } : {},
    ...config?.maxRoundMinutes !== void 0 ? { maxRoundMinutes: config.maxRoundMinutes } : {},
    ...config?.maxFiles !== void 0 ? { maxFiles: config.maxFiles } : {},
    ...config?.maxTotalMB !== void 0 ? { maxTotalMB: config.maxTotalMB } : {},
    ...config?.rawAnswers === "repo" || config?.rawAnswers === "local" ? { rawAnswers: config.rawAnswers } : {},
    ...config?.rawAnswersDir !== void 0 && config.rawAnswersDir !== "" ? { rawAnswersDir: config.rawAnswersDir } : {},
    ...config?.headless !== void 0 ? { browser: { ...base.browser, headless: config.headless } } : {},
    ...config?.judgeProvider !== void 0 && config.judgeProvider !== "" ? { judgeProvider: config.judgeProvider } : {},
    ...config?.judgeModel !== void 0 && config.judgeModel !== "" ? { judgeModel: config.judgeModel } : {}
  };
  merged.rounds = clampInt(merged.rounds, 1, 10, base.rounds);
  merged.designs = clampInt(merged.designs, 1, 6, base.designs);
  merged.stallMinutes = clampInt(merged.stallMinutes, 1, 7 * 24 * 60, base.stallMinutes);
  merged.maxRoundMinutes = Math.max(
    clampInt(merged.maxRoundMinutes, 1, 30 * 24 * 60, base.maxRoundMinutes),
    merged.stallMinutes
  );
  merged.maxFiles = clampInt(merged.maxFiles, 1, 100, base.maxFiles);
  if (!Number.isFinite(merged.maxTotalMB) || merged.maxTotalMB <= 0) merged.maxTotalMB = base.maxTotalMB;
  return merged;
}
var JUDGE_SYSTEM = [
  "\u4F60\u662F\u7814\u7A76\u4EFB\u52A1\u7684\u9A8C\u6536\u88C1\u5224\u3002\u53EA\u8F93\u51FA\u4E00\u4E2A JSON \u5BF9\u8C61\uFF0C\u4E0D\u8981 Markdown \u56F4\u680F\u3002",
  "\u5B57\u6BB5\uFF1Averdict\uFF08accepted|partial|rejected\uFF09\u3001reason\uFF08\u4E00\u53E5\u8BDD\uFF09\u3001done\uFF08\u662F\u5426\u5DF2\u6EE1\u8DB3\u5168\u90E8\u6210\u529F\u5224\u636E\uFF09\u3001",
  "summary\uFF08\u4E0D\u8D85\u8FC7 200 \u5B57\u7684\u4E2D\u6587\u7ED3\u8BBA\u6458\u8981\uFF09\u3001nextBrief\uFF08\u672A\u5B8C\u6210\u65F6\u4E0B\u4E00\u8F6E\u8981\u95EE\u4EC0\u4E48\uFF0C\u5DF2\u5B8C\u6210\u53EF\u7701\u7565\uFF09\u3001",
  "criteria\uFF08\u6570\u7EC4\uFF1A\u6BCF\u4E2A\u6210\u529F\u5224\u636E\u4E00\u9879\uFF0C\u5B57\u6BB5 criterion\u3001status=met|partial|unmet|unknown\u3001evidence \u4E00\u53E5\u8BDD\u5F15\u7528\u7B54\u590D\u4E2D\u7684\u4F9D\u636E\uFF09\u3002",
  "\u6210\u529F\u5224\u636E\u4EE5 JSON \u5B57\u7B26\u4E32\u6570\u7EC4\u63D0\u4F9B\u3002\u8F93\u51FA criteria \u5FC5\u987B\u4E0E\u8BE5\u6570\u7EC4\u957F\u5EA6\u3001\u987A\u5E8F\u76F8\u540C\uFF0Ccriterion \u5FC5\u987B\u9010\u5B57\u590D\u5236\u5BF9\u5E94\u539F\u6587\uFF1B\u7981\u6B62\u62C6\u5206\u3001\u5408\u5E76\u3001\u6539\u5199\u6216\u65B0\u589E\u5224\u636E\u3002",
  "\u4E00\u6761\u590D\u5408\u5224\u636E\u5373\u4F7F\u5305\u542B\u591A\u4E2A\u8981\u6C42\u4E5F\u53EA\u8F93\u51FA\u4E00\u9879\uFF1B\u6240\u6709\u8981\u6C42\u5747\u6709\u4F9D\u636E\u624D\u80FD met\uFF0C\u5426\u5219 partial/unmet/unknown\uFF0C\u5E76\u5728 evidence \u4E2D\u8BF4\u660E\u5DF2\u6EE1\u8DB3\u548C\u7F3A\u5931\u7684\u90E8\u5206\u3002",
  "\u5FC5\u987B\u9010\u6761\u5224\u65AD\u6240\u6709\u6210\u529F\u5224\u636E\uFF1Bdone \u53EA\u6709\u5728 verdict=accepted \u4E14\u5168\u90E8\u5224\u636E status=met \u65F6\u624D\u4E3A true\u3002",
  "\u6587\u4EF6\u5B58\u5728\u6216\u6587\u672C\u58F0\u79F0\u5DF2\u9A8C\u8BC1\u4E0D\u80FD\u66FF\u4EE3\u5B9E\u9645\u56FE\u7247\u89C6\u89C9\u4E0E HTML \u4EA4\u4E92\u8BC1\u636E\uFF1B\u6CA1\u6709\u6B64\u7C7B\u8BC1\u636E\u65F6\u4E0D\u80FD\u628A\u76F8\u5173\u8981\u6C42\u5224\u4E3A met\u3002",
  "\u5224\u65AD\u4F9D\u636E\u53EA\u80FD\u662F\u7B54\u590D\u672C\u8EAB\u4E0E\u7ED9\u5B9A\u5224\u636E\uFF1B\u4E0D\u8981\u56E0\u4E3A\u7B54\u590D\u81EA\u4FE1\u6216\u4E00\u81F4\u5C31\u5224 accepted\u3002"
].join("\n");
function parseJudge(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end <= start) throw new Error("judge returned no JSON object");
  const parsed = JSON.parse(text.slice(start, end + 1));
  const verdict = parsed.verdict === "accepted" || parsed.verdict === "rejected" || parsed.verdict === "partial" ? parsed.verdict : "partial";
  const criteria = Array.isArray(parsed.criteria) ? parsed.criteria.flatMap((item) => {
    if (item === null || typeof item !== "object") return [];
    const row = item;
    if (typeof row.criterion !== "string" || row.criterion.trim() === "") return [];
    const status = row.status === "met" || row.status === "partial" || row.status === "unmet" || row.status === "unknown" ? row.status : "unknown";
    return [{
      criterion: row.criterion,
      status,
      ...typeof row.evidence === "string" && row.evidence.trim() !== "" ? { evidence: row.evidence } : {}
    }];
  }) : void 0;
  return {
    verdict,
    reason: typeof parsed.reason === "string" ? parsed.reason : "",
    // The engine checks completion claims against the original criteria.
    done: parsed.done === true,
    summary: typeof parsed.summary === "string" ? parsed.summary : "",
    ...criteria !== void 0 && criteria.length > 0 ? { criteria } : {},
    ...typeof parsed.nextBrief === "string" ? { nextBrief: parsed.nextBrief } : {}
  };
}
var ProResearchService = class {
  constructor(ctx, config, home, spec2) {
    this.ctx = ctx;
    this.config = config;
    this.home = home;
    this.spec = spec2;
  }
  ctx;
  config;
  home;
  spec;
  engines = /* @__PURE__ */ new Map();
  stores = /* @__PURE__ */ new Map();
  topicSessions = /* @__PURE__ */ new Map();
  sessionController;
  defaultModel;
  agentFactory;
  registryChain = Promise.resolve();
  transport;
  imageTransport;
  shared;
  rootFor(cwd) {
    return cwd.trim() === "" ? process.cwd() : cwd;
  }
  storeFor(cwd) {
    return this.storeAt(this.rootFor(cwd), this.config.store);
  }
  storeAt(root, mode) {
    const key = `${mode}:${root}`;
    const existing = this.stores.get(key);
    if (existing !== void 0) return existing;
    const store = new ResearchStore({
      mode,
      projectRoot: root,
      localRoot: join5(this.home, this.spec.homeSubdir),
      rawDir: this.config.rawAnswersDir,
      rawAnswers: this.config.rawAnswers,
      docsSubdir: this.spec.storeSubdir
    });
    this.stores.set(key, store);
    return store;
  }
  transportFor() {
    if (this.config.channel === "api") {
      if (this.imageTransport === void 0) {
        this.imageTransport = new OpenAIImageTransport({
          baseUrl: this.config.image.baseUrl,
          apiKey: this.config.image.apiKey,
          model: this.config.image.model,
          size: this.config.image.size,
          quality: this.config.image.quality,
          format: this.config.image.format,
          auth: this.config.image.auth,
          editMode: this.config.image.editMode,
          timeoutMs: this.config.image.timeoutSeconds * 1e3,
          count: this.config.designs
        });
      }
      return this.imageTransport;
    }
    if (this.transport !== void 0) return this.transport;
    this.shared = acquireSharedTransport({
      profileDir: this.config.browser.profileDir,
      headless: this.config.browser.headless
    });
    this.transport = this.shared.transport;
    return this.transport;
  }
  judge() {
    return async (input) => {
      const route = this.judgeRoute();
      if (route === void 0) {
        return {
          verdict: "partial",
          reason: "\u672A\u914D\u7F6E\u88C1\u51B3\u6A21\u578B\uFF0C\u4E14\u5F53\u524D\u6CA1\u6709\u53EF\u7528\u7684 DSH \u9ED8\u8BA4\u6A21\u578B",
          done: false,
          summary: "\u672A\u542F\u7528\u81EA\u52A8\u88C1\u51B3\uFF1B\u7ED3\u8BBA\u89C1\u5404\u8F6E\u88C1\u51B3\u4E0E\u539F\u59CB\u7B54\u590D\u3002"
        };
      }
      const llm = this.ctx.get("llm");
      if (llm === void 0) throw new Error("the harness LLM service is unavailable");
      const assembler = new BlockAssembler();
      let finished = false;
      const user = [
        `\u4E3B\u9898\uFF1A${input.topic.title}`,
        `\u6210\u529F\u5224\u636E\uFF08\u539F\u6587 JSON \u6570\u7EC4\uFF0C\u4E0D\u53EF\u62C6\u5206\uFF09\uFF1A
${JSON.stringify(input.criteria)}`,
        `\u672C\u8F6E\u95EE\u9898\uFF1A
${input.question ?? "\uFF08\u672A\u8BB0\u5F55\uFF09"}`,
        `\u672C\u8F6E\u7B54\u590D\uFF1A
${input.answer.slice(0, 3e4)}`,
        `\u5DF2\u4FDD\u5B58\u4EA7\u7269\uFF08\u6587\u4EF6\u5B58\u5728\u4E0D\u4EE3\u8868\u89C6\u89C9\u6216\u4EA4\u4E92\u9A8C\u6536\u901A\u8FC7\uFF1B\u4E0D\u8981\u56E0\u7B54\u590D\u65E0\u6587\u5B57\u800C\u5426\u8BA4\u5DF2\u4FDD\u5B58\u56FE\u7247\uFF09\uFF1A
${input.topic.rounds.flatMap((round) => (round.artifacts ?? []).map((path) => `- \u7B2C ${round.n} \u8F6E\uFF1A${path}`)).join("\n") || "\uFF08\u65E0\uFF09"}`
      ].join("\n\n");
      const sessionId = this.topicSessions.get(input.topic.id) ?? (await this.entryFor(input.topic.id))?.sessionId ?? input.topic.id;
      for await (const chunk of llm.stream({
        provider: route.provider,
        model: route.model,
        sessionId,
        system: JUDGE_SYSTEM,
        messages: [createUserMessage({
          content: [{ type: "text", text: user }],
          source: { kind: this.spec.name }
        })],
        // Reasoning and JSON share the output budget on supported providers.
        // 1,800 tokens truncated real DeepSeek judgments before a complete JSON.
        maxTokens: 8192,
        ...route.reasoningEffort ? { reasoningEffort: route.reasoningEffort } : {},
        signal: input.signal === void 0 ? AbortSignal.timeout(18e4) : AbortSignal.any([input.signal, AbortSignal.timeout(18e4)])
      })) {
        assembler.push(chunk);
        if (chunk.type === "finish") finished = true;
      }
      if (assembler.finish.kind === "error" || assembler.finish.kind === "aborted") throw new Error(`\u88C1\u51B3\u670D\u52A1\u5931\u8D25\uFF1A${assembler.finish.failure.message}`);
      const blocks = assembler.blocks();
      const text = blocks.map((block) => block.type === "text" ? block.text : "").join("");
      const reasoningChars = blocks.reduce((total, block) => total + (block.type === "reasoning" ? block.text.length : 0), 0);
      const diagnostic = `finish=${finished ? assembler.finish.kind : "missing"}; textChars=${text.length}; reasoningChars=${reasoningChars}`;
      if (!finished || assembler.finish.kind !== "stop") {
        throw new Error(`\u88C1\u51B3\u672A\u6B63\u5E38\u5B8C\u6210\uFF08${diagnostic}\uFF09\uFF1B\u7B54\u590D\u5DF2\u4FDD\u7559\uFF0C\u53EF\u68C0\u67E5\u88C1\u51B3\u6A21\u578B\u540E\u91CD\u8BD5`);
      }
      try {
        return parseJudge(text);
      } catch {
        throw new Error(`\u88C1\u51B3\u8FD4\u56DE\u65E0\u6548 JSON \u6216\u7ED3\u6784\uFF08${diagnostic}\uFF09\uFF1B\u7B54\u590D\u5DF2\u4FDD\u7559\uFF0C\u53EF\u68C0\u67E5\u88C1\u51B3\u6A21\u578B\u540E\u91CD\u8BD5`);
      }
    };
  }
  judgeRoute() {
    const provider = this.config.judgeProvider.trim();
    const model = this.config.judgeModel.trim();
    if (provider.toLowerCase() === "off") return void 0;
    if (provider !== "" && model !== "") return { provider, model, source: "configured" };
    try {
      const model2 = this.defaultModel ?? this.ctx.get("agentDefaultModel");
      const selection = model2?.currentSelection();
      if (selection?.provider !== void 0 && selection.provider !== "" && selection.model !== void 0 && selection.model !== "") {
        return { provider: selection.provider, model: selection.model, reasoningEffort: selection.reasoningEffort, source: "default" };
      }
    } catch {
    }
    return void 0;
  }
  engineFor(cwd, mode = this.config.store) {
    const root = this.rootFor(cwd);
    const store = this.storeAt(root, mode);
    const key = `${mode}:${root}`;
    const existing = this.engines.get(key);
    if (existing !== void 0) return existing;
    const engine = new ResearchEngine({
      store,
      transport: this.transportFor(),
      judge: this.judge(),
      config: this.config,
      onError: (error) => {
        this.log(`topic run failed inside failure handling: ${error instanceof Error ? error.message : String(error)}`);
      },
      onEvent: (event) => {
        if (event.type === "status" && (event.status === "stalled" || event.status === "failed")) {
          this.log(`topic ${event.topicId} ${event.status}${event.reason !== void 0 ? ` (${event.reason})` : ""}`);
          void this.notifyStalled(event.topicId, event.reason);
        }
        if (event.type === "finished" && this.config.notify === "all") {
          void this.notifyFinished(event.topicId, event.status);
        }
        if (event.type === "finished" && event.status === "capped" && this.config.autoReview) {
          void this.autoReviewRequest(event.topicId);
        }
        if (event.type === "judge_failed") {
          void this.notifyJudgeFailed(event.topicId, event.round, event.message);
        }
      }
    });
    this.engines.set(key, engine);
    return engine;
  }
  log(message) {
    const logger = this.ctx.logger;
    const scoped = typeof logger === "function" ? logger(this.spec.name) : void 0;
    scoped?.info?.(message);
  }
  /**
   * Loud, one-line signal when the host provides no connection guard. Routes
   * are not registered in that case: an unauthenticated artifact/action
   * surface is worse than a missing panel.
   */
  noteMissingConnectionGuard() {
    this.log(`${this.spec.name}: connection service unavailable; HTTP routes were not registered (no host auth guard)`);
  }
  async find(cwd, topicId) {
    const entry = await this.entryFor(topicId);
    if (entry !== void 0) {
      const store2 = this.storeAt(entry.root, entry.mode);
      return { store: store2, engine: this.engineFor(entry.root, entry.mode), topic: await store2.load(topicId) };
    }
    const store = this.storeFor(cwd);
    try {
      const topic = await store.load(topicId);
      return { store, engine: this.engineFor(cwd), topic };
    } catch {
      for (const [key, candidate] of this.stores.entries()) {
        try {
          const topic = await candidate.load(topicId);
          const separator = key.indexOf(":");
          const mode = key.slice(0, separator) === "local" ? "local" : "project";
          const root = key.slice(separator + 1);
          return { store: candidate, engine: this.engineFor(root, mode), topic };
        } catch {
        }
      }
    }
    throw new Error(`unknown topic: ${topicId}`);
  }
  get registryFile() {
    return join5(this.home, this.spec.homeSubdir, "registry.json");
  }
  async readRegistry() {
    try {
      const parsed = JSON.parse(await readFile6(this.registryFile, "utf8"));
      return Array.isArray(parsed.topics) ? parsed.topics.filter((entry) => entry !== null && typeof entry === "object" && typeof entry.id === "string").map((entry) => ({ ...entry, mode: entry.mode === "local" ? "local" : "project" })) : [];
    } catch {
      return [];
    }
  }
  /**
   * Registry is a cache, not the source of truth. At startup also scan the
   * current project root and every root already named in the registry, so a
   * lost/stale registry does not hide an interrupted topic.
   */
  async knownEntries() {
    const entries = await this.readRegistry();
    const seen = new Set(entries.map((entry) => entry.id));
    const roots = /* @__PURE__ */ new Set([this.rootFor(""), ...entries.map((entry) => entry.root)]);
    for (const root of roots) {
      for (const mode of ["project", "local"]) {
        try {
          for (const topic of await this.storeAt(root, mode).list()) {
            if (seen.has(topic.id)) continue;
            seen.add(topic.id);
            entries.push({ id: topic.id, root, mode, title: topic.title, updated: topic.updated });
          }
        } catch {
        }
      }
    }
    return entries;
  }
  async writeRegistry(entries) {
    await mkdir4(dirname4(this.registryFile), { recursive: true });
    const temp = `${this.registryFile}.${randomUUID7()}.tmp`;
    await writeFile3(temp, `${JSON.stringify({ version: 1, topics: entries }, null, 2)}
`, "utf8");
    for (let attempt = 1; ; attempt += 1) {
      try {
        await rename3(temp, this.registryFile);
        return;
      } catch (error) {
        const code = error.code;
        const retriable = code === "EPERM" || code === "EACCES" || code === "EBUSY";
        if (!retriable || attempt >= 8) throw error;
        await new Promise((resolve7) => setTimeout(resolve7, 10 * attempt));
      }
    }
  }
  async record(topic, root, sessionId, mode = this.config.store) {
    if (sessionId !== void 0 && sessionId !== "") this.topicSessions.set(topic.id, sessionId);
    const job = async () => {
      const entries = (await this.readRegistry()).filter((entry) => entry.id !== topic.id);
      entries.push({
        id: topic.id,
        root,
        mode,
        title: topic.title,
        updated: topic.updated,
        ...sessionId !== void 0 && sessionId !== "" ? { sessionId } : {}
      });
      await this.writeRegistry(entries);
    };
    const next = this.registryChain.then(job, job);
    this.registryChain = next.catch(() => void 0);
    await next;
  }
  /**
   * Write scan-discovered topics back into the registry; otherwise a lost
   * registry hides interrupted topics from the sidebar forever. Existing
   * entries keep their recorded sessionId. The chain job re-reads the file so
   * concurrent record() calls cannot be overwritten.
   */
  async mergeRegistry(discovered) {
    const job = async () => {
      const entries = await this.readRegistry();
      const known = new Set(entries.map((entry) => entry.id));
      const additions = discovered.filter((entry) => !known.has(entry.id));
      if (additions.length === 0) return;
      await this.writeRegistry([...entries, ...additions]);
    };
    const next = this.registryChain.then(job, job);
    this.registryChain = next.catch(() => void 0);
    await next;
  }
  /** Remove one registry entry; callers delete the topic directory FIRST so a rescan cannot resurrect it. */
  async removeFromRegistry(id) {
    const job = async () => {
      await this.writeRegistry((await this.readRegistry()).filter((entry) => entry.id !== id));
    };
    const next = this.registryChain.then(job, job);
    this.registryChain = next.catch(() => void 0);
    await next;
  }
  /**
   * One quiet reminder in the originating session when a run stalls or fails.
   * `agent.inject` is model-facing context that does not wake the driver; when
   * the session is no longer live the sidebar still shows the state, so a
   * missing agent is not an error.
   */
  useAgentFactory(factory) {
    this.agentFactory = factory;
  }
  useSessionController(controller) {
    this.sessionController = controller;
  }
  useDefaultModel(model) {
    this.defaultModel = model;
  }
  liveAgent(sessionId) {
    const agents = this.agentFactory ?? this.ctx.get("agents");
    return agents?.get(sessionId);
  }
  async notifyStalled(id, reason) {
    try {
      const entry = await this.entryFor(id);
      const sessionId = entry?.sessionId ?? this.topicSessions.get(id);
      if (sessionId === void 0) return;
      const agent = this.liveAgent(sessionId);
      if (agent === void 0) return;
      const topic = entry === void 0 ? void 0 : await this.storeAt(entry.root, entry.mode).load(id).catch(() => void 0);
      const title = topic?.title ?? id;
      agent.inject(createUserMessage({
        content: [{
          type: "text",
          text: `<system-reminder>Pro ${this.spec.topicType === "design" ? "\u8BBE\u8BA1" : "\u7814\u7A76"}\u300C${title}\u300D\u5361\u4F4F\u4E86${reason === void 0 ? "" : `\uFF08${reason}\uFF09`}\u3002\u5728\u4FA7\u8FB9\u680F\u300CPro\u300D\u91CC\u67E5\u770B\u73B0\u573A\uFF0C\u7136\u540E\u6062\u590D\u3001\u53D6\u6D88\u6216\u4EBA\u5DE5\u6838\u5BF9\u3002</system-reminder>`
        }],
        source: { kind: this.spec.name }
      }));
    } catch {
    }
  }
  /** Automatic capped handoff: only a live session, and only mark it reviewing after delivery succeeds. */
  async autoReviewRequest(id) {
    const wake = await this.notifyCappedReview(id);
    if (!wake.ok) return;
    const entry = await this.entryFor(id);
    if (entry === void 0) return;
    await this.engineFor(entry.root, entry.mode).markReviewing(id).catch(() => void 0);
  }
  /** Ask the originating agent to inspect a response whose automatic verdict failed. */
  async notifyJudgeFailed(id, round, message) {
    try {
      const entry = await this.entryFor(id);
      const sessionId = entry?.sessionId ?? this.topicSessions.get(id);
      if (entry === void 0 || sessionId === void 0) return;
      const topic = entry === void 0 ? void 0 : await this.storeAt(entry.root, entry.mode).load(id).catch(() => void 0);
      if (topic === void 0) return;
      const dir = await this.storeAt(entry.root, entry.mode).dirOf(id);
      const agent = this.liveAgent(sessionId);
      if (agent?.followup === void 0) return;
      agent.followup(createUserMessage({
        content: [{
          type: "text",
          text: `<system-reminder>Pro \u4E3B\u9898\u300C${topic.title}\u300D\u5DF2\u53D6\u56DE\u7B2C ${round} \u8F6E\u7B54\u590D\uFF0C\u4F46\u81EA\u52A8\u88C1\u51B3\u5931\u8D25\uFF08${message}\uFF09\u3002\u7B54\u590D\u4E0E\u4EA7\u7269\u5DF2\u4FDD\u7559\uFF0C\u4E3B\u9898\u505C\u5728\u201C\u5F85\u5224\u65AD\u201D\u3002
\u8BF7\u5BBF\u4E3B\u6309\u6210\u529F\u5224\u636E\u4EBA\u5DE5\u88C1\u51B3\uFF1A
- \u6EE1\u8DB3\uFF1A${this.spec.tool} action=accept topic_id=${id} confirmed=true
- \u9700\u8981\u6539\u8FDB\uFF1A${this.spec.tool} action=regenerate topic_id=${id} confirmed=true note="\u5177\u4F53\u95EE\u9898"
- \u53EA\u8865\u5145\u4E00\u8F6E\uFF1A${this.spec.tool} action=continue topic_id=${id} confirmed=true brief="\u4E0B\u4E00\u8F6E\u95EE\u9898"
- \u4FEE\u590D judgeProvider / judgeModel \u540E\uFF1A${this.spec.tool} action=resume topic_id=${id}
\u76EE\u5F55\uFF1A${dir}
\u88C1\u51B3\u5360\u4F4D\uFF1A${join5(dir, "rounds", `${String(round).padStart(2, "0")}-verdict.md`)}</system-reminder>`
        }],
        source: { kind: this.spec.name }
      }));
    } catch {
    }
  }
  /** Ask the originating agent to inspect a capped/failed result and decide. */
  async notifyCappedReview(id, resumeCold = false) {
    try {
      const entry = await this.entryFor(id);
      const sessionId = entry?.sessionId ?? this.topicSessions.get(id);
      if (sessionId === void 0) return { ok: false, reason: "\u539F\u4F1A\u8BDD id \u672A\u8BB0\u5F55" };
      const topic = entry === void 0 ? void 0 : await this.storeAt(entry.root, entry.mode).load(id).catch(() => void 0);
      if (topic === void 0) return { ok: false, reason: "\u4E3B\u9898\u4E0D\u5B58\u5728" };
      const dir = await this.storeAt(entry?.root ?? this.rootFor(""), entry?.mode ?? this.config.store).dirOf(id);
      const state = topic.status === "capped" ? "\u5DF2\u7ED3\u675F\u672C\u6B21\u8FD0\u884C" : topic.status === "failed" ? "\u5931\u8D25" : "\u505C\u4E0B\u7B49\u5F85\u6838\u5BF9";
      const message = `<system-reminder>Pro \u4E3B\u9898\u300C${topic.title}\u300D${state}\uFF0C\u7ED3\u679C\u7B49\u5F85\u786E\u8BA4\u3002\u8BF7\u5148\u68C0\u67E5\u4EA7\u7269\u548C\u5224\u636E\uFF1A
- \u6EE1\u8DB3\uFF1A\u8C03\u7528 ${this.spec.tool} action=accept topic_id=${id} confirmed=true
- \u8FD8\u9700\u6539\u8FDB\uFF1A\u8C03\u7528 ${this.spec.tool} action=regenerate topic_id=${id} confirmed=true note="\u5177\u4F53\u95EE\u9898"
- \u9700\u8981\u7EE7\u7EED\u7814\u7A76\u4F46\u4E0D\u7528\u6362\u7248\uFF1A\u8C03\u7528 ${this.spec.tool} action=continue topic_id=${id} confirmed=true brief="\u4E0B\u4E00\u8F6E\u95EE\u9898"
\u4EA7\u7269\u76EE\u5F55\uFF1A${dir}
\u6700\u7EC8\u6C47\u603B\uFF1A${join5(dir, "final.md")}</system-reminder>`;
      if (resumeCold) return await this.wakeSession(sessionId, message);
      const agents = this.agentFactory ?? this.ctx.get("agents");
      const agent = agents?.get(sessionId);
      if (agent?.followup === void 0) return { ok: false, reason: "\u539F\u4F1A\u8BDD\u5F53\u524D\u672A\u8FD0\u884C" };
      agent.followup(createUserMessage({
        content: [{ type: "text", text: message }],
        source: { kind: this.spec.name }
      }));
      return { ok: true };
    } catch (error) {
      return { ok: false, reason: error instanceof Error ? error.message : String(error) };
    }
  }
  /** Quiet reminder for the opt-in `notify=all` mode. */
  async notifyFinished(id, status) {
    try {
      const entry = await this.entryFor(id);
      const sessionId = entry?.sessionId ?? this.topicSessions.get(id);
      if (sessionId === void 0) return;
      const agent = this.liveAgent(sessionId);
      if (agent === void 0) return;
      const topic = entry === void 0 ? void 0 : await this.storeAt(entry.root, entry.mode).load(id).catch(() => void 0);
      const title = topic?.title ?? id;
      agent.inject(createUserMessage({
        content: [{
          type: "text",
          text: `<system-reminder>Pro \u4E3B\u9898\u300C${title}\u300D\u5DF2${status === "completed" ? "\u5B8C\u6210" : status === "capped" ? "\u505C\u6B62\u5E76\u7B49\u5F85\u786E\u8BA4" : "\u53D6\u6D88"}\u3002\u4EA7\u7269\u4E0E\u6700\u7EC8\u6C47\u603B\u5728\u4FA7\u8FB9\u680F\u5BF9\u5E94\u9762\u677F\u91CC\u3002</system-reminder>`
        }],
        source: { kind: this.spec.name }
      }));
    } catch {
    }
  }
  async wakeSession(sessionId, text) {
    const agents = this.agentFactory ?? this.ctx.get("agents");
    let agent = agents?.get(sessionId);
    let resumed = false;
    if (agent === void 0) {
      const controller = this.sessionController ?? this.ctx.get("sessionController");
      if (controller === void 0) return { ok: false, reason: "sessionController \u670D\u52A1\u4E0D\u53EF\u7528\uFF0C\u65E0\u6CD5\u6062\u590D\u51B7\u4F1A\u8BDD" };
      try {
        const resolved = await controller.resolveAgent(sessionId);
        if ("error" in resolved) {
          return { ok: false, reason: `\u6062\u590D\u4F1A\u8BDD\u5931\u8D25\uFF1A${String(resolved.error)}` };
        }
        agent = "agent" in resolved ? resolved.agent : resolved;
        resumed = true;
      } catch (error) {
        return { ok: false, reason: `\u6062\u590D\u4F1A\u8BDD\u5931\u8D25\uFF1A${error instanceof Error ? error.message : String(error)}` };
      }
    }
    if (agent === void 0) return { ok: false, reason: "\u539F\u4F1A\u8BDD\u5DF2\u4E0D\u5B58\u5728\u6216\u672A\u52A0\u8F7D" };
    if (agent.followup === void 0) return { ok: false, reason: "\u5F53\u524D\u8FD0\u884C\u65F6\u4E0D\u652F\u6301\u5524\u9192\u4F1A\u8BDD" };
    agent.followup(createUserMessage({
      content: [{ type: "text", text }],
      source: { kind: this.spec.name }
    }));
    return { ok: true, ...resumed ? { resumed: true } : {} };
  }
  /**
   * A human accepted a result. Wake the originating conversation so the agent
   * continues whatever it was doing before it handed this topic off.
   */
  async notifyAccepted(id, topic, humanAccepted = true) {
    try {
      const entry = await this.entryFor(id);
      const sessionId = entry?.sessionId ?? this.topicSessions.get(id);
      if (sessionId === void 0) return { ok: false, reason: "\u539F\u4F1A\u8BDD id \u672A\u8BB0\u5F55" };
      const dir = await this.storeAt(entry?.root ?? this.rootFor(""), entry?.mode ?? this.config.store).dirOf(id);
      const outcome = humanAccepted ? `\u7528\u6237\u5DF2\u63A5\u53D7\u300C${topic.title}\u300D\u7684\u5F53\u524D\u7ED3\u679C\u3002` : `\u300C${topic.title}\u300D\u5DF2\u901A\u8FC7\u81EA\u52A8\u6587\u672C\u88C1\u51B3\uFF0C\u5C1A\u4E0D\u4EE3\u8868\u4EBA\u5DE5\u9A8C\u6536\u3002\u8BF7\u5148\u6838\u5BF9\u7ED3\u8BBA\u4E0E\u8BC1\u636E\u3002`;
      return await this.wakeSession(sessionId, `<system-reminder>${outcome}\u8BF7\u5728\u539F\u6709\u6388\u6743\u8303\u56F4\u5185\u7EE7\u7EED\u540E\u7EED\u5DE5\u4F5C\uFF0C\u4E0D\u8981\u91CD\u590D\u5DF2\u7ECF\u5B8C\u6210\u7684\u7814\u7A76/\u8BBE\u8BA1\u8F6E\u6B21\u3002\u4EA7\u7269\u76EE\u5F55\uFF1A${dir}\uFF0C\u6700\u7EC8\u6C47\u603B\uFF1A${join5(dir, "final.md")}\u3002</system-reminder>`);
    } catch (error) {
      return { ok: false, reason: error instanceof Error ? error.message : String(error) };
    }
  }
  async entryFor(id) {
    return (await this.readRegistry()).find((entry) => entry.id === id);
  }
  async listAll() {
    const entries = await this.readRegistry();
    const rows = [];
    for (const entry of entries) {
      try {
        const topic = await this.storeAt(entry.root, entry.mode).load(entry.id);
        rows.push({ ...this.view(topic), root: entry.root, store: entry.mode });
      } catch {
      }
    }
    return rows.sort((a, b) => String(b.updated ?? "").localeCompare(String(a.updated ?? "")));
  }
  async detail(id) {
    const entry = await this.entryFor(id);
    if (entry === void 0) return void 0;
    const store = this.storeAt(entry.root, entry.mode);
    const topic = await store.load(id);
    const dir = await store.dirOf(id);
    const reportInfo = await readReportInfo(dir, topic);
    return {
      ...this.view(topic),
      root: entry.root,
      store: entry.mode,
      path: dir,
      report: reportInfo?.path ?? null,
      report_info: reportInfo,
      artifact_details: await this.artifactDetails(dir, topic),
      rounds_detail: topic.rounds
    };
  }
  async artifactDetails(dir, topic) {
    const details = [];
    for (const path of topic.artifacts) {
      if (!path.replace(/\\/g, "/").startsWith("artifacts/")) continue;
      try {
        await resolveContainedPath(dir, path);
      } catch {
        continue;
      }
      const extension = extname3(path).toLowerCase();
      if (/^\.(png|jpe?g|webp|gif|svg)$/.test(extension)) {
        details.push({ path, kind: "image" });
        continue;
      }
      if (extension === ".html" || extension === ".htm") {
        details.push({ path, kind: "demo" });
        continue;
      }
      if (extension === ".zip") {
        details.push({ path, kind: "archive" });
        continue;
      }
      if (/^\.(txt|md|markdown)$/.test(extension)) {
        try {
          const head = (await readContainedPrefix(dir, path, 512)).toString("utf8");
          details.push({ path, kind: isHtmlSource(head) ? "demo" : "code" });
        } catch {
          details.push({ path, kind: "file" });
        }
        continue;
      }
      if (/^\.(css|js|jsx|ts|tsx|json|html)$/.test(extension)) {
        details.push({ path, kind: "code" });
        continue;
      }
      details.push({ path, kind: "file" });
    }
    return details;
  }
  /** Serve one artifact, enforcing both physical topic and artifact boundaries. */
  async readArtifact(id, relativePath) {
    const entry = await this.entryFor(id);
    if (entry === void 0) throw new Error(`unknown topic: ${id}`);
    const store = this.storeAt(entry.root, entry.mode);
    const dir = await store.dirOf(id);
    const normalized = relativePath.replace(/\\/g, "/");
    if (!normalized.startsWith("artifacts/")) throw new Error("artifact path escapes the topic");
    const artifactsRoot = await resolveContainedPath(dir, "artifacts");
    const bytes = await readContainedFile(artifactsRoot, normalized.slice("artifacts/".length), MAX_ARTIFACT_BYTES);
    const textMime = mimeFor(relativePath);
    if (textMime.startsWith("text/plain") || textMime.startsWith("text/markdown")) {
      const head = bytes.subarray(0, 512).toString("utf8");
      if (isHtmlSource(head)) return { bytes, mime: "text/html; charset=utf-8" };
    }
    return { bytes, mime: textMime };
  }
  /** Raw answer text for one round; shown in a new tab from the panel. */
  async answerText(id, round) {
    const entry = await this.entryFor(id);
    if (entry === void 0) return void 0;
    const store = this.storeAt(entry.root, entry.mode);
    const topic = await store.load(id);
    return await store.readAnswer(topic, round);
  }
  /** Bundle one round's artifacts into a zip for download. */
  async bundleArtifacts(id, round) {
    const entry = await this.entryFor(id);
    if (entry === void 0) throw new Error(`unknown topic: ${id}`);
    const store = this.storeAt(entry.root, entry.mode);
    const topic = await store.load(id);
    if (!Number.isInteger(round) || round < 1) throw new Error("round is required");
    return await store.bundleRound(topic, round);
  }
  /** Read a text file (final.md, verdict, question) from inside a topic. */
  async topicText(id, relativePath) {
    const entry = await this.entryFor(id);
    if (entry === void 0) throw new Error(`unknown topic: ${id}`);
    const store = this.storeAt(entry.root, entry.mode);
    const dir = await store.dirOf(id);
    const bytes = await readContainedFile(dir, relativePath, MAX_PREVIEW_BYTES);
    return { text: bytes.toString("utf8"), mime: mimeFor(relativePath) };
  }
  /** Reveal a topic-relative file in the OS file manager. */
  async revealFile(id, relativePath) {
    const entry = await this.entryFor(id);
    if (entry === void 0) throw new Error(`unknown topic: ${id}`);
    const store = this.storeAt(entry.root, entry.mode);
    const dir = await store.dirOf(id);
    const target = await resolveContainedPath(dir, relativePath);
    const reveal = externalRevealCommand(process.platform, target);
    const child = spawn(reveal.command, reveal.args, { detached: true, stdio: "ignore" });
    child.on("error", () => void 0);
    child.unref();
  }
  /** Open one topic file with the OS default application. */
  async openFile(id, relativePath) {
    const entry = await this.entryFor(id);
    if (entry === void 0) throw new Error(`unknown topic: ${id}`);
    const store = this.storeAt(entry.root, entry.mode);
    const dir = await store.dirOf(id);
    const target = await resolveContainedPath(dir, relativePath);
    const opener = externalOpenCommand(process.platform, target);
    const child = spawn(opener.command, opener.args, {
      detached: true,
      stdio: "ignore",
      ...process.platform === "win32" ? { windowsHide: true } : {}
    });
    child.on("error", () => void 0);
    child.unref();
  }
  async act(id, action, conclusion, note, materialPaths, extra) {
    const entry = await this.entryFor(id);
    if (entry === void 0) throw new Error(`unknown topic: ${id}`);
    const engine = this.engineFor(entry.root, entry.mode);
    if (action === "continue") {
      const brief = (extra?.brief ?? "").trim();
      if (brief === "") throw new Error("brief is required");
      this.assertTextSafe("brief", brief);
      const store = this.storeAt(entry.root, entry.mode);
      const topic = await store.load(id);
      let refs;
      const base = extra?.baseArtifact;
      if (base !== void 0) {
        if (topic.channel === "api" && this.config.image.editMode === "off") {
          throw new Error("imageEdit=off\uFF1A\u8BF7\u542F\u7528\u53C2\u8003\u56FE\u7F16\u8F91\u540E\u518D\u4EE5\u6B64\u56FE\u7EE7\u7EED\u4FEE\u6539");
        }
        if ((materialPaths?.length ?? 0) > 0 || extra?.designs !== void 0 && extra.designs !== 1) {
          throw new Error("\u4EE5\u8FD9\u5F20\u7EE7\u7EED\u6539\u4EC5\u4F7F\u7528\u6240\u9009\u5E95\u56FE\uFF0C\u4E14\u672C\u8F6E\u53EA\u751F\u6210\u4E00\u4E2A\u7ED3\u679C");
        }
        refs = [await baseImageMaterial(await store.dirOf(id), topic, base)];
        assertMaterialLimits(refs, this.config.maxFiles, this.config.maxTotalMB);
      }
      if (materialPaths !== void 0 && materialPaths.length > 0) {
        refs = this.withSources(entry.root, await buildManifest(entry.root, materialPaths, void 0, this.config.secretGlobs));
        assertMaterialLimits(refs, this.config.maxFiles, this.config.maxTotalMB);
      }
      const requestedDesigns = extra?.designs;
      if (requestedDesigns !== void 0 && (!Number.isInteger(requestedDesigns) || requestedDesigns < 1 || requestedDesigns > 6)) {
        throw new Error("designs must be an integer between 1 and 6");
      }
      const designs = topic.type === "design" ? base !== void 0 ? 1 : requestedDesigns ?? topic.designs ?? this.config.designs : void 0;
      const editBrief = base === void 0 ? brief : `\u4EE5\u672C\u8F6E\u9644\u5E26\u7684\u56FE\u7247\u4E3A\u552F\u4E00\u5E95\u56FE\uFF0C\u4FDD\u7559\u7528\u6237\u672A\u8981\u6C42\u6539\u53D8\u7684\u90E8\u5206\u3002

${brief}`;
      const followUp = designs === void 0 ? editBrief : this.withDesignCount(editBrief, designs);
      return this.view(await engine.continue(id, followUp, refs, designs, base));
    }
    if (action === "resume") {
      return this.view(await engine.resume(id));
    }
    if (action === "cancel") return this.view(await engine.cancel(id));
    if (action === "delete") {
      const store = this.storeAt(entry.root, entry.mode);
      const topic = await store.load(id);
      const deletable = topic.status === "draft" || topic.status === "completed" || topic.status === "cancelled" || topic.status === "capped" || topic.status === "failed" || topic.status === "stalled";
      if (!deletable) {
        throw new Error(`topic ${id} is ${topic.status}; only draft/capped/completed/failed/stalled/cancelled topics can be deleted${topic.status === "reviewing" ? "\uFF1B\u8BF7\u5148\u64A4\u56DE\u5224\u65AD\u8BF7\u6C42" : ""}`);
      }
      await store.remove(topic);
      await this.removeFromRegistry(id);
      this.topicSessions.delete(id);
      return { deleted: true, topic_id: id, title: topic.title };
    }
    if (action === "accept") {
      const accepted = await engine.accept(id);
      const wake = await this.notifyAccepted(id, accepted);
      return { ...this.view(accepted), wake };
    }
    if (action === "wake") {
      const topic = await this.storeAt(entry.root, entry.mode).load(id);
      if (topic.status !== "completed") {
        throw new Error(`topic ${id} is ${topic.status}; only completed topics can be woken without a decision`);
      }
      const wake = await this.notifyAccepted(id, topic, topic.acceptedAt !== void 0);
      return { ...this.view(topic), wake };
    }
    if (action === "review") {
      const topic = await this.storeAt(entry.root, entry.mode).load(id);
      if (topic.status !== "capped" && topic.status !== "reviewing" && topic.status !== "failed" && topic.status !== "stalled") {
        throw new Error(`topic ${id} is ${topic.status}; only capped/reviewing/failed/stalled topics need review`);
      }
      const wake = await this.notifyCappedReview(id, true);
      if (wake.ok && (topic.status === "capped" || topic.status === "reviewing" || topic.status === "failed" || topic.status === "stalled")) {
        const reviewing = await engine.markReviewing(id);
        return { ...this.view(reviewing), wake };
      }
      return { ...this.view(topic), wake };
    }
    if (action === "review_cancel") {
      return this.view(await engine.cancelReview(id));
    }
    if (action === "human_check") {
      if (conclusion === void 0) throw new Error("conclusion is required");
      const reason = note ?? "";
      if (reason.trim() === "") throw new Error("note is required");
      return this.view(await engine.humanCheck(id, conclusion, reason));
    }
    if (action === "regenerate") {
      const topic = await this.storeAt(entry.root, entry.mode).load(id);
      const finished = topic.status === "completed" || topic.status === "capped" || topic.status === "reviewing";
      const recoverable = topic.status === "failed" || topic.status === "stalled";
      if (!finished && !recoverable) {
        throw new Error(`topic ${id} is ${topic.status}; regenerate needs completed/capped/reviewing or failed/stalled`);
      }
      const feedback = (note ?? "").trim();
      this.assertTextSafe("regenerate note", feedback);
      let refs;
      if (materialPaths !== void 0 && materialPaths.length > 0) {
        refs = this.withSources(entry.root, await buildManifest(entry.root, materialPaths, void 0, this.config.secretGlobs));
        assertMaterialLimits(refs, this.config.maxFiles, this.config.maxTotalMB);
      }
      const brief = [
        `\u7EE7\u7EED\u4E3B\u9898\u300C${topic.title}\u300D\uFF1A\u7528\u6237\u5BF9\u4E0A\u4E00\u8F6E\u7ED3\u679C\u4E0D\u6EE1\u610F\uFF0C\u8BF7\u57FA\u4E8E\u5DF2\u6709\u4E0A\u4E0B\u6587\u91CD\u65B0\u751F\u6210\u5E76\u6539\u8FDB\u3002`,
        "## \u7528\u6237\u53CD\u9988",
        feedback === "" ? "\u6CA1\u6709\u5177\u4F53\u53CD\u9988\uFF1B\u8BF7\u4FDD\u6301\u6210\u529F\u5224\u636E\u4E0D\u53D8\uFF0C\u7ED9\u51FA\u4E0E\u4E0A\u4E00\u8F6E\u660E\u663E\u4E0D\u540C\u7684\u65B0\u65B9\u6848\u3002" : feedback,
        "## \u8981\u6C42",
        "\u4E0D\u8981\u91CD\u590D\u4E0A\u4E00\u8F6E\u5DF2\u786E\u8BA4\u7684\u5185\u5BB9\uFF1B\u7ED9\u51FA\u65B0\u7684\u4EA7\u7269\u6216\u65B9\u5411\uFF0C\u5E76\u8BF4\u660E\u4E0E\u4E0A\u4E00\u7248\u7684\u5DEE\u5F02\u3002"
      ].join("\n\n");
      return this.view(await engine.regenerate(
        id,
        this.withDesignCount(brief, topic.designs ?? this.config.designs),
        feedback,
        refs
      ));
    }
    throw new Error("action must be resume, cancel, delete, accept, review, review_cancel, wake, human_check or regenerate");
  }
  async handle(args, exec) {
    const action = typeof args.action === "string" ? args.action : "";
    const cwd = exec.agent?.session.header.cwd ?? process.cwd();
    switch (action) {
      case "start":
        return await this.start(args, cwd, exec.agent?.session.id);
      case "status": {
        const id = this.requireId(args);
        const { topic, store } = await this.find(cwd, id);
        return { ...this.view(topic), path: await store.dirOf(id) };
      }
      case "read_round":
      case "read_report":
      case "write_report": {
        if (!exec.agent?.session.header.cwd) throw new Error("report actions require a workspace session");
        const id = this.requireId(args);
        const { store } = await this.find(cwd, id);
        if (action === "read_round") return await store.readRound(id, cwd, args.round);
        if (action === "read_report") return await store.readReport(id, cwd);
        const report = await store.writeReport(id, cwd, {
          markdown: this.requireString(args, "markdown"),
          generation: args.generation,
          throughRound: args.through_round,
          expectedRevision: args.expected_revision
        });
        return { topic_id: id, report, path: join5(await store.dirOf(id), report.path) };
      }
      case "list": {
        const store = this.storeFor(cwd);
        const topics = await store.list();
        return { topics: topics.map((topic) => this.view(topic)) };
      }
      case "resume": {
        const id = this.requireId(args);
        const { engine } = await this.find(cwd, id);
        return this.view(await engine.resume(id));
      }
      case "continue": {
        const id = this.requireId(args);
        if (args.base_artifact !== void 0) {
          const baseArtifact = this.requireString(args, "base_artifact");
          const materials = Array.isArray(args.materials) && args.materials.length > 0 ? this.stringArray(args.materials, "materials") : void 0;
          return await this.act(id, "continue", void 0, void 0, materials, {
            brief: this.requireString(args, "brief"),
            baseArtifact,
            ...typeof args.designs === "number" ? { designs: args.designs } : {}
          });
        }
        const brief = this.requireString(args, "brief");
        this.assertTextSafe("brief", brief);
        const paths = Array.isArray(args.materials) && args.materials.length > 0 ? this.stringArray(args.materials, "materials") : [];
        const refs = paths.length > 0 ? this.withSources(cwd, await buildManifest(cwd, paths, void 0, this.config.secretGlobs)) : [];
        assertMaterialLimits(refs, this.config.maxFiles, this.config.maxTotalMB);
        const { engine, topic } = await this.find(cwd, id);
        const requestedDesigns = typeof args.designs === "number" ? args.designs : void 0;
        if (requestedDesigns !== void 0 && (!Number.isInteger(requestedDesigns) || requestedDesigns < 1 || requestedDesigns > 6)) {
          throw new Error("designs must be an integer between 1 and 6");
        }
        const designs = topic.type === "design" ? requestedDesigns ?? topic.designs ?? this.config.designs : void 0;
        const followUp = designs === void 0 ? brief : this.withDesignCount(brief, designs);
        return this.view(await engine.continue(id, followUp, refs, designs));
      }
      case "cancel": {
        const id = this.requireId(args);
        const { engine } = await this.find(cwd, id);
        return this.view(await engine.cancel(id));
      }
      case "human_check": {
        const id = this.requireId(args);
        const conclusion = args.conclusion;
        if (conclusion !== "submitted" && conclusion !== "not_submitted" && conclusion !== "reopen") {
          throw new Error("conclusion must be submitted, not_submitted or reopen");
        }
        const note = typeof args.note === "string" ? args.note : "";
        if (note.trim() === "") throw new Error("human_check requires a note");
        const { engine } = await this.find(cwd, id);
        return this.view(await engine.humanCheck(id, conclusion, note));
      }
      case "accept":
        return await this.act(this.requireId(args), "accept");
      case "wake":
        return await this.act(this.requireId(args), "wake");
      case "review":
        return await this.act(this.requireId(args), "review");
      case "review_cancel":
        return await this.act(this.requireId(args), "review_cancel");
      case "regenerate":
        return await this.act(
          this.requireId(args),
          "regenerate",
          void 0,
          typeof args.note === "string" ? args.note : "",
          Array.isArray(args.materials) && args.materials.length > 0 ? this.stringArray(args.materials, "materials") : void 0
        );
      case "delete":
        return await this.act(this.requireId(args), "delete");
      case "probe": {
        const probe = await this.transportFor().probe();
        return {
          channel: this.config.channel,
          probe: {
            ...probe,
            ...this.config.channel === "api" ? { baseUrl: this.config.image.baseUrl, format: this.config.image.format, editMode: this.config.image.editMode } : {}
          }
        };
      }
      case "login":
        if (this.config.channel === "api") {
          return {
            login: {
              ok: true,
              channel: "api",
              note: "API \u901A\u9053\u4E0D\u9700\u8981\u767B\u5F55\uFF1B\u7528 probe \u68C0\u67E5 imageBaseUrl / imageApiKey / imageModel\u3002"
            }
          };
        }
        return { login: await this.transportFor().login() };
      default:
        throw new Error("action must be start, continue, status, list, resume, cancel, delete, human_check, accept, review, review_cancel, wake, regenerate, probe, login, read_round, read_report or write_report");
    }
  }
  withSources(cwd, refs) {
    return refs.map((ref) => ({
      ...ref,
      source: ref.source ?? (isAbsolute5(ref.path) ? ref.path : resolve6(cwd, ref.path))
    }));
  }
  autoStartEnabled() {
    return this.config.autoStart;
  }
  assertTextSafe(label, value) {
    const secret = findSecret(value);
    if (secret !== void 0) {
      throw new Error(`${label} contains a ${secret}; remove it before sending`);
    }
  }
  judgeEnabled() {
    return this.judgeRoute() !== void 0;
  }
  withDesignCount(brief, designs) {
    if (this.spec.topicType !== "design") return brief;
    const count = Number.isInteger(designs) && designs >= 1 && designs <= 6 ? designs : this.config.designs;
    const delivery = this.config.channel === "api" ? `\u672C\u8F6E\u7531 API \u751F\u6210 ${count} \u5F20\u56FE\uFF0C\u6BCF\u4E2A\u65B9\u5411\u72EC\u7ACB\u6210\u56FE\uFF1BHTML demo \u4E0D\u5728\u6B64\u901A\u9053\u4EA7\u51FA\u3002` : `\u8BF7\u751F\u6210 ${count} \u4E2A\u53EF\u533A\u5206\u7684\u8BBE\u8BA1\u65B9\u5411\uFF0C\u6BCF\u4E2A\u65B9\u5411\u5355\u72EC\u4E00\u5F20\u56FE\uFF1B\u9700\u8981\u524D\u7AEF\u65F6\u7ED9\u4E00\u4E2A\u53EF\u8FD0\u884C\u7684\u5355\u6587\u4EF6 HTML demo\u3002`;
    return `${brief}

## \u51FA\u56FE\u6570\u91CF

${delivery}`;
  }
  async start(args, cwd, sessionId) {
    if (this.config.channel === "api") assertImageApiConfig(this.config.image, { requireKey: true });
    const mode = args.store ?? this.config.store;
    if (mode !== "project" && mode !== "local") throw new Error("store must be project or local");
    const title = this.requireString(args, "title");
    const question = this.requireString(args, "question");
    const brief = this.requireString(args, "brief");
    const designs = typeof args.designs === "number" ? args.designs : this.config.designs;
    if (!Number.isInteger(designs) || designs < 1 || designs > 6) {
      throw new Error("designs must be an integer between 1 and 6");
    }
    const criteria = this.stringArray(args.criteria, "criteria");
    const materialPaths = args.materials === void 0 || args.materials === null || Array.isArray(args.materials) && args.materials.length === 0 ? [] : this.stringArray(args.materials, "materials");
    const reasons = args.materialReasons ?? {};
    this.assertTextSafe("title", title);
    this.assertTextSafe("question", question);
    this.assertTextSafe("brief", brief);
    for (const criterion of criteria) this.assertTextSafe("criteria", criterion);
    for (const [path, reason] of Object.entries(reasons)) {
      if (typeof reason === "string") this.assertTextSafe(`material reason for ${path}`, reason);
    }
    const refs = this.withSources(cwd, await buildManifest(cwd, materialPaths, reasons, this.config.secretGlobs));
    assertMaterialLimits(refs, this.config.maxFiles, this.config.maxTotalMB);
    const defaultRounds = this.config.channel === "api" ? 1 : this.config.rounds;
    const card = {
      title,
      type: this.spec.topicType,
      question,
      successCriteria: criteria,
      brief: this.withDesignCount(brief, designs),
      materials: refs,
      rounds: typeof args.rounds === "number" ? args.rounds : defaultRounds,
      ...this.spec.topicType === "design" ? { designs } : {},
      store: mode,
      model: this.config.channel === "api" ? this.config.image.model : this.config.model,
      ...typeof args.parent === "string" && args.parent !== "" ? { parent: args.parent } : {}
    };
    const store = this.storeAt(this.rootFor(cwd), mode);
    const engine = this.engineFor(cwd, mode);
    const topic = await engine.start(card);
    await this.record(topic, this.rootFor(cwd), sessionId, mode);
    return { ...this.view(topic), store: mode, path: await store.dirOf(topic.id) };
  }
  requireString(args, key) {
    const value = args[key];
    if (typeof value !== "string" || value.trim() === "") throw new Error(`${key} is required`);
    return value;
  }
  requireId(args) {
    const value = args.topic_id ?? args.topicId;
    if (typeof value !== "string" || value.trim() === "") throw new Error("topic_id is required");
    return value;
  }
  stringArray(value, key) {
    if (!Array.isArray(value) || value.length === 0) throw new Error(`${key} must be a non-empty array`);
    const items = value.filter((item) => typeof item === "string" && item.trim() !== "");
    if (items.length !== value.length) throw new Error(`${key} must contain non-empty strings`);
    return items;
  }
  view(topic) {
    return {
      topic_id: topic.id,
      title: topic.title,
      type: topic.type,
      status: topic.status,
      channel: topic.channel,
      model: topic.model,
      judge_enabled: this.judgeEnabled(),
      image_edit_enabled: topic.type === "design" && (topic.channel !== "api" || this.config.image.editMode !== "off"),
      created: topic.created,
      generations: topic.generations ?? [],
      stall_reason: topic.stallReason ?? null,
      rounds: topic.rounds.length,
      last_round: topic.rounds.at(-1) ?? null,
      rounds_cap: topic.roundsCap,
      designs: topic.designs ?? null,
      stop_reason: topic.stopReason ?? null,
      review_from: topic.reviewFrom ?? null,
      accepted_at: topic.acceptedAt ?? null,
      artifacts: topic.artifacts,
      updated: topic.updated
    };
  }
  /**
   * On plugin startup, adopt rounds that were already sent before a restart.
   * The prompt marker in the stored conversation is the proof; anything that
   * cannot be proven is parked as unknown_submission instead of being resent.
   * The api channel has no page to reattach: its in-flight requests die with
   * the host, so those rounds are parked for a human instead of retried.
   */
  async recoverActive() {
    const active = /* @__PURE__ */ new Set(["queued", "uploading", "submitted", "waiting", "answered", "adjudicating"]);
    const registered = await this.readRegistry();
    const entries = await this.knownEntries();
    const discovered = entries.filter((entry) => !registered.some((item) => item.id === entry.id));
    if (discovered.length > 0) await this.mergeRegistry(discovered).catch(() => void 0);
    for (const entry of entries) {
      try {
        const store = this.storeAt(entry.root, entry.mode);
        const topic = await store.load(entry.id).catch(() => void 0);
        if (topic === void 0) continue;
        if (topic.status === "reviewing" && topic.reviewFrom === "answered") continue;
        const engine = this.engineFor(entry.root, entry.mode);
        const recordedChannel = topic.channel === "api" ? "api" : "web";
        if (recordedChannel !== this.config.channel) {
          if (topic.status === "reviewing") await engine.cancelReview(entry.id);
          if (active.has(topic.status)) {
            await engine.interrupt(entry.id, `\u8FD9\u6761\u8BB0\u5F55\u6765\u81EA ${recordedChannel} \u901A\u9053\uFF0C\u5F53\u524D\u914D\u7F6E\u4E3A ${this.config.channel}\uFF1B\u5DF2\u505C\u6B62\u81EA\u52A8\u6062\u590D\uFF0C\u8BF7\u6838\u5BF9\u540E\u91CD\u65B0\u53D1\u8D77`);
            await this.notifyStalled(entry.id, "unknown_submission");
          }
          continue;
        }
        if (this.config.channel === "api") {
          if (topic.status === "reviewing") await engine.cancelReview(entry.id);
          if (active.has(topic.status)) {
            if (topic.status === "answered" || topic.status === "adjudicating") {
              await engine.resume(entry.id).catch(async () => {
                await engine.interrupt(entry.id, "API \u4E3B\u9898\u6062\u590D\u88C1\u51B3\u5931\u8D25\uFF1B\u8BF7\u4EBA\u5DE5\u6838\u5BF9");
                await this.notifyStalled(entry.id, "unknown_submission");
              });
              continue;
            }
            await engine.interrupt(entry.id, "API \u751F\u56FE\u8BF7\u6C42\u5728 DSH \u91CD\u542F\u540E\u5DF2\u4E22\u5931\uFF0C\u672C\u8F6E\u4E0D\u4F1A\u81EA\u52A8\u91CD\u53D1\uFF1B\u5DF2\u751F\u6210\u7684\u56FE\u7247\u89C1 artifacts\uFF0C\u786E\u8BA4\u540E\u53EF\u91CD\u65B0\u53D1\u8D77\u6216\u53D6\u6D88");
            await this.notifyStalled(entry.id, "unknown_submission");
          }
          continue;
        }
        if (topic.status === "answered" || topic.status === "adjudicating") {
          try {
            await engine.resume(entry.id);
          } catch (error) {
            await engine.interrupt(entry.id, `\u6062\u590D\u88C1\u51B3\u5931\u8D25\uFF1A${error instanceof Error ? error.message : String(error)}`);
            await this.notifyStalled(entry.id, "unknown_submission");
          }
          continue;
        }
        if (topic.status === "waiting" || topic.status === "submitted") {
          try {
            await engine.reattach(entry.id);
            const recovered = await store.load(entry.id);
            if (recovered.status === "stalled") await this.notifyStalled(entry.id, recovered.stallReason);
          } catch (error) {
            await engine.interrupt(entry.id, `\u6062\u590D\u5931\u8D25\uFF1A${error instanceof Error ? error.message : String(error)}`);
            await this.notifyStalled(entry.id, "unknown_submission");
          }
        } else if (topic.status === "draft") {
          await engine.interrupt(entry.id, "DSH \u5728\u542F\u52A8\u9636\u6BB5\u4E2D\u65AD\uFF1B\u5DF2\u8F6C\u5165\u4EBA\u5DE5\u6838\u5BF9");
          await this.notifyStalled(entry.id, "unknown_submission");
        } else if (topic.status === "reviewing") {
          await engine.cancelReview(entry.id);
        } else if (active.has(topic.status)) {
          await engine.interrupt(entry.id, "DSH \u91CD\u542F\u65F6\u4EFB\u52A1\u5C1A\u672A\u5B8C\u6210\uFF1B\u5DF2\u505C\u6B62\u81EA\u52A8\u91CD\u53D1\uFF0C\u8BF7\u6838\u5BF9\u540E\u6062\u590D");
          await this.notifyStalled(entry.id, "unknown_submission");
        } else if (topic.status === "failed" || topic.status === "stalled") {
          const reason = topic.stopReason ?? "";
          const pageClosed = /target page|browser has been closed|page.*closed/i.test(reason);
          const recoverable = pageClosed || topic.stallReason === "ui" || topic.stallReason === "unknown_submission";
          const fresh = Date.now() - Date.parse(topic.updated) < 24 * 60 * 60 * 1e3;
          const last = topic.rounds.at(-1);
          const hasSubmission = last?.answeredAt === void 0 && last?.submissionState !== "not_sent" && (last?.submissionId !== void 0 || last?.dispatch !== void 0);
          if (recoverable && fresh && hasSubmission) {
            try {
              await engine.resume(entry.id);
            } catch (error) {
              await engine.interrupt(entry.id, `\u81EA\u52A8\u6062\u590D\u5931\u8D25\uFF1A${error instanceof Error ? error.message : String(error)}`);
            }
          }
        }
      } catch {
      }
    }
  }
  async dispose() {
    const engines = [...this.engines.values()];
    for (const engine of engines) engine.dispose();
    this.engines.clear();
    this.stores.clear();
    this.topicSessions.clear();
    this.imageTransport?.dispose();
    this.imageTransport = void 0;
    const shared = this.shared;
    this.shared = void 0;
    this.transport = void 0;
    const release = () => shared?.release();
    if (engines.length === 0) {
      release();
      return;
    }
    await Promise.allSettled(engines.map((engine) => engine.settle()));
    release();
  }
};
function registerSkill(ctx, spec2) {
  const skills = ctx.get("skills");
  if (skills === void 0) return;
  const root = fileURLToPath(new URL("../resources/skills", import.meta.url));
  const byName = new Map(spec2.skills.map((skill) => [skill.name, skill]));
  ctx.effect(() => skills.registerProvider(() => ({
    name: spec2.name,
    list: async () => spec2.skills.map((skill) => {
      const path = join5(root, skill.dir, "SKILL.md");
      return {
        name: skill.name,
        description: skill.description,
        rank: 350,
        source: spec2.name,
        provider: spec2.name,
        invocation: { modelInvocable: true, userInvocable: true },
        locator: { name: skill.name, path },
        path,
        resourceBase: { kind: "directory", path: join5(root, skill.dir) }
      };
    }),
    get: async (candidate) => {
      const name2 = candidate.name;
      const skill = typeof name2 === "string" ? byName.get(name2) : void 0;
      if (skill === void 0) return void 0;
      const path = join5(root, skill.dir, "SKILL.md");
      return {
        name: skill.name,
        description: skill.description,
        content: await readFile6(path, "utf8"),
        path,
        resourceBase: { kind: "directory", path: join5(root, skill.dir) },
        invocation: { modelInvocable: true, userInvocable: true },
        source: spec2.name,
        provider: spec2.name
      };
    }
  })), `${spec2.name}: skills`);
}
function sendJson(res, status, value) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
  res.end(JSON.stringify(value));
}
function artifactHeaders(mime) {
  const headers = {
    "content-type": mime,
    "cache-control": "no-store",
    "x-content-type-options": "nosniff"
  };
  if (mime.startsWith("text/html")) headers["content-security-policy"] = "sandbox allow-scripts";
  else if (mime.startsWith("image/svg+xml")) headers["content-security-policy"] = "sandbox";
  return headers;
}
var MAX_BODY_BYTES = 1e6;
var BodyTooLargeError = class extends Error {
};
async function readJsonBody(req) {
  const chunks = [];
  let total = 0;
  for await (const chunk of req) {
    const buffer = typeof chunk === "string" ? Buffer.from(chunk, "utf8") : Buffer.from(chunk);
    total += buffer.byteLength;
    if (total > MAX_BODY_BYTES) throw new BodyTooLargeError("body exceeds 1 MB");
    chunks.push(buffer);
  }
  const body = Buffer.concat(chunks).toString("utf8");
  if (body.trim() === "") return {};
  return JSON.parse(body);
}
function registerRoutes(scoped, service, spec2) {
  const webServer = scoped.webServer;
  if (webServer === void 0) return;
  const connection = scoped.get("connection");
  if (connection === void 0) {
    service.noteMissingConnectionGuard();
    return;
  }
  const reject = (req) => {
    const site = req.headers["sec-fetch-site"];
    const value = Array.isArray(site) ? site[0] : site;
    if (req.method === "POST" && value === "cross-site") return 403;
    return connection.requestRejection?.(req);
  };
  scoped.effect(() => webServer.register({
    kind: "exact",
    path: `${spec2.routes}/topics`,
    handler: async (req, res) => {
      const denied = reject(req);
      if (denied !== void 0) return sendJson(res, denied, { error: "unauthorized" });
      try {
        sendJson(res, 200, { topics: await service.listAll() });
      } catch (error) {
        sendJson(res, 500, { error: error instanceof Error ? error.message : String(error) });
      }
    }
  }), `${spec2.name}: topics route`);
  scoped.effect(() => webServer.register({
    kind: "exact",
    path: `${spec2.routes}/topic`,
    handler: async (req, res) => {
      const denied = reject(req);
      if (denied !== void 0) return sendJson(res, denied, { error: "unauthorized" });
      const url = new URL(req.url ?? "/", "http://localhost");
      const id = url.searchParams.get("id") ?? "";
      try {
        const topic = await service.detail(id);
        if (topic === void 0) return sendJson(res, 404, { error: "unknown topic" });
        sendJson(res, 200, { topic });
      } catch (error) {
        sendJson(res, 500, { error: error instanceof Error ? error.message : String(error) });
      }
    }
  }), `${spec2.name}: topic route`);
  scoped.effect(() => webServer.register({
    kind: "exact",
    path: `${spec2.routes}/action`,
    handler: async (req, res) => {
      const denied = reject(req);
      if (denied !== void 0) return sendJson(res, denied, { error: "unauthorized" });
      if (req.method !== "POST") return sendJson(res, 405, { error: "method not allowed" });
      try {
        const body = await readJsonBody(req);
        const id = typeof body.topic_id === "string" ? body.topic_id : "";
        const action = typeof body.action === "string" ? body.action : "";
        const conclusion = body.conclusion === "submitted" || body.conclusion === "not_submitted" || body.conclusion === "reopen" ? body.conclusion : void 0;
        const note = typeof body.note === "string" ? body.note : void 0;
        const brief = typeof body.brief === "string" ? body.brief : void 0;
        const designs = typeof body.designs === "number" ? body.designs : void 0;
        const baseArtifact = typeof body.base_artifact === "string" ? body.base_artifact : void 0;
        const materials = Array.isArray(body.materials) ? body.materials.filter((item) => typeof item === "string" && item.trim() !== "") : void 0;
        if (action === "probe" || action === "login") {
          sendJson(res, 200, await service.handle({ action }, { agent: void 0 }));
          return;
        }
        sendJson(res, 200, {
          topic: await service.act(id, action, conclusion, note, materials, {
            ...brief !== void 0 ? { brief } : {},
            ...designs !== void 0 ? { designs } : {},
            ...baseArtifact !== void 0 ? { baseArtifact } : {}
          })
        });
      } catch (error) {
        const status = error instanceof BodyTooLargeError ? 413 : 400;
        sendJson(res, status, { error: error instanceof Error ? error.message : String(error) });
      }
    }
  }), `${spec2.name}: action route`);
  scoped.effect(() => webServer.register({
    kind: "exact",
    path: `${spec2.routes}/asset`,
    handler: async (req, res) => {
      const denied = reject(req);
      if (denied !== void 0) return sendJson(res, denied, { error: "unauthorized" });
      const url = new URL(req.url ?? "/", "http://localhost");
      const id = url.searchParams.get("id") ?? "";
      const path = url.searchParams.get("path") ?? "";
      try {
        const asset = await service.readArtifact(id, path);
        res.writeHead(200, artifactHeaders(asset.mime));
        res.end(asset.bytes);
      } catch (error) {
        sendJson(res, error instanceof FileSizeLimitError ? 413 : 404, { error: error instanceof FileSizeLimitError ? error.message : "unknown artifact" });
      }
    }
  }), `${spec2.name}: asset route`);
  scoped.effect(() => webServer.register({
    kind: "prefix",
    path: `${spec2.routes}/raw`,
    handler: async (req, res) => {
      const denied = reject(req);
      if (denied !== void 0) return sendJson(res, denied, { error: "unauthorized" });
      const url = new URL(req.url ?? "/", "http://localhost");
      const rest = url.pathname.slice(`${spec2.routes}/raw`.length).replace(/^\/+/, "");
      const slash = rest.indexOf("/");
      if (slash <= 0) return sendJson(res, 404, { error: "unknown artifact" });
      try {
        const id = decodeURIComponent(rest.slice(0, slash));
        const relativePath = decodeURIComponent(rest.slice(slash + 1));
        const asset = await service.readArtifact(id, relativePath);
        res.writeHead(200, artifactHeaders(asset.mime));
        res.end(url.searchParams.get("preview") === "1" && asset.mime.startsWith("text/html") ? previewHtml(Buffer.from(asset.bytes).toString("utf8")) : asset.bytes);
      } catch (error) {
        sendJson(res, error instanceof FileSizeLimitError ? 413 : 404, { error: error instanceof FileSizeLimitError ? error.message : "unknown artifact" });
      }
    }
  }), `${spec2.name}: raw artifact route`);
  scoped.effect(() => webServer.register({
    kind: "exact",
    path: `${spec2.routes}/bundle`,
    handler: async (req, res) => {
      const denied = reject(req);
      if (denied !== void 0) return sendJson(res, denied, { error: "unauthorized" });
      const url = new URL(req.url ?? "/", "http://localhost");
      const id = url.searchParams.get("id") ?? "";
      const round = Number(url.searchParams.get("round") ?? "0");
      try {
        const bundle = await service.bundleArtifacts(id, round);
        res.writeHead(200, {
          "content-type": "application/zip",
          "content-disposition": `attachment; filename="${bundle.name}"`,
          "cache-control": "no-store",
          "x-content-type-options": "nosniff"
        });
        res.end(bundle.bytes);
      } catch (error) {
        sendJson(res, 404, { error: error instanceof Error ? error.message : String(error) });
      }
    }
  }), `${spec2.name}: bundle route`);
  scoped.effect(() => webServer.register({
    kind: "exact",
    path: `${spec2.routes}/answer`,
    handler: async (req, res) => {
      const denied = reject(req);
      if (denied !== void 0) return sendJson(res, denied, { error: "unauthorized" });
      const url = new URL(req.url ?? "/", "http://localhost");
      const id = url.searchParams.get("id") ?? "";
      const round = Number(url.searchParams.get("round") ?? "0");
      try {
        const text = await service.answerText(id, round);
        if (text === void 0) return sendJson(res, 404, { error: "answer not found" });
        res.writeHead(200, { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store", "x-content-type-options": "nosniff" });
        res.end(text);
      } catch (error) {
        sendJson(res, 500, { error: error instanceof Error ? error.message : String(error) });
      }
    }
  }), `${spec2.name}: answer route`);
  scoped.effect(() => webServer.register({
    kind: "exact",
    path: `${spec2.routes}/file`,
    handler: async (req, res) => {
      const denied = reject(req);
      if (denied !== void 0) return sendJson(res, denied, { error: "unauthorized" });
      const url = new URL(req.url ?? "/", "http://localhost");
      const id = url.searchParams.get("id") ?? "";
      const path = url.searchParams.get("path") ?? "";
      try {
        const file = await service.topicText(id, path);
        const mime = file.mime.includes("charset=") ? file.mime : `${file.mime}; charset=utf-8`;
        res.writeHead(200, artifactHeaders(mime));
        res.end(file.text);
      } catch (error) {
        sendJson(res, error instanceof FileSizeLimitError ? 413 : 404, { error: error instanceof FileSizeLimitError ? error.message : "unknown file" });
      }
    }
  }), `${spec2.name}: file route`);
  scoped.effect(() => webServer.register({
    kind: "exact",
    path: `${spec2.routes}/open`,
    handler: async (req, res) => {
      const denied = reject(req);
      if (denied !== void 0) return sendJson(res, denied, { error: "unauthorized" });
      if (req.method !== "POST") return sendJson(res, 405, { error: "method not allowed" });
      try {
        const body = await readJsonBody(req);
        const id = typeof body.topic_id === "string" ? body.topic_id : "";
        const relativePath = typeof body.path === "string" ? body.path : "";
        if (body.reveal === false) await service.openFile(id, relativePath);
        else await service.revealFile(id, relativePath);
        sendJson(res, 200, { ok: true });
      } catch (error) {
        const status = error instanceof BodyTooLargeError ? 413 : 400;
        sendJson(res, status, { error: error instanceof Error ? error.message : String(error) });
      }
    }
  }), `${spec2.name}: open route`);
}
function toolDescription(spec2, config) {
  if (spec2.topicType === "design") {
    if (config.channel === "api") {
      return [
        `\u7528 OpenAI \u517C\u5BB9\u751F\u56FE API\uFF08${config.image.model}\uFF09\u6309\u65B9\u5411\u751F\u6210\u8BBE\u8BA1\u56FE\uFF0C\u4FDD\u5B58\u5230\u672C\u5730\u5E76\u51FA\u73B0\u5728\u8BBE\u8BA1\u9762\u677F\uFF1B\u6B64\u901A\u9053\u53EA\u51FA\u56FE\uFF0C\u4E0D\u4EA7\u51FA HTML demo\u3002`,
        "start \u524D\u5FC5\u987B\u5148\u5C55\u793A\u8BBE\u8BA1\u5361\uFF08\u76EE\u6807\u3001\u6210\u529F\u5224\u636E\u3001\u6750\u6599\u3001\u8F6E\u6B21\u3001\u4EA7\u7269\u8DEF\u5F84\u3001\u6A21\u578B\uFF09\uFF1B\u7528\u6237\u786E\u8BA4\u540E\u4F20 confirmed=true\u3002",
        "key \u53EA\u8BFB\u63D2\u4EF6\u8BBE\u7F6E\u6216\u73AF\u5883\u53D8\u91CF GPT_IMAGE_API_KEY\uFF0C\u4E0D\u8981\u5728\u4F1A\u8BDD\u91CC\u56DE\u663E\uFF1Bprobe \u68C0\u67E5 base URL / key / \u6A21\u578B\u540D\u3002",
        "action: start | continue | status | list | resume | cancel | delete | human_check | accept | review | review_cancel | wake | regenerate | probe | login | read_round | read_report | write_report\u3002\u4EA4\u4ED8\uFF1Aread_round \u6838\u5BF9\u8BC1\u636E\uFF0Cread_report \u53D6 revision\uFF0C\u518D write_report \u5199\u5F53\u524D\u4E3B\u9898\u56FA\u5B9A\u4EA4\u4ED8\u7A3F\uFF08local/project \u5747\u652F\u6301\uFF09\uFF0C\u4E0D\u4F20\u6587\u4EF6\u8DEF\u5F84\u3002"
      ].join(" ");
    }
    return [
      "\u7528 ChatGPT \u7F51\u9875\u4F1A\u8BDD\u751F\u6210\u8BBE\u8BA1\u56FE\u4E0E\u524D\u7AEF\u4EE3\u7801/HTML demo\uFF0C\u4EA7\u7269\u4FDD\u5B58\u5230\u672C\u5730\u5E76\u51FA\u73B0\u5728\u8BBE\u8BA1\u9762\u677F\uFF1B\u9ED8\u8BA4\u4F18\u5148\u4F7F\u7528\u53EF\u7528\u7684 Pro\uFF0C\u5426\u5219\u6CBF\u7528\u8D26\u53F7\u5F53\u524D\u6A21\u578B\u3002",
      "start \u524D\u5FC5\u987B\u5148\u5C55\u793A\u8BBE\u8BA1\u5361\uFF08\u76EE\u6807\u3001\u6210\u529F\u5224\u636E\u3001\u6750\u6599\u3001\u8F6E\u6B21\u3001\u4EA7\u7269\u8DEF\u5F84\uFF09\uFF1B\u7528\u6237\u786E\u8BA4\u540E\u4F20 confirmed=true\u3002",
      "action: start | continue | status | list | resume | cancel | delete | human_check | accept | review | review_cancel | wake | regenerate | probe | login | read_round | read_report | write_report\u3002\u4EA4\u4ED8\uFF1Aread_round \u6838\u5BF9\u8BC1\u636E\uFF0Cread_report \u53D6 revision\uFF0C\u518D write_report \u5199\u5F53\u524D\u4E3B\u9898\u56FA\u5B9A\u4EA4\u4ED8\u7A3F\uFF08local/project \u5747\u652F\u6301\uFF09\uFF0C\u4E0D\u4F20\u6587\u4EF6\u8DEF\u5F84\u3002"
    ].join(" ");
  }
  return [
    "\u7528 ChatGPT \u7F51\u9875\u4F1A\u8BDD\u505A\u65E0\u4EBA\u503C\u5B88\u7684\u591A\u8F6E\u8C03\u7814\uFF1B\u9ED8\u8BA4\u4F18\u5148\u4F7F\u7528\u53EF\u7528\u7684 Pro\uFF0C\u5426\u5219\u6CBF\u7528\u8D26\u53F7\u5F53\u524D\u6A21\u578B\u3002",
    "start \u524D\u5FC5\u987B\u5148\u5411\u7528\u6237\u5C55\u793A\u7814\u7A76\u5361\uFF08\u95EE\u9898\u3001\u6210\u529F\u5224\u636E\u3001\u6750\u6599\u3001\u8F6E\u6B21\u4E0A\u9650\u3001\u4EA7\u7269\u8DEF\u5F84\uFF09\uFF1B\u7528\u6237\u786E\u8BA4\u540E\u4F20 confirmed=true\u3002",
    "action: start | continue | status | list | resume | cancel | delete | human_check | accept | review | review_cancel | wake | regenerate | probe | login | read_round | read_report | write_report\u3002\u4EA4\u4ED8\uFF1Aread_round \u6838\u5BF9\u8BC1\u636E\uFF0Cread_report \u53D6 revision\uFF0C\u518D write_report \u5199\u5F53\u524D\u4E3B\u9898\u56FA\u5B9A\u4EA4\u4ED8\u7A3F\uFF08local/project \u5747\u652F\u6301\uFF09\uFF0C\u4E0D\u4F20\u6587\u4EF6\u8DEF\u5F84\u3002"
  ].join(" ");
}
function createPlugin(spec2) {
  return (ctx, config) => {
    const resolved = resolvePluginConfig(spec2, config);
    const service = new ProResearchService(ctx, resolved, homeDir(), spec2);
    ctx.effect(() => () => service.dispose(), `${spec2.name}: close browser`);
    ctx.effect(() => {
      const timer = setTimeout(() => {
        void service.recoverActive();
      }, 2500);
      timer.unref?.();
      return () => clearTimeout(timer);
    }, `${spec2.name}: recover interrupted rounds`);
    ctx.inject(["skills"], (scoped) => registerSkill(scoped, spec2));
    ctx.inject(["agents"], (scoped) => {
      const factory = scoped.get("agents");
      if (factory !== void 0) service.useAgentFactory(factory);
    });
    ctx.inject(["sessionController"], (scoped) => {
      const controller = scoped.get("sessionController");
      if (controller !== void 0) service.useSessionController(controller);
    });
    ctx.inject(["agentDefaultModel"], (scoped) => {
      const model = scoped.get("agentDefaultModel");
      if (model !== void 0) service.useDefaultModel(model);
    });
    ctx.inject(["webServer", "connection"], (scoped) => registerRoutes(scoped, service, spec2));
    ctx.effect(() => ctx.tools.register(defineTool({
      name: spec2.tool,
      description: toolDescription(spec2, resolved),
      parameters: {
        action: {
          type: "string",
          required: true,
          enum: ["start", "continue", "status", "list", "resume", "cancel", "delete", "human_check", "accept", "review", "review_cancel", "wake", "regenerate", "probe", "login", "read_round", "read_report", "write_report"],
          description: "start|continue|status|list|resume|cancel|delete|human_check|accept|review|review_cancel|wake|regenerate|probe|login|read_round|read_report|write_report"
        },
        title: { type: "string", description: "\u4E3B\u9898\u6807\u9898\uFF08start \u5FC5\u586B\uFF09" },
        question: { type: "string", description: "\u4E3B\u9898\u76EE\u6807/\u7814\u7A76\u95EE\u9898\uFF08start \u5FC5\u586B\uFF09" },
        brief: { type: "string", description: "\u53D1\u7ED9 Pro \u7684\u5B8C\u6574 brief\uFF08start \u4E0E continue \u5FC5\u586B\uFF09" },
        criteria: { type: "array", items: { type: "string" }, description: "\u6210\u529F\u5224\u636E\uFF08start \u5FC5\u586B\uFF09" },
        materials: { type: "array", items: { type: "string" }, description: "\u6750\u6599\u8DEF\u5F84\uFF08start/continue/regenerate \u53EF\u9009\uFF09" },
        base_artifact: { type: "string", description: "\u4EC5 design \u7684 continue\uFF1A\u5F53\u524D\u4E3B\u9898\u5DF2\u8BB0\u5F55\u7684 PNG/JPEG/WebP \u4EA7\u7269\u8DEF\u5F84\uFF1B\u53EA\u4EE5\u6B64\u56FE\u4FEE\u6539\uFF0C\u4E00\u8F6E\u4E00\u4E2A\u7ED3\u679C\uFF0C\u4E0D\u4E0E materials \u5408\u7528" },
        materialReasons: { type: "object", additionalProperties: true, description: "\u53EF\u9009\uFF1A\u6750\u6599\u8DEF\u5F84 \u2192 \u9009\u62E9\u7406\u7531" },
        rounds: { type: "number", description: "\u672C\u6B21\u8F6E\u6B21\u4E0A\u9650\uFF081\u201310\uFF0C\u4EC5 start\uFF1Bcontinue \u56FA\u5B9A\u52A0\u4E00\u8F6E\uFF09" },
        store: { type: "string", enum: ["project", "local"], description: "\u4EC5 start\uFF1A\u7814\u7A76\u5361\u786E\u8BA4\u7684\u8BB0\u5F55\u4F4D\u7F6E\uFF1Bproject \u5199\u4ED3\u5E93\uFF0Clocal \u5199 DSH \u672C\u673A\uFF1B\u7701\u7565\u65F6\u4F7F\u7528\u63D2\u4EF6\u8BBE\u7F6E" },
        designs: { type: "number", description: "\u8BBE\u8BA1\u63D2\u4EF6\u672C\u8F6E\u65B9\u5411/\u56FE\u7247\u6570\uFF081\u20136\uFF0C\u4EC5 design \u4E3B\u9898\u7684 start/continue\uFF09" },
        topic_id: { type: "string", description: "status/continue/resume/cancel/delete/human_check/accept/review/review_cancel/wake/regenerate \u7684\u4E3B\u9898 id" },
        parent: { type: "string", description: "\u53EF\u9009\uFF1A\u7236\u4E3B\u9898 id\uFF0C\u4EC5 start \u4F7F\u7528" },
        conclusion: {
          type: "string",
          enum: ["submitted", "not_submitted", "reopen"],
          description: "human_check \u7ED3\u8BBA\uFF1Asubmitted|not_submitted|reopen"
        },
        note: { type: "string", description: "human_check \u4F9D\u636E\uFF1Bregenerate \u65F6\u4F5C\u4E3A\u4E0D\u6EE1\u610F\u70B9/\u65B0\u8981\u6C42" },
        round: { type: "number", description: "read_round\uFF1A\u4E3B\u9898\u5185\u5DF2\u56DE\u7B54\u7684\u5168\u5C40\u8F6E\u6B21\u5E8F\u53F7\uFF0C\u8BFB\u53D6\u539F\u7B54\u590D\u4E0E\u88C1\u51B3" },
        markdown: { type: "string", description: "write_report\uFF1A\u5DF2\u6838\u5BF9\u8BC1\u636E\u7684\u4EA4\u4ED8\u7A3F\u6B63\u6587\uFF08\u6700\u591A 256 KiB\uFF09\uFF0C\u4E0D\u8981\u5305\u542B\u8986\u76D6\u8303\u56F4\u6587\u4EF6\u5934" },
        generation: { type: "number", description: "write_report\uFF1A\u5B9E\u9645\u8986\u76D6\u7684\u5F53\u524D\u65B9\u6848\u7248\u672C\u5E8F\u53F7" },
        through_round: { type: "number", description: "write_report\uFF1A\u5B9E\u9645\u6574\u5408\u81F3\u6700\u65B0\u5DF2\u56DE\u7B54\u8F6E\u6B21\u7684\u5168\u5C40\u5E8F\u53F7" },
        expected_revision: { type: "string", description: "write_report\uFF1Aread_report \u8FD4\u56DE\u7684 revision\uFF1B\u6CA1\u6709\u65E7\u7A3F\u65F6\u4F20\u7A7A\u5B57\u7B26\u4E32\uFF0C\u9632\u6B62\u8986\u76D6\u4ED6\u4EBA\u66F4\u65B0" },
        confirmed: { type: "boolean", description: "\u7528\u6237\u5DF2\u6388\u6743\u4EFB\u52A1/\u4EA4\u4ED8\uFF1Bstart\u3001continue\u3001regenerate\u3001accept\u3001delete\u3001write_report \u9700\u8981 true" }
      },
      output: {
        schema: {
          type: "object",
          additionalProperties: true
        },
        render: (_args, value) => [{ type: "text", text: JSON.stringify(value, null, 2) }]
      },
      execute: async (args, exec) => {
        const writeAction = args.action === "start" || args.action === "continue" || args.action === "regenerate" || args.action === "accept" || args.action === "delete" || args.action === "write_report";
        const autoStart = args.action === "start" && service.autoStartEnabled();
        if (writeAction && args.confirmed !== true && !autoStart) {
          throw new Error("start, continue, regenerate, accept, delete and write_report require confirmed=true after user authorization");
        }
        return await service.handle(args, exec);
      }
    })), `${spec2.name}: tool`);
  };
}

// packages/research/src/index.ts
var name = "chatgpt-pro-research";
var inject = ["tools"];
var spec = {
  name,
  tool: "pro_research",
  routes: "/chatgpt-pro-research",
  topicType: "research",
  homeSubdir: "chatgpt-pro-research",
  storeSubdir: "research",
  skills: [{
    name: "pro-research",
    dir: "pro-research",
    description: "\u7528 ChatGPT \u7F51\u9875\u4F1A\u8BDD\u505A\u65E0\u4EBA\u503C\u5B88\u7684\u591A\u8F6E\u8C03\u7814\uFF0C\u9ED8\u8BA4\u4F18\u5148 Pro\u3001\u4E0D\u53EF\u7528\u65F6\u6CBF\u7528\u5F53\u524D\u6A21\u578B\uFF1B\u53EA\u5728\u7528\u6237\u660E\u786E\u8981\u6C42 ChatGPT \u8C03\u7814\u65F6\u4F7F\u7528\u3002"
  }]
};
var apply = createPlugin(spec);
function resolveResearchConfig(config) {
  return resolvePluginConfig(spec, config);
}
export {
  Config,
  apply,
  inject,
  name,
  resolveResearchConfig
};
