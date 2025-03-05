import * as Sentry from '@sentry/node';
import express from 'express';
import moment from 'moment-timezone';
import vike from 'vike-node/express';
import healthCheck from './healthCheck.js';

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

startServer();

async function startServer() {
  moment.locale('nb-NO');
  const app = express();

  app.use(vike());
  app.get('/healthz', healthCheck);

  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
  Sentry.setupExpressErrorHandler(app);
}
