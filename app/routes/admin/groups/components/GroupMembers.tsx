import { LoadingIndicator } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { useParams } from 'react-router-dom';
import { fetchMembershipsPagination } from 'app/actions/GroupActions';
import { selectGroupEntities } from 'app/reducers/groups';
import { selectMembershipsForGroup } from 'app/reducers/memberships';
import { selectPaginationNext } from 'app/reducers/selectors';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import useQuery from 'app/utils/useQuery';
import AddGroupMember from './AddGroupMember';
import GroupMembersList from './GroupMembersList';
import type { GroupPageParams } from 'app/routes/admin/groups/components/GroupPage';

export const defaultGroupMembersQuery = {
  descendants: 'false' as 'false' | 'true',
  role: undefined as string | undefined,
  userFullname: '',
  abakusGroupName: '',
};

const GroupMembers = () => {
  const { groupId } = useParams<GroupPageParams>() as GroupPageParams;
  const { query } = useQuery(defaultGroupMembersQuery);
  const showDescendants = query.descendants === 'true';

  const { pagination } = useAppSelector((state) =>
    selectPaginationNext({
      endpoint: `/groups/${groupId}/memberships/`,
      entity: 'memberships',
      query,
    })(state),
  );

  const memberships = useAppSelector((state) =>
    selectMembershipsForGroup(state, {
      groupId,
      descendants: showDescendants,
      pagination,
    }),
  );

  const groupEntities = useAppSelector(selectGroupEntities);
  const fetching = useAppSelector((state) => state.memberships.fetching);
  const hasMore = pagination.hasMore;

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchMemberships',
    () =>
      dispatch(
        fetchMembershipsPagination({
          groupId,
          next: true,
          query,
        }),
      ),
    [groupId, query],
  );

  return (
    <>
      <>
        Antall medlemmer (inkl. undergrupper):{' '}
        {groupEntities[groupId?.toString()]?.numberOfUsers}
      </>

      {showDescendants || <AddGroupMember groupId={groupId} />}

      <LoadingIndicator loading={!memberships && fetching}>
        <h3>Brukere</h3>
        <GroupMembersList
          groupId={groupId}
          key={Number(groupId) + Number(showDescendants)}
          hasMore={hasMore}
          groupsById={groupEntities}
          fetching={fetching}
          memberships={memberships}
        />
      </LoadingIndicator>
    </>
  );
};

export default GroupMembers;
