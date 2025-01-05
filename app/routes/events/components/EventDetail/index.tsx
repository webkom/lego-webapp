import { Flex, Page, Skeleton } from '@webkom/lego-bricks';
import { isEmpty } from 'lodash';
import { FilePenLine } from 'lucide-react';
import moment from 'moment-timezone';
import { useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useEventByIdOrSlug } from 'app/actions/EventActions';
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
import config from 'app/config';
import { useCurrentUser, useIsLoggedIn } from 'app/reducers/auth';
import { selectCommentsByIds } from 'app/reducers/comments';
import { AttendeeSection } from 'app/routes/events/components/EventDetail/AttendeeSection';
import { InterestedButton } from 'app/routes/events/components/EventDetail/InterestedButton';
import { SidebarInfo } from 'app/routes/events/components/EventDetail/SidebarInfo';
import { UnansweredSurveys } from 'app/routes/events/components/EventDetail/UnansweredSurveys';
import {
  useDeadlineInfoList,
  useEventCreatorInfoList,
} from 'app/routes/events/components/EventDetail/infoLists';
import { usePools } from 'app/routes/events/components/EventDetail/usePools';
import {
  colorForEventType,
  displayNameForEventType,
} from 'app/routes/events/utils';
import YoutubeCover from 'app/routes/pages/components/YoutubeCover';
import { useAppSelector } from 'app/store/hooks';
import Admin from '../Admin';
import JoinEventForm from '../JoinEventForm';
import styles from './EventDetail.module.css';
import type { PropertyGenerator } from 'app/components/PropertyHelmet';
import type { PoolWithRegistrations } from 'app/reducers/events';
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
  const { data: event, loading: fetching } = useEventByIdOrSlug(eventIdOrSlug);
  const showSkeleton = fetching && isEmpty(event);
  const actionGrant = event?.actionGrant || [];

  const loggedIn = useIsLoggedIn();
  const currentUser = useCurrentUser();

  const comments = useAppSelector((state) =>
    selectCommentsByIds(state, event?.comments),
  );

  const hasRegistrationAccess = Boolean(
    event && 'waitingRegistrations' in event,
  );
  const pools = usePools(hasRegistrationAccess, event);

  const currentPool = pools.find(
    (pool) =>
      'registrations' in pool &&
      pool.registrations?.some(
        (registration) => registration.user?.id === currentUser?.id,
      ),
  ) as PoolWithRegistrations | undefined;

  const currentRegistration = currentPool?.registrations.find(
    (registration) => registration.user?.id === currentUser?.id,
  );

  const navigate = useNavigate();
  useEffect(() => {
    if (event?.slug && event?.slug !== eventIdOrSlug) {
      navigate(`/events/${event.slug}`, { replace: true });
    }
  }, [event?.slug, navigate, eventIdOrSlug]);

  const color = colorForEventType(event?.eventType);

  const deadlinesInfoList = useDeadlineInfoList(event);
  const eventCreatorInfoList = useEventCreatorInfoList(event);

  const fiveMinutesBeforeActivation = moment().isAfter(
    moment(event?.activationTime).subtract(5, 'minutes'),
  );

  return (
    <Page
      cover={
        <YoutubeCover
          image={event?.cover || event?.company?.logo}
          imagePlaceholder={
            event?.coverPlaceholder || event?.company?.logoPlaceholder
          }
          youtubeUrl={event?.youtubeUrl}
          skeleton={
            fetching &&
            !(event?.cover || event?.company?.logo || event?.youtubeUrl)
          }
        />
      }
      title={
        event && (
          <Flex alignItems="center" gap="var(--spacing-sm)">
            {loggedIn && <InterestedButton event={event} />}
            {event.title}
          </Flex>
        )
      }
      actionButtons={
        event && (
          <div className={styles.eventType}>
            <strong
              style={{
                color,
              }}
            >
              {displayNameForEventType(event.eventType)}
            </strong>
          </div>
        )
      }
      skeleton={!event}
      dividerColor={color}
    >
      {event && (
        <PropertyHelmet
          propertyGenerator={propertyGenerator}
          options={{ event }}
        >
          <title>{event.title}</title>
          <link rel="canonical" href={`${config?.webUrl}/events/${event.id}`} />
        </PropertyHelmet>
      )}

      <ContentSection>
        <ContentMain>
          <DisplayContent
            content={event?.text || ''}
            skeleton={fetching && !event?.text}
          />
          {event?.tags && event.tags.length > 0 && (
            <Flex className={styles.tagRow}>
              {event.tags.map((tag, i) => (
                <Tag key={i} tag={tag} />
              ))}
            </Flex>
          )}
        </ContentMain>

        <ContentSidebar>
          <SidebarInfo event={event} />

          {event && ['OPEN', 'TBA'].includes(event.eventStatusType) ? (
            <JoinEventForm event={event} />
          ) : (
            <>
              {(fetching || hasRegistrationAccess) && (
                <AttendeeSection
                  showSkeleton={fetching}
                  event={event}
                  currentRegistration={currentRegistration}
                  pools={pools as PoolWithRegistrations[]}
                  currentPool={currentPool}
                  fiveMinutesBeforeActivation={fiveMinutesBeforeActivation}
                />
              )}

              {event &&
              'unansweredSurveys' in event &&
              event.unansweredSurveys?.length > 0 &&
              !event.isAdmitted ? (
                <UnansweredSurveys
                  event={event}
                  currentRegistration={currentRegistration}
                />
              ) : (
                !showSkeleton &&
                event && (
                  <JoinEventForm
                    event={event}
                    registration={currentRegistration}
                    fiveMinutesBeforeActivation={fiveMinutesBeforeActivation}
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
            !!deadlinesInfoList.length && (
              <>
                <Line />
                <InfoList
                  className={styles.infoList}
                  items={deadlinesInfoList}
                />
              </>
            )
          )}

          <Line />

          {fetching && !event?.createdBy && !event?.responsibleUsers ? (
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
            <InfoList
              items={eventCreatorInfoList}
              className={styles.infoList}
            />
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

          {event && <Admin actionGrant={actionGrant} event={event} />}
        </ContentSidebar>
      </ContentSection>

      {event?.contentTarget && (
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
