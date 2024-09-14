import type {
  PoolRegistrationWithUser,
  PoolWithRegistrations,
} from 'app/reducers/events';
import type { PublicUserWithAbakusGroups } from 'app/store/models/User';

const isPermittedInPool = (
  user: PublicUserWithAbakusGroups,
  pool: PoolWithRegistrations,
) => {
  return pool.permissionGroups.some((permissionGroup) =>
    user.allAbakusGroupIds.some(
      (userGroup) => userGroup === permissionGroup.id,
    ),
  );
};

export const getWaitingListPosition = (
  currentRegistration?: PoolRegistrationWithUser,
  waitingList?: PoolWithRegistrations,
  pools?: PoolWithRegistrations[],
) => {
  if (!currentRegistration || !waitingList || !pools) return undefined;

  const nonWaitingListPools = pools.filter((p) => p.name !== 'Venteliste');

  const applicablePools = pools.filter((p) =>
    isPermittedInPool(currentRegistration.user, p),
  );

  if (applicablePools.length === 0) return undefined;
  if (nonWaitingListPools.length === 1) {
    return waitingList.registrations.indexOf(currentRegistration) + 1;
  }
  return applicablePools.map((p) => {
    const applicableWaitingListRegistrations = waitingList.registrations.filter(
      (r) => isPermittedInPool(r.user, p),
    );
    return {
      poolName: p.name,
      position:
        applicableWaitingListRegistrations.indexOf(currentRegistration) + 1,
    };
  });
};
