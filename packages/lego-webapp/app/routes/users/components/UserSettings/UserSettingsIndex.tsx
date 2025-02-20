import { Page } from '@webkom/lego-bricks';
import { Helmet } from 'react-helmet-async';
import { Outlet, useParams } from 'react-router';
import { NavigationTab } from 'app/components/NavigationTab/NavigationTab';
import { useIsCurrentUser } from 'app/routes/users/utils';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';
import { useCurrentUser } from '~/redux/slices/auth';

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

export default guardLogin(UserSettingsIndex);
