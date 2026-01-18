import { orderBy } from 'lodash-es';
import { GroupType } from 'app/models';
import type { PublicGroup } from '~/redux/models/Group';
import type Membership from '~/redux/models/Membership';

export const getPrimaryGroupWithLogo = (
  memberships: Membership[],
  groupEntities: Record<number, PublicGroup>,
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
  )[0];
