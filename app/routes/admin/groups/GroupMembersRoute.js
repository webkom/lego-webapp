import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LoadingIndicator from 'app/components/LoadingIndicator';
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
