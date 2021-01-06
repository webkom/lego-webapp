// @flow

import { Component } from 'react';
import { Link } from 'react-router-dom';
import { RegisteredTable, UnregisteredTable } from './RegistrationTables';
import LoadingIndicator from 'app/components/LoadingIndicator';
import moment from 'moment-timezone';
import { Flex } from 'app/components/Layout';
import styles from './Abacard.css';
import { ConfirmModalWithParent } from 'app/components/Modal/ConfirmModal';
import Button from 'app/components/Button';
import { formatPhoneNumber, parsePhoneNumber } from 'react-phone-number-input';
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

export type Props = {
  eventId: number,
  event: Event,
  comments: Array<Comment>,
  pools: Array<EventPool>,
  loggedIn: boolean,
  currentUser: Object,
  error: Object,
  loading: boolean,
  registered: Array<EventRegistration>,
  unregistered: Array<EventRegistration>,
  unregister: ({ eventId: ID, registrationId: ID, admin: boolean }) => Promise<
    *
  >,
  updatePresence: (number, number, string) => Promise<*>,
  updatePayment: (ID, ID, EventRegistrationPaymentStatus) => Promise<*>,
  usersResult: Array<User>,
  actionGrant: ActionGrant,
  onQueryChanged: (value: string) => any,
  searching: boolean,
};

type State = {
  clickedUnregister: number,
  generatedCsvUrl?: string,
};

export default class Attendees extends Component<Props, State> {
  state = {
    clickedUnregister: 0,
    generatedCsvUrl: '',
  };

  handleUnregister = (registrationId: number) => {
    const { unregister, eventId } = this.props;
    if (this.state.clickedUnregister === registrationId) {
      unregister({
        eventId,
        registrationId,
        admin: true,
      });
      this.setState({
        clickedUnregister: 0,
      });
    } else {
      this.setState({
        clickedUnregister: registrationId,
      });
    }
  };

  handlePresence = (registrationId: ID, presence: EventRegistrationPresence) =>
    this.props.updatePresence(this.props.eventId, registrationId, presence);

  handlePayment = (
    registrationId: number,
    paymentStatus: EventRegistrationPaymentStatus
  ) =>
    this.props.updatePayment(this.props.eventId, registrationId, paymentStatus);

  render() {
    const {
      eventId,
      event,
      error,
      loading,
      registered,
      unregistered,
      currentUser,
    } = this.props;
    const registerCount = registered.filter(
      (reg) => reg.presence === 'PRESENT' && reg.pool
    ).length;

    const adminRegisterCount = registered.filter(
      (reg) => reg.adminRegistrationReason !== '' && reg.pool
    ).length;

    if (loading) {
      return <LoadingIndicator loading />;
    }

    if (error) {
      return <div>{error.message}</div>;
    }
    const showUnregister = moment().isBefore(event.startTime);

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
        new Blob([csvString], { type: 'text/csv' })
      );
      this.setState({ generatedCsvUrl: blobUrl });
    };

    return (
      <div>
        <Flex row justifyContent="space-between">
          <h2>
            <Link to={`/events/${eventId}`}>
              <i className="fa fa-angle-left" />
              {` ${event.title}`}
            </Link>
          </h2>
          {event.useContactTracing &&
            (currentUser.id === event.createdBy ||
              currentUser.id === event.createdBy.id) &&
            moment().isBefore(moment(event.endTime).add('days', 14)) &&
            (this.state.generatedCsvUrl ? (
              <a href={this.state.generatedCsvUrl} download="attendees.csv">
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
            <div className={styles.attendees}>
              {`${registerCount}/${event.totalCapacity} har møtt opp`}
            </div>
            <div className={styles.adminRegistrations}>
              {`${adminRegisterCount}/${event.totalCapacity} er adminpåmeldt`}
            </div>
          </div>
          {registered.length === 0 && <li>Ingen påmeldte</li>}
          <RegisteredTable
            event={event}
            registered={registered}
            loading={loading}
            handlePresence={this.handlePresence}
            handlePayment={this.handlePayment}
            handleUnregister={this.handleUnregister}
            clickedUnregister={this.state.clickedUnregister}
            showUnregister={showUnregister}
          />
          <strong style={{ marginTop: '10px' }}>Avmeldte:</strong>
          <UnregisteredTable unregistered={unregistered} loading={loading} />
        </Flex>
      </div>
    );
  }
}
