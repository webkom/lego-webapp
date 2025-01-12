import { promises as fs } from 'fs';
import * as Sentry from '@sentry/node';
import cookieParser from 'cookie-parser';
import express from 'express';
import baseConfig from '../config/env';
import config from './env';
import healthCheck from './health';
import { renderHtml } from './renderHtml';
import type { render as entryServerRender } from 'app/entryServer';
import type { ViteDevServer } from 'vite';

/**
 * This file is the entry point for the server in development and production (with and without SSR).
 * It is not compiled by Vite, and is run directly by `bun`.
 */

// Constants
const isProduction = process.env.NODE_ENV === 'production';
const port = config.host || 3000;
const base = '/';

// Cached production assets
const templateHtml = isProduction
  ? await fs.readFile('./dist/client/index.html', 'utf-8')
  : '';

process.__CONFIG__ = baseConfig;

// Create http server
const app = express();
app.use(Sentry.Handlers.requestHandler());
app.use(cookieParser());

app.get('/healthz', healthCheck);
app.get('/_config', (_, res) => res.json(baseConfig));

// Add Vite or respective production middlewares
let vite: ViteDevServer;
if (!isProduction) {
  const { createServer } = await import('vite');
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base,
  });
  app.use(vite.middlewares);
} else {
  const compression = (await import('compression')).default;
  const sirv = (await import('sirv')).default;
  app.use(compression());
  app.use(base, sirv('./dist/client', { extensions: [] }));
}

// Serve HTML
app.use('*', async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, '');

    let template: string;
    let render: typeof entryServerRender;
    if (!isProduction) {
      // Always read fresh template in development
      template = await fs.readFile('./index.html', 'utf-8');
      template = await vite.transformIndexHtml(url, template);
      render = (
        await vite.ssrLoadModule('app/entryServer.tsx', {
          fixStacktrace: true,
        })
      ).render;
    } else {
      template = templateHtml;
      render = (await import('../dist/server/entryServer.js')).render;
    }

    const rendered = await render(req, res);

    const statusCode = rendered.reduxState?.router.statusCode || 200;

    const html = renderHtml(template, rendered);

    res.status(statusCode).set({ 'Content-Type': 'text/html' }).send(html);
  } catch (e: unknown) {
    if (!(e instanceof Error)) return res.status(500).end();

    vite?.ssrFixStacktrace(e);
    //console.log(e.stack);
    res.status(500).end(e.stack);
  }
});

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
