import defaultConfig, {
  configWithSSR as defaultConfigWithSSR,
} from '../config/env';
import type Config from '../config/Config';

const config: Config =
  typeof window !== 'undefined' && window.__CONFIG__
    ? window.__CONFIG__
    : defaultConfig;
// This is inteded for components requiring custom SSR-attrs, and not for element rendering
// stuff to the DOM. This allows us to have custom internal api-urls on SSR
export const configWithSSR: Config =
  typeof window !== 'undefined' && window.__CONFIG__
    ? window.__CONFIG__
    : defaultConfigWithSSR;

export default config;
