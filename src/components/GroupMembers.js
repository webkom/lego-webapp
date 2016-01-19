import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import LoadingIndicator from './ui/LoadingIndicator';

const Members = ({ users }) => {
  if (!users.length) {
    return <div>No users</div>;
  }

  return (
    <ul>
      {users.map(({ username }) =>
        <li key={username}>
          <Link to={`/users/${username}`}>{username}</Link>
        </li>
      )}
    </ul>
  );
};

export default class GroupMembers extends Component {
  static propTypes = {
    group: PropTypes.object
  };

  render() {
    const { users } = this.props.group;
    return (
      <div>
        <h4>Users:</h4>
        <LoadingIndicator loading={!users}>
          {users && <Members users={users} />}
        </LoadingIndicator>
      </div>
    );
  }
}
