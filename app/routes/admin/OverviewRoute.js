import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

export default class OverviewRoute extends Component {
  static propTypes = {
    children: PropTypes.any
  };

  render() {
    return (
      <div>
        <h1>Admin</h1>
        <ul>
          <li>
            <Link to="/admin/groups">Groups</Link>
          </li>
        </ul>
      </div>
    );
  }
}
