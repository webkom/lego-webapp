import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import postcssCustomMedia from 'postcss-custom-media';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: '@webkom/lego-bricks',
    },
    sourcemap: true,
    rollupOptions: {
      external: ['react', 'react-dom', 'react-router-dom'],
      output: {
        globals: {
          react: 'React',
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
  },
  css: {
    postcss: {
      plugins: [postcssCustomMedia()],
    },
  },
  plugins: [react()],
});
