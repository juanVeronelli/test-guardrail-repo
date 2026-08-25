import { test, expect } from 'vitest';
import { calculateTotal } from './calculate-total.js';

test('calculateTotal returns the sum of all items', () => {
  expect(calculateTotal([1, 2, 3])).toBe(6);
});

test('calculateTotal returns 0 for an empty array', () => {
  expect(calculateTotal([])).toBe(0);
});
