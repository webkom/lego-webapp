export default {
  path: 'quotes',
  indexRoute: { component: require('./QuotesRoute').default },
  childRoutes: [{
    path: 'add',
    component: require('./QuoteEditorRoute').default
  },
  {
    path: ':quoteId',
    component: require('./QuoteDetailRoute').default
  }
  ]
};
