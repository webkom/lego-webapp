// @flow
import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import RouteWrapper from 'app/components/RouteWrapper';
import { UserContext } from 'app/routes/app/AppRoute';
import JoblistingRoute from './JoblistingRoute';
import JoblistingCreateRoute from './JoblistingCreateRoute';
import JoblistingDetailedRoute from './JoblistingDetailedRoute';
import JoblistingEditRoute from './JoblistingEditRoute';
import PageNotFound from '../pageNotFound';

const jobListingRoute = ({ match }: { match: { path: string } }) => (
  <UserContext.Consumer>
    {({ currentUser, loggedIn }) => (
      <Switch>
        <Route exact path={`${match.path}`} component={JoblistingRoute} />
        <RouteWrapper
          path={`${match.path}/create`}
          passedProps={{ currentUser, loggedIn }}
          Component={JoblistingCreateRoute}
        />
        <Route
          exact
          path={`${match.path}/:joblistingId`}
          component={JoblistingDetailedRoute}
        />
        <RouteWrapper
          path={`${match.path}/:joblistingId/edit`}
          passedProps={{ currentUser, loggedIn }}
          Component={JoblistingEditRoute}
        />
        <Route component={PageNotFound} />
      </Switch>
    )}
  </UserContext.Consumer>
);

export default function Joblistings() {
  return <Route path="/joblistings" component={jobListingRoute} />;
}
