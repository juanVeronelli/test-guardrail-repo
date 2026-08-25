import { CheckoutService } from './checkout/checkout-service.js';
import { IdempotencyLedger } from './checkout/idempotency-ledger.js';
import { LockManager } from './shared/lock-manager.js';

const gateway = { async capture(input) { return { id: 'ch_demo_' + input.idempotencyKey }; } };
export const checkoutService = new CheckoutService({ gateway, ledger: new IdempotencyLedger(), lockManager: new LockManager() });
