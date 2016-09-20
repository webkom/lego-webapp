export default {
  path: 'quotes',
  indexRoute: { component: require('./QuotesContainer').default },
  childRoutes: [{
    path: 'add',
    component: require('./QuotesAddContainer').default
  },
  {
    path: ':quoteId',
    component: require('./QuoteDetailContainer').default
  }
  ]
};
