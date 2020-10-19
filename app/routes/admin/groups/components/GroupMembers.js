// @flow

import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import LoadingIndicator from 'app/components/LoadingIndicator';
import GroupMembersList from './GroupMembersList';
import AddGroupMember from './AddGroupMember';
import prepare from 'app/utils/prepare';
import { push } from 'connected-react-router';
import styles from './GroupMembers.css';
import {
  fetchMemberships,
  fetchMembershipsPagination,
  addMember,
  removeMember,
} from 'app/actions/GroupActions';
import { selectMembershipsForGroup } from 'app/reducers/memberships';
import { selectPaginationNext } from 'app/reducers/selectors';
import type { AddMemberArgs } from 'app/actions/GroupActions';
import qs from 'qs';

type Props = {
  groupId: number,
  hasMore: boolean,
  fetch: ({ groupId: number, next: true }) => Promise<*>,
  fetching: boolean,
  groupsById: { [string]: { name: string, numberOfUsers?: number } },
  memberships: Array<Object>,
  showDescendants: boolean,
  addMember: (AddMemberArgs) => Promise<*>,
  removeMember: (Object) => Promise<*>,
  push: (any) => void,
  pathname: string,
  search: string,
  query: Object,
  filters: Object,
};

export const GroupMembers = ({
  addMember,
  removeMember,
  groupId,
  memberships,
  hasMore,
  fetching,
  showDescendants,
  groupsById,
  fetch,
  push,
  pathname,
  search,
  query,
  filters,
}: Props) => (
  <div className={styles.groupMembers}>
    <>
      Antall medlemmer (inlk. undergrupper):{' '}
      {groupsById[groupId.toString()].numberOfUsers}
    </>
    {showDescendants || (
      <AddGroupMember
        addMember={(...args) =>
          addMember(...args).then(() =>
            fetch({
              descendants: showDescendants,
              groupId: groupId,
              next: false,
              query,
            })
          )
        }
        groupId={groupId}
      />
    )}
    <LoadingIndicator loading={!memberships}>
      <h3 className={styles.subTitle}>Brukere</h3>
      <GroupMembersList
        key={groupId + showDescendants}
        groupId={groupId}
        filters={filters}
        query={query}
        hasMore={hasMore}
        push={push}
        pathname={pathname}
        search={search}
        groupsById={groupsById}
        fetch={fetch}
        fetching={fetching}
        showDescendants={showDescendants}
        removeMember={removeMember}
        memberships={memberships}
      />
    </LoadingIndicator>
  </div>
);

function loadData({ query, match: { params }, location }, dispatch) {
  const showDescendants = location.search.includes('descendants=true');
  return dispatch(fetchMemberships(params.groupId, showDescendants, query));
}

function mapStateToProps(state, props) {
  const { pathname, search } = state.router.location;
  const showDescendants = location.search.includes('descendants=true');
  const groupId = props.match.params && props.match.params.groupId;

  const { filters: qsFilters = '{}' } = qs.parse(search.slice(1));
  const filters = JSON.parse(qsFilters);
  const {
    role = '',
    'user.fullName': userFullname = '',
    'user.username': userUsername = '',
    abakusGroup: abakusGroupName = '',
  } = filters;

  const query = {
    descendants: showDescendants,
    role,
    userFullname,
    userUsername,
    abakusGroupName,
  };
  const { pagination } = selectPaginationNext({
    endpoint: `/groups/${groupId}/memberships/`,
    entity: 'memberships',
    query,
  })(state);
  const memberships = selectMembershipsForGroup(state, {
    groupId: props.match.params.groupId,
    descendants: showDescendants,
    pagination,
  });

  return {
    memberships,
    groupId,
    groupsById: state.groups.byId,
    fetching: state.memberships.fetching,
    showDescendants,
    hasMore: !pagination || pagination.hasMore,
    pathname,
    search,
    query,
    filters,
  };
}

const mapDispatchToProps = {
  addMember,
  removeMember,
  fetch: fetchMembershipsPagination,
  push,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  prepare(loadData, ['match.params.groupId'])
)(GroupMembers);
