import { Flex, Skeleton } from '@webkom/lego-bricks';
import moment from 'moment-timezone';
import { Link } from 'react-router-dom';
import Time from 'app/components/Time';
import Tooltip from 'app/components/Tooltip';
import { selectEvents } from 'app/reducers/events';
import { eventListDefaultQuery } from 'app/routes/events/components/EventList';
import { colorForEventType } from 'app/routes/events/utils';
import { useAppSelector } from 'app/store/hooks';
import { EventType } from 'app/store/models/Event';
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
  const events = useAppSelector(selectEvents) as unknown as FrontpageEvent[];

  const eventsToShow = events
    .filter((event) => moment(event.endTime).isAfter())
    .sort((a, b) => moment(a.startTime).diff(moment(b.startTime)));

  const mapEvents = (eventTypes: EventType[]) => {
    return eventsToShow
      .filter((event) => eventTypes.includes(event.eventType))
      .slice(0, EVENT_COLUMN_LIMIT)
      .map((event, key) => (
        <li key={key} className={styles.eventItem}>
          <span
            style={{
              color: colorForEventType(event.eventType),
              fontSize: '15px',
              lineHeight: '0',
              marginRight: '10px',
            }}
          >
            <i className="fa fa-circle" />
          </span>
          <Link to={`/events/${event.slug}`}>{event.title}</Link>
          {event.pinned && (
            <Tooltip content="Dette arrangementet er festet til forsiden">
              <i
                className="fa fa-thumb-tack"
                style={{
                  transform: 'rotate(-20deg)',
                  marginRight: '4px',
                  color: 'var(--lego-red-color)',
                }}
              />
            </Tooltip>
          )}
          <Time
            format="dd D.MM"
            time={event.startTime}
            style={{
              flex: '0 1 0',
            }}
          />
        </li>
      ));
  };

  const presentations = mapEvents([
    EventType.COMPANY_PRESENTATION,
    EventType.LUNCH_PRESENTATION,
    EventType.ALTERNATIVE_PRESENTATION,
    EventType.COURSE,
    EventType.BREAKFAST_TALK,
    EventType.KiD_EVENT,
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
      <Flex wrap className={styles.compactEvents}>
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
          <Flex column gap="5px">
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
          <Flex column gap="5px">
            {fetching && !other.length ? skeleton : rightEvents}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default CompactEvents;
