import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    // Disable happy-dom's real navigation. Several components assign `location.href`
    // to redirect; without this, happy-dom kicks off real fetch-based navigations whose
    // async tasks get aborted when the test window is torn down (the "AsyncTaskManager
    // has been destroyed" errors). Those leaked tasks can corrupt the DOM state of later
    // test files, which non-deterministically degrades DOMPurify (sanitizeHtml) into
    // stripping safe tags — the root cause of the flaky CI failures in
    // sanitizeHtml.test.ts and FAQSection.test.tsx. With `disableFallbackToSetURL` left
    // false, `location.href` still updates, so redirect assertions keep working.
    environmentOptions: {
      happyDOM: {
        settings: {
          navigation: {
            disableMainFrameNavigation: true,
            disableChildFrameNavigation: true,
            disableChildPageNavigation: true,
          },
        },
      },
    },
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.config.ts',
        '**/*.config.js',
        '**/*.spec.tsx',
        '**/*.spec.ts',
        '**/*.test.tsx',
        '**/*.test.ts',
        '**/types/**',
        '**/*.d.ts',
        '**/*.json',
        'src/assets/**',
        'src/**/*.css',
        '**/types.ts',
      ],
      thresholds: {
        branches: 70,
        functions: 70,
        lines: 70,
        statements: 70,
      },
    },
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist'],
    transformMode: {
      web: [/\.[jt]sx?$/],
    },
    server: {
      deps: {
        inline: ['@testing-library/jest-dom'],
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
