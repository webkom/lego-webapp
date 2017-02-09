export default {
  path: 'meetings',
  indexRoute: { component: require('./MeetingListRoute').default },
  childRoutes: [{
    path: 'create',
    component: require('./MeetingCreateRoute').default
  }, {
    path: ':meetingId',
    component: require('./MeetingDetailRoute').default
  }, {
    path: ':meetingId/edit',
    component: require('./MeetingEditRoute').default

  }
  ]
};
