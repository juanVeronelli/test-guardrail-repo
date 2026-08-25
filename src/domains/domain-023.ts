export interface Domain023Input { readonly tenantId: string; readonly value: number }
export function evaluateDomain023(input: Domain023Input): number {
  if (input.tenantId.trim().length === 0) throw new Error('tenantId is required');
  return input.value + 23;
}
