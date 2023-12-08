import { Helmet } from 'react-helmet-async';
import { Route, Switch, useParams, useRouteMatch } from 'react-router-dom';
import { CompatRoute } from 'react-router-dom-v5-compat';
import { Content } from 'app/components/Content';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import { useUserContext } from 'app/routes/app/AppRoute';
import { useIsCurrentUser } from 'app/routes/users/utils';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';
import StudentConfirmation from './StudentConfirmation';
import UserSettings from './UserSettings';
import UserSettingsNotifications from './UserSettingsNotifications';
import UserSettingsOAuth2 from './UserSettingsOAuth2';
import UserSettingsOAuth2Form from './UserSettingsOAuth2Form';

const UserSettingsIndex = () => {
  const { path } = useRouteMatch();

  const { username } = useParams<{ username: string }>();
  const isCurrentUser = useIsCurrentUser(username);
  const { currentUser } = useUserContext();
  const base = `/users/${username}/settings`;

  // At the moment changing settings for other users only works
  // for the settings under `/profile` - so no point in showing
  // the other tabs.
  return (
    <Content>
      <Helmet title="Innstillinger" />
      <NavigationTab
        title="Innstillinger"
        back={{
          label: 'Profil',
          path: `/users/${username}`,
        }}
      >
        {isCurrentUser && (
          <>
            <NavigationLink to={`${base}/profile`}>Profil</NavigationLink>
            <NavigationLink to={`${base}/notifications`}>
              Notifikasjoner
            </NavigationLink>
            <NavigationLink to={`${base}/oauth2`}>OAuth2</NavigationLink>
            <NavigationLink to={`${base}/student-confirmation`}>
              {currentUser.isStudent
                ? 'Studentstatus'
                : 'Verifiser studentstatus'}
            </NavigationLink>
          </>
        )}
      </NavigationTab>

      <Switch>
        <Route exact path={`${path}/profile`} component={UserSettings} />
        <Route
          exact
          path={`${path}/notifications`}
          component={UserSettingsNotifications}
        />
        <Route exact path={`${path}/oauth2`} component={UserSettingsOAuth2} />
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
        <Route
          exact
          path={`${path}/student-confirmation`}
          component={StudentConfirmation}
        />
      </Switch>
    </Content>
  );
};

export default guardLogin(UserSettingsIndex);
