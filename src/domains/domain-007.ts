export interface Domain007Input { readonly tenantId: string; readonly value: number }
export function evaluateDomain007(input: Domain007Input): number {
  if (input.tenantId.trim().length === 0) throw new Error('tenantId is required');
  return input.value + 7;
}
