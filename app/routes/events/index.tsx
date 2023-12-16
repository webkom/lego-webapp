import loadable from '@loadable/component';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { CompatRoute } from 'react-router-dom-v5-compat';

const EventDetail = loadable(() => import('./components/EventDetail'));
const EventEditor = loadable(() => import('./components/EventEditor'));
const EventAdministrateRoute = loadable(
  () => import('./EventAdministrateRoute')
);
const PageNotFound = loadable(() => import('../pageNotFound'));
const Calendar = loadable(() => import('./components/Calendar'));
const EventList = loadable(() => import('./components/EventList'));

const EventRoute = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path} component={EventList} />
      <Route path={`${path}/calendar/:year?/:month?`} component={Calendar} />
      <CompatRoute path={`${path}/create`} component={EventEditor} />
      <CompatRoute
        exact
        path={`${path}/:eventIdOrSlug`}
        component={EventDetail}
      />
      <CompatRoute
        path={`${path}/:eventIdOrSlug/edit`}
        component={EventEditor}
      />
      <Route
        path={`${path}/:eventId/administrate`}
        component={EventAdministrateRoute}
      />
      <Route component={PageNotFound} />
    </Switch>
  );
};

export default function Events() {
  return <Route path="/events" component={EventRoute} />;
}
