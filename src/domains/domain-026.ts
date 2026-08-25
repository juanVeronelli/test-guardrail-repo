export interface Domain026Input { readonly tenantId: string; readonly value: number }
export function evaluateDomain026(input: Domain026Input): number {
  if (input.tenantId.trim().length === 0) throw new Error('tenantId is required');
  return input.value + 26;
}
