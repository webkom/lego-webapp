import { LoadingIndicator } from '@webkom/lego-bricks';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMemberships } from 'app/actions/GroupActions';
import { selectMembershipsForGroup } from 'app/reducers/memberships';
import { selectPaginationNext } from 'app/reducers/selectors';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import useQuery from 'app/utils/useQuery';
import AddGroupMember from './AddGroupMember';
import GroupMembersList from './GroupMembersList';

export const defaultGroupMembersQuery = {
  descendants: 'false' as 'false' | 'true',
  role: undefined as string | undefined,
  userFullname: '',
  abakusGroupName: '',
};

const GroupMembers = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const dispatch = useAppDispatch();
  const { query } = useQuery(defaultGroupMembersQuery);
  const showDescendants = query.descendants === 'true';

  const { pagination } = useAppSelector((state) =>
    selectPaginationNext({
      endpoint: `/groups/${groupId}/memberships/`,
      entity: 'memberships',
      query,
    })(state)
  );

  const memberships = useAppSelector((state) =>
    selectMembershipsForGroup(state, {
      groupId,
      descendants: showDescendants,
      pagination,
    })
  );

  const groupsById = useAppSelector((state) => state.groups.byId);
  const fetching = useAppSelector((state) => state.memberships.fetching);
  const hasMore = !pagination || pagination.hasMore;

  useEffect(() => {
    dispatch(fetchMemberships(groupId, query));
  }, [dispatch, groupId, query, showDescendants]);

  return (
    <>
      <>
        Antall medlemmer (inkl. undergrupper):{' '}
        {groupsById[groupId.toString()]?.numberOfUsers}
      </>

      {showDescendants || <AddGroupMember groupId={groupId} />}

      <LoadingIndicator loading={!memberships && fetching}>
        <h3>Brukere</h3>
        <GroupMembersList
          key={Number(groupId) + Number(showDescendants)}
          groupId={groupId}
          hasMore={hasMore}
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
