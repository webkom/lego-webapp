import { Flex, LoadingIndicator } from '@webkom/lego-bricks';
import EmptyState from 'app/components/EmptyState';
import EventItem, { type EventStyle } from 'app/components/EventItem';
import type { Event } from 'app/models';

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
  if (loading && (!events || events.length === 0)) {
    return <LoadingIndicator loading margin="20px auto" />;
  }

  if (!events || events.length === 0) {
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
