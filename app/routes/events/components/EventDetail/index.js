// @flow

import styles from './EventDetail.css';
import React, { Component } from 'react';
import { Link } from 'react-router';
import Image from 'app/components/Image';
import CommentView from 'app/components/Comments/CommentView';
import { FlexRow, FlexColumn, FlexItem } from 'app/components/FlexBox';
import Button from 'app/components/Button';
import Icon from 'app/components/Icon';
import Markdown from 'app/components/Markdown';
import JoinEventForm from '../JoinEventForm';
import RegisteredCell from '../RegisteredCell';
import RegisteredSummary from '../RegisteredSummary';
import colorForEvent from '../../colorForEvent';
import { AttendanceStatus } from 'app/components/UserAttendance';
import Tag from 'app/components/Tag';
import Time from 'app/components/Time';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { Flex } from 'app/components/Layout';
import { EVENT_TYPE_TO_STRING } from '../../utils.js';

const InterestedButton = ({ value, onClick }) => {
  const [icon, text] = value
    ? ['check', 'Du er interessert']
    : ['plus', 'Jeg er interessert'];

  return (
    <Button onClick={onClick}>
      <Icon name={icon} />
      {' '}
      {text}
    </Button>
  );
};

/**
 *
 */
type Props = {
  eventId: Number,
  event: Object,
  loggedIn: boolean,
  currentUser: Object,
  actionGrant: Array<any>,
  comments: Array<any>,
  error?: Object,
  loading: boolean,
  pools: Array<any>,
  registrations: Array<any>,
  currentRegistration: Object,
  poolsWithWaitingRegistrations: Array<any>,
  waitingRegistrations: Array<any>,
  isUserInterested: boolean,
  register: (eventId: Number) => Promise<*>,
  unregister: (eventId: Number, registrationId: Number) => Promise<*>,
  payment: (eventId: Number, token: string) => Promise<*>,
  updateFeedback: (
    eventId: Number,
    registrationId: Number,
    feedback: string
  ) => Promise<*>
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
      poolsWithWaitingRegistrations,
      waitingRegistrations
    } = this.props;

    if (!event.id) {
      return null;
    }

    if (loading || Object.keys(event).length === 0) {
      return <LoadingIndicator loading />;
    }

    if (error) {
      return <div>{error.message}</div>;
    }
    const metaColor = colorForEvent(event.eventType);

    return (
      <div className={styles.root}>
        <div className={styles.coverImage}>
          <Image src={event.cover} />
        </div>

        <Flex wrap alignItems="center" justifyContent="space-between">
          <h2>{event.title}</h2>
          <InterestedButton value={this.props.isUserInterested} />
        </Flex>

        <Flex wrap>
          <Flex column className={styles.description}>
            <div dangerouslySetInnerHTML={{ __html: event.text }} />
            <Flex className={styles.tagRow}>
              {event.tags.map((tag, i) => <Tag key={i} tag={tag} />)}
            </Flex>
          </Flex>
          <Flex column className={styles.meta} style={{ background: metaColor }}>
            <ul>
              {event.company &&
                <li>
                  Arrangerende bedrift <strong>{event.company.name}</strong>
                </li>}
              <li>
                <span>Hva </span>
                <strong>{EVENT_TYPE_TO_STRING(event.eventType)}</strong>
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
              <li>Finner sted i <strong>{event.location}</strong></li>
              {event.activationTime &&
                <li>
                  Påmelding åpner
                  {' '}
                  <strong>
                    <Time
                      time={event.activationTime}
                      format="DD.MM.YYYY HH:mm"
                    />
                  </strong>
                </li>}
              {event.isPriced && <li>Dette er et betalt arrangement</li>}
              {event.price > 0 &&
                <li>Pris: <strong>{event.price / 100},-</strong></li>}
            </ul>
            {loggedIn &&
              <FlexItem>
                <h3>Påmeldte:</h3>
                <FlexRow className={styles.registeredThumbnails}>
                  {registrations
                    .slice(0, 10)
                    .map(reg => (
                      <RegisteredCell key={reg.user.id} user={reg.user} />
                    ))}
                </FlexRow>
                <RegisteredSummary registrations={registrations} />
                <AttendanceStatus
                  title="Påmeldte"
                  pools={poolsWithWaitingRegistrations}
                />
                {!currentRegistration &&
                  <div>
                    <i className="fa fa-exclamation-circle" />
                    {' '}
                    Du er ikke registrert
                  </div>}
                {currentRegistration &&
                  <div>
                    {currentRegistration.pool
                      ? <div>
                          <i className="fa fa-check-circle" /> Du er registrert
                        </div>
                      : <div>
                          <i className="fa fa-pause-circle" />
                          {' '}
                          Du er i venteliste
                        </div>}
                    {event.isPriced &&
                      (currentRegistration.chargeStatus === 'succeeded'
                        ? <div>
                            <i className="fa fa-check-circle" /> Du har betalt
                          </div>
                        : <div>
                            <i className="fa fa-exclamation-circle" />
                            {' '}
                            Du har ikke betalt
                          </div>)}
                  </div>}
                {actionGrant.includes('update') &&
                  <ul>
                    <li><strong>Admin</strong></li>
                    <li>
                      <Link
                        to={`/events/${event.id}/administrate`}
                        style={{ color: 'white' }}
                      >
                        Påmeldinger
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={`/events/${event.id}/edit`}
                        style={{ color: 'white' }}
                      >
                        Rediger
                      </Link>
                    </li>
                  </ul>}
              </FlexItem>}
          </Flex>
        </Flex>

        <Flex wrapReverse>
          {loggedIn &&
            <FlexColumn className={styles.join}>
              <div className={styles.joinHeader}>
                Bli med på dette arrangementet
              </div>

              <div>
                <JoinEventForm
                  event={event}
                  registration={currentRegistration}
                  currentUser={currentUser}
                  onToken={this.handleToken}
                  onSubmit={this.handleRegistration}
                />
              </div>
            </FlexColumn>}

          <Flex column className={styles.openFor}>
            <strong>Åpent for</strong>
            <ul>
              {(pools || [])
                .map(pool =>
                  pool.permissionGroups.map(group => (
                    <li key={group.id}>{group.name}</li>
                  ))
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
