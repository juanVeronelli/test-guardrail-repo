export function assertUsdCents(value) {
  if (!Number.isSafeInteger(value) || value <= 0) throw new TypeError('amountCents must be a positive integer');
  return value;
}
