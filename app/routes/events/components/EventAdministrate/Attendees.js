// @flow

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { RegisteredTable, UnregisteredTable } from './RegistrationTables';
import LoadingIndicator from 'app/components/LoadingIndicator';
import moment from 'moment-timezone';
import { Flex } from 'app/components/Layout';
import styles from './Abacard.css';
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
  unregister: ({ eventId: ID, registrationId: ID, admin: boolean }) => Promise<
    *
  >,
  updatePresence: (number, number, string) => Promise<*>,
  updatePayment: (ID, ID, EventRegistrationChargeStatus) => Promise<*>,
  usersResult: Array<User>,
  actionGrant: ActionGrant,
  onQueryChanged: (value: string) => any,
  searching: boolean
};

type State = {
  clickedUnregister: number
};

export default class Attendees extends Component<Props, State> {
  state = {
    clickedUnregister: 0
  };

  handleUnregister = (registrationId: number) => {
    const { unregister, eventId } = this.props;
    if (this.state.clickedUnregister === registrationId) {
      unregister({
        eventId,
        registrationId,
        admin: true
      });
      this.setState({
        clickedUnregister: 0
      });
    } else {
      this.setState({
        clickedUnregister: registrationId
      });
    }
  };

  handlePresence = (registrationId: ID, presence: EventRegistrationPresence) =>
    this.props.updatePresence(this.props.eventId, registrationId, presence);

  handlePayment = (
    registrationId: number,
    chargeStatus: EventRegistrationChargeStatus
  ) =>
    this.props.updatePayment(this.props.eventId, registrationId, chargeStatus);

  render() {
    const {
      eventId,
      event,
      error,
      loading,
      registered,
      unregistered
    } = this.props;
    const registerCount = registered.filter(
      reg => reg.presence === 'PRESENT' && reg.pool
    ).length;

    const adminRegisterCount = registered.filter(
      reg => reg.adminRegistrationReason !== '' && reg.pool
    ).length;

    if (loading) {
      return <LoadingIndicator loading />;
    }

    if (error) {
      return <div>{error.message}</div>;
    }
    const showUnregister = moment().isBefore(event.startTime);
    return (
      <div>
        <h2>
          <Link to={`/events/${eventId}`}>
            <i className="fa fa-angle-left" />
            {` ${event.title}`}
          </Link>
        </h2>
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
