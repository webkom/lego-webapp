// @flow

import styles from './EventDetail.css';
import React, { Component, Fragment } from 'react';
import CommentView from 'app/components/Comments/CommentView';
import Icon from 'app/components/Icon';
import JoinEventForm from '../JoinEventForm';
import RegisteredSummary from '../RegisteredSummary';
import {
  AttendanceStatus,
  ModalParentComponent
} from 'app/components/UserAttendance';
import Tag from 'app/components/Tags/Tag';
import { FormatTime, FromToTime } from 'app/components/Time';
import InfoList from 'app/components/InfoList';
import { Flex } from 'app/components/Layout';
import Tooltip from 'app/components/Tooltip';
import { EVENT_TYPE_TO_STRING, colorForEvent } from '../../utils';
import Admin from '../Admin';
import RegistrationMeta from '../RegistrationMeta';
import DisplayContent from 'app/components/DisplayContent';
import {
  Content,
  ContentHeader,
  ContentSection,
  ContentMain,
  ContentSidebar
} from 'app/components/Content';
import type { ID } from 'app/models';
import { Link } from 'react-router';
import UserGrid from 'app/components/UserGrid';

type InterestedButtonProps = {
  isInterested: boolean
};

const InterestedButton = ({ isInterested }: InterestedButtonProps) => {
  const icon = isInterested ? 'star' : 'star-outline';
  return (
    <div style={{ display: 'inline-block' }}>
      <Tooltip
        style={{ lineHeight: '1.3rem' }}
        content={
          <span style={{ fontSize: '1rem', fontWeight: '100', padding: '0' }}>
            Favoritt
          </span>
        }
      >
        <Icon className={styles.star} name={icon} />
      </Tooltip>
    </div>
  );
};

type Props = {
  eventId: string,
  event: Object,
  loggedIn: boolean,
  currentUser: Object,
  actionGrant: Array<string>,
  comments: Array<Object>,
  error?: Object,
  pools: Array<Object>,
  registrations: Array<Object>,
  currentRegistration: Object,
  currentRegistrationIndex: number,
  hasSimpleWaitingList: boolean,
  waitingRegistrations: Array<Object>,
  register: ({
    eventId: string,
    captchaResponse: string,
    feedback: string,
    userId: number
  }) => Promise<*>,
  follow: (eventId: string, userId: string) => Promise<*>,
  unfollow: (eventId: string, userId: string) => Promise<*>,
  unregister: ({
    eventId: string,
    registrationId: number,
    userId: number
  }) => Promise<*>,
  payment: (eventId: string, token: string) => Promise<*>,
  updateFeedback: (
    eventId: string,
    registrationId: number,
    feedback: string
  ) => Promise<*>,
  deleteEvent: (eventId: ID) => Promise<*>,
  updateUser: Object => void
};

