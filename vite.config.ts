import path from 'node:path';
import { default as react } from '@vitejs/plugin-react';
import postcssImport from 'postcss-import';
import postcssNested from 'postcss-nested';
import postcssPresetEnv from 'postcss-preset-env';
import { defineConfig } from 'vite';
import { patchCssModules } from 'vite-css-modules';
import preloadPlugin from 'vite-preload/plugin';

export default defineConfig({
  root: '.',
  plugins: [preloadPlugin(), patchCssModules(), react()],
  css: {
    postcss: {
      plugins: [
        postcssImport({
          path: [path.resolve(__dirname)],
          // postcss doesn't support webpack modules import, which css-loader
          // requires that we use, so we need to resolve imports with '~'
          // manually.
          resolve(id, basedir) {
            if (/^~app/.test(id)) {
              return path.resolve(path.resolve(__dirname), id.slice(1));
            }
            if (/^~/.test(id)) {
              return path.resolve('./node_modules', id);
            }
            return path.resolve(basedir, id);
          },
        }),
        postcssPresetEnv({
          stage: 1,
          features: {
            'custom-media-queries': true,
          },
        }),
        postcssNested(),
      ],
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
  build: {
    manifest: true,
    ssrManifest: false,
    sourcemap: true,
  },
  server: {
    port: 3000,
    open: true,
  },
  ssr: {
    noExternal: ['@webkom/react-prepare', 'final-form-focus'],
  },
  define: {
    global: {},
  },
});
