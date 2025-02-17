import vikeReact from 'vike-react/config';
import Layout from '../layouts/LayoutDefault';
import type { Config } from 'vike/types';

// Default config (can be overridden by pages)
// https://vike.dev/config

export default {
  // https://vike.dev/Layout
  Layout,

  // https://vike.dev/head-tags
  title: 'My Vike App',
  description: 'Demo showcasing Vike',

  passToClient: ['storeInitialState'],

  extends: vikeReact,
} satisfies Config;
