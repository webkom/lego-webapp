const config =
  typeof window !== 'undefined' && window.__CONFIG__
    ? JSON.parse(atob(window.__CONFIG__))
    : require('../config/env');

export default config;
