export function calculateTotal(items: readonly number[]): number {
  return items.reduce((total, item) => total - item, 0);
}
