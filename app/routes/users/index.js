import resolveAsyncRoute from 'app/routes/resolveAsyncRoute';
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

const old = {
  path: 'users',
  indexRoute: resolveAsyncRoute(() => import('../errors')),
  childRoutes: [
    {
      path: 'registration',
      ...resolveAsyncRoute(() => import('./UserConfirmationRoute'))
    },
    {
      path: 'reset-password',
      ...resolveAsyncRoute(() => import('./UserResetPasswordRoute'))
    },
    {
      path: ':username',
      ...resolveAsyncRoute(() => import('./UserProfileRoute'))
    },
    {
      path: ':username/settings',
      ...resolveAsyncRoute(() => import('./components/UserSettingsIndex')),
      childRoutes: [
        {
          path: 'profile',
          ...resolveAsyncRoute(() => import('./UserSettingsRoute'))
        },
        {
          path: 'notifications',
          ...resolveAsyncRoute(() => import('./UserSettingsNotificationsRoute'))
        },
        {
          path: 'oauth2',
          ...resolveAsyncRoute(() => import('./UserSettingsOAuth2Route'))
        },
        {
          path: 'oauth2/new',
          ...resolveAsyncRoute(() => import('./UserSettingsOAuth2CreateRoute'))
        },
        {
          path: 'oauth2/:applicationId',
          ...resolveAsyncRoute(() => import('./UserSettingsOAuth2EditRoute'))
        },
        {
          path: 'student-confirmation',
          ...resolveAsyncRoute(() => import('./StudentConfirmationRoute'))
        }
      ]
    }
  ]
};

const usersRoute = ({ match }) => (
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
                passedProps={(currentUser, loggedIn)}
                Component={UserSettingsRoute}
              />
              <RouteWrapper
                exact
                path={`${match.path}/notifications`}
                passedProps={(currentUser, loggedIn)}
                Component={UserSettingsNotificationsRoute}
              />
              <RouteWrapper
                exact
                path={`${match.path}/oauth2`}
                passedProps={(currentUser, loggedIn)}
                Component={UserSettingsOAuth2Route}
              />
              <RouteWrapper
                exact
                path={`${match.path}/oauth2/new`}
                passedProps={(currentUser, loggedIn)}
                Component={UserSettingsOAuth2CreateRoute}
              />
              <RouteWrapper
                exact
                path={`${match.path}/oauth2/:applicationId(\\d+)`}
                passedProps={(currentUser, loggedIn)}
                Component={UserSettingsOAuth2EditRoute}
              />
              <RouteWrapper
                exact
                path={`${match.path}/student-confirmation`}
                passedProps={(currentUser, loggedIn)}
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
