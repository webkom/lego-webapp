import { omit } from 'lodash';
import { cloneElement } from 'react';
import { Helmet } from 'react-helmet-async';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Content } from 'app/components/Content';
import { LoginPage } from 'app/components/LoginForm';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import type { Element } from 'react';

type Props = {
  children: Array<Element<any>>;
  currentUser: Record<string, any>;
  isMe: boolean;
  match: {
    path: string;
    params: {
      username: string;
    };
  };
};

const UserSettingsIndex = (props: Props) => {
  const base = `/users/${props.match.params.username}/settings`;
  // At the moment changing settings for other users only works
  // for the settings under `/profile` - so no point in showing
  // the other tabs.
  return (
    <Content>
      <Helmet title="Innstillinger" />
      <NavigationTab title="Innstillinger">
        {props.isMe && (
          <>
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
          </>
        )}
      </NavigationTab>
      {props.children &&
        props.children.map((child) =>
          cloneElement(child, { ...omit(props, 'match'), children: undefined })
        )}
    </Content>
  );
};

const mapStateToProps = (state, props) => {
  const { username } = props.match.params;
  const isMe = username === 'me' || username === state.auth.username;
  return {
    isMe,
  };
};

export default compose(
  replaceUnlessLoggedIn(LoginPage), // $FlowFixMe
  connect(mapStateToProps)
)(UserSettingsIndex);
