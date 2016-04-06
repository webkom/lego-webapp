import React, { Component, PropTypes } from 'react';
import LoadingIndicator from 'app/components/LoadingIndicator';
import EditPermissions from './components/EditPermissions';

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
      editing: false
    };
  }
  toggleEditing() {
    this.setState({
      editing: !this.state.editing
    });
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
        <h4>Permissions: (<a onClick={::this.toggleEditing}>{editing ? 'Cancel' : 'Edit'}</a>)</h4>
        <LoadingIndicator loading={!permissions}>
          {display}

        </LoadingIndicator>
      </div>
    );
  }
}
