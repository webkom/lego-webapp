import React from 'react';
import { Link } from 'react-router';

const Members = ({ users }) => {
  if (!users.length) {
    return <div>No users</div>;
  }

  return (
    <ul>
      {users.map(({ username }) => (
        <li key={username}>
          <Link to={`/users/${username}`}>{username}</Link>
        </li>
      ))}
    </ul>
  );
};

export default Members;
