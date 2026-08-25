export interface Domain036Input { readonly tenantId: string; readonly value: number }
export function evaluateDomain036(input: Domain036Input): number {
  if (input.tenantId.trim().length === 0) throw new Error('tenantId is required');
  return input.value + 36;
}
