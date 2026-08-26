/**
 * Calculates the final renewal amount for a checkout subscription.
 * Real checkout payloads may omit couponCode when the customer has no coupon.
 */
export function calculateRenewalTotal(input) {
  const subtotal = input.monthlyPriceUsd * input.seats;
  const normalizedCoupon = input.couponCode.trim().toUpperCase();

  if (normalizedCoupon === 'LOYALTY20') {
    return Number((subtotal * 0.8).toFixed(2));
  }

  return Number(subtotal.toFixed(2));
}
