import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';
import groups from './groups';
import email from './email';
import OverviewRoute from './OverviewRoute';
import { Route, Switch } from 'react-router-dom';
import RouteWrapper from 'app/components/RouteWrapper';
import * as React from 'react';
import PageNotFound from '../pageNotFound';
import { UserContext } from 'app/routes/app/AppRoute';

const old = {
  path: 'admin', // admin
  ...resolveAsyncRoute(() => import('./OverviewRoute')),
  childRoutes: [groups, email]
};

const adminRoute = ({ match }) => (
  <UserContext.Consumer>
    {({ currentUser, loggedIn }) => (
      <Switch>
        <RouteWrapper
          path={`${match.path}`}
          passedProps={{ currentUser, loggedIn }}
          Component={OverviewRoute}
        />
        <Route component={PageNotFound} />
      </Switch>
    )}
  </UserContext.Consumer>
);

export default function Admin() {
  return <Route path="/admin" component={adminRoute} />;
}
