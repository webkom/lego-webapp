import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';
import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import RouteWrapper from 'app/components/RouteWrapper';
import { UserContext } from 'app/routes/app/AppRoute';
import PollsListRoute from './PollsListRoute';
import PollsCreateRoute from './PollsCreateRoute';
import PollsDetailRoute from './PollsDetailRoute';
import PageNotFound from '../pageNotFound';

const old = {
  path: 'polls',
  indexRoute: resolveAsyncRoute(() => import('./PollsListRoute')),
  childRoutes: [
    {
      path: 'new',
      ...resolveAsyncRoute(() => import('./PollsCreateRoute'))
    },
    {
      path: ':pollsId',
      ...resolveAsyncRoute(() => import('./PollsDetailRoute'))
    }
  ]
};

const pollsRoute = ({ match }) => (
  <UserContext.Consumer>
    {({ currentUser, loggedIn }) => (
      <Switch>
        <RouteWrapper
          exact
          path={`${match.path}`}
          passedProps={{ currentUser, loggedIn }}
          Component={PollsListRoute}
        />
        <RouteWrapper
          exact
          path={`${match.path}/new`}
          passedProps={{ currentUser, loggedIn }}
          Component={PollsCreateRoute}
        />
        <RouteWrapper
          exact
          path={`${match.path}/:pollsId`}
          passedProps={{ currentUser, loggedIn }}
          Component={PollsDetailRoute}
        />
        <Route component={PageNotFound} />
      </Switch>
    )}
  </UserContext.Consumer>
);
export default function Polls() {
  return <Route path="/polls" component={pollsRoute} />;
}
