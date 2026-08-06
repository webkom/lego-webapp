import cx from 'classnames';
import { User } from 'lucide-react';
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

  const count = event.registrationCount ?? registrations.length;

  const you = currentUser
    ? registrations.find(
        (registration) => registration.user.id === currentUser.id,
      )
    : undefined;
  const others = registrations.filter((registration) => registration !== you);
  const ordered = you ? [you, ...others] : registrations;
  const faces = ordered.slice(0, MAX_FACES);
  const extra = count - faces.length;
  // The pile always shows three circles grey placeholders
  const placeholders =
    event.eventStatusType === EventStatusType.OPEN
      ? 0
      : MAX_FACES - faces.length;
  const hasAttendees = faces.length > 0;

  const names = ordered
    .slice(0, 2)
    .map((registration) =>
      registration === you ? 'Du' : registration.user.firstName.split(' ')[0],
    );
  const hidden = count - names.length;

  let lines: string[];
  if (event.eventStatusType === EventStatusType.OPEN) {
    lines = [attendanceLabel(event)];
  } else if (!currentUser && count === 0) {
    lines = ['Logg inn for å se påmeldte'];
  } else if (count === 0) {
    lines = [isPast ? 'Ingen var med' : 'Ingen påmeldt'];
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
        {(hasAttendees || placeholders > 0) && (
          <div
            role={hasAttendees ? 'button' : undefined}
            tabIndex={hasAttendees ? 0 : undefined}
            title={hasAttendees ? 'Se hvem som kommer' : undefined}
            className={cx(styles.faceRow, !hasAttendees && styles.faceRowEmpty)}
            onClick={hasAttendees ? () => setModalOpen(true) : undefined}
            onKeyDown={
              hasAttendees ? activateOnKey(() => setModalOpen(true)) : undefined
            }
          >
            {faces.map((registration) => (
              <ProfilePicture
                key={registration.id}
                user={registration.user}
                size={spotlight ? 30 : 32}
                className={styles.face}
              />
            ))}
            {Array.from({ length: placeholders }, (_, index) => (
              <span key={index} className={styles.facePlaceholder}>
                <User size={spotlight ? 16 : 18} />
              </span>
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
