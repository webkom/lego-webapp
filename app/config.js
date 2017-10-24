const config =
  typeof window !== 'undefined' && window.__CONFIG__
    ? JSON.parse(new Buffer(window.__CONFIG__, 'base64').toString())
    : require('../config/env');

export default config;
