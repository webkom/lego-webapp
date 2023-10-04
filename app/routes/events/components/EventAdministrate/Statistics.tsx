import type { EventRegistration, Group } from 'app/models';
import EventAttendeeStatistics from 'app/routes/events/components/EventAttendeeStatistics';
import type { DetailedEvent } from 'app/store/models/Event';
import styles from 'app/routes/events/components/EventAttendeeStatistics.css';
import { DatePicker } from 'app/components/Form';
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

  const [registrationStartTime, setRegistrationStartTime] = useState<string>("");
  const [registrationEndTime, setRegistrationEndTime] = useState<string>("");

  const updateRegistrationStartDate = (date: string) => {
    setRegistrationStartTime(date);
  }

  const updateRegistrationEndDate = (date: string) => {
    setRegistrationEndTime(date);
  }

  return (
    <>
      <div className={styles.filterContainer}>
        <label>Startdato for påmelding</label>
        <DatePicker value={registrationStartTime} onChange={updateRegistrationStartDate} onBlur={() => {}} onFocus={() => {}}/>
        <label>Sluttdato for påmelding</label>
        <DatePicker value={registrationEndTime} onChange={updateRegistrationEndDate} onBlur={() => {}} onFocus={() => {}}/>
      </div>

      <EventAttendeeStatistics
        eventId={event.id}
        registrations={registered}
        unregistrations={unregistered}
        committeeGroupIDs={committees.map((group) => group.id)}
        revueGroupIDs={revueGroups.map((group) => group.id)}
        registrationStartTime={registrationStartTime}
        registrationEndTime={registrationEndTime}
      />
    </>
  );
};

export default Statistics;
