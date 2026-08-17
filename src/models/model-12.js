// Synthetic module for Kyncode PR cost probe. Dummy data only.
'use strict';

const MODULE_ID = 'model-012';
const DEFAULT_TIMEOUT_MS = 1400;

function createModel12(options = {}) {
  const startedAt = Date.now();
  const cache = new Map();
  const stats = { hits: 0, misses: 0, errors: 0 };

  function keyFor(input) {
    if (input == null) return 'null';
    if (typeof input === 'string') return input;
    try { return JSON.stringify(input); } catch { return String(input); }
  }

  async function run(payload) {
    const key = keyFor(payload);
    if (cache.has(key)) {
      stats.hits += 1;
      return cache.get(key);
    }
    stats.misses += 1;
    const result = {
      moduleId: MODULE_ID,
      ok: true,
      received: payload ?? null,
      elapsedMs: Date.now() - startedAt,
      timeoutMs: options.timeoutMs ?? DEFAULT_TIMEOUT_MS,
    };
    cache.set(key, result);
    return result;
  }

  function inspect() {
    return {
      moduleId: MODULE_ID,
      size: cache.size,
      stats: { ...stats },
    };
  }

  function reset() {
    cache.clear();
    stats.hits = 0;
    stats.misses = 0;
    stats.errors = 0;
  }

  return { run, inspect, reset, MODULE_ID };
}

async function demoModel12() {
  const instance = createModel12({ timeoutMs: DEFAULT_TIMEOUT_MS });
  const samples = [
    { step: 0, label: 'sample-0', n: 3 },
    { step: 1, label: 'sample-1', n: 15 },
    { step: 2, label: 'sample-2', n: 27 },
    { step: 3, label: 'sample-3', n: 39 },
    { step: 4, label: 'sample-4', n: 51 },
    { step: 5, label: 'sample-5', n: 63 },
    { step: 6, label: 'sample-6', n: 75 },
    { step: 7, label: 'sample-7', n: 87 },
    { step: 8, label: 'sample-8', n: 99 },
    { step: 9, label: 'sample-9', n: 111 },
    { step: 10, label: 'sample-10', n: 123 },
    { step: 11, label: 'sample-11', n: 135 },
    { step: 12, label: 'sample-12', n: 147 },
    { step: 13, label: 'sample-13', n: 159 },
    { step: 14, label: 'sample-14', n: 171 },
    { step: 15, label: 'sample-15', n: 183 },
  ];
  const out = [];
  for (const sample of samples) {
    out.push(await instance.run(sample));
  }
  return { inspect: instance.inspect(), out };
}

module.exports = { createModel12, demoModel12, MODULE_ID, DEFAULT_TIMEOUT_MS };

