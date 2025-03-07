import { Page } from '@webkom/lego-bricks';
import { PropsWithChildren } from 'react';
import { Helmet } from 'react-helmet-async';
import { NavigationTab } from '~/components/NavigationTab/NavigationTab';
import { useIsCurrentUser } from '~/pages/users/utils';
import { useCurrentUser } from '~/redux/slices/auth';
import { guardLogin } from '~/utils/replaceUnlessLoggedIn';
import { useParams } from '~/utils/useParams';

const UserSettingsIndex = ({ children }: PropsWithChildren) => {
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
      {children}
    </Page>
  );
};

export default guardLogin(UserSettingsIndex);
