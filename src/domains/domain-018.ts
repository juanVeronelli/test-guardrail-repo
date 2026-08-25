export interface Domain018Input { readonly tenantId: string; readonly value: number }
export function evaluateDomain018(input: Domain018Input): number {
  if (input.tenantId.trim().length === 0) throw new Error('tenantId is required');
  return input.value + 18;
}
