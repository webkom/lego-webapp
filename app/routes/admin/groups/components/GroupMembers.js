// @flow

import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import LoadingIndicator from 'app/components/LoadingIndicator';
import GroupMembersList from './GroupMembersList';
import AddGroupMember from './AddGroupMember';
import prepare from 'app/utils/prepare';
import styles from './GroupMembers.css';
import {
  fetchMemberships,
  addMember,
  removeMember
} from 'app/actions/GroupActions';
import { selectMembershipsForGroup } from 'app/reducers/memberships';
import type { AddMemberArgs } from 'app/actions/GroupActions';

type Props = {
  group: Object,
  memberships: Array<Object>,
  addMember: AddMemberArgs => Promise<*>,
  removeMember: Object => Promise<*>
};

export const GroupMembers = ({
  addMember,
  removeMember,
  group,
  memberships
}: Props) => (
  <div className={styles.groupMembers}>
    <AddGroupMember addMember={addMember} group={group} />
    <LoadingIndicator loading={!memberships}>
      <h3 className={styles.subTitle}>Brukere</h3>
      <GroupMembersList removeMember={removeMember} memberships={memberships} />
    </LoadingIndicator>
  </div>
);

function loadData({ params }, dispatch) {
  return dispatch(fetchMemberships(params.groupId));
}

function mapStateToProps(state, props) {
  const memberships = selectMembershipsForGroup(state, {
    groupId: props.params.groupId
  });

  return { memberships };
}

const mapDispatchToProps = { addMember, removeMember };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  prepare(loadData, ['params.groupId'])
)(GroupMembers);
