import { usePreparedEffect } from '@webkom/react-prepare';
import { useCallback } from 'react';
import { useParams } from 'react-router';
import { fetchMembershipsPagination } from 'app/actions/GroupActions';
import { ContentMain } from 'app/components/Content';
import { selectGroupById } from 'app/reducers/groups';
import { selectMembershipsForGroup } from 'app/reducers/memberships';
import { selectPaginationNext } from 'app/reducers/selectors';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { EntityType } from 'app/store/models/entities';
import useQuery from 'app/utils/useQuery';
import AddGroupMember from './AddGroupMember';
import GroupMembersList from './GroupMembersList';
import type { GroupPageParams } from 'app/routes/admin/groups/components/GroupPage';
import type { DetailedGroup } from 'app/store/models/Group';

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
      entity: EntityType.Memberships,
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

  const group = useAppSelector((state) =>
    selectGroupById<DetailedGroup>(state, groupId),
  );
  const hasMore = pagination.hasMore;

  const dispatch = useAppDispatch();

  const fetchMemberships = useCallback(
    async (next: boolean) => {
      await dispatch(
        fetchMembershipsPagination({
          groupId,
          next,
          query,
          descendants: showDescendants,
        }),
      );
    },
    [dispatch, groupId, query, showDescendants],
  );

  usePreparedEffect('fetchMemberships', () => fetchMemberships(false), [
    groupId,
    query,
  ]);

  return (
    <ContentMain>
      <span>Antall medlemmer (inkl. undergrupper): {group?.numberOfUsers}</span>

      {showDescendants || (
        <AddGroupMember
          groupId={groupId}
          onMemberAdded={() => fetchMemberships(false)}
        />
      )}

      <div>
        <h3>Brukere</h3>
        <GroupMembersList
          key={Number(groupId) + Number(showDescendants)}
          hasMore={hasMore}
          fetching={pagination.fetching}
          memberships={memberships}
          fetchMemberships={fetchMemberships}
        />
      </div>
    </ContentMain>
  );
};

export default GroupMembers;
