import { describe, expect, it } from 'vitest';
import { PaymentService } from '../../src/payments/payment-service.js';

describe('PaymentService baseline', () => {
  it('deduplicates a retry inside the same tenant', () => {
    const service = new PaymentService();
    const command = { amountCents: 129900, orderId: 'ord-shared-9001', tenantId: 'agency-a' };
    expect(service.authorize(command).chargeId).toBe(service.authorize(command).chargeId);
  });
});
