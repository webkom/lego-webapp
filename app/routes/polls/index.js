// @flow
import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import RouteWrapper from 'app/components/RouteWrapper';
import { UserContext } from 'app/routes/app/AppRoute';
import PollsListRoute from './PollsListRoute';
import PollsCreateRoute from './PollsCreateRoute';
import PollsDetailRoute from './PollsDetailRoute';
import PageNotFound from '../pageNotFound';
import MatchType from 'app/models';

const pollsRoute = ({ match }: { match: MatchType }) => (
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
