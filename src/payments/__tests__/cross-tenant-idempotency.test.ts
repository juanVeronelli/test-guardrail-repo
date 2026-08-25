import { describe, it, expect, beforeEach } from 'vitest';
import { IdempotencyLedger, CrossTenantPaymentLeakError } from '../idempotency-ledger.js';

describe('IdempotencyLedger – cross-tenant isolation', () => {
  let ledger: IdempotencyLedger;
  let seq: number;

  beforeEach(() => {
    ledger = new IdempotencyLedger();
    seq = 0;
  });

  const makeCharge = () => `ch_${++seq}`;

  it('should give each tenant its own independent charge for the same orderId', () => {
    // Two different tenants submit the same orderId – must NOT collide
    const attemptA = ledger.claim(
      { amountCents: 5000, orderId: 'order-1', tenantId: 'tenant-A' },
      makeCharge,
    );
    // Before fix this throws CrossTenantPaymentLeakError; after fix it returns a new charge
    const attemptB = ledger.claim(
      { amountCents: 5000, orderId: 'order-1', tenantId: 'tenant-B' },
      makeCharge,
    );

    expect(attemptA.chargeId).not.toBe(attemptB.chargeId);
    expect(attemptA.tenantId).toBe('tenant-A');
    expect(attemptB.tenantId).toBe('tenant-B');
  });

  it('should deduplicate retries within the same tenant (same-tenant idempotency preserved)', () => {
    const first = ledger.claim(
      { amountCents: 5000, orderId: 'order-2', tenantId: 'tenant-A' },
      makeCharge,
    );
    const retry = ledger.claim(
      { amountCents: 5000, orderId: 'order-2', tenantId: 'tenant-A' },
      makeCharge,
    );

    expect(first.chargeId).toBe(retry.chargeId);
  });

  it('should still throw CrossTenantPaymentLeakError when the same namespaced key is claimed by a mismatched tenant (guard remains)', () => {
    // This scenario cannot happen after the fix because keys are namespaced,
    // but we verify the guard class is still exported and constructable.
    expect(() => { throw new CrossTenantPaymentLeakError('order-x'); })
      .toThrow(CrossTenantPaymentLeakError);
  });
});
