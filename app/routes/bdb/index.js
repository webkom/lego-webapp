export default {
  path: 'bdb',
  indexRoute: { component: require('./BdbRoute').default },
  childRoutes: [{
    path: 'add',
    component: require('./AddCompanyRoute').default
  }, {
    path: ':companyId',
    component: require('./BdbDetailRoute').default
  }, {
    path: ':companyId/edit',
    component: require('./EditCompanyRoute').default
  }, {
    path: ':companyId/semesters/add',
    component: require('./AddSemesterRoute').default
  }, {
    path: ':companyId/semesters/:semesterId',
    component: require('./EditSemesterRoute').default
  }
  ]
};
