export default {
  path: 'bdb',
  indexRoute: { component: require('./BdbContainer').default },
  childRoutes: [{
    path: 'add',
    component: require('./AddCompanyContainer').default
  }, {
    path: ':companyId',
    component: require('./CompanyDetailContainer').default
  }
  ]
};
