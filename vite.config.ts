import path from 'path';
import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [reactRouter(), tsconfigPaths()],
  resolve: {
    alias: {
      app: path.resolve(__dirname, './app/'),
      '@webkom/lego-bricks/dist/style.css': path.resolve(
        __dirname,
        './packages/lego-bricks/src/global.css',
      ),
      '@webkom/lego-bricks': path.resolve(
        __dirname,
        './packages/lego-bricks/src/index.ts',
      ),
    },
  },
  ssr: {
    noExternal: ['react-textarea-autosize', 'react-dropzone'],
  },
  test: {
    alias: {
      node_modules: path.resolve(__dirname, './node_modules/'),
    },
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
  },
});
