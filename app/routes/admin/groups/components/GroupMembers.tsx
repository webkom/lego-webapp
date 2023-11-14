import { LoadingIndicator } from '@webkom/lego-bricks';
import { push } from 'connected-react-router';
import qs from 'qs';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  fetchMemberships,
  fetchMembershipsPagination,
  addMember,
  removeMember,
} from 'app/actions/GroupActions';
import { selectCurrentUser } from 'app/reducers/auth';
import { selectMembershipsForGroup } from 'app/reducers/memberships';
import { selectPaginationNext } from 'app/reducers/selectors';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import AddGroupMember from './AddGroupMember';
import GroupMembersList from './GroupMembersList';
import type { AddMemberArgs } from 'app/actions/GroupActions';
import type Membership from 'app/store/models/Membership';
import type { CurrentUser } from 'app/store/models/User';

type Props = {
  groupId: number;
  hasMore: boolean;
  fetch: (arg0: {
    groupId: number;
    next: boolean;
    query: Record<string, any>;
    descendants: boolean;
  }) => Promise<any>;
  fetching: boolean;
  groupsById: Record<
    string,
    {
      name: string;
      numberOfUsers?: number;
    }
  >;
  memberships: Membership[];
  showDescendants: boolean;
  addMember: (arg0: AddMemberArgs) => Promise<any>;
  removeMember: (membership: Membership) => Promise<void>;
  push: (arg0: any) => void;
  pathname: string;
  search: string;
  query: Record<string, any>;
  filters: Record<string, any>;
  currentUser: CurrentUser;
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
  currentUser,
}: Props) => (
  <>
    <>
      Antall medlemmer (inkl. undergrupper):{' '}
      {groupsById[groupId.toString()].numberOfUsers}
    </>
    {showDescendants || (
      <AddGroupMember addMember={addMember} groupId={groupId} />
    )}
    <LoadingIndicator loading={!memberships}>
      <h3>Brukere</h3>
      <GroupMembersList
        key={groupId + Number(showDescendants)}
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
        addMember={addMember}
        removeMember={removeMember}
        memberships={memberships}
        currentUser={currentUser}
      />
    </LoadingIndicator>
  </>
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
  const currentUser = selectCurrentUser(state);
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
    currentUser,
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
  withPreparedDispatch('fetchGroupMemberships', loadData, (props) => [
    props.match.params.groupId,
  ])
)(GroupMembers);
