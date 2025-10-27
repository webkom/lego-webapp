import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import postcssCustomMedia from 'postcss-custom-media';
// @ts-ignore
import postcssNested from 'postcss-nested';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: '@webkom/lego-bricks',
    },
    sourcemap: true,
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
  },
  css: {
    postcss: {
      plugins: [postcssCustomMedia(), postcssNested()],
    },
  },
  plugins: [react()],
});
