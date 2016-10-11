export default {
  path: 'meetings',
  indexRoute: { component: require('./MeetingListRoute').default },
  childRoutes: [{
    path: ':meetingId',
    component: require('./MeetingDetailRoute').default
  }]
};
