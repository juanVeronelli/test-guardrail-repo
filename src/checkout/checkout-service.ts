import { assertUsdCents } from '../shared/money.js';
import { LockManager } from '../shared/lock-manager.js';
import { IdempotencyLedger, type PaymentReceipt } from './idempotency-ledger.js';

interface PaymentGateway {
  capture(input: { readonly amountCents: number; readonly customerId: string; readonly idempotencyKey: string }): Promise<{ readonly id: string }>;
}

export class CheckoutService {
  constructor(private readonly gateway: PaymentGateway, private readonly ledger: IdempotencyLedger, private readonly lockManager: LockManager) {}

  async confirmPayment(input: { readonly idempotencyKey: string; readonly amountCents: number; readonly customerId: string }): Promise<PaymentReceipt> {
    assertUsdCents(input.amountCents);
    if (!input.idempotencyKey || !input.customerId) throw new TypeError('payment identity is required');
    return this.lockManager.withKey(input.idempotencyKey, async () => {
      const existing = this.ledger.get(input.idempotencyKey);
      if (existing !== undefined) return existing;

      const charge = await this.gateway.capture(input);
      const receipt: PaymentReceipt = { ...input, chargeId: charge.id, status: 'paid' };
      this.ledger.save(input.idempotencyKey, receipt);
      return receipt;
    });
  }
}
