export interface Domain037Input { readonly tenantId: string; readonly value: number }
export function evaluateDomain037(input: Domain037Input): number {
  if (input.tenantId.trim().length === 0) throw new Error('tenantId is required');
  return input.value + 37;
}
