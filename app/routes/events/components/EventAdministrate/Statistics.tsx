import type { EventRegistration, Group } from 'app/models';
import EventAttendeeStatistics from 'app/routes/events/components/EventAttendeeStatistics';
import type { DetailedEvent } from 'app/store/models/Event';

interface Props {
  committees: Group[];
  revueGroups: Group[];
  registered: EventRegistration[];
  unregistered: EventRegistration[];
  event: DetailedEvent;
}

const Statistics = ({
  committees,
  revueGroups,
  registered,
  unregistered,
  event,
}: Props) => {
  return (
    <EventAttendeeStatistics
      eventId={event.id}
      registrations={registered}
      unregistrations={unregistered}
      committeeGroupIDs={committees.map((group) => group.id)}
      revueGroupIDs={revueGroups.map((group) => group.id)}
      eventStartTime={event.startTime}
    />
  );
};

export default Statistics;
