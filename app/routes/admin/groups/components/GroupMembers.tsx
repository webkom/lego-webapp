import { LoadingIndicator } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { useParams } from 'react-router-dom';
import { fetchMembershipsPagination } from 'app/actions/GroupActions';
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
  const hasMore = pagination.hasMore;

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchMemberships',
    () =>
      groupId &&
      dispatch(fetchMembershipsPagination({ groupId, next: true, query })),
    [groupId]
  );

  return (
    <>
      <>
        Antall medlemmer (inkl. undergrupper):{' '}
        {groupsById[groupId?.toString()]?.numberOfUsers}
      </>

      {showDescendants || <AddGroupMember groupId={groupId} />}

      <LoadingIndicator loading={!memberships && fetching}>
        <h3>Brukere</h3>
        <GroupMembersList
          key={Number(groupId) + Number(showDescendants)}
          hasMore={hasMore}
          groupsById={groupsById}
          fetching={fetching}
          memberships={memberships}
        />
      </LoadingIndicator>
    </>
  );
};

export default GroupMembers;
