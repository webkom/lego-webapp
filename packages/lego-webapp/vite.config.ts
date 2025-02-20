import path from 'node:path';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import react from '@vitejs/plugin-react';
import vike from 'vike/plugin';
import { defineConfig } from 'vite';
import { cjsInterop } from 'vite-plugin-cjs-interop';

export default defineConfig({
  plugins: [
    vike({}),
    react({}),
    sentryVitePlugin({
      sourcemaps: {
        disable: false,
      },
    }),
    cjsInterop({
      dependencies: ['react-helmet-async', 'redux-logger', 'lodash'],
    }),
  ],
  resolve: {
    alias: {
      app: path.resolve(__dirname, './app/'),
      '~': path.resolve(__dirname, './'),
    },
  },

  build: {
    target: 'es2022',
    sourcemap: true,
  },
});
