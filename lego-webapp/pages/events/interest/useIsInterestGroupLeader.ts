import { GroupType } from 'app/models';
import { useAppSelector } from '~/redux/hooks';
import { selectGroupsByType } from '~/redux/slices/groups';
import type { PublicListGroup } from '~/redux/models/Group';
import type { RoleType } from '~/utils/constants';

export const LEADER_ROLES: RoleType[] = ['leader', 'co-leader'];

// Mirrors the backend rule: leaders of an interest group can create interest
// events. Relies on the page's existing interest-group fetch.
const useIsInterestGroupLeader = () => {
  const interestGroups = useAppSelector((state) =>
    selectGroupsByType<PublicListGroup>(state, GroupType.Interest),
  );

  return interestGroups.some(
    (group) =>
      group.active &&
      group.userMembership &&
      LEADER_ROLES.includes(group.userMembership.role),
  );
};

export default useIsInterestGroupLeader;
