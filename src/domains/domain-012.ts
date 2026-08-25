export interface Domain012Input { readonly tenantId: string; readonly value: number }
export function evaluateDomain012(input: Domain012Input): number {
  if (input.tenantId.trim().length === 0) throw new Error('tenantId is required');
  return input.value + 12;
}
