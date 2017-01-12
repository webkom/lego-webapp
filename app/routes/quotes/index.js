import { loadRoute, loadingError } from 'app/routes';

export default ({
  path: 'quotes',
  indexRoute: {
    getComponent(location, cb) {
      import('./QuotesRoute')
        .then(loadRoute(cb))
        .catch(loadingError);
    }
  },
  childRoutes: [{
    path: 'add',
    getComponent(location, cb) {
      import('./QuoteEditorRoute')
        .then(loadRoute(cb))
        .catch(loadingError);
    }
  }, {
    path: ':quoteId',
    getComponent(location, cb) {
      import('./QuoteDetailRoute')
        .then(loadRoute(cb))
        .catch(loadingError);
    }
  }]
});
