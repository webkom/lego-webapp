import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import UserProfile from '../components/UserProfile';
import RequireLogin from '../components/RequireLogin';
import { fetchUser } from '../actions/UserActions';

function fetchData(props) {
  const { dispatch, username, users } = props;
  if (!users[username]) {
    dispatch(fetchUser(username));
  }
}

@connect(state => ({
  username: state.router.params.username || state.auth.username
}))
export default class UserContainer extends Component {

  static propTypes = {
    auth: PropTypes.object.isRequired,
    username: PropTypes.string,
    loggedIn: PropTypes.bool.isRequired,
    users: PropTypes.object.isRequired
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

    return (
      <RequireLogin loggedIn={this.props.loggedIn}>
        <UserProfile user={user} />
      </RequireLogin>
    );
  }
}
