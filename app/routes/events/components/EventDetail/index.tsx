import { Flex, Page, Skeleton } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { isEmpty } from 'lodash';
import { CircleHelp, FilePenLine } from 'lucide-react';
import moment from 'moment-timezone';
import { useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { fetchEvent } from 'app/actions/EventActions';
import CommentView from 'app/components/Comments/CommentView';
import {
  ContentSection,
  ContentMain,
  ContentSidebar,
} from 'app/components/Content';
import DisplayContent from 'app/components/DisplayContent';
import InfoList from 'app/components/InfoList';
import PropertyHelmet from 'app/components/PropertyHelmet';
import Tag from 'app/components/Tags/Tag';
import TextWithIcon from 'app/components/TextWithIcon';
import { FormatTime } from 'app/components/Time';
import Tooltip from 'app/components/Tooltip';
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
  selectWaitingRegistrationsForEvent,
} from 'app/reducers/events';
import { resolveGroupLink } from 'app/reducers/groups';
import { selectPenaltyByUserId } from 'app/reducers/penalties';
import { selectUserWithGroups } from 'app/reducers/users';
import { AttendeeSection } from 'app/routes/events/components/EventDetail/AttendeeSection';
import { InterestedButton } from 'app/routes/events/components/EventDetail/InterestedButton';
import { SidebarInfo } from 'app/routes/events/components/EventDetail/SidebarInfo';
import { UnansweredSurveys } from 'app/routes/events/components/EventDetail/UnansweredSurveys';
import {
  colorForEventType,
  penaltyHours,
  registrationCloseTime,
  displayNameForEventType,
} from 'app/routes/events/utils';
import YoutubeCover from 'app/routes/pages/components/YoutubeCover';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import Admin from '../Admin';
import JoinEventForm from '../JoinEventForm';
import styles from './EventDetail.css';
import type { PropertyGenerator } from 'app/components/PropertyHelmet';
import type {
  AuthUserDetailedEvent,
  UserDetailedEvent,
} from 'app/store/models/Event';

const Line = () => <div className={styles.line} />;

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
  const { eventIdOrSlug } = useParams<{ eventIdOrSlug: string }>();
  const event = useAppSelector((state) =>
    selectEventByIdOrSlug(state, { eventIdOrSlug }),
  ) as AuthUserDetailedEvent | UserDetailedEvent;
  const eventId = event?.id;
  const fetching = useAppSelector((state) => state.events.fetching);
  const showSkeleton = fetching && isEmpty(event);
  const actionGrant = event?.actionGrant || [];
  const hasFullAccess = Boolean('waitingRegistrations' in event);

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

  const currentRegistration = currentPool?.registrations.find(
    (registration) => registration.user?.id === currentUser?.id,
  );

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

  const currentMoment = moment();

  const activationTimeMoment = moment(event.activationTime);

  // Get the actual activation time.
  // The time from LEGO is with penalties applied.
  // This "unapplies" the penalties again
  const eventRegistrationTime = event.heedPenalties
    ? activationTimeMoment.subtract(penaltyHours(penalties), 'hours')
    : activationTimeMoment;

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
            <TextWithIcon
              iconNode={<CircleHelp />}
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
              size={14}
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
              iconNode={<CircleHelp />}
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
              size={14}
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
    <Page
      cover={
        <YoutubeCover
          image={event.cover || event.company?.logo}
          imagePlaceholder={
            event.coverPlaceholder || event.company?.logoPlaceholder
          }
          youtubeUrl={event.youtubeUrl}
          skeleton={showSkeleton}
        />
      }
      title={
        <Flex alignItems="center" gap="var(--spacing-sm)">
          {loggedIn && <InterestedButton event={event} />}
          {event.title}
        </Flex>
      }
      actionButtons={
        <div className={styles.eventType}>
          <strong
            style={{
              color,
            }}
          >
            {displayNameForEventType(event.eventType)}
          </strong>
        </div>
      }
      skeleton={showSkeleton}
      dividerColor={color}
    >
      <PropertyHelmet propertyGenerator={propertyGenerator} options={{ event }}>
        <title>{event.title}</title>
        <link rel="canonical" href={`${config?.webUrl}/events/${event.id}`} />
      </PropertyHelmet>

      <ContentSection>
        <ContentMain>
          <DisplayContent content={event.text} skeleton={showSkeleton} />
          <Flex className={styles.tagRow}>
            {event.tags?.map((tag, i) => <Tag key={i} tag={tag} />)}
          </Flex>
        </ContentMain>

        <ContentSidebar>
          <SidebarInfo showSkeleton={showSkeleton} event={event} />

          {['OPEN', 'TBA'].includes(event.eventStatusType) ? (
            <JoinEventForm event={event} />
          ) : (
            <>
              <AttendeeSection
                showSkeleton={showSkeleton}
                event={event}
                currentRegistration={currentRegistration}
                pools={pools}
                currentPool={currentPool}
              />

              {'unansweredSurveys' in event &&
              event.unansweredSurveys?.length > 0 &&
              !event.isAdmitted ? (
                <UnansweredSurveys
                  event={event}
                  currentRegistration={currentRegistration}
                />
              ) : (
                !showSkeleton && (
                  <JoinEventForm
                    event={event}
                    registration={currentRegistration}
                    pendingRegistration={pendingRegistration}
                  />
                )
              )}
            </>
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
              iconNode={<FilePenLine />}
              size={20}
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
    </Page>
  );
};

export default EventDetail;
