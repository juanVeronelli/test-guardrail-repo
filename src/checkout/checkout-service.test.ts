import { describe, it, expect, vi } from 'vitest';
import { CheckoutService } from './checkout-service.js';
import { IdempotencyLedger } from './idempotency-ledger.js';
import { LockManager } from '../shared/lock-manager.js';

describe('CheckoutService.confirmPayment', () => {
  it('should not capture twice when two concurrent requests share the same idempotencyKey', async () => {
    const captureCount = { value: 0 };

    // Simulate a slow gateway so both concurrent calls can race past the ledger check
    const gateway = {
      capture: vi.fn(async (_input: { amountCents: number; customerId: string; idempotencyKey: string }) => {
        captureCount.value++;
        // Yield to allow the other concurrent call to also reach capture
        await new Promise((resolve) => setTimeout(resolve, 10));
        return { id: `charge_${captureCount.value}` };
      }),
    };

    const ledger = new IdempotencyLedger();
    const lockManager = new LockManager();
    const service = new CheckoutService(gateway, ledger, lockManager);

    const input = { idempotencyKey: 'idem-key-001', amountCents: 1000, customerId: 'cust-123' };

    // Fire two concurrent requests with the same idempotency key
    const [receipt1, receipt2] = await Promise.all([
      service.confirmPayment(input),
      service.confirmPayment(input),
    ]);

    // Gateway must only be called once — idempotency guarantee
    expect(gateway.capture).toHaveBeenCalledTimes(1);

    // Both receipts must be identical (same chargeId)
    expect(receipt1.chargeId).toBe(receipt2.chargeId);
  });
});
