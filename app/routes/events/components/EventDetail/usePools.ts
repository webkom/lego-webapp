import {
  selectMergedPool,
  selectMergedPoolWithRegistrations,
  selectPoolsForEvent,
  selectPoolsWithRegistrationsForEvent,
  selectWaitingRegistrationsForEvent,
} from 'app/reducers/events';
import { useAppSelector } from 'app/store/hooks';
import type {
  AuthUserDetailedEvent,
  UserDetailedEvent,
} from 'app/store/models/Event';

export function usePools(
  hasRegistrationAccess: boolean,
  event?: AuthUserDetailedEvent | UserDetailedEvent,
) {
  const pools = useAppSelector((state) => {
    if (hasRegistrationAccess) {
      return event?.isMerged
        ? selectMergedPoolWithRegistrations(state, event.id)
        : selectPoolsWithRegistrationsForEvent(state, event?.id);
    } else {
      return event?.isMerged
        ? selectMergedPool(state, event.id)
        : selectPoolsForEvent(state, event?.id);
    }
  });

  const waitingRegistrations = useAppSelector((state) =>
    selectWaitingRegistrationsForEvent(state, event?.id),
  );

  if (!event) {
    return [];
  }

  if (hasRegistrationAccess) {
    return waitingRegistrations.length > 0
      ? [
          ...pools,
          {
            name: 'Venteliste',
            registrations: waitingRegistrations,
            registrationCount: waitingRegistrations.length,
            permissionGroups: [],
          },
        ]
      : pools;
  } else {
    return event.waitingRegistrationCount && event.waitingRegistrationCount > 0
      ? [
          ...pools,
          {
            name: 'Venteliste',
            registrationCount: event.waitingRegistrationCount,
            permissionGroups: [],
          },
        ]
      : pools;
  }
}
