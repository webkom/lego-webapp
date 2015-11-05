import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import UserProfile from '../components/UserProfile';
import RequireLogin from '../components/RequireLogin';
import { fetchUser } from '../actions/UserActions';

function fetchData(props) {
  const { username, user } = props;
  if (!user) {
    props.fetchUser(username);
  }
}

@connect(
  (state, props) => ({
    username: props.params.username || state.auth.username,
    isMe: !props.params.username || props.params.username === state.auth.username,
    auth: state.auth,
    user: state.users[props.params.username || state.auth.username],
    loggedIn: state.auth.token !== null
  }),
  { fetchUser }
)
export default class UserContainer extends Component {

  static propTypes = {
    auth: PropTypes.object.isRequired,
    username: PropTypes.string,
    loggedIn: PropTypes.bool.isRequired,
    user: PropTypes.object,
    isMe: PropTypes.bool.isRequired,
    fetchUser: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired
  };

  componentDidMount() {
    fetchData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.username !== this.props.username) {
      fetchData(nextProps);
    }
  }

  render() {
    const { user, isMe } = this.props;

    return (
      <RequireLogin loggedIn={this.props.loggedIn}>
        <UserProfile user={user} isMe={isMe} />
      </RequireLogin>
    );
  }
}
