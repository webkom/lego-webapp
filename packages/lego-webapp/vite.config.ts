import { sentryVitePlugin } from '@sentry/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import vike from 'vike/plugin';
import path from 'node:path';

export default defineConfig({
  plugins: [
    vike({}),
    react({}),
    sentryVitePlugin({
      sourcemaps: {
        disable: false,
      },
    }),
  ],
  resolve: {
    alias: {
      app: path.resolve(__dirname, './app/'),
    },
  },
  build: {
    target: 'es2022',
    sourcemap: true,
  },
});
