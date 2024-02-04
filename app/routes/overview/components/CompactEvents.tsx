import { Flex, Skeleton } from '@webkom/lego-bricks';
import moment from 'moment-timezone';
import { Link } from 'react-router-dom';
import Time from 'app/components/Time';
import Tooltip from 'app/components/Tooltip';
import { eventListDefaultQuery } from 'app/routes/events/components/EventList';
import { colorForEventType } from 'app/routes/events/utils';
import { useAppSelector } from 'app/store/hooks';
import { stringifyQuery } from 'app/utils/useQuery';
import styles from './CompactEvents.css';
import type { FrontpageEvent } from 'app/store/models/Event';
import type { CSSProperties } from 'react';

type Props = {
  events: FrontpageEvent[];
  style?: CSSProperties;
};

const EVENT_COLUMN_LIMIT = 5;

const CompactEvents = ({ events, style }: Props) => {
  const mapEvents = (eventTypes) => {
    return events
      .filter(
        (event) =>
          moment(event.endTime).isAfter() &&
          eventTypes.includes(event.eventType)
      )
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
    'company_presentation',
    'lunch_presentation',
    'alternative_presentation',
    'course',
    'breakfast_talk',
    'kid_event',
  ]);
  const leftEvents =
    presentations.length > 0 ? presentations : ['Ingen presentasjoner'];
  const other = mapEvents(['other', 'event', 'social', 'party']);
  const rightEvents = other.length > 0 ? other : ['Ingen arrangementer'];

  const fetching = useAppSelector(
    (state) => state.frontpage.fetching || state.events.fetching
  );

  const skeleton = [...Array(EVENT_COLUMN_LIMIT)].map((i) => (
    <Skeleton key={i} className={styles.eventItem} />
  ));

  return (
    <Flex column style={style}>
      <Flex wrap className={styles.compactEvents}>
        <Flex column className={styles.compactLeft}>
          <Link
            to={{
              pathname: '/events',
              search: stringifyQuery(
                {
                  eventTypes: ['company_presentation', 'course'],
                },
                eventListDefaultQuery
              ),
            }}
          >
            <h3 className="u-ui-heading">Bedpres og kurs</h3>
          </Link>
          <Flex column gap="5px">
            {fetching && !events.length ? skeleton : leftEvents}
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
                eventListDefaultQuery
              ),
            }}
          >
            <h3 className="u-ui-heading">Arrangementer</h3>
          </Link>
          <Flex column gap="5px">
            {fetching && !events.length ? skeleton : rightEvents}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default CompactEvents;
