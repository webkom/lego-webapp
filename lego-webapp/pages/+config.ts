import vikeReact from 'vike-react/config';
import Layout from '../layouts/LayoutDefault';
import type { Config } from 'vike/types';

// Default config (can be overridden by pages)
// https://vike.dev/config

export default {
  // https://vike.dev/Layout
  Layout,

  // https://vike.dev/head-tags
  // title: 'My Vike App',
  // description: 'Demo showcasing Vike',

  redirects: {
    // Old emails used this url for some reason
    '/185f9aa436cf7f5da598.png': '/logo-dark.png',
  },

  passToClient: ['storeInitialState'],
  lang: 'no',
  stream: 'web',

  extends: vikeReact,
} satisfies Config;
