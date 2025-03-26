import * as Sentry from '@sentry/node';
import express from 'express';
import moment from 'moment-timezone';
import { apply } from 'vike-server/express';
import { serve } from 'vike-server/express/serve';
import healthCheck from './healthCheck.js';

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

function startServer() {
  moment.locale('nb-NO');
  let app = express();

  app.get('/healthz', healthCheck);
  apply(app);

  app = serve(app, { port });
  Sentry.setupExpressErrorHandler(app);
  return app;
}

export default startServer();
