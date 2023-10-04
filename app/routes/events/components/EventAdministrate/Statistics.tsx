import { useState } from 'react';
import { DatePicker } from 'app/components/Form';
import type { Dateish, EventRegistration, Group } from 'app/models';
import EventAttendeeStatistics from 'app/routes/events/components/EventAttendeeStatistics';
import styles from 'app/routes/events/components/EventAttendeeStatistics.css';
import type { DetailedEvent } from 'app/store/models/Event';
import type { DetailedRegistration } from 'app/store/models/Registration';

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
  const [registrationStartTime, setRegistrationStartTime] = useState<Dateish>(
    '2021-01-01T00:00:00.000Z'
  );
  const [registrationEndTime, setRegistrationEndTime] = useState<Dateish>(null);

  const updateRegistrationStartDate = (date: string) => {
    setRegistrationStartTime(date);
  };

  const updateRegistrationEndDate = (date: string) => {
    setRegistrationEndTime(date);
  };

  return (
    <>
      <div className={styles.filterContainer}>
        <label>Startdato for påmelding</label>
        <DatePicker
          value={registrationStartTime as string}
          onChange={updateRegistrationStartDate}
          onBlur={() => {}}
          onFocus={() => {}}
        />
        <label>Sluttdato for påmelding</label>
        <DatePicker
          value={registrationEndTime as string}
          onChange={updateRegistrationEndDate}
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
        registrationStartTime={registrationStartTime}
        registrationEndTime={registrationEndTime}
      />
    </>
  );
};

export default Statistics;
