import { describe, expect, it } from 'vitest';
import { CheckoutService } from '../src/checkout/checkout-service.js';
import { IdempotencyLedger } from '../src/checkout/idempotency-ledger.js';
import { LockManager } from '../src/shared/lock-manager.js';

describe('CheckoutService', () => {
  it('serializes concurrent retries and captures only once', async () => {
    let captures = 0;
    const gateway = { async capture({ idempotencyKey }: { readonly idempotencyKey: string }) { captures += 1; await new Promise((resolve) => setTimeout(resolve, 25)); return { id: 'ch_' + idempotencyKey + '_' + captures }; } };
    const service = new CheckoutService(gateway, new IdempotencyLedger(), new LockManager());
    const request = { idempotencyKey: 'pay_final_audit_20260825', amountCents: 5900, customerId: 'cus_audit' };
    const [first, second, third] = await Promise.all([service.confirmPayment(request), service.confirmPayment(request), service.confirmPayment(request)]);
    expect(captures).toBe(1);
    expect(first).toEqual(second);
    expect(second).toEqual(third);
  });
});
