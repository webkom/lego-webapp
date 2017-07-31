// @flow

import styles from './EventDetail.css';
import React, { Component } from 'react';
import Image from 'app/components/Image';
import CommentView from 'app/components/Comments/CommentView';
import Button from 'app/components/Button';
import Icon from 'app/components/Icon';
import JoinEventForm from '../JoinEventForm';
import RegisteredCell from '../RegisteredCell';
import RegisteredSummary from '../RegisteredSummary';
import { AttendanceStatus } from 'app/components/UserAttendance';
import Tag from 'app/components/Tag';
import Time from 'app/components/Time';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { Flex } from 'app/components/Layout';
import { EVENT_TYPE_TO_STRING, styleForEvent } from '../../utils.js';
import Admin from '../Admin';
import RegistrationMeta from '../RegistrationMeta';
import cx from 'classnames';

const InterestedButton = ({ value, onClick }) => {
  const [icon, text] = value
    ? ['check', 'Du er interessert']
    : ['plus', 'Jeg er interessert'];

  return (
    <Button onClick={onClick}>
      <Icon name={icon} /> {text}
    </Button>
  );
};

/**
 *
 */
type Props = {
  eventId: string,
  event: Object,
  loggedIn: boolean,
  currentUser: Object,
  actionGrant: Array<string>,
  comments: Array<Object>,
  error?: Object,
  loading: boolean,
  pools: Array<Object>,
  registrations: Array<Object>,
  currentRegistration: Object,
  waitingRegistrations: Array<Object>,
  isUserInterested: boolean,
  register: (
    eventId: string,
    captchaResponse: string,
    feedback: string
  ) => Promise<*>,
  unregister: (eventId: string, registrationId: number) => Promise<*>,
  payment: (eventId: string, token: string) => Promise<*>,
  updateFeedback: (
    eventId: string,
    registrationId: number,
    feedback: string
  ) => Promise<*>,
  deleteEvent: (eventId: string) => Promise<*>
};

/**
 *
 */
export default class EventDetail extends Component {
  props: Props;

  handleRegistration = ({ captchaResponse, feedback, type }: Object) => {
    const {
      eventId,
      currentRegistration,
      register,
      unregister,
      updateFeedback
    } = this.props;
    switch (type) {
      case 'feedback':
        return updateFeedback(eventId, currentRegistration.id, feedback);
      case 'register':
        return register(eventId, captchaResponse, feedback);
      case 'unregister':
        return unregister(eventId, currentRegistration.id);
      default:
        return undefined;
    }
  };

  handleToken = (token: Object) => {
    this.props.payment(this.props.event.id, token.id);
  };

  render() {
    const {
      event,
      loggedIn,
      currentUser,
      actionGrant,
      comments,
      error,
      loading,
      pools,
      registrations,
      currentRegistration,
      deleteEvent
    } = this.props;

    if (!event.id) {
      return null;
    }

    if (loading || Object.keys(event).length === 0) {
      return <LoadingIndicator loading />;
    }

    if (error) {
      return (
        <div>
          {error.message}
        </div>
      );
    }
    const styleType = styleForEvent(event.eventType);

    return (
      <div className={styles.root}>
        <div className={styles.coverImage}>
          <Image src={event.cover} />
        </div>

        <Flex wrap alignItems="center" justifyContent="space-between">
          <h2>
            {event.title}
          </h2>
          <InterestedButton value={this.props.isUserInterested} />
        </Flex>

        <Flex wrap className={styles.mainRow}>
          <Flex column className={styles.description}>
            <div
              className={styles.text}
              dangerouslySetInnerHTML={{ __html: event.text }}
            />
            <Flex className={styles.tagRow}>
              {event.tags.map((tag, i) => <Tag key={i} tag={tag} />)}
            </Flex>
          </Flex>
          <Flex column className={cx(styles.meta, styleType)}>
            <ul>
              {event.company &&
                <li>
                  Arrangerende bedrift <strong>{event.company.name}</strong>
                </li>}
              <li>
                <span>Hva </span>
                <strong>
                  {EVENT_TYPE_TO_STRING(event.eventType)}
                </strong>
              </li>
              <li>
                Starter{' '}
                <strong>
                  <Time time={event.startTime} format="DD.MM.YYYY HH:mm" />
                </strong>
              </li>
              <li>
                Slutter{' '}
                <strong>
                  <Time time={event.endTime} format="DD.MM.YYYY HH:mm" />
                </strong>
              </li>
              <li>
                Finner sted i <strong>{event.location}</strong>
              </li>
              {event.activationTime &&
                <li>
                  Påmelding åpner{' '}
                  <strong>
                    <Time
                      time={event.activationTime}
                      format="DD.MM.YYYY HH:mm"
                    />
                  </strong>
                </li>}
              {event.isPriced &&
                <div>
                  <li>Dette er et betalt arrangement</li>
                  <li>
                    Pris: <strong>{event.price / 100},-</strong>
                  </li>
                </div>}
            </ul>
            {loggedIn &&
              <Flex column>
                <h3>Påmeldte:</h3>
                <Flex className={styles.registeredThumbnails}>
                  {registrations
                    .slice(0, 10)
                    .map(reg =>
                      <RegisteredCell key={reg.user.id} user={reg.user} />
                    )}
                </Flex>
                <RegisteredSummary registrations={registrations} />
                <AttendanceStatus title="Påmeldte" pools={pools} />
                <RegistrationMeta
                  registration={currentRegistration}
                  isPriced={event.isPriced}
                />
                <Admin
                  actionGrant={actionGrant}
                  event={event}
                  deleteEvent={deleteEvent}
                />
              </Flex>}
          </Flex>
        </Flex>

        <Flex wrapReverse>
          {loggedIn &&
            <JoinEventForm
              event={event}
              registration={currentRegistration}
              currentUser={currentUser}
              onToken={this.handleToken}
              onSubmit={this.handleRegistration}
            />}

          <Flex column className={styles.openFor}>
            <strong>Åpent for</strong>
            <ul>
              {(pools || []).map(pool =>
                pool.permissionGroups.map(group =>
                  <li key={group.id}>
                    {group.name}
                  </li>
                )
              )}
            </ul>
          </Flex>
        </Flex>
        {event.commentTarget &&
          <CommentView
            formEnabled
            user={currentUser}
            commentTarget={event.commentTarget}
            loggedIn={loggedIn}
            comments={comments}
          />}
      </div>
    );
  }
}
