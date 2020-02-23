// @flow
import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import RouteWrapper from 'app/components/RouteWrapper';
import { UserContext } from 'app/routes/app/AppRoute';
import MeetingListRoute from './MeetingListRoute';
import MeetingCreateRoute from './MeetingCreateRoute';
import MeetingDetailRoute from './MeetingDetailRoute';
import MeetingEditRoute from './MeetingEditRoute';
import PageNotFound from '../pageNotFound';

const meetingRoute = ({ match }: { match: { path: string } }) => (
  <UserContext.Consumer>
    {({ currentUser, loggedIn }) => (
      <Switch>
        <RouteWrapper
          exact
          path={`${match.path}`}
          passedProps={{ currentUser, loggedIn }}
          Component={MeetingListRoute}
        />
        <RouteWrapper
          path={`${match.path}/create`}
          passedProps={{ currentUser, loggedIn }}
          Component={MeetingCreateRoute}
        />
        <RouteWrapper
          exact
          path={`${match.path}/:meetingId`}
          passedProps={{ currentUser, loggedIn }}
          Component={MeetingDetailRoute}
        />
        <RouteWrapper
          path={`${match.path}/:meetingId/edit`}
          passedProps={{ currentUser, loggedIn }}
          Component={MeetingEditRoute}
        />
        <Route component={PageNotFound} />
      </Switch>
    )}
  </UserContext.Consumer>
);
export default function Meetings() {
  return <Route path="/meetings" component={meetingRoute} />;
}
