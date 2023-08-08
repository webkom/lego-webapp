import { LoadingIndicator } from '@webkom/lego-bricks';
import EmptyState from 'app/components/EmptyState';
import EventItem, { type EventStyle } from 'app/components/EventItem';
import { Flex } from 'app/components/Layout';
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
  if (loading) {
    return <LoadingIndicator loading margin="20px auto" />;
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
    <EmptyState className="secondaryFontColor">{noEventsMessage}</EmptyState>
  );
};
export default EventListCompact;
