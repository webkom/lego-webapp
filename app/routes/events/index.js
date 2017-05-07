import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';

export default {
  path: 'events',
  indexRoute: resolveAsyncRoute(
    () => import('./EventListRoute'),
    () => require('./EventListRoute')
  ),
  childRoutes: [
    {
      path: 'calendar',
      ...resolveAsyncRoute(
        () => import('./CalendarRoute'),
        () => require('./CalendarRoute')
      ),
      childRoutes: [
        {
          path: ':year',
          childRoutes: [
            {
              path: ':month'
            }
          ]
        }
      ]
    },
    {
      path: 'create',
      ...resolveAsyncRoute(
        () => import('./EventCreateRoute'),
        () => require('./EventCreateRoute')
      )
    },
    {
      path: ':eventId',
      ...resolveAsyncRoute(
        () => import('./EventDetailRoute'),
        () => require('./EventDetailRoute')
      )
    },
    {
      path: ':eventId/edit',
      ...resolveAsyncRoute(
        () => import('./EventEditRoute'),
        () => require('./EventEditRoute')
      )
    },
    {
      path: ':eventId/administrate',
      ...resolveAsyncRoute(
        () => import('./EventAdministrateRoute'),
        () => require('./EventAdministrateRoute')
      )
    }
  ]
};