export default class EventDetail extends Component<Props> {
  handleRegistration = ({ captchaResponse, feedback, type }: Object) => {
    const {
      eventId,
      currentRegistration,
      register,
      unregister,
      updateFeedback,
      currentUser: { id: userId }
    } = this.props;
    switch (type) {
      case 'feedback':
        return updateFeedback(eventId, currentRegistration.id, feedback);
      case 'register':
        // Note that we do not return this promise due to custom submitting handling
        register({
          eventId,
          captchaResponse,
          feedback,
          userId
        });
        return;
      case 'unregister':
        unregister({
          eventId,
          registrationId: currentRegistration.id,
          userId
        });
        return;
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
      pools,
      registrations,
      currentRegistration,
      currentRegistrationIndex,
      hasSimpleWaitingList,
      deleteEvent,
      follow,
      unfollow
    } = this.props;
    if (!event.id) {
      return null;
    }

    if (error) {
      return <div>{error.message}</div>;
    }

    const color = colorForEvent(event.eventType);
    const onRegisterClick = event.isUserFollowing
      ? () => unfollow(event.isUserFollowing.id, event.id)
      : () => follow(currentUser.id, event.id);

    const infoItems = [
      event.company && {
        key: 'Arrangerende bedrift',
        value: (
          <Link to={`/companies/${event.company.id}`}>
            {event.company.name}
          </Link>
        )
      },
      event.createdBy && {
        key: 'Forfatter',
        value: (
          <Link to={`/users/${event.createdBy.username}`}>
            {event.createdBy.fullName}
          </Link>
        )
      },
      event.responsibleGroup && {
        key: 'Arrangør',
        value: (
          <span>
            {event.responsibleGroup.name}{' '}
            {event.responsibleGroup.contactEmail && (
              <a href={`mailto:${event.responsibleGroup.contactEmail}`}>
                {event.responsibleGroup.contactEmail}
              </a>
            )}
          </span>
        )
      },
      {
        key: 'Hva',
        value: EVENT_TYPE_TO_STRING(event.eventType)
      },
      {
        key: 'Når',
        value: <FromToTime from={event.startTime} to={event.endTime} />
      },
      { key: 'Finner sted i', value: event.location },
      event.activationTime && {
        key: 'Påmelding åpner',
        value: <FormatTime time={event.activationTime} />
      },
      event.unregistrationDeadline && {
        key: 'Avregistreringsfrist',
        value: <FormatTime time={event.unregistrationDeadline} />
      }
    ];

    const paidItems = [
      { key: 'Pris', value: `${event.priceMember / 100},-` },
      event.paymentDueDate && {
        key: 'Betalingsfrist',
        value: <FormatTime time={event.paymentDueDate} />
      }
    ];

    return (
      <div>
        <Content banner={event.cover || (event.company && event.company.logo)}>
          <ContentHeader
            borderColor={color}
            onClick={onRegisterClick}
            className={styles.title}
          >
            {loggedIn && (
              <InterestedButton isInterested={event.isUserFollowing} />
            )}
            {event.title}
          </ContentHeader>

          <ContentSection>
            <ContentMain>
              <DisplayContent content={event.text} />
              <Flex className={styles.tagRow}>
                {event.tags.map((tag, i) => (
                  <Tag key={i} tag={tag} />
                ))}
              </Flex>
            </ContentMain>
            <ContentSidebar>
              <InfoList items={infoItems} />
              {event.isPriced && (
                <div className={styles.paymentInfo}>
                  <strong>Dette er et betalt arrangement</strong>
                  <InfoList items={paidItems} />
                </div>
              )}
              <Flex column>
                <h3>Påmeldte</h3>
                {registrations ? (
                  <Fragment>
                    <UserGrid
                      minRows={2}
                      maxRows={2}
                      users={registrations.slice(0, 14).map(reg => reg.user)}
                    />
                    <ModalParentComponent
                      key="modal"
                      pools={pools}
                      registrations={registrations}
                      title="Påmeldte"
                    >
                      <RegisteredSummary registrations={registrations} />
                      <AttendanceStatus />
                    </ModalParentComponent>
                  </Fragment>
                ) : (
                  <AttendanceStatus pools={pools} />
                )}

                {loggedIn && (
                  <RegistrationMeta
                    registration={currentRegistration}
                    isPriced={event.isPriced}
                    registrationIndex={currentRegistrationIndex}
                    hasSimpleWaitingList={hasSimpleWaitingList}
                  />
                )}
                <Admin
                  actionGrant={actionGrant}
                  event={event}
                  deleteEvent={deleteEvent}
                />
              </Flex>
            </ContentSidebar>
          </ContentSection>

          {loggedIn &&
          event.unansweredSurveys &&
          event.unansweredSurveys.length > 0 ? (
            <div className={styles.unansweredSurveys}>
              <h3>
                Du kan ikke melde deg på dette arrangementet fordi du har
                ubesvarte spørreundersøkelser.
              </h3>
              <p>
                Man må svare på alle spørreundersøkelser for tidligere
                arrangementer før man kan melde seg på nye arrangementer. Du kan
                svare på undersøkelsene dine ved å trykke på følgende linker:
              </p>
              <ul>
                {event.unansweredSurveys.map((surveyId, i) => (
                  <li key={surveyId}>
                    <Link to={`/surveys/${surveyId}`}>
                      Undersøkelse {i + 1}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div>
              <div className={styles.joinHeader}>
                Bli med på dette arrangementet
              </div>
              <Link
                to="/pages/arrangementer/26-arrangementsregler"
                style={{ marginTop: 0 }}
              >
                <Flex alignItems="center">
                  <Icon name="document" style={{ marginRight: '4px' }} />
                  <span>Regler for Abakus&#39; arrangementer</span>
                </Flex>
              </Link>

              <JoinEventForm
                event={event}
                registration={currentRegistration}
                currentUser={currentUser}
                updateUser={updateUser}
                onToken={this.handleToken}
                onSubmit={this.handleRegistration}
              />
            </div>
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
