import { PaymentService } from '../payments/payment-service.js';

export interface CheckoutRequest { readonly amountCents: number; readonly orderId: string; readonly tenantId: string }
const payments = new PaymentService();
export function authorizeEnterpriseCheckout(request: CheckoutRequest): string {
  return payments.authorize(request).chargeId;
}
