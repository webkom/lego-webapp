export default {
  path: 'events',
  indexRoute: { component: require('./CalendarRoute').default },
  childRoutes: [{
    path: ':eventId',
    component: require('./EventDetailRoute').default
  }]
};
