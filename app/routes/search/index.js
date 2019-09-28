import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';
import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import RouteWrapper from 'app/components/RouteWrapper';
import { UserContext } from 'app/routes/app/AppRoute';
import SearchRoute from './SearchRoute';
import PageNotFound from '../pageNotFound';

const old = {
  path: 'search',
  indexRoute: resolveAsyncRoute(() => import('./SearchRoute'))
};

const searchRoute = ({ match }) => (
  <UserContext.Consumer>
    {({ currentUser, loggedIn }) => (
      <Switch>
        <RouteWrapper
          exact
          path={`${match.path}`}
          passedProps={{ currentUser, loggedIn }}
          Component={SearchRoute}
        />
        <Route component={PageNotFound} />
      </Switch>
    )}
  </UserContext.Consumer>
);
export default function Quotes() {
  return <Route path="/search" component={searchRoute} />;
}
