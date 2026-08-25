export interface Domain021Input { readonly tenantId: string; readonly value: number }
export function evaluateDomain021(input: Domain021Input): number {
  if (input.tenantId.trim().length === 0) throw new Error('tenantId is required');
  return input.value + 21;
}
