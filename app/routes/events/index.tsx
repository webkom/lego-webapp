import loadable from '@loadable/component';
import { Route, Switch } from 'react-router-dom';
import { UserContext } from 'app/routes/app/AppRoute';
import EventStatistics from 'app/routes/events/EventStatisticsRoute';

const EventEditRoute = loadable(() => import('./EventEditRoute'));
const EventAdministrateRoute = loadable(
  () => import('./EventAdministrateRoute')
);
const EventAttendeeRoute = loadable(() => import('./EventAttendeeRoute'));
const EventAllergiesRoute = loadable(() => import('./EventAllergiesRoute'));
const EventAdminRegisterRoute = loadable(
  () => import('./EventAdminRegisterRoute')
);
const EventAbacardRoute = loadable(() => import('./EventAbacardRoute'));
const PageNotFound = loadable(() => import('../pageNotFound'));
const RouteWrapper = loadable(() => import('app/components/RouteWrapper'));
const CalendarRoute = loadable(() => import('./CalendarRoute'));
const CreateRoute = loadable(() => import('./EventCreateRoute'));
const DetailRoute = loadable(() => import('./EventDetailRoute'));
const EventListRoute = loadable(() => import('./EventListRoute'));

const eventRoute = ({
  match,
}: {
  match: {
    path: string;
  };
}) => (
  <UserContext.Consumer>
    {({ currentUser, loggedIn }) => (
      <Switch>
        <RouteWrapper
          exact
          path={`${match.path}`}
          Component={EventListRoute}
          passedProps={{
            currentUser,
            loggedIn,
          }}
        />
        <RouteWrapper
          path={`${match.path}/calendar/:year?/:month?`}
          Component={CalendarRoute}
          passedProps={{
            currentUser,
            loggedIn,
          }}
        />
        <RouteWrapper
          path={`${match.path}/create`}
          Component={CreateRoute}
          passedProps={{
            currentUser,
            loggedIn,
          }}
        />
        <RouteWrapper
          exact
          path={`${match.path}/:eventId`}
          passedProps={{
            currentUser,
            loggedIn,
          }}
          Component={DetailRoute}
        />
        <RouteWrapper
          path={`${match.path}/:eventId/edit`}
          passedProps={{
            currentUser,
            loggedIn,
          }}
          Component={EventEditRoute}
        />
        <Route path={`${match.path}/:eventId/administrate`}>
          {({ match }) => (
            <EventAdministrateRoute
              {...{
                match,
                currentUser,
                loggedIn,
              }}
            >
              <RouteWrapper
                exact
                path={`${match.path}/attendees`}
                Component={EventAttendeeRoute}
                passedProps={{
                  currentUser,
                  loggedIn,
                }}
              />
              <RouteWrapper
                exact
                path={`${match.path}/allergies`}
                Component={EventAllergiesRoute}
                passedProps={{
                  currentUser,
                  loggedIn,
                }}
              />
              <RouteWrapper
                exact
                path={`${match.path}/statistics`}
                Component={EventStatistics}
                passedProps={{
                  currentUser,
                  loggedIn,
                }}
              />
              <RouteWrapper
                exact
                path={`${match.path}/admin-register`}
                Component={EventAdminRegisterRoute}
                passedProps={{
                  currentUser,
                  loggedIn,
                }}
              />
              <RouteWrapper
                exact
                path={`${match.path}/abacard`}
                Component={EventAbacardRoute}
                passedProps={{
                  currentUser,
                  loggedIn,
                }}
              />
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
