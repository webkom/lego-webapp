export default {
  path: 'interestgroups',
  indexRoute: { component: require('./InterestGroupListRoute').default },
  childRoutes: [{
    path: 'create',
    component: require('./InterestGroupCreateRoute').default
  }, {
    path: ':interestGroupId',
    component: require('./InterestGroupDetailRoute').default
  }]
};
