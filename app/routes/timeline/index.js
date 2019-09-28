import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';
import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import RouteWrapper from 'app/components/RouteWrapper';
import { UserContext } from 'app/routes/app/AppRoute';
import PageNotFound from '../pageNotFound';
import TimelineRoute from './TimelineRoute';

const old = {
  path: 'timeline',
  indexRoute: resolveAsyncRoute(
    () => import('./TimelineRoute'),
    () => import('./TimelineRoute')
  )
};

const timelineRoute = ({ match }) => (
  <UserContext.Consumer>
    {({ currentUser, loggedIn }) => (
      <Switch>
        <RouteWrapper
          exact
          path={`${match.path}`}
          passedProps={{ currentUser, loggedIn }}
          Component={TimelineRoute}
        />
        <Route component={PageNotFound} />
      </Switch>
    )}
  </UserContext.Consumer>
);
export default function Timeline() {
  return <Route path="/timeline" component={timelineRoute} />;
}
