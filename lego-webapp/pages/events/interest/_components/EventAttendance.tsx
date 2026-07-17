import { useState } from 'react';
import { ProfilePicture } from '~/components/Image';
import AttendanceModal from '~/components/UserAttendance/AttendanceModal';
import { activateOnKey } from '~/pages/events/interest/utils';
import { EventStatusType } from '~/redux/models/Event';
import { useCurrentUser } from '~/redux/slices/auth';
import styles from './EventAttendance.module.css';
import type { AttendanceModalRegistration } from '~/components/UserAttendance/AttendanceModalContent';
import type { ListEvent } from '~/redux/models/Event';
import type { PoolRegistrationWithUser } from '~/redux/slices/events';

const MAX_FACES = 5;

type Props = {
  event: ListEvent;
  registrations: PoolRegistrationWithUser[];
  waitingRegistrations: AttendanceModalRegistration[];
  isPast: boolean;
};

const EventAttendance = ({
  event,
  registrations,
  waitingRegistrations,
  isPast,
}: Props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState(0);
  const currentUser = useCurrentUser();

  const count = registrations.length || event.registrationCount || 0;

  // You come first in the facepile, like the design's known faces
  const you = currentUser
    ? registrations.find(
        (registration) => registration.user.id === currentUser.id,
      )
    : undefined;
  const ordered = you
    ? [you, ...registrations.filter((registration) => registration !== you)]
    : registrations;
  const faces = ordered.slice(0, MAX_FACES);
  const extra = count - faces.length;

  const verb = isPast ? 'var med' : 'kommer';
  let bold = '';
  let rest: string;
  if (event.eventStatusType === EventStatusType.OPEN) {
    rest = 'ingen påmelding — bare møt opp';
  } else if (count === 0) {
    rest = isPast ? 'ingen var med' : 'ingen påmeldt ennå';
  } else if (you) {
    bold = 'Du';
    rest = count > 1 ? ` + ${count - 1} andre ${verb}` : ` ${verb}`;
  } else {
    rest = `${count} ${verb}`;
  }

  return (
    <>
      <div className={styles.attendance}>
        {faces.length > 0 && (
          <div
            role="button"
            tabIndex={0}
            title="Se hvem som kommer"
            className={styles.faceRow}
            onClick={() => setModalOpen(true)}
            onKeyDown={activateOnKey(() => setModalOpen(true))}
          >
            {faces.map((registration) => (
              <ProfilePicture
                key={registration.id}
                user={registration.user}
                size={26}
                className={styles.face}
              />
            ))}
            {extra > 0 && <span className={styles.extraPill}>+{extra}</span>}
          </div>
        )}
        <div className={styles.attendLine}>
          {bold && <b>{bold}</b>}
          {rest}
        </div>
      </div>
      <AttendanceModal
        pools={[
          { name: 'Påmeldte', registrations },
          ...(waitingRegistrations.length > 0
            ? [{ name: 'Venteliste', registrations: waitingRegistrations }]
            : []),
        ]}
        title="Påmeldte"
        isOpen={modalOpen}
        onOpenChange={setModalOpen}
        openTab={modalTab}
        onOpenTabChange={setModalTab}
      />
    </>
  );
};

export default EventAttendance;
