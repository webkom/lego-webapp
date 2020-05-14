// @flow

import React, { Component } from 'react';
import { isEqual } from 'lodash';
import type { Permission, ID } from 'app/models';

type Props = {
  groupId: number,
  updateGroup: ({
    groupId: ID,
    updates: {
      permissions: Array<Permission>,
    },
  }) => void,
  permissions: Array<Permission>,
};

type State = {
  permissions: Array<Permission>,
  edited: boolean,
};

export default class EditPermissions extends Component<Props, State> {
  newPermissionRef: any;

  state = {
    permissions: this.props.permissions,
    edited: false,
  };

  // eslint-disable-next-line
  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.permissions !== this.props.permissions) {
      this.setState({
        permissions: nextProps.permissions,
      });
    }
  }

  del(perm: Permission) {
    const permissions = this.state.permissions.filter((p) => p !== perm);
    this.setState({
      permissions,
    });
  }

  save = () => {
    this.props.updateGroup({
      groupId: this.props.groupId,
      updates: {
        permissions: this.state.permissions,
      },
    });
  };

  add = (e: SyntheticEvent<*>) => {
    e.preventDefault();
    if (!this.newPermissionRef.value) {
      return;
    }

    const permissions = [
      ...this.state.permissions,
      this.newPermissionRef.value,
    ];
    this.newPermissionRef.value = '';
    this.setState({
      permissions,
    });
  };

  render() {
    const { permissions } = this.state;
    const edited = !isEqual(permissions, this.props.permissions);

    return (
      <div>
        <ul>
          {permissions.map((p) => (
            <li key={p}>
              {p} <button onClick={this.del.bind(this, p)}>X</button>
            </li>
          ))}
        </ul>
        <form onSubmit={this.add}>
          <input
            type="text"
            ref={(ref) => {
              this.newPermissionRef = ref;
            }}
          />
          <input type="submit" value="+" />
        </form>
        <br />
        <button
          onClick={this.save}
          style={{ display: edited ? 'block' : 'none' }}
        >
          Save
        </button>
      </div>
    );
  }
}
