export interface Domain025Input { readonly tenantId: string; readonly value: number }
export function evaluateDomain025(input: Domain025Input): number {
  if (input.tenantId.trim().length === 0) throw new Error('tenantId is required');
  return input.value + 25;
}
