import path from 'node:path';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import react from '@vitejs/plugin-react';
import postcssCustomMedia from 'postcss-custom-media';
import vike from 'vike/plugin';
import { defineConfig } from 'vite';
import { patchCssModules } from 'vite-css-modules';
import { cjsInterop } from 'vite-plugin-cjs-interop';

export default defineConfig({
  plugins: [
    patchCssModules(),
    vike({}),
    react({}),
    sentryVitePlugin({
      sourcemaps: {
        disable: false,
      },
    }),
    cjsInterop({
      dependencies: [
        'react-helmet-async',
        'redux-logger',
        'lodash',
        'moment-timezone',
        'validator',
        'react-turnstile',
      ],
    }),
  ],
  resolve: {
    noExternal: ['react-dropzone'],
    alias: {
      app: path.resolve(__dirname, './app/'),
      '~': path.resolve(__dirname, './'),
      styles: path.resolve(__dirname, './styles/'),
      assets: path.resolve(__dirname, './assets/'),
    },
  },
  css: {
    postcss: {
      plugins: [postcssCustomMedia()],
    },
  },

  build: {
    target: 'es2022',
    sourcemap: true,
  },
});
