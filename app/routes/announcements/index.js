import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';
import AnnouncementsRoute from './AnnouncementsRoute';
import { Route, Switch } from 'react-router-dom';
import RouteWrapper from 'app/components/RouteWrapper';
import * as React from 'react';
import PageNotFound from '../pageNotFound';
import { UserContext } from 'app/routes/app/AppRoute';

const old = {
  path: 'announcements',
  indexRoute: resolveAsyncRoute(
    () => import('./AnnouncementsRoute'),
    () => require('./AnnouncementsRoute')
  )
};

const announcementsRoute = ({ match }) => (
  <UserContext.Consumer>
    {({ currentUser, loggedIn }) => (
      <Switch>
        <RouteWrapper
          exact
          path={`${match.path}`}
          passedProps={{ currentUser, loggedIn }}
          Component={AnnouncementsRoute}
        />
        <Route component={PageNotFound} />
      </Switch>
    )}
  </UserContext.Consumer>
);

export default function Announcements() {
  return <Route path="/announcements" component={announcementsRoute} />;
}
