import { describe, expect, it } from 'vitest';
import { calculateTotal } from './calculate-total.js';

describe('calculateTotal', () => {
  it('sums all items', () => {
    expect(calculateTotal([1, 2, 3])).toBe(6);
  });
});
