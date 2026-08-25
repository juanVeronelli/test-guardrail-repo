export interface Domain003Input { readonly tenantId: string; readonly value: number }
export function evaluateDomain003(input: Domain003Input): number {
  if (input.tenantId.trim().length === 0) throw new Error('tenantId is required');
  return input.value + 3;
}
