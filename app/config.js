const config =
  typeof window !== 'undefined' && window.__CONFIG__ ? window.__CONFIG__ : require('../config/env');

export default config;
