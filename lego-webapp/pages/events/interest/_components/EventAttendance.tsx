import { Flex } from '@webkom/lego-bricks';
import cx from 'classnames';
import { User } from 'lucide-react';
import { useState } from 'react';
import { ProfilePicture } from '~/components/Image';
import AttendanceModal from '~/components/UserAttendance/AttendanceModal';
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
  const placeholders = MAX_FACES - faces.length;
  const hasAttendees = faces.length > 0;

  const names = ordered
    .slice(0, 2)
    .map((registration) =>
      registration === you ? 'Du' : registration.user.firstName.split(' ')[0],
    );
  const hidden = count - names.length;

  let lines: string[];
  if (!currentUser && count === 0) {
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

  const faceRow = (
    <>
      {faces.map((registration) => (
        <ProfilePicture
          key={registration.id}
          user={registration.user}
          size={32}
          className={styles.face}
        />
      ))}
      {Array.from({ length: placeholders }, (_, index) => (
        <span key={index} className={styles.facePlaceholder}>
          <User size={18} />
        </span>
      ))}
      {extra > 0 && <span className={styles.extraPill}>+{extra}</span>}
    </>
  );

  return (
    <>
      <Flex column gap="var(--spacing-sm)" className={styles.attendance}>
        {hasAttendees ? (
          <button
            type="button"
            title="Se hvem som kommer"
            className={styles.faceRow}
            onClick={() => setModalOpen(true)}
          >
            {faceRow}
          </button>
        ) : (
          placeholders > 0 && (
            <div className={cx(styles.faceRow, styles.faceRowEmpty)}>
              {faceRow}
            </div>
          )
        )}
        <Flex column className={styles.attendLine}>
          {lines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </Flex>
      </Flex>
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
