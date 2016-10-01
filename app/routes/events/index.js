export default {
  path: 'events',
  indexRoute: { component: require('./EventListRoute').default },
  childRoutes: [{
    path: 'calendar',
    component: require('./CalendarRoute').default
  }, {
    path: ':eventId',
    component: require('./EventDetailRoute').default
  }]
};
