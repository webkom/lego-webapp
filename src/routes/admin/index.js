// <Route path='admin' component={AdminContainer}>
// //       <IndexRoute component={AdminOverview}/>
// //       <Route path='groups' component={GroupPageContainer}>
// //         <IndexRoute component={Test} />
// //         <Route path=':groupId' component={GroupViewContainer}>
// //           <Route path='settings' component={GroupSettings} />
// //           <Route path='members' component={GroupMembers} />
// //         </Route>
// //       </Route>
// //     </Route>

export default {
  path: 'admin',
  indexRoute: require('./OverviewRoute').default,
  childRoutes: [{
    path: 'groups',
    component: require('./GroupsRoute').default,
    childRoutes: [{
      path: ':groupId',
      component: require('./GroupDetailRoute').default,
      childRoutes: [{
        path: 'settings',
        component: require('./GroupSettingsRoute').default
      }, {
        path: 'members',
        component: require('./GroupMembersRoute').default
      }]
    }]
  }]
};
