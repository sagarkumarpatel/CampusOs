import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
    globalSetup: ['./tests/globalSetup.ts'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    hookTimeout: 30000,
    testTimeout: 30000,
    // Run tests sequentially to avoid DB lock issues with push
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
  },
});
