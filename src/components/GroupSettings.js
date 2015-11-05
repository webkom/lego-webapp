import React, { Component, PropTypes } from 'react';
import LoadingIndicator from './ui/LoadingIndicator';

const Permissions = ({ permissions }) => {
  if (!permissions.length) {
    return <div>No power</div>;
  }

  return (
    <ul>
      {permissions.map(permission =>
        <li key={permission}>
          {permission}
        </li>
      )}
    </ul>
  );
};

export default class GroupSettings extends Component {
  static propTypes = {
    group: PropTypes.object
  }

  render() {
    const { permissions } = this.props.group;
    return (
      <div>
        <h4>Permissions:</h4>
        <LoadingIndicator loading={!permissions}>
          {permissions && <Permissions permissions={permissions} />}
        </LoadingIndicator>
      </div>
    );
  }
}
