import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LoadingIndicator from 'app/components/LoadingIndicator';
import GroupMembersList from './GroupMembersList';
import AddGroupMember from './AddGroupMember';
import styles from './GroupMembers.css';

export default class GroupMembers extends Component {
  static propTypes = {
    group: PropTypes.object
  };

  render() {
    const { memberships } = this.props.group;
    return (
      <div className={styles.groupMembers}>
        <AddGroupMember group={this.props.group} />
        <LoadingIndicator loading={!memberships}>
          <h3 className={styles.subTitle}>Brukere</h3>
          <GroupMembersList memberships={memberships} />
        </LoadingIndicator>
      </div>
    );
  }
}
