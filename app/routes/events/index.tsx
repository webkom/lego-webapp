import loadable from '@loadable/component';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import RouteWrapper from 'app/components/RouteWrapper';
import { UserContext } from 'app/routes/app/AppRoute';

const EventEditRoute = loadable(() => import('./EventEditRoute'));
const EventAdministrateRoute = loadable(
  () => import('./EventAdministrateRoute')
);
const PageNotFound = loadable(() => import('../pageNotFound'));
const Calendar = loadable(() => import('./components/Calendar'));
const CreateRoute = loadable(() => import('./EventCreateRoute'));
const DetailRoute = loadable(() => import('./EventDetailRoute'));
const EventList = loadable(() => import('./components/EventList'));

const EventRoute = () => {
  const { path } = useRouteMatch();

  return (
    <UserContext.Consumer>
      {({ currentUser, loggedIn }) => (
        <Switch>
          <Route exact path={path} component={EventList} />
          <Route
            path={`${path}/calendar/:year?/:month?`}
            component={Calendar}
          />
          <RouteWrapper
            path={`${path}/create`}
            Component={CreateRoute}
            passedProps={{
              currentUser,
              loggedIn,
            }}
          />
          <RouteWrapper
            exact
            path={`${path}/:eventIdOrSlug`}
            passedProps={{
              currentUser,
              loggedIn,
            }}
            Component={DetailRoute}
          />
          <RouteWrapper
            path={`${path}/:eventIdOrSlug/edit`}
            passedProps={{
              currentUser,
              loggedIn,
            }}
            Component={EventEditRoute}
          />
          <Route
            path={`${path}/:eventId/administrate`}
            component={EventAdministrateRoute}
          />
          <Route component={PageNotFound} />
        </Switch>
      )}
    </UserContext.Consumer>
  );
};

export default function Events() {
  return <Route path="/events" component={EventRoute} />;
}
