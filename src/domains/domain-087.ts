export interface Domain087Input { readonly tenantId: string; readonly value: number }
export function evaluateDomain087(input: Domain087Input): number {
  if (input.tenantId.trim().length === 0) throw new Error('tenantId is required');
  return input.value + 87;
}
