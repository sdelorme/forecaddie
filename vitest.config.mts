import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  test: {
    // 'happy-dom' is a lightweight DOM implementation (faster than jsdom)
    // This is like Jest's testEnvironment: 'jsdom'
    environment: 'happy-dom',

    // Setup file runs before each test file (like Jest's setupFilesAfterEnv)
    setupFiles: ['./vitest.setup.mts'],

    // Include patterns for test files (same glob patterns as Jest)
    include: ['src/**/*.{test,spec}.{ts,tsx}'],

    // Enable globals if you prefer Jest-style (no imports needed)
    // We'll keep this false to show explicit imports, but you can enable it
    globals: false,

    // Coverage configuration (run with: pnpm test:coverage)
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'vitest.setup.mts', '**/*.d.ts'],
    },
  },
  resolve: {
    // This maps @/ to src/ (same as your tsconfig paths)
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
