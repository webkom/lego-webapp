import { LoadingIndicator } from '@webkom/lego-bricks';
import qs from 'qs';
import { useEffect, useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom-v5-compat';
import { fetchMemberships } from 'app/actions/GroupActions';
import { selectMembershipsForGroup } from 'app/reducers/memberships';
import { selectPaginationNext } from 'app/reducers/selectors';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import AddGroupMember from './AddGroupMember';
import GroupMembersList from './GroupMembersList';

const GroupMembers = () => {
  const { groupId } = useParams();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const showDescendants = location.search.includes('descendants=true');

  const { filters: qsFilters } = qs.parse(location.search.slice(1));
  const filters = JSON.parse(typeof qsFilters === 'string' ? qsFilters : '{}');
  const {
    role = '',
    'user.fullName': userFullname = '',
    abakusGroup: abakusGroupName = '',
  } = filters;
  const query = useMemo(() => {
    return {
      descendants: showDescendants,
      role,
      userFullname,
      abakusGroupName,
    };
  }, [showDescendants, role, userFullname, abakusGroupName]);

  const { pagination } = useAppSelector((state) =>
    selectPaginationNext({
      endpoint: `/groups/${groupId}/memberships/`,
      entity: 'memberships',
      query,
    })(state)
  );
  const memberships = useAppSelector((state) =>
    selectMembershipsForGroup(state, {
      groupId: groupId,
      descendants: showDescendants,
      pagination,
    })
  );
  const groupsById = useAppSelector((state) => state.groups.byId);
  const fetching = useAppSelector((state) => state.memberships.fetching);
  const hasMore = !pagination || pagination.hasMore;

  useEffect(() => {
    dispatch(fetchMemberships(groupId, showDescendants, query));
  }, [dispatch, groupId, location.search, query, showDescendants]);

  return (
    <>
      <>
        Antall medlemmer (inkl. undergrupper):{' '}
        {groupsById[groupId.toString()].numberOfUsers}
      </>

      {showDescendants || <AddGroupMember groupId={groupId} />}

      <LoadingIndicator loading={!memberships && fetching}>
        <h3>Brukere</h3>
        <GroupMembersList
          key={Number(groupId) + Number(showDescendants)}
          groupId={groupId}
          filters={filters}
          query={query}
          hasMore={hasMore}
          pathname={location.pathname}
          search={location.search}
          groupsById={groupsById}
          fetching={fetching}
          showDescendants={showDescendants}
          memberships={memberships}
        />
      </LoadingIndicator>
    </>
  );
};

export default GroupMembers;
