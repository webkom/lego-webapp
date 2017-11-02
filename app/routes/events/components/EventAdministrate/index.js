// @flow

import styles from './Administrate.css';
import React, { Component } from 'react';
import { Link } from 'react-router';
import { RegisteredElement, UnregisteredElement } from './RegistrationElements';
import LoadingIndicator from 'app/components/LoadingIndicator';
import AdminRegisterForm from './AdminRegisterForm';
import moment from 'moment-timezone';
import { Flex } from 'app/components/Layout';
import type {
  Event,
  Comment,
  EventPool,
  ActionGrant,
  User,
  ID,
  EventRegistration,
  EventRegistrationChargeStatus,
  EventRegistrationPresence
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
  unregister: (ID, ID, boolean) => Promise<*>,
  updatePresence: (number, number, string) => Promise<*>,
  updatePayment: (ID, ID, EventRegistrationChargeStatus) => Promise<*>,
  adminRegister: (ID, ID, ID, string, string) => Promise<*>,
  usersResult: Array<User>,
  actionGrant: ActionGrant,
  onQueryChanged: (value: string) => any,
  searching: boolean
};

type State = {
  clickedUnregister: number
};

export default class EventAdministrate extends Component<Props, State> {
  state = {
    clickedUnregister: 0
  };

  handleUnregister = (registrationId: number) => {
    if (this.state.clickedUnregister === registrationId) {
      this.props.unregister(this.props.eventId, registrationId, true);
      this.setState({
        clickedUnregister: 0
      });
    } else {
      this.setState({
        clickedUnregister: registrationId
      });
    }
  };

  handlePresence = (
    registrationId: ID,
    presence: EventRegistrationPresence
  ) => {
    this.props.updatePresence(this.props.eventId, registrationId, presence);
  };

  handlePayment = (
    registrationId: number,
    chargeStatus: EventRegistrationChargeStatus
  ) => {
    this.props.updatePayment(this.props.eventId, registrationId, chargeStatus);
  };

  handleAdminRegistration = ({
    user,
    pool,
    feedback,
    reason
  }: {
    user: User,
    pool: number,
    feedback: string,
    reason: string
  }) => {
    this.props.adminRegister(
      this.props.eventId,
      user.id,
      pool,
      feedback,
      reason
    );
  };

  render() {
    const {
      eventId,
      event,
      pools,
      error,
      loading,
      registered,
      unregistered
    } = this.props;

    if (loading) {
      return <LoadingIndicator loading />;
    }

    if (error) {
      return <div>{error.message}</div>;
    }
    const showUnregister = moment().isBefore(event.startTime);

    return (
      <div className={styles.root}>
        <h2>
          <Link to={`/events/${eventId}`}>
            <i className="fa fa-angle-left" />
            {` ${event.title}`}
          </Link>
        </h2>
        <Flex column alignItems="center">
          <div className={styles.list}>
            <strong>Adminpåmelding:</strong>
            <AdminRegisterForm
              {...this.props}
              onSubmit={this.handleAdminRegistration}
              pools={pools}
            />
            <strong>Påmeldte:</strong>
            <ul className={styles.grid}>
              <li className={styles.registeredList}>
                <div>Bruker:</div>
                <div className={styles.center}>Status:</div>
                <div className={styles.center}>Til stede:</div>
                <div>Dato:</div>
                <div className={styles.center}>Klassetrinn:</div>
                <div className={styles.center}>Betaling:</div>
                <div>Tilbakemelding:</div>
                <div>Administrer:</div>
              </li>
              {registered.length === 0 && <li>Ingen påmeldte</li>}
              {registered.map(reg => (
                <RegisteredElement
                  key={reg.id}
                  registration={reg}
                  handlePresence={this.handlePresence}
                  handlePayment={this.handlePayment}
                  handleUnregister={this.handleUnregister}
                  clickedUnregister={this.state.clickedUnregister}
                  showUnregister={showUnregister}
                />
              ))}
            </ul>
          </div>
          <div className={styles.list} style={{ paddingTop: '1em' }}>
            <strong>Avmeldte:</strong>
            <ul className={styles.grid}>
              <li className={styles.unregisteredList}>
                <div>Bruker:</div>
                <div>Status:</div>
                <div>Påmeldt:</div>
                <div>Avmeldt:</div>
                <div>Klassetrinn:</div>
              </li>
              {unregistered.length === 0 && <div>Ingen avmeldte</div>}
              {unregistered.map(reg => (
                <UnregisteredElement key={reg.id} registration={reg} />
              ))}
            </ul>
          </div>
        </Flex>
      </div>
    );
  }
}
