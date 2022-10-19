// @flow

import styles from './EventDetail.css';
import sharedStyles from '../Event.css';
import { Component, Fragment } from 'react';
import CommentView from 'app/components/Comments/CommentView';
import Icon from 'app/components/Icon';
import JoinEventForm from '../JoinEventForm';
import RegisteredSummary from '../RegisteredSummary';
import {
  AttendanceStatus,
  ModalParentComponent,
} from 'app/components/UserAttendance';
import Tag from 'app/components/Tags/Tag';
import moment from 'moment-timezone';
import { FormatTime, FromToTime } from 'app/components/Time';
import InfoList from 'app/components/InfoList';
import { Flex } from 'app/components/Layout';
import Tooltip from 'app/components/Tooltip';
import {
  colorForEvent,
  penaltyHours,
  getEventSemesterFromStartTime,
  registrationCloseTime,
} from '../../utils';
import Admin from '../Admin';
import RegistrationMeta from '../RegistrationMeta';
import DisplayContent from 'app/components/DisplayContent';
import {
  Content,
  ContentHeader,
  ContentSection,
  ContentMain,
  ContentSidebar,
} from 'app/components/Content';
import { Link } from 'react-router-dom';
import UserGrid from 'app/components/UserGrid';
import type {
  ID,
  EventPool,
  EventRegistration,
  Event,
  ActionGrant,
  AddPenalty,
  FollowerItem,
} from 'app/models';
import type { CommentEntity } from 'app/reducers/comments';
import type { UserEntity } from 'app/reducers/users';
import { MazemapEmbed } from 'app/components/MazemapEmbed';

type InterestedButtonProps = {
  isInterested: boolean,
};

const Line = () => <div className={styles.line} />;

const InterestedButton = ({ isInterested }: InterestedButtonProps) => {
  const icon = isInterested ? 'star' : 'star-outline';
  return (
    <div style={{ display: 'inline-block' }}>
      <Tooltip
        style={{ lineHeight: '1.3rem' }}
        content={
          <span style={{ fontSize: '1rem', fontWeight: '100', padding: '0' }}>
            Følg arrangementet, og få e-post når påmelding nærmer seg!
          </span>
        }
      >
        <Icon name={icon} className={styles.star} />
      </Tooltip>
    </div>
  );
};

type Props = {
  eventId: ID,
  event: Event,
  loggedIn: boolean,
  currentUser: UserEntity,
  actionGrant: ActionGrant,
  comments: Array<CommentEntity>,
  error?: Object,
  pools: Array<EventPool>,
  registrations: Array<EventRegistration>,
  currentRegistration: EventRegistration,
  currentRegistrationIndex: number,
  pendingRegistration?: EventRegistration,
  hasSimpleWaitingList: boolean,
  waitingRegistrations: Array<EventRegistration>,
  penalties: Array<AddPenalty>,
  register: ({
    eventId: ID,
    captchaResponse: string,
    feedback: string,
    userId: ID,
  }) => Promise<*>,
  follow: (eventId: ID, userId: ID) => Promise<*>,
  unfollow: (eventId: ID, userId: ID) => Promise<*>,
  unregister: ({
    eventId: ID,
    registrationId: ID,
    userId: ID,
  }) => Promise<*>,
  payment: (eventId: ID) => Promise<*>,
  updateFeedback: (
    eventId: ID,
    registrationId: ID,
    feedback: string
  ) => Promise<*>,
  deleteEvent: (eventId: ID) => Promise<*>,
  deleteComment: (id: ID, contentTarget: string) => Promise<*>,
  currentUserFollowing: ?FollowerItem,
};

type State = { mapIsOpen: boolean };

