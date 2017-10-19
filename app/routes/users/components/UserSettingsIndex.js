// @flow

import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import Content from 'app/components/Layout/Content';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import { LoginPage } from 'app/components/LoginForm';

type Props = {
  children: React$Element<*>,
  currentUser: Object,
  isMe: boolean,
  params: {
    username: string
  }
};

const UserSettingsIndex = (props: Props) => {
  const base = `/users/${props.params.username}/settings`;
  // At the moment changing settings for other users only works
  // for the settings under `/profile` - so no point in showing
  // the other tabs.
  return (
    <Content>
      <NavigationTab title="Innstillinger">
        {props.isMe && (
          <div>
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
          </div>
        )}
      </NavigationTab>
      {props.children &&
        React.cloneElement(props.children, {
          ...props,
          children: undefined
        })}
    </Content>
  );
};

const mapStateToProps = (state, props) => {
  const { username } = props.params;
  const isMe = username === 'me' || username === state.auth.username;
  return { isMe };
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  connect(mapStateToProps)
)(UserSettingsIndex);
