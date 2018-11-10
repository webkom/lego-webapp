import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';

export default {
  path: 'pages/',
  indexRoute: resolveAsyncRoute(() => import('./PageListRoute')),
  childRoutes: [
    {
      path: 'about',
      ...resolveAsyncRoute(() => import('./LandingPageRoute'))
    },
    {
      // Hacky solution based on url in prod now.
      path: 'info/17-strategidokument',
      ...resolveAsyncRoute(() => import('./AbakusVisionRoute'))
    },
    {
      path: 'new',
      ...resolveAsyncRoute(() => import('./PageCreateRoute'))
    },
    {
      path: ':section/:pageSlug/edit',
      ...resolveAsyncRoute(() => import('./PageEditRoute'))
    },
    {
      path: ':section/:pageSlug',
      ...resolveAsyncRoute(() => import('./PageDetailRoute'))
    }
  ]
};
