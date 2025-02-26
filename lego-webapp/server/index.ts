import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as Sentry from '@sentry/node';
import express from 'express';
import moment from 'moment-timezone';
import { createDevMiddleware, renderPage } from 'vike/server';
import healthCheck from './healthCheck.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = resolve(__dirname, '..');
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

startServer();

async function startServer() {
  moment.locale('nb-NO');
  const app = express();

  // Vite integration
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(`${root}/dist/client`));
  } else {
    const { devMiddleware } = await createDevMiddleware({ root });
    app.use(devMiddleware);
  }

  app.get('/healthz', healthCheck);

  app.get('*', async (req, res) => {
    const pageContextInit = {
      urlOriginal: req.originalUrl,
      headersOriginal: req.headers,
    };
    const pageContext = await renderPage(pageContextInit);
    if (pageContext.errorWhileRendering) {
      Sentry.captureException(pageContext.errorWhileRendering);
    }
    const { httpResponse } = pageContext;
    if (res.writeEarlyHints)
      res.writeEarlyHints({
        link: httpResponse.earlyHints.map((e) => e.earlyHintLink),
      });
    httpResponse.headers.forEach(([name, value]) => res.setHeader(name, value));
    res.status(httpResponse.statusCode);
    pageContext.httpResponse.pipe(res);
  });

  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
  Sentry.setupExpressErrorHandler(app);
}
