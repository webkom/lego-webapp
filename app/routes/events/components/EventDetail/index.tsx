import { Button, Card, Flex, Icon, Skeleton } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { isEmpty } from 'lodash';
import moment from 'moment-timezone';
import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { fetchEvent, follow, unfollow } from 'app/actions/EventActions';
import mazemapLogo from 'app/assets/mazemap.svg';
import CommentView from 'app/components/Comments/CommentView';
import {
  Content,
  ContentHeader,
  ContentSection,
  ContentMain,
  ContentSidebar,
} from 'app/components/Content';
import DisplayContent from 'app/components/DisplayContent';
import InfoList from 'app/components/InfoList';
import { MazemapEmbed } from 'app/components/MazemapEmbed';
import PropertyHelmet from 'app/components/PropertyHelmet';
import Tag from 'app/components/Tags/Tag';
import TextWithIcon from 'app/components/TextWithIcon';
import { FormatTime, FromToTime } from 'app/components/Time';
import Tooltip from 'app/components/Tooltip';
import { AttendanceStatus } from 'app/components/UserAttendance';
import AttendanceModal from 'app/components/UserAttendance/AttendanceModal';
import UserGrid from 'app/components/UserGrid';
import config from 'app/config';
import { useCurrentUser, useIsLoggedIn } from 'app/reducers/auth';
import {
  selectCommentsForEvent,
  selectEventByIdOrSlug,
  selectMergedPool,
  selectMergedPoolWithRegistrations,
  selectPoolsForEvent,
  selectPoolsWithRegistrationsForEvent,
  selectRegistrationForEventByUserId,
  selectRegistrationsFromPools,
  selectWaitingRegistrationsForEvent,
} from 'app/reducers/events';
import { resolveGroupLink } from 'app/reducers/groups';
import { selectPenaltyByUserId } from 'app/reducers/penalties';
import { selectUserWithGroups } from 'app/reducers/users';
import {
  colorForEventType,
  penaltyHours,
  getEventSemesterFromStartTime,
  registrationCloseTime,
} from 'app/routes/events/utils';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import Admin from '../Admin';
import JoinEventForm from '../JoinEventForm';
import RegisteredSummary from '../RegisteredSummary';
import RegistrationMeta from '../RegistrationMeta';
import styles from './EventDetail.css';
import type { PropertyGenerator } from 'app/components/PropertyHelmet';
import type {
  AuthUserDetailedEvent,
  UserDetailedEvent,
} from 'app/store/models/Event';
import type { ReadRegistration } from 'app/store/models/Registration';

type InterestedButtonProps = {
  isInterested: boolean;
};

const MIN_USER_GRID_ROWS = 2;
const MAX_USER_GRID_ROWS = 2;

const Line = () => <div className={styles.line} />;

const InterestedButton = ({ isInterested }: InterestedButtonProps) => {
  const icon = isInterested ? 'star' : 'star-outline';
  return (
    <Tooltip content="Følg arrangementet, og få e-post når påmelding nærmer seg!">
      <Icon name={icon} className={styles.star} />
    </Tooltip>
  );
};

const propertyGenerator: PropertyGenerator<{
  event: AuthUserDetailedEvent | UserDetailedEvent;
}> = (props, config) => {
  if (!props.event) return;

  const tags = (props.event.tags || []).map((content) => ({
    content,
    property: 'article:tag',
  }));

  return [
    {
      property: 'og:title',
      content: props.event.title,
    },
    {
      property: 'og:description',
      content: props.event.description,
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      property: 'og:image:width',
      content: '1667',
    },
    {
      property: 'og:image:height',
      content: '500',
    },
    {
      property: 'og:url',
      content: `${config?.webUrl}/events/${props.event.id}`,
    },
    {
      property: 'og:image',
      content: props.event.cover,
    },
    ...tags,
  ];
};

