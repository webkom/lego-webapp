import React, { Component } from 'react';
import LoadingIndicator from 'app/components/LoadingIndicator';
import EditPermissions from './components/EditPermissions';

const Permissions = ({ permissions }) => {
  if (!permissions.length) {
    return <div>No power</div>;
  }

  return (
    <ul>
      {permissions.map((permission) =>
        <li key={permission}>
          {permission}
        </li>
      )}
    </ul>
  );
};

export default class GroupSettings extends Component {
  state = {
    editing: true
  };

  toggleEditing = () => {
    this.setState({
      editing: !this.state.editing
    });
  };

  render() {
    const { permissions, id } = this.props.group;
    const { updateGroup } = this.props;
    const { editing } = this.state;

    let display;
    if (permissions) {
      display = editing
        ? <EditPermissions permissions={permissions} groupId={id} updateGroup={updateGroup} />
        : <Permissions permissions={permissions} />;
    }

    return (
      <div>
        <h4>Permissions: (<button onClick={this.toggleEditing}>{editing ? 'Cancel' : 'Edit'}</button>)</h4>
        <LoadingIndicator loading={!permissions}>
          {display}

        </LoadingIndicator>
      </div>
    );
  }
}
