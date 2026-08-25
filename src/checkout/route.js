export function createCheckoutRoute(service) {
  return async function checkoutRoute(request) {
    try {
      const receipt = await service.confirmPayment(request.body);
      return { statusCode: 200, body: receipt };
    } catch (error) {
      return { statusCode: 500, body: { code: 'CHECKOUT_CONFIRM_FAILED', message: error instanceof Error ? error.message : 'Unknown error' } };
    }
  };
}
