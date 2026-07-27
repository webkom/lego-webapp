import cx from 'classnames';
import { useState } from 'react';
import { ProfilePicture } from '~/components/Image';
import AttendanceModal from '~/components/UserAttendance/AttendanceModal';
import { activateOnKey, attendanceLabel } from '~/pages/events/interest/utils';
import { EventStatusType } from '~/redux/models/Event';
import { useCurrentUser } from '~/redux/slices/auth';
import styles from './EventAttendance.module.css';
import type { AttendanceModalRegistration } from '~/components/UserAttendance/AttendanceModalContent';
import type { ListEvent } from '~/redux/models/Event';
import type { PoolRegistrationWithUser } from '~/redux/slices/events';

const MAX_FACES = 3;

type Props = {
  event: ListEvent;
  registrations: PoolRegistrationWithUser[];
  waitingRegistrations: AttendanceModalRegistration[];
  isPast: boolean;
  spotlight?: boolean;
};

const EventAttendance = ({
  event,
  registrations,
  waitingRegistrations,
  isPast,
  spotlight,
}: Props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState(0);
  const currentUser = useCurrentUser();

  const count = registrations.length || event.registrationCount || 0;

  const you = currentUser
    ? registrations.find(
        (registration) => registration.user.id === currentUser.id,
      )
    : undefined;
  const others = registrations.filter((registration) => registration !== you);
  const ordered = you ? [you, ...others] : registrations;
  const faces = ordered.slice(0, MAX_FACES);
  const extra = count - faces.length;

  const names = others
    .slice(0, 2)
    .map((registration) => registration.user.firstName.split(' ')[0]);
  const hidden = count - names.length;

  let lines: string[];
  if (event.eventStatusType === EventStatusType.OPEN) {
    lines = [attendanceLabel(event)];
  } else if (!currentUser && count === 0) {
    lines = ['logg inn for å se påmeldte'];
  } else if (count === 0) {
    lines = [isPast ? 'ingen var med' : 'ingen påmeldt ennå'];
  } else if (names.length === 0) {
    lines = [count === 1 ? '1 påmeldt' : `${count} påmeldte`];
  } else {
    lines = [names.join(', ')];
    if (hidden === 1) lines.push('+ 1 annet medlem');
    else if (hidden > 1) lines.push(`+ ${hidden} andre medlemmer`);
  }

  return (
    <>
      <div className={cx(styles.attendance, spotlight && styles.spotlight)}>
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
                size={spotlight ? 30 : 32}
                className={styles.face}
              />
            ))}
            {extra > 0 && <span className={styles.extraPill}>+{extra}</span>}
          </div>
        )}
        {!spotlight && (
          <div className={styles.attendLine}>
            {lines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </div>
        )}
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
