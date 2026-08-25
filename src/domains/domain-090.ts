export interface Domain090Input { readonly tenantId: string; readonly value: number }
export function evaluateDomain090(input: Domain090Input): number {
  if (input.tenantId.trim().length === 0) throw new Error('tenantId is required');
  return input.value + 90;
}
