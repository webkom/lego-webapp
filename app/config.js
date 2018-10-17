const config =
  typeof window !== 'undefined' && window.__CONFIG__
    ? window.__CONFIG__
    : require('../config/env').default;

export default config;
