export default {
  path: 'events',
  indexRoute: { component: require('./CalendarRoute').default },
  childRoutes: [{
    path: 'list',
    component: require('./EventListRoute').default
  }, {
    path: ':eventId',
    component: require('./EventDetailRoute').default
  }]
};
