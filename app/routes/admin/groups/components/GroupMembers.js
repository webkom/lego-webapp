// @flow

import React from 'react';
import { connect } from 'react-redux';
import LoadingIndicator from 'app/components/LoadingIndicator';
import GroupMembersList from './GroupMembersList';
import AddGroupMember from './AddGroupMember';
import styles from './GroupMembers.css';
import { addMember, removeMember } from 'app/actions/GroupActions';
import type { AddMemberArgs } from 'app/actions/GroupActions';

type Props = {
  group: Object,
  addMember: AddMemberArgs => Promise<*>,
  removeMember: Object => Promise<*>
};

export const GroupMembers = ({ addMember, removeMember, group }: Props) => {
  const { memberships } = group;
  return (
    <div className={styles.groupMembers}>
      <AddGroupMember addMember={addMember} group={group} />
      <LoadingIndicator loading={!memberships}>
        <h3 className={styles.subTitle}>Brukere</h3>
        <GroupMembersList
          removeMember={removeMember}
          memberships={memberships}
        />
      </LoadingIndicator>
    </div>
  );
};

const mapDispatchToProps = { addMember, removeMember };
export default connect(null, mapDispatchToProps)(GroupMembers);
