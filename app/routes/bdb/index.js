export default {
  path: 'bdb',
  indexRoute: { component: require('./BdbContainer').default },
  childRoutes: [{
    path: ':companyId',
    component: require('./CompanyDetailContainer').default
  }
  ]
};
