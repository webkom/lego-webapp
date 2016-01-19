import React, { Component, PropTypes } from 'react';
import LoadingIndicator from './ui/LoadingIndicator';
import EditPermissions from './EditPermissions';

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
    group: PropTypes.object,
    updateGroup: PropTypes.func
  };
  constructor() {
    super();
    this.state = {
      editing: true
    };
  }
  render() {
    const { permissions, id } = this.props.group;
    const { updateGroup } = this.props;
    const { editing } = this.state;

    let display;
    if (permissions) {
      display = editing ?
        <EditPermissions permissions={permissions} groupId={id} updateGroup={updateGroup} /> :
        <Permissions permissions={permissions} />;
    }

    return (
      <div>
        <h4>Permissions:</h4>
        <LoadingIndicator loading={!permissions}>
          {display}

        </LoadingIndicator>
      </div>
    );
  }
}
