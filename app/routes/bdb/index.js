export default {
  path: 'bdb',
  indexRoute: { component: require('./BdbRoute').default },
  childRoutes: [{
    path: 'add',
    component: require('./AddCompanyRoute').default
  }, {
    path: ':companyId',
    component: require('./CompanyDetailRoute').default
  }, {
    path: ':companyId/edit',
    component: require('./EditCompanyRoute').default
  }
  ]
};
