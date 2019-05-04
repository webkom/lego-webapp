import * as React from 'react';
import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';
import { Route, Switch } from 'react-router-dom';
import RouteWrapper from 'app/components/RouteWrapper';
import CalendarRoute from './CalendarRoute';
import CreateRoute from './EventCreateRoute';
import DetailRoute from './EventDetailRoute';
import EventListRoute from './EventListRoute';
import { UserContext } from 'app/routes/app/AppRoute';
import EventEditRoute from './EventEditRoute';

const old = {
  path: '/events',
  indexRoute: EventListRoute,
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

const eventRoute = ({ match }) => (
  <UserContext.Consumer>
    {({ currentUser, loggedIn }) => (
      <Switch>
        <RouteWrapper exact path={`${match.path}`} Component={EventListRoute} />
        <Route path={`${match.path}/calendar`} component={CalendarRoute} />
        {/*<Route
          exact
          path={`${match.path}/calendar`}
          component={({ match }) => (
            <>
            <Route path={`${match.path}/calendar`} component={CalendarRoute} />
              <Route
                path={`${match.path}/:year`}
                component={({ match }) => (
                  <Route
                    path={`${match.path}/:month`}
                    component={CalendarRoute}
                  />
                )}
              />
            </>
          )}
        />*/}
        <Route path={`${match.path}/create`} component={CreateRoute} />
        <RouteWrapper
          exact
          path={`${match.path}/:eventId`}
          passedProps={{ currentUser, loggedIn }}
          Component={DetailRoute}
        />
        <RouteWrapper
          path={`${match.path}/:eventId/edit`}
          passedProps={{ currentUser, loggedIn }}
          Component={EventEditRoute}
        />
      </Switch>
    )}
  </UserContext.Consumer>
);

export default function Events() {
  return <RouteWrapper path="/events" Component={eventRoute} />;
}
