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
          <ul className={styles.list}>
            <li className={styles.element}>
              <FlexRow className={styles.element}>
                <FlexItem className={styles.col}>Bruker:</FlexItem>
                <FlexItem className={styles.col}>Status:</FlexItem>
                <FlexItem className={styles.col}>Til stede:</FlexItem>
                <FlexItem className={styles.col}>Dato:</FlexItem>
                <FlexItem className={styles.col}>Klassetrinn:</FlexItem>
                <FlexItem className={styles.col}>Betaling:</FlexItem>
                <FlexItem className={styles.col2}>Tilbakemelding:</FlexItem>
                <FlexItem className={styles.col}>Administrer:</FlexItem>
              </FlexRow>
            </li>
            {registered.length === 0 && <div>Ingen påmeldte</div>}
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
            <ul className={styles.list}>
              <li>
                <FlexRow className={styles.element}>
                  <FlexItem className={styles.col}>Bruker:</FlexItem>
                  <FlexItem className={styles.col}>Status:</FlexItem>
                  <FlexItem className={styles.col}>Påmeldt:</FlexItem>
                  <FlexItem className={styles.col}>Avmeldt:</FlexItem>
                  <FlexItem className={styles.col}>Klassetrinn:</FlexItem>
                </FlexRow>
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
