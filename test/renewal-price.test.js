import assert from 'node:assert/strict';
import test from 'node:test';

import { calculateRenewalTotal } from '../src/renewal-price.js';

test('applies a loyalty discount to a checkout renewal', () => {
  assert.equal(
    calculateRenewalTotal({ couponCode: ' loyalty20 ', monthlyPriceUsd: 59, seats: 2 }),
    94.4,
  );
});
