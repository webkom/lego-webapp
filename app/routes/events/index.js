// @flow
import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import RouteWrapper from 'app/components/RouteWrapper';
import CalendarRoute from './CalendarRoute';
import CreateRoute from './EventCreateRoute';
import DetailRoute from './EventDetailRoute';
import EventListRoute from './EventListRoute';
import { UserContext } from 'app/routes/app/AppRoute';
import EventEditRoute from './EventEditRoute';
import EventAdministrateRoute from './EventAdministrateRoute';
import EventAttendeeRoute from './EventAttendeeRoute';
import EventAdminRegisterRoute from './EventAdminRegisterRoute';
import EventAbacardRoute from './EventAbacardRoute';
import PageNotFound from '../pageNotFound';

const eventRoute = ({ match }: { match: { path: string } }) => (
  <UserContext.Consumer>
    {({ currentUser, loggedIn }) => (
      <Switch>
        <Route exact path={`${match.path}`} component={EventListRoute} />
        <Route
          path={`${match.path}/calendar/:year?/:month?`}
          component={CalendarRoute}
        />
        <RouteWrapper
          path={`${match.path}/create`}
          Component={CreateRoute}
          passedProps={{ currentUser, loggedIn }}
        />
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
        <Route path={`${match.path}/:eventId/administrate`}>
          {({ match }) => (
            <EventAdministrateRoute {...{ match, currentUser, loggedIn }}>
              <RouteWrapper
                exact
                path={`${match.path}/attendees`}
                Component={EventAttendeeRoute}
                passedProps={{ currentUser, loggedIn }}
              />
              <RouteWrapper
                exact
                path={`${match.path}/admin-register`}
                Component={EventAdminRegisterRoute}
                passedProps={{ currentUser, loggedIn }}
              />
              <RouteWrapper
                exact
                path={`${match.path}/abacard`}
                Component={EventAbacardRoute}
                passedProps={{ currentUser, loggedIn }}
              />
              <Route component={PageNotFound} />
            </EventAdministrateRoute>
          )}
        </Route>
        <Route component={PageNotFound} />
      </Switch>
    )}
  </UserContext.Consumer>
);

export default function Events() {
  return <Route path="/events" component={eventRoute} />;
}
