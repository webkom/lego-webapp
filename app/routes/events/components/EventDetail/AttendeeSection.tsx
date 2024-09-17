import { Flex } from '@webkom/lego-bricks';
import moment from 'moment-timezone';
import Attendance from 'app/components/UserAttendance/Attendance';
import { useIsLoggedIn } from 'app/reducers/auth';
import { selectRegistrationsFromPools } from 'app/reducers/events';
import RegistrationMeta, {
  RegistrationMetaSkeleton,
} from 'app/routes/events/components/RegistrationMeta';
import { getEventSemesterFromStartTime } from 'app/routes/events/utils';
import { useAppSelector } from 'app/store/hooks';
import type { UserDetailedEvent } from 'app/store/models/Event';
import type {
  PaymentRegistration,
  ReadRegistration,
} from 'app/store/models/Registration';

const MIN_USER_GRID_ROWS = 2;
const MAX_USER_GRID_ROWS = 2;

interface Props {
  showSkeleton: boolean;
  event?: UserDetailedEvent;
  currentRegistration?: PaymentRegistration;
  pools: any;
  currentPool: any;
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
  const registrations: ReadRegistration[] | undefined = useAppSelector(
    (state) => selectRegistrationsFromPools(state, { eventId: event?.id }),
  );

  const currentMoment = moment();
  const hasSimpleWaitingList =
    pools.filter((p) => p.name != 'Venteliste').length <= 1;
  const waitingListIndex =
    currentPool?.registrations.indexOf(currentRegistration);

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
        skeleton={fetching && !registrations}
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
            registrationIndex={waitingListIndex}
            hasSimpleWaitingList={hasSimpleWaitingList}
            skeleton={showSkeleton}
          />
        ))}
    </Flex>
  );
};
