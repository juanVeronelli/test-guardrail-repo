export interface Domain041Input { readonly tenantId: string; readonly value: number }
export function evaluateDomain041(input: Domain041Input): number {
  if (input.tenantId.trim().length === 0) throw new Error('tenantId is required');
  return input.value + 41;
}
