import { GroupType } from 'app/models';
import { useAppSelector } from '~/redux/hooks';
import { selectGroupsByType } from '~/redux/slices/groups';
import type { EntityId } from '@reduxjs/toolkit';
import type { PublicListGroup } from '~/redux/models/Group';

// Relies on the page's existing interest-group fetch
const useMemberGroupIds = (): Set<EntityId> => {
  const interestGroups = useAppSelector((state) =>
    selectGroupsByType<PublicListGroup>(state, GroupType.Interest),
  );

  return new Set(
    interestGroups
      .filter((group) => group.userMembership)
      .map((group) => group.id),
  );
};

export default useMemberGroupIds;
