import styles from './Administrate.css';
import React, { Component } from 'react';
import Image from 'app/components/Image';
import CommentView from 'app/components/Comments/CommentView';
import { FlexRow, FlexColumn, FlexItem } from 'app/components/FlexBox';
import Button from 'app/components/Button';
import Icon from 'app/components/Icon';
import Markdown from 'app/components/Markdown';
import { AttendanceStatus } from 'app/components/UserAttendance';
import Tag from 'app/components/Tag';
import Time from 'app/components/Time';
import { RegisteredElement, UnregisteredElement } from './RegistrationElements';

/**
 *
 */
export type Props = {
  event: Event,
  eventId: Number,
  comments: Array,
  pools: Array,
  registered: Array
};

/**
 *
 */
export default class EventAdministrate extends Component {
  props: Props;

  setAdmitted = status => {
    console.log('ADMIT', status);
  };

  handleUnregister = registrationId => {
    this.props.unregister(this.props.eventId, registrationId, true);
  };

  handlePresence = (registrationId, presence) => {
    this.props.updatePresence(this.props.eventId, registrationId, presence);
  };

  handlePayment = (registrationId, chargeStatus) => {
    console.log(registrationId, chargeStatus);
    this.props.updatePayment(this.props.eventId, registrationId, chargeStatus);
  };

  render() {
    const {
      eventId,
      loggedIn,
      currentUser,
      error,
      loading,
      registered,
      unregistered,
      unregister
    } = this.props;

    if (loading) {
      return <LoadingIndicator loading />;
    }

    if (error) {
      return <div>{error.message}</div>;
    }

    return (
      <div className={styles.root}>
        <h2>{`Event: ${eventId}`}</h2>
        <FlexColumn alignItems="center">
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
                setAdmitted={this.setAdmitted}
                unregister={this.handleUnregister}
                handlePresence={this.handlePresence}
                handlePayment={this.handlePayment}
              />
            ))}
          </ul>
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
        </FlexColumn>
      </div>
    );
  }
}
