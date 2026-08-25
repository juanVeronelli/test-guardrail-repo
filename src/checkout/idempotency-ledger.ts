export interface PaymentReceipt {
  readonly amountCents: number;
  readonly chargeId: string;
  readonly customerId: string;
  readonly idempotencyKey: string;
  readonly status: 'paid';
}

export class IdempotencyLedger {
  readonly #receipts = new Map<string, PaymentReceipt>();
  get(key: string): PaymentReceipt | undefined { return this.#receipts.get(key); }
  save(key: string, receipt: PaymentReceipt): void { this.#receipts.set(key, Object.freeze({ ...receipt })); }
}
