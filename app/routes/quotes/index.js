import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';

export default {
  path: 'quotes',
  indexRoute: resolveAsyncRoute(
    () => import('./QuotesRoute'),
    () => require('./QuotesRoute')
  ),
  childRoutes: [
    {
      path: 'add',
      ...resolveAsyncRoute(
        () => import('./QuoteEditorRoute'),
        () => require('./QuoteEditorRoute')
      )
    },
    {
      path: ':quoteId',
      ...resolveAsyncRoute(
        () => import('./QuoteDetailRoute'),
        () => require('./QuoteDetailRoute')
      )
    }
  ]
};
