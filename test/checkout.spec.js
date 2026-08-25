import assert from 'node:assert/strict';
import test from 'node:test';
import { CheckoutService } from '../src/checkout/checkout-service.js';
import { IdempotencyLedger } from '../src/checkout/idempotency-ledger.js';
import { LockManager } from '../src/shared/lock-manager.js';

function createHarness() {
  let captures = 0;
  const gateway = {
    async capture({ idempotencyKey }) {
      captures += 1;
      await new Promise((resolve) => setTimeout(resolve, 25));
      return { id: 'ch_' + idempotencyKey + '_' + captures };
    },
  };
  const service = new CheckoutService({ gateway, ledger: new IdempotencyLedger(), lockManager: new LockManager() });
  return { service, captureCount: () => captures };
}

test('validates monetary input', async () => {
  const { service } = createHarness();
  await assert.rejects(() => service.confirmPayment({ idempotencyKey: 'pay_invalid', amountCents: 0, customerId: 'cus_1' }), /positive integer/);
});

test('serializes concurrent retries and captures only once', async () => {
  const { service, captureCount } = createHarness();
  const request = { idempotencyKey: 'pay_final_audit_20260825', amountCents: 5900, customerId: 'cus_audit' };
  const [first, second, third] = await Promise.all([service.confirmPayment(request), service.confirmPayment(request), service.confirmPayment(request)]);
  assert.equal(captureCount(), 1);
  assert.deepEqual(first, second);
  assert.deepEqual(second, third);
});
