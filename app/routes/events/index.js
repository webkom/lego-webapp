import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';
import EventListRoute from './EventListRoute';

export default {
  path: '/events',
  component: EventListRoute,
  childRoutes: [
    {
      path: 'calendar',
      ...resolveAsyncRoute(() => import('./CalendarRoute')),
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
      ...resolveAsyncRoute(() => import('./EventCreateRoute'))
    },
    {
      path: ':eventId',
      ...resolveAsyncRoute(() => import('./EventDetailRoute'))
    },
    {
      path: ':eventId/edit',
      ...resolveAsyncRoute(() => import('./EventEditRoute'))
    },
    {
      path: ':eventId/administrate',
      ...resolveAsyncRoute(() => import('./EventAdministrateRoute')),
      childRoutes: [
        {
          path: 'attendees',
          ...resolveAsyncRoute(() => import('./EventAttendeeRoute'))
        },
        {
          path: 'admin-register',
          ...resolveAsyncRoute(() => import('./EventAdminRegisterRoute'))
        },
        {
          path: 'abacard',
          ...resolveAsyncRoute(() => import('./EventAbacardRoute'))
        }
      ]
    }
  ]
};
