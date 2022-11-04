import EventAttendeeStatistics from 'app/routes/events/components/EventAttendeeStatistics';
import { EventRegistration, Group } from 'app/models';

interface Props {
  committees: Group[];
  revueGroups: Group[];
  registered: EventRegistration[];
  unregistered: EventRegistration[];
}

const Statistics = ({
  committees,
  revueGroups,
  registered,
  unregistered,
}: Props) => {
  return (
    <EventAttendeeStatistics
      registrations={registered}
      unregistrations={unregistered}
      committeeGroupIDs={committees.map((group) => group.id)}
      revueGroupIDs={revueGroups.map((group) => group.id)}
    />
  );
};

export default Statistics;
