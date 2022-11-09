import { Event, EventRegistration, Group } from 'app/models';
import EventAttendeeStatistics from 'app/routes/events/components/EventAttendeeStatistics';

interface Props {
  committees: Group[];
  revueGroups: Group[];
  registered: EventRegistration[];
  unregistered: EventRegistration[];
  event: Event;
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
      registrations={registered}
      unregistrations={unregistered}
      committeeGroupIDs={committees.map((group) => group.id)}
      revueGroupIDs={revueGroups.map((group) => group.id)}
      eventStartTime={event.startTime}
    />
  );
};

export default Statistics;
