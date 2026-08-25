import { describe, it, expect } from 'vitest';
import { IdempotencyLedger } from './idempotency-ledger.js';

describe('IdempotencyLedger', () => {
  it('issues independent charges for different tenants sharing the same orderId', () => {
    const ledger = new IdempotencyLedger();

    const tenantAAttempt = ledger.claim(
      { amountCents: 5000, orderId: 'order-123', tenantId: 'tenant-A' },
      () => 'charge-A-001',
    );

    const tenantBAttempt = ledger.claim(
      { amountCents: 7500, orderId: 'order-123', tenantId: 'tenant-B' },
      () => 'charge-B-001',
    );

    expect(tenantAAttempt.chargeId).toBe('charge-A-001');
    expect(tenantBAttempt.chargeId).toBe('charge-B-001');
    expect(tenantAAttempt.tenantId).toBe('tenant-A');
    expect(tenantBAttempt.tenantId).toBe('tenant-B');
  });

  it('deduplicates retries for the same tenant and orderId', () => {
    const ledger = new IdempotencyLedger();

    const first = ledger.claim(
      { amountCents: 5000, orderId: 'order-456', tenantId: 'tenant-A' },
      () => 'charge-A-002',
    );

    const retry = ledger.claim(
      { amountCents: 5000, orderId: 'order-456', tenantId: 'tenant-A' },
      () => 'charge-A-003',
    );

    expect(first.chargeId).toBe('charge-A-002');
    expect(retry.chargeId).toBe('charge-A-002');
  });
});
