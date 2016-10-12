import React, { Component } from 'react';
import isEqual from 'lodash/isEqual';

type Props = {
  groupId: number,
  updateGroup: () => void
};

export default class EditPermissions extends Component {
  props: Props;

  newPermissionRef: any;

  constructor(props) {
    super(props);
    this.state = {
      permissions: props.permissions,
      edited: false
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.permissions !== this.props.permissions) {
      this.setState({
        permissions: newProps.permissions
      });
    }
  }

  del(perm) {
    const permissions = this.state.permissions.filter((p) => p !== perm);
    this.setState({
      permissions
    });
  }

  save = () => {
    this.props.updateGroup({
      groupId: this.props.groupId,
      updates: {
        permissions: this.state.permissions
      }
    });
  };

  add = (e) => {
    e.preventDefault();
    if (!this.newPermissionRef.value) {
      return;
    }

    const permissions = [...this.state.permissions, this.newPermissionRef.value];
    this.newPermissionRef.value = '';
    this.setState({
      permissions
    });
  };

  render() {
    const { permissions } = this.state;
    const edited = !isEqual(permissions, this.props.permissions);

    return (
      <div>
        <ul>
          {permissions.map((p) =>
            <li key={p}>
              {p} <button onClick={this.del.bind(this, p)}>X</button>
            </li>
          )}
        </ul>
        <form onSubmit={this.add}>
          <input
            type='text'
            ref={(ref) => { this.newPermissionRef = ref; }}
          />
          <input type='submit' value='+'/>
        </form>
        <br/>
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
