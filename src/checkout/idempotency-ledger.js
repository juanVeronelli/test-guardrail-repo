export class IdempotencyLedger {
  #receipts = new Map();

  get(key) { return this.#receipts.get(key); }
  has(key) { return this.#receipts.has(key); }
  save(key, receipt) { this.#receipts.set(key, Object.freeze({ ...receipt })); }
}
