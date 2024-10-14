import { Flex } from '@webkom/lego-bricks';
import moment from 'moment-timezone';
import { useMemo } from 'react';
import Attendance from 'app/components/UserAttendance/Attendance';
import { useIsLoggedIn } from 'app/reducers/auth';
import { selectRegistrationsFromPools } from 'app/reducers/events';
import { getWaitingListPosition } from 'app/routes/events/components/EventDetail/getWaitingListPosition';
import RegistrationMeta, {
  RegistrationMetaSkeleton,
} from 'app/routes/events/components/RegistrationMeta';
import { getEventSemesterFromStartTime } from 'app/routes/events/utils';
import { useAppSelector } from 'app/store/hooks';
import type {
  PoolWithRegistrations,
  PoolRegistrationWithUser,
} from 'app/reducers/events';
import type { UserDetailedEvent } from 'app/store/models/Event';

const MIN_USER_GRID_ROWS = 2;
const MAX_USER_GRID_ROWS = 2;

interface Props {
  showSkeleton: boolean;
  event?: UserDetailedEvent;
  currentRegistration?: PoolRegistrationWithUser;
  pools: PoolWithRegistrations[];
  currentPool?: PoolWithRegistrations;
}

export const AttendeeSection = ({
  showSkeleton,
  event,
  currentRegistration,
  pools,
  currentPool,
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
    event &&
    currentMoment.isAfter(moment(event.activationTime).subtract(5, 'minutes'))
      ? MIN_USER_GRID_ROWS
      : 0;

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
        skeleton={fetching && registrations.length === 0}
      />

      {loggedIn &&
        (showSkeleton || !event ? (
          <RegistrationMetaSkeleton />
        ) : (
          <RegistrationMeta
            useConsent={event.useConsent}
            hasOpened={moment(event.activationTime).isBefore(currentMoment)}
            photoConsents={event.photoConsents}
            eventSemester={getEventSemesterFromStartTime(event.startTime)}
            hasEnded={moment(event.endTime).isBefore(currentMoment)}
            registration={currentRegistration}
            isPriced={event.isPriced}
            waitingListPosition={waitingListPosition}
            skeleton={showSkeleton}
          />
        ))}
    </Flex>
  );
};
