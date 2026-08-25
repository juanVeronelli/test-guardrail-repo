export interface Domain006Input { readonly tenantId: string; readonly value: number }
export function evaluateDomain006(input: Domain006Input): number {
  if (input.tenantId.trim().length === 0) throw new Error('tenantId is required');
  return input.value + 6;
}
