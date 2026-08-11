import { orderBy } from 'lodash-es';
import { GroupType } from 'app/models';
import type { EntityId } from '@reduxjs/toolkit';
import type { UnknownGroup } from '~/redux/models/Group';
import type Membership from '~/redux/models/Membership';

export const getGroupsWithLogo = (
  memberships: Membership[],
  groupEntities: Record<EntityId, UnknownGroup>,
) =>
  orderBy(
    memberships
      .map((m) => ({
        ...m,
        abakusGroup: groupEntities[m.abakusGroup],
      }))
      .filter(
        (m) => m.abakusGroup?.logo && m.abakusGroup.type !== GroupType.Interest,
      ),
    [(m) => m.abakusGroup.type !== GroupType.Board, (m) => !m.isActive],
  );