export default class EventDetail extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      mapIsOpen: false,
    };
  }

  handleRegistration = ({ captchaResponse, feedback, type }: Object) => {
    const {
      eventId,
      currentRegistration,
      register,
      unregister,
      updateFeedback,
      currentUser: { id: userId },
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
          userId,
        });
        return;
      case 'unregister':
        unregister({
          eventId,
          registrationId: currentRegistration.id,
          userId,
        });
        return;
      default:
        return undefined;
    }
  };

  handlePaymentMethod = () => this.props.payment(this.props.event.id);

  render() {
    const {
      event,
      loggedIn,
      currentUser,
      actionGrant,
      comments,
      error,
      pools,
      registrations,
      currentRegistration,
      currentRegistrationIndex,
      pendingRegistration,
      hasSimpleWaitingList,
      deleteEvent,
      penalties,
      follow,
      unfollow,
      deleteComment,
      currentUserFollowing,
    } = this.props;
    if (!event.id) {
      return null;
    }

    if (error) {
      return <div>{error.message}</div>;
    }

    const color = colorForEvent(event.eventType);
    const onRegisterClick = currentUserFollowing
      ? () => unfollow(currentUserFollowing.id, event.id)
      : () => follow(currentUser.id, event.id);

    const currentMoment = moment();
    const activationTimeMoment = moment(event.activationTime);
    const eventRegistrationTime = activationTimeMoment.subtract(
      penaltyHours(penalties),
      'hours'
    );
    const registrationCloseTimeMoment = registrationCloseTime(event);

    const deadlines = [
      event.activationTime && currentMoment.isBefore(activationTimeMoment)
        ? {
            key: 'Påmelding åpner',
            value: (
              <FormatTime
                format="dd DD. MMM HH:mm"
                time={eventRegistrationTime}
              />
            ),
          }
        : null,
      event.heedPenalties &&
      event.unregistrationDeadline &&
      !['OPEN', 'TBA'].includes(event.eventStatusType)
        ? {
            key: 'Frist for prikk',
            keyNode: (
              <Tooltip
                content={
                  <span>
                    Lurer du på hvordan prikksystemet fungerer? Sjekk ut{' '}
                    <Link to="/pages/arrangementer/26-arrangementsregler">
                      arrangementsreglene
                    </Link>
                    .
                  </span>
                }
              >
                <Flex alignItems="center" gap={4}>
                  Frist for prikk
                  <Icon name="help-circle-outline" size={16} />
                </Flex>
              </Tooltip>
            ),
            value: (
              <FormatTime
                format="dd DD. MMM HH:mm"
                time={event.unregistrationDeadline}
              />
            ),
          }
        : null,
      activationTimeMoment.isBefore(currentMoment)
        ? {
            key: 'Frist for av/påmelding',
            keyNode: (
              <Tooltip
                content={
                  <span>
                    Etter påmeldingen stenger er det hverken mulig å melde seg
                    på eller av arrangementet.
                  </span>
                }
              >
                <Flex alignItems="center" gap={4}>
                  {currentMoment.isBefore(registrationCloseTimeMoment)
                    ? 'Påmelding stenger'
                    : 'Påmelding stengte'}{' '}
                  <Icon name="help-circle-outline" size={16} />
                </Flex>
              </Tooltip>
            ),
            value: (
              <FormatTime
                format="dd DD. MMM HH:mm"
                time={registrationCloseTimeMoment}
              />
            ),
          }
        : null,
      event.paymentDueDate
        ? {
            key: 'Betalingsfrist',
            value: (
              <FormatTime
                format="dd DD. MMM HH:mm"
                time={event.paymentDueDate}
              />
            ),
          }
        : null,
    ];

    const eventCreator = [
      event.responsibleGroup && {
        key: 'Arrangør',
        value: (
          <span>
            {event.responsibleGroup.type === 'komite' ? (
              <Link to={`/pages/komiteer/${event.responsibleGroup.id}`}>
                {event.responsibleGroup.name}
              </Link>
            ) : (
              event.responsibleGroup.name
            )}{' '}
            {event.responsibleGroup.contactEmail && (
              <a href={`mailto:${event.responsibleGroup.contactEmail}`}>
                {event.responsibleGroup.contactEmail}
              </a>
            )}
          </span>
        ),
      },
      event.createdBy && {
        key: 'Forfatter',
        value: (
          <Link to={`/users/${event.createdBy.username}`}>
            {event.createdBy.fullName}
          </Link>
        ),
      },
    ];

    return (
      <div>
        <Content
          banner={event.cover || event.company?.logo}
          bannerPlaceholder={
            event.coverPlaceholder || event.company?.logoPlaceholder
          }
          youtubeUrl={event.youtubeUrl}
        >
          <ContentHeader
            borderColor={color}
            onClick={loggedIn && onRegisterClick}
            className={styles.title}
            event={event}
          >
            {loggedIn && (
              <InterestedButton isInterested={!!currentUserFollowing} />
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
              {event.company && (
                <div className={styles.iconWithText}>
                  <Icon name="briefcase-outline" className={styles.infoIcon} />
                  <strong>
                    <Link to={`/companies/${event.company.id}`}>
                      {event.company.name}
                    </Link>
                  </strong>
                </div>
              )}
              <div className={styles.iconWithText}>
                <Icon name="time-outline" className={styles.infoIcon} />
                <strong>
                  <FromToTime from={event.startTime} to={event.endTime} />
                </strong>
              </div>
              <div className={styles.iconWithText}>
                <Icon name="location-outline" className={styles.infoIcon} />
                <strong>{event.location}</strong>
              </div>
              {event.isPriced && (
                <div className={styles.iconWithText}>
                  <Icon name="cash-outline" className={styles.infoIcon} />
                  <strong>{event.priceMember / 100},-</strong>
                </div>
              )}
              {event.mazemapPoi && (
                <>
                  <div
                    className={styles.simulateLink}
                    onClick={() =>
                      this.setState({ mapIsOpen: !this.state.mapIsOpen })
                    }
                  >
                    {' '}
                    {this.state.mapIsOpen ? 'Skjul kart' : 'Vis kart'}
                  </div>
                  {this.state.mapIsOpen && (
                    <MazemapEmbed mazemapPoi={event.mazemapPoi} />
                  )}
                </>
              )}
              {['OPEN', 'TBA'].includes(event.eventStatusType) ? (
                <JoinEventForm event={event} />
              ) : (
                <Flex column className={styles.registeredBox}>
                  <h3>Påmeldte</h3>
                  {registrations ? (
                    <Fragment>
                      <UserGrid
                        minRows={0}
                        maxRows={2}
                        users={registrations
                          .slice(0, 14)
                          .map((reg) => reg.user)}
                      />
                      <ModalParentComponent
                        key="modal"
                        pools={pools}
                        registrations={registrations}
                        title="Påmeldte"
                      >
                        <RegisteredSummary
                          registrations={registrations}
                          currentRegistration={currentRegistration}
                        />
                        <AttendanceStatus
                          legacyRegistrationCount={
                            event.legacyRegistrationCount
                          }
                        />
                      </ModalParentComponent>
                    </Fragment>
                  ) : (
                    <AttendanceStatus
                      pools={pools}
                      legacyRegistrationCount={event.legacyRegistrationCount}
                    />
                  )}
                  {loggedIn && (
                    <RegistrationMeta
                      useConsent={event.useConsent}
                      hasOpened={moment(event.activationTime).isBefore(
                        currentMoment
                      )}
                      photoConsents={event.photoConsents}
                      eventSemester={getEventSemesterFromStartTime(
                        event.startTime
                      )}
                      hasEnded={moment(event.endTime).isBefore(currentMoment)}
                      registration={currentRegistration}
                      isPriced={event.isPriced}
                      registrationIndex={currentRegistrationIndex}
                      hasSimpleWaitingList={hasSimpleWaitingList}
                    />
                  )}
                  {event.useContactTracing && !currentRegistration && (
                    <div>
                      <i className="fa fa-exclamation-circle" /> Ved å melde deg
                      på dette arrangementet samtykker du til at
                      kontaktinformasjonen din (navn, telefonnummer og epost)
                      kan deles med FHI og NTNU (og eventuelt andre aktører
                      nevnt i beskrivelsen av arrangementet) for smittesporing.
                      Kontaktinformasjonen vil være tilgjengelig for brukeren
                      som laget arrangementet i 14 dager etter at arrangementet
                      har funnet sted, og vil kun brukes til smittesporing.
                    </div>
                  )}
                  {event.unansweredSurveys &&
                  event.unansweredSurveys.length > 0 ? (
                    <div className={sharedStyles.eventWarning}>
                      <p>
                        Du kan ikke melde deg på dette arrangementet fordi du
                        har ubesvarte spørreundersøkelser.
                      </p>
                      <br />
                      <p>
                        Man må svare på alle spørreundersøkelser for tidligere
                        arrangementer før man kan melde seg på nye
                        arrangementer. Du kan svare på undersøkelsene dine ved å
                        trykke på følgende linker:
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
                      <JoinEventForm
                        event={event}
                        registration={currentRegistration}
                        currentUser={currentUser}
                        pendingRegistration={pendingRegistration}
                        createPaymentIntent={this.handlePaymentMethod}
                        onSubmit={this.handleRegistration}
                      />
                    </div>
                  )}
                </Flex>
              )}
              {deadlines.some((d) => d !== null) && (
                <>
                  <Line />
                  <InfoList className={styles.infoList} items={deadlines} />
                </>
              )}
              <Line />
              <InfoList items={eventCreator} className={styles.infoList} />
              <Line />
              {loggedIn && (
                <Link
                  to={`/users/${currentUser.username}/settings/profile`}
                  className={styles.iconWithText}
                >
                  <Icon name="create-outline" className={styles.infoIcon} />
                  <span>Oppdater matallergier/preferanser</span>
                </Link>
              )}
              <Link
                to="/pages/arrangementer/26-arrangementsregler"
                className={styles.iconWithText}
              >
                <Icon name="document-outline" className={styles.infoIcon} />
                <span>Arrangementsregler</span>
              </Link>
              {(actionGrant.includes('edit') ||
                actionGrant.includes('delete')) && <Line />}
              <Flex column>
                <Admin
                  actionGrant={actionGrant}
                  event={event}
                  deleteEvent={deleteEvent}
                />
              </Flex>
            </ContentSidebar>
          </ContentSection>
          {event.contentTarget && (
            <CommentView
              style={{ marginTop: 20 }}
              user={currentUser}
              contentTarget={event.contentTarget}
              loggedIn={loggedIn}
              comments={comments}
              deleteComment={deleteComment}
            />
          )}
        </Content>
      </div>
    );
  }
}
