import React, { Component, PropTypes } from 'react';
import isEqual from 'lodash/isEqual';

export default class EditPermissions extends Component {
  static propTypes = {
    permissions: PropTypes.array.isRequired,
    groupId: PropTypes.number.isRequired,
    updateGroup: PropTypes.func.isRequired
  };
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
    const permissions = this.state.permissions.filter(p => p !== perm);
    this.setState({
      permissions
    });
  }
  save() {
    this.props.updateGroup({
      groupId: this.props.groupId,
      updates: {
        permissions: this.state.permissions
      }
    });
  }
  add(e) {
    e.preventDefault();
    if (!this.refs.newPermission.value) {
      return;
    }
    const permissions = [...this.state.permissions, this.refs.newPermission.value];
    this.refs.newPermission.value = '';
    this.setState({
      permissions
    });
  }
  render() {
    const { permissions } = this.state;
    const edited = !isEqual(permissions, this.props.permissions);

    return (
      <div>
        <ul>
          {permissions.map(p =>
            <li key={p}>{p} <a className='fa fa-times' onClick={this.del.bind(this, p)}/></li>
          )}
        </ul>
        <form onSubmit={::this.add}>
          <input type='text' ref='newPermission'/>
          <input type='submit' value='+'/>
        </form>
        <br/>
        <button onClick={::this.save} style={{ display: edited ? 'block' : 'none' }}>Save</button>
      </div>
    );
  }
}
