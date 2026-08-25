export interface Domain027Input { readonly tenantId: string; readonly value: number }
export function evaluateDomain027(input: Domain027Input): number {
  if (input.tenantId.trim().length === 0) throw new Error('tenantId is required');
  return input.value + 27;
}
