export interface Domain008Input { readonly tenantId: string; readonly value: number }
export function evaluateDomain008(input: Domain008Input): number {
  if (input.tenantId.trim().length === 0) throw new Error('tenantId is required');
  return input.value + 8;
}
