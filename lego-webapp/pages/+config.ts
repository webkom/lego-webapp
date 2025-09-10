import vikeReact from 'vike-react/config';
import type { Config } from 'vike/types';

export default {
  // https://vike.dev/head-tags
  // title: 'My Vike App',
  // description: 'Demo showcasing Vike',

  redirects: {
    '/kontakt': '/contact',
    '/interestgroups': '/interest-groups',
    '/admin/email': '/admin/email/lists',
    // Old emails used this url for some reason
    '/185f9aa436cf7f5da598.png': '/logo-dark.png',
    '/pages/organisasjon/46-fondstyret/edit':
      '/pages/organisasjon/46-fondet/edit', // backwards compat for renamed slug
    '/pages/organisasjon/46-fondstyret': '/pages/organisasjon/46-fondet', // backwards compat for renamed slug
  },

  passToClient: ['storeInitialState'],
  lang: 'no',
  stream: 'web',

  extends: vikeReact,
} satisfies Config;
