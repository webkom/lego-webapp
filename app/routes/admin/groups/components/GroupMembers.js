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
  fetchMembershipsPagination,
  addMember,
  removeMember
} from 'app/actions/GroupActions';
import { selectMembershipsForGroup } from 'app/reducers/memberships';
import type { AddMemberArgs } from 'app/actions/GroupActions';
import { get } from 'lodash';

type Props = {
  group: Object,
  hasMore: boolean,
  fetch: ({ groupId: string, next: true }) => Promise<*>,
  fetching: boolean,
  memberships: Array<Object>,
  addMember: AddMemberArgs => Promise<*>,
  removeMember: Object => Promise<*>
};

export const GroupMembers = ({
  addMember,
  removeMember,
  group,
  memberships,
  hasMore,
  fetching,

  fetch
}: Props) => (
  <div className={styles.groupMembers}>
    <AddGroupMember addMember={addMember} group={group} />
    <LoadingIndicator loading={!memberships}>
      <h3 className={styles.subTitle}>Brukere</h3>
      <GroupMembersList
        group={group}
        hasMore={hasMore}
        fetch={fetch}
        fetching={fetching}
        removeMember={removeMember}
        memberships={memberships}
      />
    </LoadingIndicator>
  </div>
);

function loadData({ match: { params } }, dispatch) {
  return dispatch(fetchMemberships(params.groupId));
}

function mapStateToProps(state, props) {
  const memberships = selectMembershipsForGroup(state, {
    groupId: props.match.params.groupId
  });

  const groupId = props.group && props.group.id;

  return {
    memberships,
    fetching: state.memberships.fetching,
    hasMore: get(state, ['memberships', 'pagination', groupId, 'hasMore'])
  };
}

const mapDispatchToProps = {
  addMember,
  removeMember,
  fetch: fetchMembershipsPagination
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  prepare(loadData, ['match.params.groupId'])
)(GroupMembers);
