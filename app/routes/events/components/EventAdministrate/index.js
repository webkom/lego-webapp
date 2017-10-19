import styles from './Administrate.css';
import React, { Component } from 'react';
import { Link } from 'react-router';
import { RegisteredElement, UnregisteredElement } from './RegistrationElements';
import LoadingIndicator from 'app/components/LoadingIndicator';
import AdminRegisterForm from './AdminRegisterForm';
import moment from 'moment';
import { Flex } from 'app/components/Layout';

/**
 *
 */
export type Props = {
  eventId: Number,
  event: Event,
  comments: Array,
  pools: Array,
  loggedIn: boolean,
  currentUser: Object,
  error: Object,
  loading: boolean,
  registered: Array,
  unregistered: Array,
  unregister: () => Promise<*>,
  updatePresence: (Number, Number, string) => Promise<*>,
  updatePayment: (Number, Number, string) => Promise<*>,
  adminRegister: (Number, Number, Number, string, string) => Promise<*>,
  usersResult: Array,
  actionGrant: Array<string>,
  onQueryChanged: (value: string) => any,
  searching: boolean
};

/**
 *
 */
export default class EventAdministrate extends Component {
  props: Props;

  state = {
    clickedUnregister: 0
  };

  handleUnregister = registrationId => {
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

  handlePresence = (registrationId, presence) => {
    this.props.updatePresence(this.props.eventId, registrationId, presence);
  };

  handlePayment = (registrationId, chargeStatus) => {
    this.props.updatePayment(this.props.eventId, registrationId, chargeStatus);
  };

  handleAdminRegistration = ({ user, pool, feedback, reason }) => {
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
      unregistered,
      usersResult,
      onQueryChanged,
      searching
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
              usersResult={usersResult}
              onQueryChanged={onQueryChanged}
              onSubmit={this.handleAdminRegistration}
              pools={pools}
              searching={searching}
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
              {registered.map((reg, i) => (
                <RegisteredElement
                  key={i}
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
              {unregistered.map((reg, i) => (
                <UnregisteredElement key={i} registration={reg} />
              ))}
            </ul>
          </div>
        </Flex>
      </div>
    );
  }
}
