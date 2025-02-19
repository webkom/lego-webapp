import { sentryVitePlugin } from '@sentry/vite-plugin';
import react from '@vitejs/plugin-react';
import vike from 'vike/plugin';
import { defineConfig } from 'vite';

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
  build: {
    target: 'es2022',
    sourcemap: true,
  },
});
