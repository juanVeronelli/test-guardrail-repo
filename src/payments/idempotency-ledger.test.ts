import { describe, it, expect } from 'vitest';
import { IdempotencyLedger, CrossTenantPaymentLeakError } from './idempotency-ledger.js';

describe('IdempotencyLedger', () => {
  it('should isolate ledger entries per tenant so different tenants with the same orderId do not collide', () => {
    const ledger = new IdempotencyLedger();

    const tenantAAttempt = ledger.claim(
      { amountCents: 1000, orderId: 'order-42', tenantId: 'tenant-A' },
      () => 'charge-A-001',
    );

    expect(tenantAAttempt.chargeId).toBe('charge-A-001');
    expect(tenantAAttempt.tenantId).toBe('tenant-A');

    // Tenant B uses the same orderId — must NOT collide with tenant A's entry
    // With the current bug (key = orderId only), this throws CrossTenantPaymentLeakError
    // instead of creating a new independent charge for tenant B.
    const tenantBAttempt = ledger.claim(
      { amountCents: 2000, orderId: 'order-42', tenantId: 'tenant-B' },
      () => 'charge-B-001',
    );

    expect(tenantBAttempt.chargeId).toBe('charge-B-001');
    expect(tenantBAttempt.tenantId).toBe('tenant-B');
    expect(tenantBAttempt.amountCents).toBe(2000);
  });

  it('should still return the same attempt for the same tenant and orderId (idempotency)', () => {
    const ledger = new IdempotencyLedger();

    const first = ledger.claim(
      { amountCents: 500, orderId: 'order-99', tenantId: 'tenant-A' },
      () => 'charge-first',
    );

    const second = ledger.claim(
      { amountCents: 500, orderId: 'order-99', tenantId: 'tenant-A' },
      () => 'charge-second',
    );

    expect(second.chargeId).toBe('charge-first');
    expect(second).toBe(first);
  });
});
