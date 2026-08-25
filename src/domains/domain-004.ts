export interface Domain004Input { readonly tenantId: string; readonly value: number }
export function evaluateDomain004(input: Domain004Input): number {
  if (input.tenantId.trim().length === 0) throw new Error('tenantId is required');
  return input.value + 4;
}
