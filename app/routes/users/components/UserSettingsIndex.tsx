import { Helmet } from 'react-helmet-async';
import { Route, Routes, useParams } from 'react-router-dom-v5-compat';
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

      <Routes>
        <Route path="profile" element={<UserSettings />} />
        <Route path="notifications" element={<UserSettingsNotifications />} />
        <Route
          path="oauth2/*"
          element={
            <Routes>
              <Route index element={<UserSettingsOAuth2 />} />
              <Route path="new" element={<UserSettingsOAuth2Form />} />
              <Route
                path=":applicationId"
                element={<UserSettingsOAuth2Form />}
              />
            </Routes>
          }
        />
        <Route path="student-confirmation" element={<StudentConfirmation />} />
      </Routes>
    </Content>
  );
};

export default guardLogin(UserSettingsIndex);
