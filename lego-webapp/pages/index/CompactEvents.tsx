import { Flex, Icon, Skeleton, Tooltip } from '@webkom/lego-bricks';
import { Pin } from 'lucide-react';
import moment from 'moment-timezone';
import Circle from '~/components/Circle';
import EmptyState from '~/components/EmptyState';
import Time from '~/components/Time';
import { eventListDefaultQuery } from '~/pages/events/index/+Layout';
import { colorForEventType } from '~/pages/events/utils';
import { useAppSelector } from '~/redux/hooks';
import { EventType } from '~/redux/models/Event';
import { selectAllEvents } from '~/redux/slices/events';
import utilStyles from '~/styles/utilities.module.css';
import { stringifyQuery } from '~/utils/useQuery';
import styles from './CompactEvents.module.css';
import type { CSSProperties } from 'react';
import type { FrontpageEvent } from '~/redux/models/Event';

type Props = {
  className?: string;
  style?: CSSProperties;
};

const EVENT_COLUMN_LIMIT = 5;

const EventItemSkeleton = ({ events }: { events: number }) => (
  <Skeleton array={EVENT_COLUMN_LIMIT - events} className={styles.eventItem} />
);

const CompactEvents = ({ className, style }: Props) => {
  const events = useAppSelector(selectAllEvents<FrontpageEvent>);

  const eventsToShow = events
    .filter((event) => moment(event.endTime).isAfter())
    .sort((a, b) => moment(a.startTime).diff(moment(b.startTime)));

  const mapEvents = (eventTypes: EventType[]) => {
    return eventsToShow
      .filter((event) => eventTypes.includes(event.eventType))
      .slice(0, EVENT_COLUMN_LIMIT)
      .map((event, key) => (
        <a
          key={key}
          href={`/events/${event.slug}`}
          className={styles.eventItem}
        >
          <Flex
            alignItems="center"
            justifyContent="space-between"
            gap="var(--spacing-sm)"
          >
            <Flex alignItems="center" gap="var(--spacing-sm)">
              <Circle
                size="var(--font-size-xs)"
                color={colorForEventType(event.eventType)}
              />
              <span className={styles.eventItemTitle}>{event.title}</span>
            </Flex>
            <Flex alignItems="center" gap="var(--spacing-xs)">
              {event.pinned && (
                <Tooltip content="Dette arrangementet er festet til forsiden">
                  <Icon
                    iconNode={<Pin />}
                    size={16}
                    className={styles.pinned}
                  />
                </Tooltip>
              )}
              <Time format="dd D. MMM" time={event.startTime} />
            </Flex>
          </Flex>
        </a>
      ));
  };

  const presentations = mapEvents([
    EventType.COMPANY_PRESENTATION,
    EventType.LUNCH_PRESENTATION,
    EventType.ALTERNATIVE_PRESENTATION,
    EventType.COURSE,
    EventType.BREAKFAST_TALK,
    EventType.NEXUS_EVENT,
  ]);
  const other = mapEvents([
    EventType.OTHER,
    EventType.EVENT,
    EventType.SOCIAL,
    EventType.PARTY,
  ]);

  const fetching = useAppSelector(
    (state) => state.frontpage.fetching || state.events.fetching,
  );

  return (
    <Flex column className={className} style={style}>
      <Flex className={styles.compactEvents}>
        <Flex column className={styles.compactLeft}>
          <a
            href={`/events${stringifyQuery({ eventTypes: ['company_presentation', 'course'] }, eventListDefaultQuery)}`}
          >
            <h3 className={utilStyles.frontPageHeader}>Bedpres og kurs</h3>
          </a>
          <Flex column gap="var(--spacing-xs)">
            {presentations
              ? presentations
              : !fetching && <EmptyState body="Ingen presentasjoner" />}
            {fetching && <EventItemSkeleton events={presentations.length} />}
          </Flex>
        </Flex>
        <Flex column className={styles.compactRight}>
          <a
            href={`/events${stringifyQuery({ eventTypes: ['social', 'other'] }, eventListDefaultQuery)}`}
          >
            <h3 className={utilStyles.frontPageHeader}>Sosialt</h3>
          </a>
          <Flex column gap="var(--spacing-xs)">
            {other
              ? other
              : !fetching && <EmptyState body="Ingen arrangementer" />}
            {fetching && <EventItemSkeleton events={other.length} />}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default CompactEvents;
