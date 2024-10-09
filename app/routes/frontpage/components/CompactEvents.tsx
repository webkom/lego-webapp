import { Flex, Icon, Skeleton } from '@webkom/lego-bricks';
import { Pin } from 'lucide-react';
import moment from 'moment-timezone';
import { Link } from 'react-router-dom';
import Circle from 'app/components/Circle';
import Time from 'app/components/Time';
import Tooltip from 'app/components/Tooltip';
import { selectAllEvents } from 'app/reducers/events';
import { eventListDefaultQuery } from 'app/routes/events/components/EventList';
import { colorForEventType } from 'app/routes/events/utils';
import { useAppSelector } from 'app/store/hooks';
import { EventType } from 'app/store/models/Event';
import truncateString from 'app/utils/truncateString';
import { stringifyQuery } from 'app/utils/useQuery';
import styles from './CompactEvents.css';
import type { FrontpageEvent } from 'app/store/models/Event';
import type { CSSProperties } from 'react';

type Props = {
  className?: string;
  style?: CSSProperties;
};

const EVENT_COLUMN_LIMIT = 5;

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
        <Link
          key={key}
          to={`/events/${event.slug}`}
          className={styles.eventItem}
        >
          <Flex
            alignItems="center"
            justifyContent="space-between"
            gap="var(--spacing-md)"
          >
            <Flex alignItems="center" gap="var(--spacing-sm)">
              <Circle
                size="var(--font-size-xs)"
                color={colorForEventType(event.eventType)}
              />
              <span>{truncateString(event.title, 27)}</span>
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
        </Link>
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
  const leftEvents =
    presentations.length > 0 ? presentations : ['Ingen presentasjoner'];
  const other = mapEvents([
    EventType.OTHER,
    EventType.EVENT,
    EventType.SOCIAL,
    EventType.PARTY,
  ]);
  const rightEvents = other.length > 0 ? other : ['Ingen arrangementer'];

  const fetching = useAppSelector(
    (state) => state.frontpage.fetching || state.events.fetching,
  );

  const skeleton = (
    <Skeleton array={EVENT_COLUMN_LIMIT} className={styles.eventItem} />
  );

  return (
    <Flex column className={className} style={style}>
      <Flex className={styles.compactEvents}>
        <Flex column className={styles.compactLeft}>
          <Link
            to={{
              pathname: '/events',
              search: stringifyQuery(
                {
                  eventTypes: ['company_presentation', 'course'],
                },
                eventListDefaultQuery,
              ),
            }}
          >
            <h3 className="u-ui-heading">Bedpres og kurs</h3>
          </Link>
          <Flex column gap="var(--spacing-xs)">
            {fetching && !presentations.length ? skeleton : leftEvents}
          </Flex>
        </Flex>
        <Flex column className={styles.compactRight}>
          <Link
            to={{
              pathname: '/events',
              search: stringifyQuery(
                {
                  eventTypes: ['social', 'other'],
                },
                eventListDefaultQuery,
              ),
            }}
          >
            <h3 className="u-ui-heading">Arrangementer</h3>
          </Link>
          <Flex column gap="var(--spacing-xs)">
            {fetching && !other.length ? skeleton : rightEvents}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default CompactEvents;
