import type Config from '../config/Config';
import type { RootState } from 'app/store/createRootReducer';

declare global {
  interface Window {
    __CONFIG__?: Config;
    __PRELOADED_STATE__?: RootState | Record<string, never>;
    __IS_SSR__?: boolean;
  }

  namespace NodeJS {
    interface Process {
      __CONFIG__?: Config;
    }
  }

  interface ImportMeta {
    env: {
      /**
       * Whether the code is running on the server (server side rendering).
       */
      SSR: boolean;
      /**
       * Whether the app is running in development mode.
       */
      DEV: boolean;
      /**
       * Whether the app is running in production mode.
       */
      PROD: boolean;
      /**
       * The base URL of the server the app is being served from.
       */
      BASE_URL: string;

      /**
       * The URL of the backend API server.
       */
      API_URL?: string;
      /**
       * The URL of the backend WebSocket server.
       */
      WS_URL?: string;
      /**
       * The URL of the frontend web server.
       */
      WEB_URL?: string;
      /**
       * The Turnstile Captcha key.
       */
      CAPTCHA_KEY?: string;
      SKIP_CAPTCHA?: boolean;
      STRIPE_KEY?: string;
      SENTRY_DSN?: string;
      RELEASE?: string;
      ENVIRONMENT?: string;
      SSR_API_URL?: string;
      SSR_BASE_URL?: string;
    };
  }
}

export {};
