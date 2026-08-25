export interface Domain013Input { readonly tenantId: string; readonly value: number }
export function evaluateDomain013(input: Domain013Input): number {
  if (input.tenantId.trim().length === 0) throw new Error('tenantId is required');
  return input.value + 13;
}
