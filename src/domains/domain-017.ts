export interface Domain017Input { readonly tenantId: string; readonly value: number }
export function evaluateDomain017(input: Domain017Input): number {
  if (input.tenantId.trim().length === 0) throw new Error('tenantId is required');
  return input.value + 17;
}
