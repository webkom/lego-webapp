import { useRouteMatch, Route, Switch } from 'react-router-dom';
import { CompatRoute } from 'react-router-dom-v5-compat';
import RouteWrapper from 'app/components/RouteWrapper';
import { UserContext } from 'app/routes/app/AppRoute';
import PageNotFound from '../pageNotFound';
import UserSettingsRoute from './UserSettingsRoute';
import StudentConfirmation from './components/StudentConfirmation';
import UserConfirmationForm from './components/UserConfirmation';
import UserProfile from './components/UserProfile';
import UserResetPasswordForm from './components/UserResetPassword';
import UserSettingsIndex from './components/UserSettingsIndex';
import UserSettingsNotifications from './components/UserSettingsNotifications';
import UserSettingsOAuth2 from './components/UserSettingsOAuth2';
import UserSettingsOAuth2Form from './components/UserSettingsOAuth2Form';

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
          <CompatRoute
            exact
            path={`${path}/reset-password`}
            component={UserResetPasswordForm}
          />
          <Route
            exact
            path={`${path}/student-confirmation`}
            component={StudentConfirmation}
          />
          <Route exact path={`${path}/:username`} component={UserProfile} />
          <Route path={`${path}/:username/settings`}>
            <UserSettingsIndex>
              <RouteWrapper
                exact
                path={`${path}/profile`}
                passedProps={{
                  currentUser,
                  loggedIn,
                }}
                Component={UserSettingsRoute}
              />
              <Route
                exact
                path={`${path}/notifications`}
                component={UserSettingsNotifications}
              />
              <Route
                exact
                path={`${path}/oauth2`}
                component={UserSettingsOAuth2}
              />
              <CompatRoute
                exact
                path={`${path}/oauth2/new`}
                component={UserSettingsOAuth2Form}
              />
              <CompatRoute
                exact
                path={`${path}/oauth2/:applicationId(\\d+)`}
                component={UserSettingsOAuth2Form}
              />
            </UserSettingsIndex>
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