const EventDetail = () => {
  const [mapIsOpen, setMapIsOpen] = useState(false);

  const { eventIdOrSlug } = useParams<{ eventIdOrSlug: string }>();
  const event = useAppSelector((state) =>
    selectEventByIdOrSlug(state, { eventIdOrSlug }),
  ) as AuthUserDetailedEvent | UserDetailedEvent;
  const eventId = event?.id;
  const fetching = useAppSelector((state) => state.events.fetching);
  const showSkeleton = fetching && isEmpty(event);
  const actionGrant = event?.actionGrant || [];
  const hasFullAccess = Boolean(event?.waitingRegistrations);

  const loggedIn = useIsLoggedIn();
  const currentUser = useCurrentUser();
  const user = useAppSelector(
    (state) =>
      currentUser &&
      selectUserWithGroups(state, { username: currentUser.username }),
  );
  const penalties = useAppSelector((state) =>
    selectPenaltyByUserId(state, user?.id),
  );

  const comments = useAppSelector((state) =>
    selectCommentsForEvent(state, { eventId }),
  );
  const poolsWithRegistrations = useAppSelector((state) =>
    event?.isMerged
      ? selectMergedPoolWithRegistrations(state, { eventId })
      : selectPoolsWithRegistrationsForEvent(state, { eventId }),
  );
  const registrations: ReadRegistration[] | undefined = useAppSelector(
    (state) => selectRegistrationsFromPools(state, { eventId }),
  );
  const waitingRegistrations = useAppSelector((state) =>
    selectWaitingRegistrationsForEvent(state, { eventId }),
  );
  const normalPools = useAppSelector((state) =>
    event?.isMerged
      ? selectMergedPool(state, { eventId })
      : selectPoolsForEvent(state, { eventId }),
  );

  let pools =
    event?.waitingRegistrationCount && event.waitingRegistrationCount > 0
      ? normalPools.concat({
          name: 'Venteliste',
          registrationCount: event.waitingRegistrationCount,
          permissionGroups: [],
        })
      : normalPools;

  if (hasFullAccess) {
    pools =
      waitingRegistrations && waitingRegistrations.length > 0
        ? poolsWithRegistrations.concat({
            name: 'Venteliste',
            registrations: waitingRegistrations,
            registrationCount: waitingRegistrations.length,
            permissionGroups: [],
          })
        : poolsWithRegistrations;
  }

  const currentPool = pools.find((pool) =>
    pool.registrations?.some(
      (registration) => registration.user?.id === currentUser?.id,
    ),
  );

  let currentRegistration;
  let currentRegistrationIndex;

  if (currentPool) {
    currentRegistrationIndex = currentPool.registrations.findIndex(
      (registration) => registration.user?.id === currentUser?.id,
    );
    currentRegistration = currentPool.registrations[currentRegistrationIndex];
  }

  const hasSimpleWaitingList = poolsWithRegistrations.length <= 1;
  const pendingRegistration = useAppSelector(
    (state) =>
      currentUser &&
      selectRegistrationForEventByUserId(state, {
        eventId,
        userId: currentUser.id,
      }),
  );

  const navigate = useNavigate();
  useEffect(() => {
    if (event?.slug && event?.slug !== eventIdOrSlug) {
      navigate(`/events/${event.slug}`, { replace: true });
    }
  }, [event?.slug, navigate, eventIdOrSlug]);

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchEventDetail',
    () => eventIdOrSlug && dispatch(fetchEvent(eventIdOrSlug)),
    [eventIdOrSlug, loggedIn],
  );

  const color = colorForEventType(event.eventType);

  const onRegisterClick = event.following
    ? () => dispatch(unfollow(event.following as number, event.id))
    : () => dispatch(follow(currentUser.id, event.id));

  const currentMoment = moment();

  const activationTimeMoment = moment(event.activationTime);

  // Get the actual activation time.
  // The time from LEGO is with penalties applied.
  // This "unapplies" the penalties again
  const eventRegistrationTime = event.heedPenalties
    ? activationTimeMoment.subtract(penaltyHours(penalties), 'hours')
    : activationTimeMoment;

  const registrationCloseTimeMoment = registrationCloseTime(event);

  // The UserGrid is expanded when there's less than 5 minutes till activation
  const minUserGridRows = currentMoment.isAfter(
    moment(activationTimeMoment).subtract(5, 'minutes'),
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
              iconRight
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
                  Etter påmeldingen stenger er det hverken mulig å melde seg på
                  eller av arrangementet
                </>
              }
              iconRight
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
            <FormatTime format="dd DD. MMM HH:mm" time={event.paymentDueDate} />
          ),
        }
      : null,
  ];

  const groupLink =
    event.responsibleGroup && resolveGroupLink(event.responsibleGroup);

  const responsibleGroupName = groupLink ? (
    <Link to={groupLink}>{event.responsibleGroup?.name}</Link>
  ) : (
    event.responsibleGroup?.name
  );

  const eventCreator = [
    // Responsible group
    event.responsibleGroup && {
      key: 'Arrangør',
      value: event.responsibleGroup.contactEmail ? (
        <Tooltip
          content={
            <span>
              {event.responsibleGroup.contactEmail && (
                <a href={`mailto:${event.responsibleGroup.contactEmail}`}>
                  {event.responsibleGroup.contactEmail}
                </a>
              )}
            </span>
          }
        >
          {responsibleGroupName}
        </Tooltip>
      ) : (
        responsibleGroupName
      ),
    },
    // Responsible users, author or anonymous
    ...(event.responsibleUsers && event.responsibleUsers.length > 0
      ? [
          {
            key:
              event.responsibleUsers.length > 1
                ? 'Kontaktpersoner'
                : 'Kontaktperson',
            value: (
              <ul>
                {event.responsibleUsers.map((user) => (
                  <li key={user.id}>
                    <Link to={`/users/${user.username}`} key={user.username}>
                      {user.fullName}
                    </Link>
                  </li>
                ))}
              </ul>
            ),
          },
        ]
      : event.createdBy
        ? [
            {
              key: 'Forfatter',
              value: (
                <Link to={`/users/${event.createdBy.username}`}>
                  {event.createdBy.fullName}
                </Link>
              ),
            },
          ]
        : [
            {
              key: 'Forfatter',
              value: 'Anonym',
            },
          ]),
  ].filter(Boolean); // This will remove any undefined items from the array

  return (
    <Content
      banner={event.cover || event.company?.logo}
      bannerPlaceholder={
        event.coverPlaceholder || event.company?.logoPlaceholder
      }
      youtubeUrl={event.youtubeUrl}
      skeleton={showSkeleton}
    >
      <PropertyHelmet propertyGenerator={propertyGenerator} options={{ event }}>
        <title>{event.title}</title>
        <link rel="canonical" href={`${config?.webUrl}/events/${event.id}`} />
      </PropertyHelmet>

      <ContentHeader
        borderColor={color}
        onClick={loggedIn ? onRegisterClick : undefined}
        className={styles.title}
        event={event}
      >
        <Flex alignItems="center" gap="var(--spacing-md)">
          {loggedIn && <InterestedButton isInterested={!!event.following} />}
          {showSkeleton ? (
            <Skeleton className={styles.header} />
          ) : (
            <h2 className={styles.header}>{event.title}</h2>
          )}
        </Flex>
      </ContentHeader>

      <ContentSection>
        <ContentMain>
          <DisplayContent content={event.text} skeleton={showSkeleton} />
          <Flex className={styles.tagRow}>
            {event.tags?.map((tag, i) => <Tag key={i} tag={tag} />)}
          </Flex>
        </ContentMain>

        <ContentSidebar>
          {showSkeleton ? (
            <Flex column gap="var(--spacing-sm)">
              <Skeleton array={3} className={styles.sidebarInfo} />
            </Flex>
          ) : (
            <Flex column gap="var(--spacing-sm)">
              {event.company && (
                <TextWithIcon
                  iconName="briefcase-outline"
                  content={
                    <Link to={`/companies/${event.company.id}`}>
                      {event.company.name}
                    </Link>
                  }
                  className={styles.sidebarInfo}
                />
              )}

              <TextWithIcon
                iconName="time-outline"
                content={
                  <FromToTime from={event.startTime} to={event.endTime} />
                }
                className={styles.sidebarInfo}
              />

              {event.isForeignLanguage !== null && event.isForeignLanguage && (
                <TextWithIcon
                  iconName="language-outline"
                  content="English"
                  className={styles.sidebarInfo}
                />
              )}

              <TextWithIcon
                iconName="location-outline"
                content={event.location}
                className={styles.sidebarInfo}
              />

              {event.mazemapPoi && (
                <Button
                  className={styles.mapButton}
                  onClick={() => setMapIsOpen(!mapIsOpen)}
                >
                  <img
                    className={styles.mazemapImg}
                    alt="MazeMap-logo"
                    src={mazemapLogo}
                  />
                  {mapIsOpen ? 'Skjul kart' : 'Vis kart'}
                </Button>
              )}

              {event.isPriced && (
                <TextWithIcon
                  iconName="cash-outline"
                  content={event.priceMember / 100 + ',-'}
                  className={styles.sidebarInfo}
                />
              )}
            </Flex>
          )}

          {event.mazemapPoi && (
            <>{mapIsOpen && <MazemapEmbed mazemapPoi={event.mazemapPoi} />}</>
          )}

          {['OPEN', 'TBA'].includes(event.eventStatusType) ? (
            <JoinEventForm event={event} />
          ) : (
            <Flex column>
              <h3>Påmeldte</h3>

              <UserGrid
                minRows={minUserGridRows}
                maxRows={MAX_USER_GRID_ROWS}
                users={registrations?.slice(0, 14).map((reg) => reg.user)}
                skeleton={fetching && !registrations}
              />

              <AttendanceModal key="modal" pools={pools} title="Påmeldte">
                {({ toggleModal }) => (
                  <>
                    <RegisteredSummary
                      toggleModal={toggleModal}
                      registrations={loggedIn && registrations}
                      currentRegistration={currentRegistration}
                      skeleton={fetching && !registrations}
                    />
                    <AttendanceStatus
                      toggleModal={toggleModal}
                      pools={pools}
                      legacyRegistrationCount={event.legacyRegistrationCount}
                      skeleton={fetching && !registrations}
                    />
                  </>
                )}
              </AttendanceModal>

              {loggedIn && (
                <RegistrationMeta
                  useConsent={event.useConsent}
                  hasOpened={moment(event.activationTime).isBefore(
                    currentMoment,
                  )}
                  photoConsents={event.photoConsents}
                  eventSemester={getEventSemesterFromStartTime(event.startTime)}
                  hasEnded={moment(event.endTime).isBefore(currentMoment)}
                  registration={currentRegistration}
                  isPriced={event.isPriced}
                  registrationIndex={currentRegistrationIndex}
                  hasSimpleWaitingList={hasSimpleWaitingList}
                  skeleton={showSkeleton}
                />
              )}

              {'unansweredSurveys' in event &&
              event.unansweredSurveys?.length > 0 &&
              !event.isAdmitted ? (
                <Card severity="danger">
                  <p>
                    Du kan ikke melde deg på dette arrangementet fordi du har
                    ubesvarte spørreundersøkelser. Gå til lenkene under for å
                    svare:
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
                </Card>
              ) : (
                !showSkeleton && (
                  <JoinEventForm
                    event={event}
                    registration={currentRegistration}
                    pendingRegistration={pendingRegistration}
                  />
                )
              )}
            </Flex>
          )}

          {showSkeleton ? (
            <>
              <Line />
              <Flex column gap="var(--spacing-sm)">
                <Skeleton array={2} className={styles.sidebarInfo} />
              </Flex>
            </>
          ) : (
            deadlines.some((d) => d !== null) && (
              <>
                <Line />
                <InfoList className={styles.infoList} items={deadlines} />
              </>
            )
          )}

          <Line />

          {showSkeleton ? (
            <Flex column gap="var(--spacing-sm)">
              <Flex gap="var(--spacing-md)" className={styles.sidebarInfo}>
                Arrangør
                <Skeleton className={styles.sidebarInfo} />
              </Flex>
              <Flex gap="var(--spacing-md)" className={styles.sidebarInfo}>
                Forfatter
                <Skeleton className={styles.sidebarInfo} />
              </Flex>
            </Flex>
          ) : (
            <InfoList items={eventCreator} className={styles.infoList} />
          )}

          <Line />

          {loggedIn && (
            <TextWithIcon
              iconName="create-outline"
              content={
                <Link to={`/users/${currentUser?.username}/settings/profile`}>
                  Oppdater matallergier / preferanser
                </Link>
              }
            />
          )}

          {(actionGrant.includes('edit') || actionGrant.includes('delete')) && (
            <Line />
          )}

          <Admin actionGrant={actionGrant} event={event} />
        </ContentSidebar>
      </ContentSection>

      {event.contentTarget && (
        <CommentView
          style={{
            marginTop: 20,
          }}
          contentTarget={event.contentTarget}
          comments={comments}
          contentAuthors={event.createdBy?.id}
        />
      )}
    </Content>
  );
};

export default EventDetail;
