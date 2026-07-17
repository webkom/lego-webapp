import { GroupType } from 'app/models';
import { useAppSelector } from '~/redux/hooks';
import { useCurrentUser } from '~/redux/slices/auth';
import { selectGroupsByType } from '~/redux/slices/groups';
import type { RoleType } from '~/utils/constants';

const LEADER_ROLES: RoleType[] = ['leader', 'co-leader'];

// Mirrors the backend rule: leaders of an interest group can create interest
// events. Relies on the page's existing interest-group fetch.
const useIsInterestGroupLeader = () => {
  const currentUser = useCurrentUser();
  const interestGroups = useAppSelector((state) =>
    selectGroupsByType(state, GroupType.Interest),
  );

  const interestGroupIds = new Set(interestGroups.map((group) => group.id));
  return (currentUser?.memberships ?? []).some(
    (membership) =>
      membership.isActive &&
      LEADER_ROLES.includes(membership.role) &&
      interestGroupIds.has(membership.abakusGroup),
  );
};

export default useIsInterestGroupLeader;
