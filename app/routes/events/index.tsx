import loadable from '@loadable/component';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { CompatRoute } from 'react-router-dom-v5-compat';
import RouteWrapper from 'app/components/RouteWrapper';
import { UserContext } from 'app/routes/app/AppRoute';

const EventDetail = loadable(() => import('./components/EventDetail'));
const EventEditRoute = loadable(() => import('./EventEditRoute'));
const EventAdministrateRoute = loadable(
  () => import('./EventAdministrateRoute')
);
const PageNotFound = loadable(() => import('../pageNotFound'));
const Calendar = loadable(() => import('./components/Calendar'));
const CreateRoute = loadable(() => import('./EventCreateRoute'));
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
          <CompatRoute
            exact
            path={`${path}/:eventIdOrSlug`}
            component={EventDetail}
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
