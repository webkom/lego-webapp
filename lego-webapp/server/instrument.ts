// Loaded with `node --import` so Sentry is initialized once, before the server and its dependencies load.
// Never call Sentry.init per request: every call creates a new client that is never freed.
import { sentryServerConfig } from '../sentry.server.config';

sentryServerConfig();
