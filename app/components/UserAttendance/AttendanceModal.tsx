import { Modal } from '@webkom/lego-bricks';
import AttendanceModalContent from './AttendanceModalContent';
import type { Pool } from './AttendanceModalContent';

export type AttendanceModalProps = {
  pools: Pool[];
  title: string;
  isMeeting?: boolean;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  openTab: number;
  onOpenTabChange: (tabIndex: number) => void;
};

const AttendanceModal = ({
  pools,
  title,
  isMeeting = false,
  isOpen,
  onOpenChange,
  openTab,
  onOpenTabChange,
}: AttendanceModalProps) => (
  <Modal isOpen={isOpen} onOpenChange={onOpenChange} title={title}>
    <AttendanceModalContent
      selectedPool={openTab}
      togglePool={onOpenTabChange}
      pools={pools}
      isMeeting={isMeeting}
    />
  </Modal>
);

export default AttendanceModal;
