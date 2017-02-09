export default {
  path: 'joblistings',
  indexRoute: { component: require('./JoblistingsRoute').default },
  childRoutes: [{
    path: ':joblistingId',
    component: require('./JoblistingsDetailedRoute').default
  }]
};
