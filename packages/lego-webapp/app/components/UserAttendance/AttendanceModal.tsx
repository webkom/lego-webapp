import { Modal } from '@webkom/lego-bricks';
import { Drawer } from 'app/components/Drawer';
import { useIsMobileViewport } from 'app/utils/isMobileViewport';
import AttendanceModalContent from './AttendanceModalContent';
import styles from './AttendanceModalContent.module.css';
import type { AttendanceModalPool } from './AttendanceModalContent';

export type AttendanceModalProps = {
  pools: AttendanceModalPool[];
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
}: AttendanceModalProps) => {
  const isMobile = useIsMobileViewport();

  const content = (
    <AttendanceModalContent
      selectedPool={openTab}
      togglePool={onOpenTabChange}
      pools={pools}
      isMeeting={isMeeting}
    />
  );

  if (isMobile) {
    return (
      <Drawer isOpen={isOpen} onOpenChange={onOpenChange} title={title}>
        {content}
      </Drawer>
    );
  } else {
    return (
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title={title}
        contentClassName={styles.modalContainer}
      >
        {content}
      </Modal>
    );
  }
};

export default AttendanceModal;
