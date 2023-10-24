/// <reference types="vitest" />

import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      app: path.resolve(__dirname, './app/'),
      '@webkom/lego-bricks': path.resolve(
        __dirname,
        './packages/lego-bricks/src/index.ts'
      ),
    },
  },
  test: {
    alias: {
      node_modules: path.resolve(__dirname, './node_modules/'),
    },
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
  },
});
