import type { CheckoutService } from './checkout-service.js';

export function createCheckoutRoute(service: CheckoutService) {
  return async function checkoutRoute(request: { readonly body: { readonly idempotencyKey: string; readonly amountCents: number; readonly customerId: string } }) {
    try {
      const receipt = await service.confirmPayment(request.body);
      return { statusCode: 200, body: receipt };
    } catch (error: unknown) {
      return { statusCode: 500, body: { code: 'CHECKOUT_CONFIRM_FAILED', message: error instanceof Error ? error.message : 'Unknown error' } };
    }
  };
}
