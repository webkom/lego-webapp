import loadable from '@loadable/component';
import { Helmet } from 'react-helmet-async';
import { Outlet, type RouteObject, useParams } from 'react-router-dom';
import { Content } from 'app/components/Content';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import { useUserContext } from 'app/routes/app/AppRoute';
import pageNotFound from 'app/routes/pageNotFound';
import { useIsCurrentUser } from 'app/routes/users/utils';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';

const UserSettings = loadable(() => import('./UserSettings'));
const UserSettingsNotifications = loadable(
  () => import('./UserSettingsNotifications'),
);
const UserSettingsOAuth2 = loadable(() => import('./UserSettingsOAuth2'));
const UserSettingsOAuth2Form = loadable(
  () => import('./UserSettingsOAuth2Form'),
);
const StudentConfirmation = loadable(() => import('./StudentConfirmation'));

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

      <Outlet />
    </Content>
  );
};

const userSettingsRoute: RouteObject[] = [
  {
    Component: guardLogin(UserSettingsIndex),
    children: [
      { path: 'profile', Component: UserSettings },
      { path: 'notifications', Component: UserSettingsNotifications },
      {
        path: 'oauth2/*',
        children: [
          { index: true, Component: UserSettingsOAuth2 },
          { path: 'new', Component: UserSettingsOAuth2Form },
          { path: ':applicationId', Component: UserSettingsOAuth2Form },
        ],
      },
      { path: 'student-confirmation', Component: StudentConfirmation },
    ],
  },
  { path: '*', children: pageNotFound },
];

export default userSettingsRoute;
