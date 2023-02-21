import type { Event } from 'app/models';
import EmptyState from '../EmptyState';
import EventItem, { type EventStyle } from '../EventItem';
import { Flex } from '../Layout';
import styles from './EventListCompact.css';

type Props = {
  events: Array<Event>;
  noEventsMessage: string;
  loggedIn: boolean;
  eventStyle?: EventStyle;
};

const EventListCompact = ({
  events,
  noEventsMessage,
  loggedIn,
  eventStyle = 'default',
}: Props) => (
  <>
    {events && events.length ? (
      <Flex column wrap>
        {events.map((event) => (
          <EventItem
            key={event.id}
            event={event}
            showTags={false}
            loggedIn={loggedIn}
            eventStyle={eventStyle}
          />
        ))}
      </Flex>
    ) : (
      <EmptyState>
        <h2 className={styles.emptyState}>{noEventsMessage}</h2>
      </EmptyState>
    )}
  </>
);

export default EventListCompact;
