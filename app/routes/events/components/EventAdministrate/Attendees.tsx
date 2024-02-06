import {
  Button,
  ConfirmModal,
  Flex,
  LoadingIndicator,
} from '@webkom/lego-bricks';
import moment from 'moment-timezone';
import { useState } from 'react';
import { formatPhoneNumber, parsePhoneNumber } from 'react-phone-number-input';
import { useParams } from 'react-router-dom';
import {
  getRegistrationGroups,
  selectEventById,
  selectMergedPoolWithRegistrations,
  selectPoolsWithRegistrationsForEvent,
} from 'app/reducers/events';
import { useUserContext } from 'app/routes/app/AppRoute';
import { useAppSelector } from 'app/store/hooks';
import styles from './Abacard.css';
import { RegisteredTable, UnregisteredTable } from './RegistrationTables';
import type { AdministrateEvent } from 'app/store/models/Event';

const Attendees = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const event = useAppSelector((state) =>
    selectEventById(state, { eventId })
  ) as AdministrateEvent;
  const pools = useAppSelector((state) =>
    event?.isMerged
      ? selectMergedPoolWithRegistrations(state, { eventId })
      : selectPoolsWithRegistrationsForEvent(state, { eventId })
  );
  const loading = useAppSelector((state) => state.events.fetching);
  const { registered, unregistered } = useAppSelector((state) =>
    getRegistrationGroups(state, {
      eventId,
    })
  );

  const { currentUser } = useUserContext();

  const [generatedCsvUrl, setGeneratedCsvUrl] = useState('');

  const registerCount = registered.filter(
    (reg) => reg.presence === 'PRESENT' && reg.pool
  ).length;
  const adminRegisterCount = registered.filter(
    (reg) => reg.adminRegistrationReason !== '' && reg.pool
  ).length;
  const registeredPaidCount = registered.filter(
    (reg) =>
      (reg.paymentStatus === 'succeeded' || reg.paymentStatus === 'manual') &&
      reg.pool
  ).length;
  const unRegisteredPaidCount = unregistered.filter(
    (unreg) =>
      unreg.paymentStatus === 'succeeded' || unreg.paymentStatus === 'manual'
  ).length;

  if (loading || !event) {
    return <LoadingIndicator loading={loading} />;
  }

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

  const exportInfoMessage = `Informasjonen du eksporterer MÅ slettes når det ikke lenger er behov for den,
                og skal kun distribueres gjennom e-post. Dersom informasjonen skal deles med personer utenfor Abakus
                må det spesifiseres for de påmeldte hvem informasjonen skal deles med.`;

  const eventHasEnded = moment().isAfter(moment(event.endTime));

  const createInfoCSV = async () => {
    const data = registered.map((registration) => ({
      name: registration.user.fullName,
      email: registration.user.email,
      phoneNumber: registration.user.phoneNumber,
    }));
    const csvBeginning = 'navn,e-post,landskode,telefonnummer\n';
    const csvString = data.reduce(
      (prev, current) =>
        prev +
        `${current.name},${current.email || ''},${
          parsePhoneNumber(current.phoneNumber).countryCallingCode || ''
        },${formatPhoneNumber(current.phoneNumber) || ''}\n`,
      csvBeginning
    );
    const blobUrl = URL.createObjectURL(
      new Blob([csvString], {
        type: 'text/csv',
      })
    );
    setGeneratedCsvUrl(blobUrl);
  };

  return (
    <div>
      <Flex justifyContent="space-between">
        {event.useContactTracing &&
          currentUser.id === event.createdBy &&
          moment().isBefore(moment(event.endTime).add(14, 'days')) &&
          (generatedCsvUrl ? (
            <a href={generatedCsvUrl} download="attendees.csv">
              Last ned
            </a>
          ) : (
            <ConfirmModal
              title="Eksporter til csv"
              closeOnConfirm={true}
              message={exportInfoMessage}
              onConfirm={createInfoCSV}
            >
              {({ openConfirmModal }) => (
                <Button onClick={openConfirmModal}>
                  Eksporter deltakere til csv
                </Button>
              )}
            </ConfirmModal>
          ))}
      </Flex>
      <Flex column>
        <div>
          <strong>Påmeldte:</strong>
          <div className={styles.attendeeStatistics}>
            {`${registerCount}/${event.registrationCount} ${
              eventHasEnded ? 'møtte opp' : 'har møtt opp'
            }`}
          </div>
          <div className={styles.attendeeStatistics}>
            {`${adminRegisterCount}/${event.registrationCount} ${
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
        {registered.length === 0 ? (
          <span className="secondaryFontColor">Ingen påmeldte</span>
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
        <strong
          style={{
            marginTop: '10px',
          }}
        >
          Avmeldte:
        </strong>
        {unregistered.length === 0 ? (
          <span className="secondaryFontColor">Ingen avmeldte</span>
        ) : (
          <UnregisteredTable
            unregistered={unregistered}
            loading={loading}
            event={event}
          />
        )}
      </Flex>
    </div>
  );
};

export default Attendees;
