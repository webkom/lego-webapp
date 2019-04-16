import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';

export default {
  path: 'quotes',
  indexRoute: resolveAsyncRoute(() => import('./QuotesRoute')),
  childRoutes: [
    {
      path: 'add',
      ...resolveAsyncRoute(() => import('./QuoteEditorRoute'))
    },
    {
      path: ':quoteId',
      ...resolveAsyncRoute(() => import('./QuoteDetailRoute'))
    }
  ]
};
