import defaultConfig from '../config/env';
import type Config from '../config/Config';

const config: Config =
  typeof window !== 'undefined' && window.__CONFIG__
    ? window.__CONFIG__
    : defaultConfig;

export default config;
export type { Config };
