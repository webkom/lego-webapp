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
import MatchType from 'app/models';

const jobListingRoute = ({ match }: { match: MatchType }) => (
  <UserContext.Consumer>
    {({ currentUser, loggedIn }) => (
      <Switch>
        <RouteWrapper
          path={`${match.path}/:joblistingId/edit`}
          passedProps={{ currentUser, loggedIn }}
          Component={JoblistingEditRoute}
        />
        <Route
          path={`${match.path}/:joblistingId`}
          component={JoblistingDetailedRoute}
        />
        <RouteWrapper
          path={`${match.path}/create`}
          passedProps={{ currentUser, loggedIn }}
          Component={JoblistingCreateRoute}
        />
        <Route path={`${match.path}`} component={JoblistingRoute} />
        <Route component={PageNotFound} />
      </Switch>
    )}
  </UserContext.Consumer>
);

export default function Joblistings() {
  return <Route path="/joblistings" component={jobListingRoute} />;
}
