export default {
  path: 'companyInterest',
  indexRoute: { component: require('./CompanyInterestListRoute').default },
  childRoutes: [
    {
      path: 'createCompanyInterest',
      component: require('./CompanyInterestRoute').default
    }
  ]
};
