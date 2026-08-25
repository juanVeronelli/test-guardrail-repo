import { describe, it, expect } from 'vitest';
import { IdempotencyLedger, CrossTenantPaymentLeakError } from './idempotency-ledger.js';

describe('IdempotencyLedger', () => {
  it('issues independent charges for different tenants sharing the same orderId', () => {
    const ledger = new IdempotencyLedger();
    let chargeCounter = 0;
    const createCharge = () => `charge-${++chargeCounter}`;

    const attemptA = ledger.claim(
      { amountCents: 1000, orderId: 'order-1', tenantId: 'tenant-A' },
      createCharge,
    );

    // A different tenant with the same orderId must get its own independent charge,
    // not throw CrossTenantPaymentLeakError and not reuse tenant-A's charge.
    const attemptB = ledger.claim(
      { amountCents: 2000, orderId: 'order-1', tenantId: 'tenant-B' },
      createCharge,
    );

    expect(attemptA.chargeId).not.toBe(attemptB.chargeId);
    expect(attemptA.tenantId).toBe('tenant-A');
    expect(attemptB.tenantId).toBe('tenant-B');
  });

  it('deduplicates retries for the same tenant and orderId without creating a new charge', () => {
    const ledger = new IdempotencyLedger();
    let chargeCounter = 0;
    const createCharge = () => `charge-${++chargeCounter}`;

    const first = ledger.claim(
      { amountCents: 500, orderId: 'order-2', tenantId: 'tenant-A' },
      createCharge,
    );
    const retry = ledger.claim(
      { amountCents: 500, orderId: 'order-2', tenantId: 'tenant-A' },
      createCharge,
    );

    expect(first.chargeId).toBe(retry.chargeId);
    expect(chargeCounter).toBe(1);
  });
});
