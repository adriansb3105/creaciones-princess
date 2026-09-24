import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': import.meta.dirname,
    },
  },
  test: {
    environment: 'node',
    include: ['**/*.test.js'],
    exclude: ['node_modules', '.next'],
  },
});
