import { Flex, Icon, Skeleton } from '@webkom/lego-bricks';
import moment from 'moment-timezone';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EmptyState from 'app/components/EmptyState';
import Tooltip from 'app/components/Tooltip';
import { selectEvents } from 'app/reducers/events';
import { colorForEventType } from 'app/routes/events/utils';
import { useAppSelector } from 'app/store/hooks';
import truncateString from 'app/utils/truncateString';
import styles from './UpcomingRegistrations.css';
import type { FrontpageEvent } from 'app/store/models/Event';

const createTimeString = (event: FrontpageEvent) => {
  const time = moment(event.activationTime);
  // If it's 1 day left we would like to say 'i morgen' and not 1 day
  if (moment().add('1', 'day').isSame(time, 'day')) {
    return 'i morgen';
  }

  let timeString = '';
  if (moment().isAfter(time)) {
    timeString += 'for ';
  }
  timeString += time.fromNow();
  return timeString.replace('minutter', 'min').replace('sekunder', 'sek');
};

type Props = {
  event: FrontpageEvent;
};
const UpcomingRegistration = ({ event }: Props) => {
  const [timeString, setTimeString] = useState(createTimeString(event));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeString(createTimeString(event));
    }, 1000);
    return () => clearInterval(interval);
  }, [event]);

  const activeString = moment(event.activationTime).format('LLLL');

  return (
    <Tooltip content={`Påmelding: ${activeString}`}>
      <Link to={`/events/${event.slug}`}>
        <Flex
          column
          style={{
            borderColor: colorForEventType(event.eventType),
          }}
          className={styles.eventItem}
        >
          <h4 className={styles.title}>{truncateString(event.title, 43)}</h4>
          <Flex
            alignItems="center"
            gap="var(--spacing-sm)"
            className={styles.info}
          >
            <Icon name="alarm-outline" size={20} />
            <div>
              <span>
                Påmelding
                {moment().isBefore(event.activationTime) ? ' åpner' : ' åpnet'}
              </span>
              <span className={styles.time}>{timeString}</span>
            </div>
          </Flex>
        </Flex>
      </Link>
    </Tooltip>
  );
};

// Filter for activation
const hasActivation = (event: FrontpageEvent) => event.activationTime !== null;

// Filter for range
const inRange = (event: FrontpageEvent) => {
  const start = moment(event && event.activationTime);
  return (
    // Check that the date is within 3 days
    start.isSameOrBefore(moment().add(3, 'days'), 'day') && // Check that the date is the same day
    start.isSameOrAfter(moment(), 'day')
  );
};

const UPCOMING_REGISTRATIONS_LIMIT = 2;

const UpcomingRegistrations = () => {
  const events = useAppSelector(selectEvents) as unknown as FrontpageEvent[];

  // Sorted events based on activationTime, take out the
  // ones that are out of range
  const orderedEvents = events
    .filter(hasActivation)
    .filter(inRange)
    .sort((a, b) => moment(a.activationTime).diff(moment(b.activationTime)))
    .splice(0, UPCOMING_REGISTRATIONS_LIMIT);

  const fetching = useAppSelector(
    (state) => state.frontpage.fetching || state.events.fetching,
  );

  return (
    <div className={styles.wrapper}>
      {fetching && !events.length ? (
        <Skeleton
          array={UPCOMING_REGISTRATIONS_LIMIT}
          className={styles.eventItem}
        />
      ) : orderedEvents.length > 0 ? (
        orderedEvents.map((event) => (
          <UpcomingRegistration key={event.id} event={event} />
        ))
      ) : (
        <EmptyState icon="leaf-outline" className={styles.filler}>
          Ingen påmeldinger de neste 3 dagene
        </EmptyState>
      )}
    </div>
  );
};

export default UpcomingRegistrations;
