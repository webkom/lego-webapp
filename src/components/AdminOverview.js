import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class AdminOverview extends Component {
  static propTypes = {
    children: PropTypes.any
  };
  render() {
    return (
      <div>
        <h1>Admin</h1>
        <ul>
          <li>
            <Link to='/admin/groups'>Groups</Link>
          </li>
        </ul>
      </div>
    );
  }
}
