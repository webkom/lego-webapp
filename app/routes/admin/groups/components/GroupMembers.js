// @flow

import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import qs from 'qs';
import { compose } from 'redux';

import type { AddMemberArgs } from 'app/actions/GroupActions';
import {
  addMember,
  fetchMemberships,
  fetchMembershipsPagination,
  removeMember,
} from 'app/actions/GroupActions';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { selectMembershipsForGroup } from 'app/reducers/memberships';
import { selectPaginationNext } from 'app/reducers/selectors';
import prepare from 'app/utils/prepare';
import AddGroupMember from './AddGroupMember';
import GroupMembersList from './GroupMembersList';

import styles from './GroupMembers.css';

type Props = {
  groupId: number,
  hasMore: boolean,
  fetch: ({
    groupId: number,
    next: boolean,
    query: Object,
    descendants: boolean,
  }) => Promise<*>,
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
      Antall medlemmer (inkl. undergrupper):{' '}
      {groupsById[groupId.toString()].numberOfUsers}
    </>
    {showDescendants || (
      <AddGroupMember addMember={addMember} groupId={groupId} />
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
  const showDescendants = search.includes('descendants=true');
  const groupId = props.match.params && props.match.params.groupId;

  const { filters: qsFilters } = qs.parse(search.slice(1));
  const filters = JSON.parse(typeof qsFilters === 'string' ? qsFilters : '{}');
  const {
    role = '',
    'user.fullName': userFullname = '',
    abakusGroup: abakusGroupName = '',
  } = filters;

  const query = {
    descendants: showDescendants,
    role,
    userFullname,
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
