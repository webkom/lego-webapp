import path from 'node:path';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import react from '@vitejs/plugin-react';
import postcssCustomMedia from 'postcss-custom-media';
import postcssNested from 'postcss-nested';
import vike from 'vike/plugin';
import { patchCssModules } from 'vite-css-modules';
import { cjsInterop } from 'vite-plugin-cjs-interop';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    patchCssModules(),
    vike(),
    react(),
    sentryVitePlugin({
      sourcemaps: {
        disable: false,
      },
    }),
    cjsInterop({
      dependencies: [
        'react-helmet-async',
        'redux-logger',
        'moment-timezone',
        'validator',
        'react-turnstile',
        'final-form-arrays',
      ],
    }),
    cjsInterop({
      client: true,
      dependencies: ['@gamestdio/websocket'],
    }),
  ],
  resolve: {
    noExternal: ['react-dropzone'],
    alias: {
      app: path.resolve(import.meta.dirname, './app/'),
      '~': path.resolve(import.meta.dirname, './'),
      styles: path.resolve(import.meta.dirname, './styles/'),
      assets: path.resolve(import.meta.dirname, './assets/'),
    },
  },
  css: {
    postcss: {
      plugins: [postcssCustomMedia(), postcssNested()],
    },
  },

  build: {
    target: 'es2022',
    sourcemap: true,
    cssCodeSplit: false,
  },
  environments: {
    ssr: {
      build: {
        rollupOptions: {
          input: { instrument: './server/instrument.ts' },
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
  },
});
