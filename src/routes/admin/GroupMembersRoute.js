import React, { Component, PropTypes } from 'react';
import LoadingIndicator from '🏠/components/LoadingIndicator';
import GroupMembersList from './components/GroupMembersList';

export default class GroupMembers extends Component {
  static propTypes = {
    group: PropTypes.object
  };

  render() {
    const { users } = this.props.group;
    return (
      <div>
        <h4>Users:</h4>
        <LoadingIndicator loading={!users}>
          {users && <GroupMembersList users={users} />}
        </LoadingIndicator>
      </div>
    );
  }
}
