import { Flex } from '@webkom/lego-bricks';
import moment from 'moment-timezone';
import { useParams } from 'react-router-dom';
import EmptyState from 'app/components/EmptyState';
import {
  getRegistrationGroups,
  selectTransformedEventById,
  selectMergedPoolWithRegistrations,
  selectPoolsWithRegistrationsForEvent,
} from 'app/reducers/events';
import { useAppSelector } from 'app/store/hooks';
import styles from './Abacard.css';
import { RegisteredTable, UnregisteredTable } from './RegistrationTables';
import type { AdministrateEvent } from 'app/store/models/Event';

const Attendees = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const event = useAppSelector((state) =>
    selectTransformedEventById(state, { eventId }),
  ) as AdministrateEvent;
  const pools = useAppSelector((state) =>
    event?.isMerged
      ? selectMergedPoolWithRegistrations(state, { eventId })
      : selectPoolsWithRegistrationsForEvent(state, { eventId }),
  );
  const loading = useAppSelector((state) => state.events.fetching);
  const { registered, unregistered } = useAppSelector((state) =>
    getRegistrationGroups(state, {
      eventId,
    }),
  );

  const registerCount = registered.filter(
    (reg) => reg.presence === 'PRESENT' && reg.pool,
  ).length;
  const adminRegisterCount = registered.filter(
    (reg) => reg.adminRegistrationReason !== '' && reg.pool,
  ).length;
  const registeredPaidCount = registered.filter(
    (reg) =>
      (reg.paymentStatus === 'succeeded' || reg.paymentStatus === 'manual') &&
      reg.pool,
  ).length;
  const unRegisteredPaidCount = unregistered.filter(
    (unreg) =>
      unreg.paymentStatus === 'succeeded' || unreg.paymentStatus === 'manual',
  ).length;

  // Not showing the presence column until 1 day before start or if someone has been given set to presence
  const showPresence =
    moment().isAfter(moment(event.startTime).subtract(1, 'day')) ||
    registerCount > 0;

  const showUnregister = // Show unregister button until 1 day after event has ended,
    // or until reg/unreg has ended if that is more than 1 day
    // after event end
    moment().isBefore(moment(event.endTime).add(1, 'day')) ||
    moment().isBefore(event.unregistrationCloseTime) ||
    moment().isBefore(event.registrationCloseTime);

  const eventHasEnded = moment().isAfter(moment(event.endTime));

  return (
    <>
      <Flex alignItems="center" justifyContent="space-between">
        <h3>Påmeldte</h3>
        <div>
          <div className={styles.attendeeStatistics}>
            {`${registerCount}/${event.registrationCount || '?'} ${
              eventHasEnded ? 'møtte opp' : 'har møtt opp'
            }`}
          </div>
          <div className={styles.attendeeStatistics}>
            {`${adminRegisterCount}/${event.registrationCount || '?'} ${
              eventHasEnded ? 'ble' : 'er'
            } adminpåmeldt`}
          </div>
          <div className={styles.attendeeStatistics}>
            {registeredPaidCount > 0
              ? `${registeredPaidCount}/${
                  event.registrationCount
                } registrerte ${eventHasEnded ? 'betalte' : 'har betalt'}`
              : ''}
          </div>
          <div className={styles.attendeeStatistics}>
            {unRegisteredPaidCount > 0
              ? `${unRegisteredPaidCount}/${
                  unregistered.length
                } avregistrerte ${eventHasEnded ? 'betalte' : 'har betalt'}`
              : ''}
          </div>
        </div>
      </Flex>

      {registered.length === 0 && !loading ? (
        <EmptyState body="Ingen påmeldte" />
      ) : (
        <RegisteredTable
          event={event}
          registered={registered}
          loading={loading}
          showPresence={showPresence}
          showUnregister={showUnregister}
          pools={pools}
        />
      )}

      <h3>Avmeldte</h3>
      {unregistered.length === 0 && !loading ? (
        <EmptyState body="Ingen avmeldte" />
      ) : (
        <UnregisteredTable
          unregistered={unregistered}
          loading={loading}
          event={event}
        />
      )}
    </>
  );
};

export default Attendees;
