import { Flex, Skeleton } from '@webkom/lego-bricks';
import EmptyState from 'app/components/EmptyState';
import EventItem, { type EventStyle } from 'app/components/EventItem';
import styles from 'app/components/EventItem/styles.css';
import type { ListEvent } from 'app/store/models/Event';

type Props = {
  events: ListEvent[];
  noEventsMessage: string;
  eventStyle?: EventStyle;
  loading?: boolean;
  extraCompactSkeletonLimit?: number;
};

const EventListCompact = ({
  events,
  noEventsMessage,
  eventStyle = 'default',
  loading,
  extraCompactSkeletonLimit,
}: Props) => {
  if (loading && !events.length) {
    switch (eventStyle) {
      case 'default':
        return (
          <Flex column>
            {[...Array(3)].map((i) => (
              <Skeleton key={i} className={styles.eventItem} />
            ))}
          </Flex>
        );
      case 'compact':
        return <Skeleton className={styles.eventItemCompact} />;
      case 'extra-compact':
        return (
          <Flex column>
            {[...Array(extraCompactSkeletonLimit || 8)].map((i) => (
              <Skeleton key={i} className={styles.eventItem} />
            ))}
          </Flex>
        );
    }
  }

  if (!events.length) {
    return (
      <EmptyState className="secondaryFontColor">{noEventsMessage}</EmptyState>
    );
  }

  return (
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
  );
};
export default EventListCompact;
