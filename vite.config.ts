import path from 'node:path';
import react from '@vitejs/plugin-react';
import postcssImport from 'postcss-import';
import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  plugins: [react()],
  css: {
    postcss: {
      plugins: [postcssImport()],
    },
  },
  resolve: {
    alias: {
      app: path.resolve(__dirname, 'app/'),
      '~app': path.resolve(__dirname, 'app/'),
      config: path.resolve(__dirname, 'config/'),
      node_modules: path.resolve(__dirname, 'node_modules'),
    },
  },
  define: {
    global: {},
    __CLIENT__: true,
    __DEV__: true,
    'process.env': {},
  },
});
