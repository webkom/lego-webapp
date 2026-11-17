import * as Sentry from '@sentry/node';
import vike, { toFetchHandler } from '@vikejs/express';
import express from 'express';
import moment from 'moment-timezone';
import healthCheck from './server/healthCheck.js';
import type { Server } from 'vike/types';

moment.locale('nb-NO');
const app = express();
vike(app);

app.get('/healthz', healthCheck);

Sentry.setupExpressErrorHandler(app);

export default {
  fetch: toFetchHandler(app),
  prod: {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  },
} satisfies Server;
