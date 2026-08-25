import { IdempotencyLedger, type PaymentCommand, type PaymentAttempt } from './idempotency-ledger.js';

export class PaymentService {
  readonly #ledger = new IdempotencyLedger();
  #sequence = 0;

  authorize(command: PaymentCommand): PaymentAttempt {
    return this.#ledger.claim(command, () => {
      this.#sequence += 1;
      return `ch_staging_${String(this.#sequence).padStart(6, '0')}`;
    });
  }
}
