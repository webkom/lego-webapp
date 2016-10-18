// @flow

import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import UserProfile from './components/UserProfile';
import RequireLogin from 'app/components/RequireLogin';
import { fetchUser } from 'app/actions/UserActions';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';

function loadData(params, props) {
  const { username } = params;
  if (!props.user) {
    props.fetchUser(username);
  }
}

type Props = {
  loggedIn: boolean,
  user: Object,
  isMe: boolean
};

class UserProfileRoute extends Component {
  props: Props;

  render() {
    const { user, isMe } = this.props;

    return (
      <RequireLogin loggedIn={this.props.loggedIn}>
        <UserProfile
          user={user}
          isMe={isMe}
        />
      </RequireLogin>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    username: props.params.username || state.auth.username,
    isMe: !props.params.username || props.params.username === state.auth.username,
    auth: state.auth,
    user: state.users.byId[props.params.username || state.auth.username],
    loggedIn: state.auth.token !== null
  };
}

const mapDispatchToProps = { fetchUser };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchOnUpdate(['username'], loadData)
)(UserProfileRoute);
