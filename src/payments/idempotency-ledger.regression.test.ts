/**
 * Regression test: cross-tenant payment idempotency collision
 * Incident: CrossTenantPaymentLeakError in IdempotencyLedger.claim
 *
 * RED condition: when ledgerKey = command.orderId (no tenant namespace),
 * tenant-b's claim collides with tenant-a's entry for the same orderId
 * and throws CrossTenantPaymentLeakError instead of returning an
 * independent charge result.
 */
import { describe, it, expect } from "vitest";
import { IdempotencyLedger } from "./idempotency-ledger.js";

describe("IdempotencyLedger.claim – cross-tenant isolation", () => {
  it("allows two different tenants to claim the same orderId independently (no cross-tenant leak)", async () => {
    const ledger = new IdempotencyLedger();

    const resultA = await ledger.claim({
      tenantId: "tenant-a",
      orderId: "order-canary",
      amount: 100,
    });

    // tenant-b must get its own independent result, not collide with tenant-a
    const resultB = await ledger.claim({
      tenantId: "tenant-b",
      orderId: "order-canary",
      amount: 200,
    });

    // Both claims must succeed without throwing CrossTenantPaymentLeakError
    expect(resultA).toBeDefined();
    expect(resultB).toBeDefined();

    // The two results must be distinct (different tenant charges)
    expect(resultA).not.toEqual(resultB);
  });

  it("deduplicates a retry from the same tenant (same-tenant idempotency preserved)", async () => {
    const ledger = new IdempotencyLedger();

    const first = await ledger.claim({
      tenantId: "tenant-a",
      orderId: "order-retry",
      amount: 50,
    });

    // Retry with identical inputs must return the same result, not a new charge
    const retry = await ledger.claim({
      tenantId: "tenant-a",
      orderId: "order-retry",
      amount: 50,
    });

    expect(retry).toEqual(first);
  });
});
