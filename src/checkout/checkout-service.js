import { assertUsdCents } from '../shared/money.js';

export class CheckoutService {
  constructor({ gateway, ledger, lockManager }) {
    this.gateway = gateway;
    this.ledger = ledger;
    this.lockManager = lockManager;
  }

  async confirmPayment({ idempotencyKey, amountCents, customerId }) {
    assertUsdCents(amountCents);
    if (!idempotencyKey || !customerId) throw new TypeError('payment identity is required');

    const existing = this.ledger.get(idempotencyKey);
    if (existing) return existing;

    // BUG: the check and capture are not serialized. Concurrent retries can capture twice.
    const charge = await this.gateway.capture({ amountCents, customerId, idempotencyKey });
    const receipt = {
      amountCents,
      chargeId: charge.id,
      customerId,
      idempotencyKey,
      status: 'paid',
    };
    this.ledger.save(idempotencyKey, receipt);
    return receipt;
  }
}
