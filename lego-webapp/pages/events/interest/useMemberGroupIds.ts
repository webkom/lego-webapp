import { useMemo } from 'react';
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

  // Every agenda row calls this, so build the set once per group change
  return useMemo(
    () =>
      new Set(
        interestGroups
          .filter((group) => group.userMembership)
          .map((group) => group.id),
      ),
    [interestGroups],
  );
};

export default useMemberGroupIds;
