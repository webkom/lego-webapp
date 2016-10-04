export default {
  path: 'companies',
  indexRoute: { component: require('./CompaniesRoute').default },
  childRoutes: [{
    path: ':companyId',
    component: require('./CompanyDetailRoute').default
  }]
};
