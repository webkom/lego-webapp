import { Button, Flex, LoadingIndicator } from '@webkom/lego-bricks';
import moment from 'moment-timezone';
import { useState } from 'react';
import { formatPhoneNumber, parsePhoneNumber } from 'react-phone-number-input';
import { ConfirmModal } from 'app/components/Modal/ConfirmModal';
import type {
  EventAdministrate,
  EventPool,
  ActionGrant,
  User,
  ID,
  EventRegistration,
  EventRegistrationPaymentStatus,
  EventRegistrationPresence,
} from 'app/models';
import type Comment from 'app/store/models/Comment';
import type { CurrentUser } from 'app/store/models/User';
import styles from './Abacard.css';
import { RegisteredTable, UnregisteredTable } from './RegistrationTables';

export type Props = {
  eventId: number;
  event: EventAdministrate;
  comments: Comment[];
  pools: Array<EventPool>;
  loggedIn: boolean;
  currentUser: CurrentUser;
  error: Record<string, any>;
  loading: boolean;
  registered: Array<EventRegistration>;
  unregistered: Array<EventRegistration>;
  unregister: (registrationId: {
    eventId: ID;
    registrationId: ID;
    admin: boolean;
  }) => Promise<void>;
  updatePresence: (
    eventId: number,
    registrationId: number,
    presence: string
  ) => Promise<any>;
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
  const registeredPaidCount = registered.filter(
    (reg) =>
      (reg.paymentStatus === 'succeeded' || reg.paymentStatus === 'manual') &&
      reg.pool
  ).length;
  const unRegisteredPaidCount = unregistered.filter(
    (unreg) =>
      unreg.paymentStatus === 'succeeded' || unreg.paymentStatus === 'manual'
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
    moment().isBefore(moment(event.endTime).add(1, 'day')) ||
    moment().isBefore(event.unregistrationCloseTime) ||
    moment().isBefore(event.registrationCloseTime);
  const exportInfoMessage = `Informasjonen du eksporterer MÅ slettes når det ikke lenger er behov for den,
                og skal kun distribueres gjennom e-post. Dersom informasjonen skal deles med personer utenfor Abakus
                må det spesifiseres for de påmeldte hvem informasjonen skal deles med.`;

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
            {`${registerCount}/${event.registrationCount} har møtt opp`}
          </div>
          <div className={styles.attendeeStatistics}>
            {`${adminRegisterCount}/${event.registrationCount} er adminpåmeldt`}
          </div>
          <div className={styles.attendeeStatistics}>
            {registeredPaidCount > 0
              ? `${registeredPaidCount}/${event.registrationCount} registrerte har betalt`
              : ''}
          </div>
          <div className={styles.attendeeStatistics}>
            {unRegisteredPaidCount > 0
              ? `${unRegisteredPaidCount}/${unregistered.length} avregistrerte har betalt`
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
          <span className="secondaryFontColor">Ingen avmeldte</span>
        ) : (
          <UnregisteredTable
            unregistered={unregistered}
            loading={loading}
            event={event}
            handlePayment={handlePayment}
          />
        )}
      </Flex>
    </div>
  );
};

export default Attendees;
