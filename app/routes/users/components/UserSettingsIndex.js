// @flow

import React from 'react';

import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import styles from './UserSettingsIndex.css';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import { LoginPage } from 'app/components/LoginForm';

type Props = {
  children: React$Element<*>,
  currentUser: Object,
  params: {
    username: string
  }
};

const UserSettingsIndex = (props: Props) => {
  const base = `/users/${props.params.username}/settings`;
  return (
    <div className={styles.root}>
      <NavigationTab title="Innstillinger">
        <NavigationLink to={`${base}/profile`}>Profil</NavigationLink>
        <NavigationLink to={`${base}/notifications`}>
          Notifikasjoner
        </NavigationLink>
        <NavigationLink to={`${base}/oauth2`}>OAuth2</NavigationLink>
        {!props.currentUser.isStudent && (
          <NavigationLink to={`${base}/student-confirmation`}>
            Verifiser studentstatus
          </NavigationLink>
        )}
      </NavigationTab>
      {props.children &&
        React.cloneElement(props.children, {
          ...props,
          children: undefined
        })}
    </div>
  );
};

export default replaceUnlessLoggedIn(LoginPage)(UserSettingsIndex);
