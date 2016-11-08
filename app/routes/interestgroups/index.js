export default {
  path: 'interestgroups',
  indexRoute: { component: require('./InterestGroupListRoute').default },
  childRoutes: [{
    path: ':interestGroupId',
    component: require('./InterestGroupDetailRoute').default
  }]
};
