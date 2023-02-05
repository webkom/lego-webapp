import moment from 'moment-timezone';
import { useState } from 'react';
import { formatPhoneNumber, parsePhoneNumber } from 'react-phone-number-input';
import Button from 'app/components/Button';
import { Flex } from 'app/components/Layout';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { ConfirmModalWithParent } from 'app/components/Modal/ConfirmModal';
import type {
  Event,
  Comment,
  EventPool,
  ActionGrant,
  User,
  ID,
  EventRegistration,
  EventRegistrationPaymentStatus,
  EventRegistrationPresence,
} from 'app/models';
import styles from './Abacard.css';
import { RegisteredTable, UnregisteredTable } from './RegistrationTables';

export type Props = {
  eventId: number;
  event: Event;
  comments: Array<Comment>;
  pools: Array<EventPool>;
  loggedIn: boolean;
  currentUser: Record<string, any>;
  error: Record<string, any>;
  loading: boolean;
  registered: Array<EventRegistration>;
  unregistered: Array<EventRegistration>;
  unregister: (arg0: {
    eventId: ID;
    registrationId: ID;
    admin: boolean;
  }) => Promise<void>;
  updatePresence: (arg0: number, arg1: number, arg2: string) => Promise<any>;
  updatePayment: (
    arg0: ID,
    arg1: ID,
    arg2: EventRegistrationPaymentStatus
  ) => Promise<any>;
  usersResult: Array<User>;
  actionGrant: ActionGrant;
  onQueryChanged: (value: string) => any;
  searching: boolean;
};

const Attendees = ({
  eventId,
  event,
  pools,
  currentUser,
  error,
  loading,
  registered,
  unregistered,
  unregister,
  updatePresence,
  updatePayment,
}: Props) => {
  const [generatedCsvUrl, setGeneratedCsvUrl] = useState('');

  const handleUnregister = async (registrationId: number) => {
    await unregister({
      eventId,
      registrationId,
      admin: true,
    });
  };
  const handlePresence = (
    registrationId: ID,
    presence: EventRegistrationPresence
  ) => updatePresence(eventId, registrationId, presence);
  const handlePayment = (
    registrationId: number,
    paymentStatus: EventRegistrationPaymentStatus
  ) => updatePayment(eventId, registrationId, paymentStatus);

  const registerCount = registered.filter(
    (reg) => reg.presence === 'PRESENT' && reg.pool
  ).length;
  const adminRegisterCount = registered.filter(
    (reg) => reg.adminRegistrationReason !== '' && reg.pool
  ).length;
  const paidCount = registered.filter(
    (reg) =>
      (reg.paymentStatus === 'succeeded' || reg.paymentStatus === 'manual') &&
      reg.pool
  ).length;

  if (loading) {
    return <LoadingIndicator loading />;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  // Not showing the presence column until 1 day before start or if someone has been given set to presence
  const showPresence =
    moment().isAfter(moment(event.startTime).subtract(1, 'day')) ||
    registerCount > 0;

  const showUnregister = // Show unregister button until 1 day after event has ended,
    // or until reg/unreg has ended if that is more than 1 day
    // after event end
    moment().isBefore(moment(event.endTime).add('days', 1)) ||
    moment().isBefore(event.unregistrationCloseTime) ||
    moment().isBefore(event.registrationCloseTime);
  const exportInfoMessage = `Informasjonen du eksporterer MÅ slettes når det ikke lenger er behov for den,
                og skal kun distribueres gjennom mail. Dersom informasjonen skal deles med personer utenfor Abakus
                må det spesifiseres for de påmeldte hvem informasjonen skal deles med.`;

  const createInfoCSV = async () => {
    const data = registered.map((registration) => ({
      name: registration.user.fullName,
      email: registration.user.email,
      phoneNumber: registration.user.phoneNumber,
    }));
    const csvBeginning = 'navn,epost,landskode,telefonnummer\n';
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
          (currentUser.id === event.createdBy ||
            currentUser.id === event.createdBy.id) &&
          moment().isBefore(moment(event.endTime).add('days', 14)) &&
          (generatedCsvUrl ? (
            <a href={generatedCsvUrl} download="attendees.csv">
              Last ned
            </a>
          ) : (
            <ConfirmModalWithParent
              title="Eksporter til csv"
              closeOnConfirm={true}
              message={exportInfoMessage}
              onConfirm={createInfoCSV}
            >
              <Button size="large">Eksporter deltakere til csv</Button>
            </ConfirmModalWithParent>
          ))}
      </Flex>
      <Flex column>
        <div>
          <strong>Påmeldte:</strong>
          <div className={styles.attendeeStatistics}>
            {`${registerCount}/${event.registrationCount} har møtt opp`}
          </div>
          <div className={styles.attendeeStatistics}>
            {`${adminRegisterCount}/${event.registrationCount} er adminpåmeldt`}
          </div>
          <div className={styles.attendeeStatistics}>
            {`${paidCount}/${event.registrationCount} har betalt`}
          </div>
        </div>
        {registered.length === 0 ? (
          <li>Ingen påmeldte</li>
        ) : (
          <RegisteredTable
            event={event}
            registered={registered}
            loading={loading}
            handlePresence={handlePresence}
            handlePayment={handlePayment}
            handleUnregister={handleUnregister}
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
          <li>Ingen avmeldte</li>
        ) : (
          <UnregisteredTable unregistered={unregistered} loading={loading} />
        )}
      </Flex>
    </div>
  );
};

export default Attendees;
