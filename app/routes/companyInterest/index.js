export default {
  path: 'companyInterest',
  indexRoute: { component: require('./CompanyInterestListRoute').default },
  childRoutes: [
    {
      path: 'create',
      component: require('./CompanyInterestRoute').default
    },
    {
      path: ':companyInterestId',
      component: require('./CompanyInterestDetailRoute').default
    }
  ]
};
