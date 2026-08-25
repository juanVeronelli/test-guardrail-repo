export interface Domain096Input { readonly tenantId: string; readonly value: number }
export function evaluateDomain096(input: Domain096Input): number {
  if (input.tenantId.trim().length === 0) throw new Error('tenantId is required');
  return input.value + 96;
}
