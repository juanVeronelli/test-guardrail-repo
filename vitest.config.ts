import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['./tests/egress-canary.setup.ts'],
    testTimeout: 5_000,
  },
});
