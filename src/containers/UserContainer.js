import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import UserProfile from '../components/UserProfile';
import RequireLogin from '../components/RequireLogin';
import { fetchUser } from '../actions/UserActions';

function fetchData(props) {
  const { username, users } = props;
  if (!users[username]) {
    props.fetchUser(username);
  }
}

@connect(
  (state, props) => ({
    username: props.params.username || state.auth.username,
    isMe: !props.params.username || props.params.username === state.auth.username
  }),
  { fetchUser }
)
export default class UserContainer extends Component {

  static propTypes = {
    auth: PropTypes.object.isRequired,
    username: PropTypes.string,
    loggedIn: PropTypes.bool.isRequired,
    users: PropTypes.object.isRequired,
    isMe: PropTypes.bool.isRequired,
    fetchUser: PropTypes.func.isRequired
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
    const user = this.props.users[this.props.username];
    const isMe = this.props.isMe;

    return (
      <RequireLogin loggedIn={this.props.loggedIn}>
        <UserProfile user={user} isMe={isMe} />
      </RequireLogin>
    );
  }
}
