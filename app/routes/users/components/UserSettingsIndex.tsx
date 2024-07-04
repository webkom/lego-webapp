import loadable from '@loadable/component';
import { Page } from '@webkom/lego-bricks';
import { Helmet } from 'react-helmet-async';
import { Outlet, type RouteObject, useParams } from 'react-router-dom';
import { NavigationTab } from 'app/components/NavigationTab/NavigationTab';
import { useCurrentUser } from 'app/reducers/auth';
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
  const currentUser = useCurrentUser();
  const base = `/users/${username}/settings`;

  // At the moment changing settings for other users only works
  // for the settings under `/profile` - so no point in showing
  // the other tabs.
  return (
    <Page
      title="Innstillinger"
      back={{
        label: 'Profil',
        href: `/users/${username}`,
      }}
      tabs={
        isCurrentUser && (
          <>
            <NavigationTab href={`${base}/profile`}>
              Rediger profil
            </NavigationTab>
            <NavigationTab href={`${base}/notifications`}>
              Notifikasjoner
            </NavigationTab>
            <NavigationTab href={`${base}/oauth2`}>OAuth2</NavigationTab>
            <NavigationTab href={`${base}/student-confirmation`}>
              {currentUser?.isStudent
                ? 'Studentstatus'
                : 'Verifiser studentstatus'}
            </NavigationTab>
          </>
        )
      }
    >
      <Helmet title="Innstillinger" />
      <Outlet />
    </Page>
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
