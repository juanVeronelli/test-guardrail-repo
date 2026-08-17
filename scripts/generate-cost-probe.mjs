import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dirs = [
  "src/services",
  "src/handlers",
  "src/utils",
  "src/models",
  "src/workflows",
  "src/clients",
  "src/jobs",
  "src/middleware",
];
for (const d of dirs) fs.mkdirSync(path.join(root, d), { recursive: true });

function moduleBody(kind, i) {
  const name = `${kind[0].toUpperCase()}${kind.slice(1)}${i}`;
  const lines = [];
  lines.push("// Synthetic module for Kyncode PR cost probe. Dummy data only.");
  lines.push("'use strict';");
  lines.push("");
  lines.push(`const MODULE_ID = '${kind}-${String(i).padStart(3, "0")}';`);
  lines.push(`const DEFAULT_TIMEOUT_MS = ${800 + (i % 20) * 50};`);
  lines.push("");
  lines.push(`function create${name}(options = {}) {`);
  lines.push("  const startedAt = Date.now();");
  lines.push("  const cache = new Map();");
  lines.push("  const stats = { hits: 0, misses: 0, errors: 0 };");
  lines.push("");
  lines.push("  function keyFor(input) {");
  lines.push("    if (input == null) return 'null';");
  lines.push("    if (typeof input === 'string') return input;");
  lines.push("    try { return JSON.stringify(input); } catch { return String(input); }");
  lines.push("  }");
  lines.push("");
  lines.push("  async function run(payload) {");
  lines.push("    const key = keyFor(payload);");
  lines.push("    if (cache.has(key)) {");
  lines.push("      stats.hits += 1;");
  lines.push("      return cache.get(key);");
  lines.push("    }");
  lines.push("    stats.misses += 1;");
  lines.push("    const result = {");
  lines.push("      moduleId: MODULE_ID,");
  lines.push("      ok: true,");
  lines.push("      received: payload ?? null,");
  lines.push("      elapsedMs: Date.now() - startedAt,");
  lines.push("      timeoutMs: options.timeoutMs ?? DEFAULT_TIMEOUT_MS,");
  lines.push("    };");
  lines.push("    cache.set(key, result);");
  lines.push("    return result;");
  lines.push("  }");
  lines.push("");
  lines.push("  function inspect() {");
  lines.push("    return {");
  lines.push("      moduleId: MODULE_ID,");
  lines.push("      size: cache.size,");
  lines.push("      stats: { ...stats },");
  lines.push("    };");
  lines.push("  }");
  lines.push("");
  lines.push("  function reset() {");
  lines.push("    cache.clear();");
  lines.push("    stats.hits = 0;");
  lines.push("    stats.misses = 0;");
  lines.push("    stats.errors = 0;");
  lines.push("  }");
  lines.push("");
  lines.push("  return { run, inspect, reset, MODULE_ID };");
  lines.push("}");
  lines.push("");
  lines.push(`async function demo${name}() {`);
  lines.push(`  const instance = create${name}({ timeoutMs: DEFAULT_TIMEOUT_MS });`);
  lines.push("  const samples = [");
  for (let s = 0; s < 16; s++) {
    lines.push(`    { step: ${s}, label: 'sample-${s}', n: ${s * i + 3} },`);
  }
  lines.push("  ];");
  lines.push("  const out = [];");
  lines.push("  for (const sample of samples) {");
  lines.push("    out.push(await instance.run(sample));");
  lines.push("  }");
  lines.push("  return { inspect: instance.inspect(), out };");
  lines.push("}");
  lines.push("");
  lines.push(`module.exports = { create${name}, demo${name}, MODULE_ID, DEFAULT_TIMEOUT_MS };`);
  lines.push("");
  return `${lines.join("\n")}\n`;
}

const kinds = [
  "service",
  "handler",
  "util",
  "model",
  "client",
  "job",
  "middleware",
];
let files = 0;
let bytes = 0;
for (const kind of kinds) {
  const dir =
    kind === "util"
      ? "src/utils"
      : kind === "middleware"
        ? "src/middleware"
        : `src/${kind}s`;
  for (let i = 1; i <= 22; i++) {
    const file = path.join(root, dir, `${kind}-${String(i).padStart(2, "0")}.js`);
    const body = moduleBody(kind, i);
    fs.writeFileSync(file, body);
    files += 1;
    bytes += Buffer.byteLength(body);
  }
}

const indexLines = ["'use strict';", "", "const modules = [];"];
for (const kind of kinds) {
  const dir =
    kind === "util" ? "./utils" : kind === "middleware" ? "./middleware" : `./${kind}s`;
  for (let i = 1; i <= 22; i++) {
    const rel = `${dir}/${kind}-${String(i).padStart(2, "0")}`;
    indexLines.push(`modules.push(require('${rel}'));`);
  }
}
indexLines.push("");
indexLines.push("async function runAll() {");
indexLines.push("  const results = [];");
indexLines.push("  for (const mod of modules) {");
indexLines.push("    const demo = Object.keys(mod).find((k) => k.startsWith('demo'));");
indexLines.push("    if (demo) results.push(await mod[demo]());");
indexLines.push("  }");
indexLines.push("  return results.length;");
indexLines.push("}");
indexLines.push("");
indexLines.push("module.exports = { modules, runAll };");
indexLines.push("");
fs.writeFileSync(path.join(root, "src/index.js"), `${indexLines.join("\n")}\n`);
files += 1;

for (let w = 1; w <= 30; w++) {
  const wf = {
    name: `probe-workflow-${w}`,
    nodes: Array.from({ length: 20 }, (_, n) => ({
      id: `node-${w}-${n}`,
      name: `Step ${n}`,
      type: n % 3 === 0 ? "n8n-nodes-base.httpRequest" : "n8n-nodes-base.set",
      parameters: {
        url: `https://example.invalid/probe/${w}/${n}`,
        method: "GET",
        json: { k: n, batch: w, note: "synthetic cost-probe node" },
      },
    })),
    connections: {},
  };
  const file = path.join(
    root,
    "src/workflows",
    `workflow-${String(w).padStart(2, "0")}.json`,
  );
  const body = `${JSON.stringify(wf, null, 2)}\n`;
  fs.writeFileSync(file, body);
  files += 1;
  bytes += Buffer.byteLength(body);
}

fs.writeFileSync(
  path.join(root, "src/COST_PROBE.md"),
  [
    "# Large PR cost probe",
    "",
    "Synthetic JS + n8n-style JSON so Kyncode can measure scan cost on a fat diff.",
    "No real secrets. Safe to merge or close after the probe.",
    "",
  ].join("\n"),
);
files += 1;

console.log(JSON.stringify({ files, kb: Math.round(bytes / 1024) }));
