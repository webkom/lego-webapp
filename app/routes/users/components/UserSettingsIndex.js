// @flow

import React from 'react';

import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import styles from './UserSettingsIndex.css';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import { LoginPage } from 'app/components/LoginForm';

type Props = {
  children: React$Element<*>,
  currentUser: Object
};

const UserSettingsIndex = (props: Props) => {
  return (
    <div className={styles.root}>
      <NavigationTab title="Innstillinger">
        <NavigationLink to="/users/me/settings/profile">Profil</NavigationLink>
        <NavigationLink to="/users/me/settings/notifications">
          Notifikasjoner
        </NavigationLink>
        <NavigationLink to="/users/me/settings/oauth2">OAuth2</NavigationLink>
        {!props.currentUser.isStudent &&
          <NavigationLink to="/users/me/settings/student-confirmation">
            Verifiser studentstatus
          </NavigationLink>}
      </NavigationTab>
      {React.cloneElement(props.children, {
        ...props,
        children: undefined
      })}
    </div>
  );
};

export default replaceUnlessLoggedIn(LoginPage)(UserSettingsIndex);
