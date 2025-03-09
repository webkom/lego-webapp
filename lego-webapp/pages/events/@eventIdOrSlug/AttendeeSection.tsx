import { Flex } from '@webkom/lego-bricks';
import moment from 'moment-timezone';
import { useMemo } from 'react';
import Attendance from '~/components/UserAttendance/Attendance';
import RegistrationMeta, {
  RegistrationMetaSkeleton,
} from '~/components/UserAttendance/RegistrationMeta';
import { getWaitingListPosition } from '~/pages/events/@eventIdOrSlug/getWaitingListPosition';
import { getEventSemesterFromStartTime } from '~/pages/events/utils';
import { useAppSelector } from '~/redux/hooks';
import { useIsLoggedIn } from '~/redux/slices/auth';
import { selectRegistrationsFromPools } from '~/redux/slices/events';
import type { UserDetailedEvent } from '~/redux/models/Event';
import type {
  PoolWithRegistrations,
  PoolRegistrationWithUser,
} from '~/redux/slices/events';

const MIN_USER_GRID_ROWS = 2;
const MAX_USER_GRID_ROWS = 2;

interface Props {
  showSkeleton: boolean;
  event?: UserDetailedEvent;
  currentRegistration?: PoolRegistrationWithUser;
  pools: PoolWithRegistrations[];
  currentPool?: PoolWithRegistrations;
  fiveMinutesBeforeActivation: boolean;
}

export const AttendeeSection = ({
  showSkeleton,
  event,
  currentRegistration,
  pools,
  currentPool,
  fiveMinutesBeforeActivation,
}: Props) => {
  const loggedIn = useIsLoggedIn();
  const fetching = useAppSelector((state) => state.events.fetching);
  const registrations = useAppSelector((state) =>
    selectRegistrationsFromPools(state, event?.id),
  );

  const currentMoment = moment();
  const waitingListPosition = useMemo(
    () => getWaitingListPosition(currentRegistration, currentPool, pools),
    [currentRegistration, currentPool, pools],
  );

  // The UserGrid is expanded when there's less than 5 minutes till activation
  const minUserGridRows =
    event && fiveMinutesBeforeActivation ? MIN_USER_GRID_ROWS : 0;

  return (
    <Flex column>
      <h3>Påmeldte</h3>

      <Attendance
        pools={pools}
        registrations={registrations}
        currentRegistration={currentRegistration}
        minUserGridRows={minUserGridRows}
        maxUserGridRows={MAX_USER_GRID_ROWS}
        legacyRegistrationCount={event?.legacyRegistrationCount}
        skeleton={fetching && !registrations.length}
      />

      {loggedIn &&
        (showSkeleton || !event ? (
          <RegistrationMetaSkeleton />
        ) : (
          <RegistrationMeta
            useConsent={event.useConsent}
            fiveMinutesBeforeActivation={fiveMinutesBeforeActivation}
            photoConsents={event.photoConsents}
            eventSemester={getEventSemesterFromStartTime(event.startTime)}
            hasEnded={moment(event.endTime).isBefore(currentMoment)}
            registration={currentRegistration}
            isPriced={event.isPriced}
            waitingListPosition={waitingListPosition}
          />
        ))}
    </Flex>
  );
};
