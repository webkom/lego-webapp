import moment from 'moment-timezone';
import { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import mazemapLogo from 'app/assets/mazemap.png';
import Button from 'app/components/Button';
import CommentView from 'app/components/Comments/CommentView';
import {
  Content,
  ContentHeader,
  ContentSection,
  ContentMain,
  ContentSidebar,
} from 'app/components/Content';
import DisplayContent from 'app/components/DisplayContent';
import Icon from 'app/components/Icon';
import { Image } from 'app/components/Image';
import InfoList from 'app/components/InfoList';
import { Flex } from 'app/components/Layout';
import { MazemapEmbed } from 'app/components/MazemapEmbed';
import Tag from 'app/components/Tags/Tag';
import TextWithIcon from 'app/components/TextWithIcon';
import { FormatTime, FromToTime } from 'app/components/Time';
import Tooltip from 'app/components/Tooltip';
import {
  AttendanceStatus,
  ModalParentComponent,
} from 'app/components/UserAttendance';
import UserGrid from 'app/components/UserGrid';
import type {
  EventPool,
  EventRegistration,
  Event,
  ActionGrant,
  AddPenalty,
} from 'app/models';
import { resolveGroupLink } from 'app/reducers/groups';
import type { ID } from 'app/store/models';
import type Comment from 'app/store/models/Comment';
import type { CurrentUser } from 'app/store/models/User';
import {
  colorForEvent,
  penaltyHours,
  getEventSemesterFromStartTime,
  registrationCloseTime,
} from '../../utils';
import Admin from '../Admin';
import sharedStyles from '../Event.css';
import JoinEventForm from '../JoinEventForm';
import RegisteredSummary from '../RegisteredSummary';
import RegistrationMeta from '../RegistrationMeta';
import styles from './EventDetail.css';

type InterestedButtonProps = {
  isInterested: boolean;
};

const MIN_USER_GRID_ROWS = 2;
const MAX_USER_GRID_ROWS = 2;

const Line = () => <div className={styles.line} />;

const InterestedButton = ({ isInterested }: InterestedButtonProps) => {
  const icon = isInterested ? 'star' : 'star-outline';
  return (
    <div
      style={{
        display: 'inline-block',
      }}
    >
      <Tooltip
        style={{
          lineHeight: '1.3rem',
        }}
        content={
          <span
            style={{
              fontSize: '1rem',
              fontWeight: '100',
              padding: '0',
            }}
          >
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
  eventId: ID;
  event: Event;
  loggedIn: boolean;
  currentUser: CurrentUser;
  actionGrant: ActionGrant;
  comments: Array<Comment>;
  error?: Record<string, any>;
  pools: Array<EventPool>;
  registrations: Array<EventRegistration>;
  currentRegistration: EventRegistration;
  currentRegistrationIndex: number;
  pendingRegistration?: EventRegistration;
  hasSimpleWaitingList: boolean;
  waitingRegistrations: Array<EventRegistration>;
  penalties: Array<AddPenalty>;
  register: (arg0: {
    eventId: ID;
    captchaResponse: string;
    feedback: string;
    userId: ID;
  }) => Promise<any>;
  follow: (userId: ID, eventId: ID) => Promise<any>;
  unfollow: (followId: ID, eventId: ID) => Promise<any>;
  unregister: (arg0: {
    eventId: ID;
    registrationId: ID;
    userId: ID;
  }) => Promise<any>;
  payment: (eventId: ID) => Promise<any>;
  updateFeedback: (
    eventId: ID,
    registrationId: ID,
    feedback: string
  ) => Promise<any>;
  deleteEvent: (eventId: ID) => Promise<any>;
  deleteComment: (id: ID, contentTarget: string) => Promise<any>;
};
type State = {
  mapIsOpen: boolean;
};
export default class EventDetail extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      mapIsOpen: false,
    };
  }

  handleRegistration = ({
    captchaResponse,
    feedback,
    type,
  }: Record<string, any>) => {
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
    } = this.props;

    if (!event.id) {
      return null;
    }

    if (error) {
      return <div>{error.message}</div>;
    }

    const color = colorForEvent(event.eventType);

    const onRegisterClick = event.following
      ? () => unfollow(event.following, event.id)
      : () => follow(currentUser.id, event.id);

    const currentMoment = moment();

    const activationTimeMoment = moment(event.activationTime);

    const eventRegistrationTime = activationTimeMoment.subtract(
      penaltyHours(penalties),
      'hours'
    );

    const registrationCloseTimeMoment = registrationCloseTime(event);

    // The UserGrid is expanded when there's less than 5 minutes till activation
    const minUserGridRows = currentMoment.isAfter(
      moment(activationTimeMoment).subtract(5, 'minutes')
    )
      ? MIN_USER_GRID_ROWS
      : 0;

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
              <TextWithIcon
                iconName="help-circle-outline"
                content="Frist for prikk"
                tooltipContentIcon={
                  <>
                    Lurer du på hvordan prikksystemet fungerer? Sjekk ut{' '}
                    <Link to="/pages/arrangementer/26-arrangementsregler">
                      arrangementsreglene
                    </Link>
                    .
                  </>
                }
                iconRight={true}
                size={16}
              />
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
              <TextWithIcon
                iconName="help-circle-outline"
                content={
                  currentMoment.isBefore(registrationCloseTimeMoment)
                    ? 'Påmelding stenger'
                    : 'Påmelding stengte'
                }
                tooltipContentIcon={
                  <>
                    Etter påmeldingen stenger er det hverken mulig å melde seg
                    på eller av arrangementet.
                  </>
                }
                iconRight={true}
                size={16}
              />
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

    const groupLink =
      event.responsibleGroup && resolveGroupLink(event.responsibleGroup);

    const eventCreator = [
      event.responsibleGroup && {
        key: 'Arrangør',
        value: (
          <span>
            {groupLink ? (
              <Link to={groupLink}>{event.responsibleGroup.name}</Link>
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
      event?.createdBy
        ? event.createdBy && {
            key: 'Forfatter',
            value: (
              <Link to={`/users/${event.createdBy.username}`}>
                {event.createdBy.fullName}
              </Link>
            ),
          }
        : {
            key: 'Forfatter',
            value: 'Anonym',
          },
    ];

    return (
      <Content
        banner={event.cover || event.company?.logo}
        bannerPlaceholder={
          event.coverPlaceholder || event.company?.logoPlaceholder
        }
        youtubeUrl={event.youtubeUrl}
      >
        <ContentHeader
          borderColor={color}
          onClick={loggedIn ? onRegisterClick : undefined}
          className={styles.title}
          event={event}
        >
          {loggedIn && <InterestedButton isInterested={!!event.following} />}
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
              <TextWithIcon
                iconName="briefcase-outline"
                content={
                  <Link to={`/companies/${event.company.id}`}>
                    {event.company.name}
                  </Link>
                }
              />
            )}
            <TextWithIcon
              iconName="time-outline"
              content={<FromToTime from={event.startTime} to={event.endTime} />}
            />
            <div className={styles.infoIconLocation}>
              <TextWithIcon
                iconName="location-outline"
                content={event.location}
              />
              {event.mazemapPoi && (
                <Button
                  className={styles.mapButton}
                  onClick={() =>
                    this.setState({
                      mapIsOpen: !this.state.mapIsOpen,
                    })
                  }
                >
                  <Image
                    className={styles.mazemapImg}
                    alt="mazemapLogo"
                    src={mazemapLogo}
                  />
                  {this.state.mapIsOpen ? 'Skjul kart' : 'Vis kart'}
                </Button>
              )}
            </div>

            {event.isPriced && (
              <TextWithIcon
                iconName="cash-outline"
                content={event.priceMember / 100 + ',-'}
              />
            )}
            {event.mazemapPoi && (
              <>
                {this.state.mapIsOpen && (
                  <MazemapEmbed mazemapPoi={event.mazemapPoi} />
                )}
              </>
            )}
            {['OPEN', 'TBA'].includes(event.eventStatusType) ? (
              <JoinEventForm event={event} />
            ) : (
              <Flex column>
                <h3>Påmeldte</h3>
                {registrations ? (
                  <Fragment>
                    <UserGrid
                      minRows={minUserGridRows}
                      maxRows={MAX_USER_GRID_ROWS}
                      users={registrations.slice(0, 14).map((reg) => reg.user)}
                    />
                    <ModalParentComponent
                      key="modal"
                      pools={pools}
                      title="Påmeldte"
                    >
                      <RegisteredSummary
                        registrations={registrations}
                        currentRegistration={currentRegistration}
                      />
                      <AttendanceStatus
                        pools={pools}
                        legacyRegistrationCount={event.legacyRegistrationCount}
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
                    kontaktinformasjonen din (navn, telefonnummer og epost) kan
                    deles med FHI og NTNU (og eventuelt andre aktører nevnt i
                    beskrivelsen av arrangementet) for smittesporing.
                    Kontaktinformasjonen vil være tilgjengelig for brukeren som
                    laget arrangementet i 14 dager etter at arrangementet har
                    funnet sted, og vil kun brukes til smittesporing.
                  </div>
                )}
                {event.unansweredSurveys &&
                event.unansweredSurveys.length > 0 &&
                !event.isAdmitted ? (
                  <div className={sharedStyles.eventWarning}>
                    <p>
                      Du kan ikke melde deg på dette arrangementet fordi du har
                      ubesvarte spørreundersøkelser.
                    </p>
                    <br />
                    <p>
                      Man må svare på alle spørreundersøkelser for tidligere
                      arrangementer før man kan melde seg på nye arrangementer.
                      Du kan svare på undersøkelsene dine ved å trykke på
                      følgende linker:
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
              <TextWithIcon
                iconName="create-outline"
                content={
                  <Link to={`/users/${currentUser.username}/settings/profile`}>
                    Oppdater matallergier/preferanser
                  </Link>
                }
              />
            )}
            <TextWithIcon
              iconName="document-outline"
              content={
                <Link to="/pages/arrangementer/26-arrangementsregler">
                  Arrangementsregler
                </Link>
              }
            />
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
            style={{
              marginTop: 20,
            }}
            user={currentUser}
            contentTarget={event.contentTarget}
            loggedIn={loggedIn}
            comments={comments}
            deleteComment={deleteComment}
          />
        )}
      </Content>
    );
  }
}
