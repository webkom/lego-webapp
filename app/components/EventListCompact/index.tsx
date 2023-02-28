import EmptyState from 'app/components/EmptyState';
import EventItem, { type EventStyle } from 'app/components/EventItem';
import { Flex } from 'app/components/Layout';
import LoadingIndicator from 'app/components/LoadingIndicator';
import type { Event } from 'app/models';
import styles from './EventListCompact.css';

type Props = {
  events: Array<Event>;
  noEventsMessage: string;
  eventStyle?: EventStyle;
  loading?: boolean;
};

const EventListCompact = ({
  events,
  noEventsMessage,
  eventStyle = 'default',
  loading,
}: Props) => {
  if (loading) {
    return <LoadingIndicator margin="20px auto" loading />;
  }
  return events && events.length ? (
    <Flex column wrap>
      {events.map((event) => (
        <EventItem
          key={event.id}
          event={event}
          showTags={false}
          eventStyle={eventStyle}
        />
      ))}
    </Flex>
  ) : (
    <EmptyState className={styles.noEventsMessage}>
      {noEventsMessage}
    </EmptyState>
  );
};
export default EventListCompact;
