// @flow

import styles from './EventDetail.css';
import React, { Component } from 'react';
import { Image } from 'app/components/Image';
import CommentView from 'app/components/Comments/CommentView';
import Icon from 'app/components/Icon';
import JoinEventForm from '../JoinEventForm';
import RegisteredCell from '../RegisteredCell';
import RegisteredSummary from '../RegisteredSummary';
import {
  AttendanceStatus,
  ModalParentComponent
} from 'app/components/UserAttendance';
import Tag from 'app/components/Tag';
import Time from 'app/components/Time';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { Flex } from 'app/components/Layout';
import { EVENT_TYPE_TO_STRING, styleForEvent } from '../../utils.js';
import Admin from '../Admin';
import RegistrationMeta from '../RegistrationMeta';
import Content from 'app/components/Layout/Content';
import cx from 'classnames';

type InterestedButtonProps = {
  isInterested: boolean
};

const InterestedButton = ({ isInterested }: InterestedButtonProps) => {
  const icon = isInterested ? 'star' : 'star-outline';
  return <Icon className={styles.star} name={icon} />;
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
  register: (
    eventId: string,
    captchaResponse: string,
    feedback: string
  ) => Promise<*>,
  follow: (eventId: string, userId: string) => Promise<*>,
  unfollow: (eventId: string, userId: string) => Promise<*>,
  unregister: (eventId: string, registrationId: number) => Promise<*>,
  payment: (eventId: string, token: string) => Promise<*>,
  updateFeedback: (
    eventId: string,
    registrationId: number,
    feedback: string
  ) => Promise<*>,
  deleteEvent: (eventId: string) => Promise<*>,
  updateUser: Object => void
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
      updateUser,
      actionGrant,
      comments,
      error,
      loading,
      pools,
      registrations,
      currentRegistration,
      deleteEvent,
      follow,
      unfollow
    } = this.props;

    if (!event.id) {
      return null;
    }

    if (loading) {
      return <LoadingIndicator loading />;
    }

    if (error) {
      return <div>{error.message}</div>;
    }
    const styleType = styleForEvent(event.eventType);

    const onRegisterClick = event.isUserFollowing
      ? () => unfollow(event.isUserFollowing.id, event.id)
      : () => follow(currentUser.id, event.id);

    return (
      <div>
        <div className={styles.coverImage}>
          <Image src={event.cover} />
        </div>

        <Content className={styles.content}>
          <div>
            <h2
              onClick={onRegisterClick}
              className={cx(styleType, styles.title)}
            >
              <InterestedButton isInterested={event.isUserFollowing} />
              {event.title}
            </h2>
          </div>

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
            <Flex column className={cx(styles.meta)}>
              <ul>
                {event.company && (
                  <li>
                    Arrangerende bedrift <strong>{event.company.name}</strong>
                  </li>
                )}
                <li>
                  <span className={styles.metaDescriptor}>Hva</span>
                  <strong>{EVENT_TYPE_TO_STRING(event.eventType)}</strong>
                </li>
                <li>
                  <span className={styles.metaDescriptor}>Starter</span>
                  <strong>
                    <Time time={event.startTime} format="DD.MM.YYYY HH:mm" />
                  </strong>
                </li>
                <li>
                  <span className={styles.metaDescriptor}>Slutter</span>
                  <strong>
                    <Time time={event.endTime} format="DD.MM.YYYY HH:mm" />
                  </strong>
                </li>
                <li>
                  Finner sted i <strong>{event.location}</strong>
                </li>
                {event.activationTime && (
                  <li>
                    Påmelding åpner
                    <strong style={{ marginLeft: 5 }}>
                      <Time
                        time={event.activationTime}
                        format="DD.MM.YYYY HH:mm"
                        style={{ marginLeft: '5px' }}
                      />
                    </strong>
                  </li>
                )}
                {event.isPriced && (
                  <div>
                    <li>Dette er et betalt arrangement</li>
                    <li>
                      Pris: <strong>{event.priceMember / 100},-</strong>
                    </li>
                  </div>
                )}
              </ul>
              {loggedIn && (
                <Flex column>
                  <h3>Påmeldte</h3>
                  <Flex className={styles.registeredThumbnails}>
                    {registrations
                      .slice(0, 10)
                      .map(reg => (
                        <RegisteredCell key={reg.user.id} user={reg.user} />
                      ))}
                  </Flex>
                  <ModalParentComponent pools={pools} title="Påmeldte">
                    <RegisteredSummary registrations={registrations} />
                    <AttendanceStatus />
                  </ModalParentComponent>

                  <RegistrationMeta
                    registration={currentRegistration}
                    isPriced={event.isPriced}
                  />
                  <Admin
                    actionGrant={actionGrant}
                    event={event}
                    deleteEvent={deleteEvent}
                  />
                </Flex>
              )}
            </Flex>
          </Flex>

          {loggedIn && (
            <JoinEventForm
              event={event}
              registration={currentRegistration}
              currentUser={currentUser}
              updateUser={updateUser}
              onToken={this.handleToken}
              onSubmit={this.handleRegistration}
            />
          )}

          {event.commentTarget && (
            <CommentView
              style={{ marginTop: 20 }}
              user={currentUser}
              commentTarget={event.commentTarget}
              loggedIn={loggedIn}
              comments={comments}
            />
          )}
        </Content>
      </div>
    );
  }
}
