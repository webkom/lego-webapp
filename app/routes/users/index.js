// @flow
import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import RouteWrapper from 'app/components/RouteWrapper';
import { UserContext } from 'app/routes/app/AppRoute';
import PageNotFound from '../pageNotFound';
import UserSettingsIndex from './components/UserSettingsIndex';
import UserProfileRoute from './UserProfileRoute';
import UserSettingsRoute from './UserSettingsRoute';
import UserConfirmationRoute from './UserConfirmationRoute';
import UserResetPasswordRoute from './UserResetPasswordRoute';
import UserSettingsNotificationsRoute from './UserSettingsNotificationsRoute';
import UserSettingsOAuth2Route from './UserSettingsOAuth2Route';
import UserSettingsOAuth2CreateRoute from './UserSettingsOAuth2CreateRoute';
import UserSettingsOAuth2EditRoute from './UserSettingsOAuth2EditRoute';
import StudentConfirmationRoute from './StudentConfirmationRoute';

const usersRoute = ({ match }: { match: { path: string } }) => (
  <UserContext.Consumer>
    {({ currentUser, loggedIn }) => (
      <Switch>
        <RouteWrapper
          exact
          path={`${match.path}/registration`}
          passedProps={{ currentUser, loggedIn }}
          Component={UserConfirmationRoute}
        />
        <RouteWrapper
          exact
          path={`${match.path}/reset-password`}
          passedProps={{ currentUser, loggedIn }}
          Component={UserResetPasswordRoute}
        />
        <RouteWrapper
          exact
          path={`${match.path}/:username`}
          passedProps={{ currentUser, loggedIn }}
          Component={UserProfileRoute}
        />
        <Route path={`${match.path}/:username/settings`}>
          {({ match, location }) => (
            <UserSettingsIndex {...{ match, currentUser, loggedIn, location }}>
              <RouteWrapper
                exact
                path={`${match.path}/profile`}
                passedProps={{ currentUser, loggedIn }}
                Component={UserSettingsRoute}
              />
              <RouteWrapper
                exact
                path={`${match.path}/notifications`}
                passedProps={{ currentUser, loggedIn }}
                Component={UserSettingsNotificationsRoute}
              />
              <RouteWrapper
                exact
                path={`${match.path}/oauth2`}
                passedProps={{ currentUser, loggedIn }}
                Component={UserSettingsOAuth2Route}
              />
              <RouteWrapper
                exact
                path={`${match.path}/oauth2/new`}
                passedProps={{ currentUser, loggedIn }}
                Component={UserSettingsOAuth2CreateRoute}
              />
              <RouteWrapper
                exact
                path={`${match.path}/oauth2/:applicationId(\\d+)`}
                passedProps={{ currentUser, loggedIn }}
                Component={UserSettingsOAuth2EditRoute}
              />
              <RouteWrapper
                exact
                path={`${match.path}/student-confirmation`}
                passedProps={{ currentUser, loggedIn }}
                Component={StudentConfirmationRoute}
              />
            </UserSettingsIndex>
          )}
        </Route>
        <Route component={PageNotFound} />
      </Switch>
    )}
  </UserContext.Consumer>
);
export default function Users() {
  return <Route path="/users" component={usersRoute} />;
}
