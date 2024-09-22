import { useState } from 'react';
import AttendanceModal from 'app/components/UserAttendance/AttendanceModal';
import AttendanceStatus from 'app/components/UserAttendance/AttendanceStatus';
import UserGrid from 'app/components/UserGrid';
import { useIsLoggedIn } from 'app/reducers/auth';
import RegisteredSummary from 'app/routes/events/components/RegisteredSummary';
import type { Pool } from 'app/components/UserAttendance/AttendanceModalContent';
import type { SummaryRegistration } from 'app/routes/events/components/RegisteredSummary';
import type { PaymentRegistration } from 'app/store/models/Registration';

type Props = {
  pools: Pool[];
  registrations?: SummaryRegistration[];
  currentRegistration?: PaymentRegistration;
  minUserGridRows?: number;
  maxUserGridRows?: number;
  isMeeting?: boolean;
  legacyRegistrationCount?: number;
  skeleton?: boolean;
};

const Attendance = ({
  pools,
  registrations,
  currentRegistration,
  minUserGridRows = 0,
  maxUserGridRows = 2,
  isMeeting,
  legacyRegistrationCount,
  skeleton,
}: Props) => {
  const [modalTab, setModalTab] = useState<number>(0);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const openModalTab = (index: number) => {
    setModalOpen(true);
    const amendedIndex = pools.length === 1 ? index : index + 1; // account for "All" pool if it exists
    setModalTab(amendedIndex);
  };

  const loggedIn = useIsLoggedIn();

  return (
    <>
      {!isMeeting && (
        <>
          <UserGrid
            minRows={minUserGridRows}
            maxRows={maxUserGridRows}
            users={registrations?.slice(0, 14).map((reg) => reg.user)}
            skeleton={skeleton}
          />
          <RegisteredSummary
            registrations={loggedIn ? registrations : undefined}
            currentRegistration={currentRegistration}
            skeleton={skeleton}
            openModalTab={openModalTab}
          />
        </>
      )}
      <AttendanceStatus
        pools={pools}
        openModalTab={openModalTab}
        legacyRegistrationCount={legacyRegistrationCount}
        skeleton={skeleton}
      />
      <AttendanceModal
        pools={pools}
        title={isMeeting ? 'Inviterte' : 'Påmeldte'}
        isMeeting={isMeeting}
        isOpen={modalOpen}
        onOpenChange={setModalOpen}
        openTab={modalTab}
        onOpenTabChange={setModalTab}
      />
    </>
  );
};

export default Attendance;
