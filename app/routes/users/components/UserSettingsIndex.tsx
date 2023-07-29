import { omit } from 'lodash';
import { cloneElement } from 'react';
import { Helmet } from 'react-helmet-async';
import { compose } from 'redux';
import { Content } from 'app/components/Content';
import { LoginPage } from 'app/components/LoginForm';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import { useIsCurrentUser } from 'app/routes/users/utils';
import type { CurrentUser } from 'app/store/models/User';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import type { ReactElement } from 'react';
import type { RouteChildrenProps } from 'react-router';

type Props = {
  children: ReactElement[];
  currentUser: CurrentUser;
  loggedIn: boolean;
} & RouteChildrenProps<{ username: string }>;

const UserSettingsIndex = (props: Props) => {
  const isCurrentUser = useIsCurrentUser(props.match.params.username);

  const base = `/users/${props.match.params.username}/settings`;
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
          path: `/users/${props.match?.params.username}`,
        }}
      >
        {isCurrentUser && (
          <div data-test-id="navigation-tab">
            <NavigationLink to={`${base}/profile`}>Profil</NavigationLink>
            <NavigationLink to={`${base}/notifications`}>
              Notifikasjoner
            </NavigationLink>
            <NavigationLink to={`${base}/oauth2`}>OAuth2</NavigationLink>
            <NavigationLink to={`${base}/student-confirmation`}>
              {props.currentUser.isStudent
                ? 'Studentstatus'
                : 'Verifiser studentstatus'}
            </NavigationLink>
          </div>
        )}
      </NavigationTab>
      {props.children &&
        props.children.map((child) =>
          cloneElement(child, { ...omit(props, 'match'), children: undefined })
        )}
    </Content>
  );
};

export default compose(replaceUnlessLoggedIn(LoginPage))(UserSettingsIndex);
