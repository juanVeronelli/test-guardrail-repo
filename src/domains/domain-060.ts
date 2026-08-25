export interface Domain060Input { readonly tenantId: string; readonly value: number }
export function evaluateDomain060(input: Domain060Input): number {
  if (input.tenantId.trim().length === 0) throw new Error('tenantId is required');
  return input.value + 60;
}
