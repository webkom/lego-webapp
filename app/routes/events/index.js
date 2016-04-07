export default {
  path: 'events',
  component: require('./IndexRoute').default,
  indexRoute: { component: require('./components/Calendar').default },
  childRoutes: [{
    path: ':eventId',
    component: require('./EventDetailRoute').default
  }]
};
