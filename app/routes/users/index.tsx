import { useRouteMatch, Route, Switch } from 'react-router-dom';
import RouteWrapper from 'app/components/RouteWrapper';
import { UserContext } from 'app/routes/app/AppRoute';
import PageNotFound from '../pageNotFound';
import StudentConfirmationRoute from './StudentConfirmationRoute';
import UserResetPasswordRoute from './UserResetPasswordRoute';
import UserSettingsNotificationsRoute from './UserSettingsNotificationsRoute';
import UserSettingsOAuth2CreateRoute from './UserSettingsOAuth2CreateRoute';
import UserSettingsOAuth2EditRoute from './UserSettingsOAuth2EditRoute';
import UserSettingsOAuth2Route from './UserSettingsOAuth2Route';
import UserSettingsRoute from './UserSettingsRoute';
import UserConfirmationForm from './components/UserConfirmation';
import UserProfile from './components/UserProfile';
import UserSettingsIndex from './components/UserSettingsIndex';

const UsersRoute = () => {
  const { path } = useRouteMatch();

  return (
    <UserContext.Consumer>
      {({ currentUser, loggedIn }) => (
        <Switch>
          <Route
            exact
            path={`${path}/registration`}
            component={UserConfirmationForm}
          />
          <RouteWrapper
            exact
            path={`${path}/reset-password`}
            passedProps={{
              currentUser,
              loggedIn,
            }}
            Component={UserResetPasswordRoute}
          />
          <Route exact path={`${path}/:username`} component={UserProfile} />
          <Route path={`${path}/:username/settings`}>
            {({ match, location }) => (
              <UserSettingsIndex
                {...{
                  match,
                  currentUser,
                  loggedIn,
                  location,
                }}
              >
                <RouteWrapper
                  exact
                  path={`${path}/profile`}
                  passedProps={{
                    currentUser,
                    loggedIn,
                  }}
                  Component={UserSettingsRoute}
                />
                <RouteWrapper
                  exact
                  path={`${path}/notifications`}
                  passedProps={{
                    currentUser,
                    loggedIn,
                  }}
                  Component={UserSettingsNotificationsRoute}
                />
                <RouteWrapper
                  exact
                  path={`${path}/oauth2`}
                  passedProps={{
                    currentUser,
                    loggedIn,
                  }}
                  Component={UserSettingsOAuth2Route}
                />
                <RouteWrapper
                  exact
                  path={`${path}/oauth2/new`}
                  passedProps={{
                    currentUser,
                    loggedIn,
                  }}
                  Component={UserSettingsOAuth2CreateRoute}
                />
                <RouteWrapper
                  exact
                  path={`${path}/oauth2/:applicationId(\\d+)`}
                  passedProps={{
                    currentUser,
                    loggedIn,
                  }}
                  Component={UserSettingsOAuth2EditRoute}
                />
                <RouteWrapper
                  exact
                  path={`${path}/student-confirmation`}
                  passedProps={{
                    currentUser,
                    loggedIn,
                  }}
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
};

export default function Users() {
  return <Route path="/users" component={UsersRoute} />;
}
