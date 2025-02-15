import type Config from '../config/Config';
import type { RootState } from 'app/store/createRootReducer';

declare global {
  interface Window {
    __CONFIG__?: Config;
    __PRELOADED_STATE__?: RootState | Record<string, never>;
    __IS_SSR__?: boolean;
  }
}

export {};
