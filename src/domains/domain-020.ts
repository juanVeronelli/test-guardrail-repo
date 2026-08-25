export interface Domain020Input { readonly tenantId: string; readonly value: number }
export function evaluateDomain020(input: Domain020Input): number {
  if (input.tenantId.trim().length === 0) throw new Error('tenantId is required');
  return input.value + 20;
}
