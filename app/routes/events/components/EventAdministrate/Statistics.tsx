import EventAttendeeStatistics from 'app/routes/events/components/EventAttendeeStatistics';
import styles from 'app/routes/events/components/EventAttendeeStatistics.css';
import type { Dateish, EventRegistration, Group } from 'app/models';
import type { DetailedEvent } from 'app/store/models/Event';
import type { DetailedRegistration } from 'app/store/models/Registration';
import { useState } from 'react';

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
  const [viewStartTime, setViewStartTime] = useState<Dateish>(
    '2021-01-01T00:00:00.000Z'
  );
  const [viewEndTime, setViewEndTime] = useState<Dateish>(null);

  const updateViewStartDate = (date: string) => {
    setViewStartTime(date);
  };

  const updateViewEndDate = (date: string) => {
    setViewEndTime(date);
  };

  return (
    <>
      <div className={styles.filterContainer}>
        <label>Startdato for sidevisning</label>
        <DatePicker
          value={viewStartTime as string}
          onChange={updateViewStartDate}
          onBlur={() => {}}
          onFocus={() => {}}
        />
        <label>Sluttdato for sidevisning</label>
        <DatePicker
          value={viewEndTime as string}
          onChange={updateViewEndDate}
          onBlur={() => {}}
          onFocus={() => {}}
        />
      </div>

      <EventAttendeeStatistics
        eventId={event.id}
        registrations={registered as DetailedRegistration[]}
        unregistrations={unregistered as DetailedRegistration[]}
        committeeGroupIDs={committees.map((group) => group.id)}
        revueGroupIDs={revueGroups.map((group) => group.id)}
        eventStartTime={event.startTime}
        viewStartTime={viewStartTime}
        viewEndTime={viewEndTime}
      />
    </>
  );
};

export default Statistics;
