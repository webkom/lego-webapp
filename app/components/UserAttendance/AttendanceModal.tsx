import { Modal } from '@webkom/lego-bricks';
import { useState } from 'react';
import AttendanceModalContent from './AttendanceModalContent';
import type { Pool } from './AttendanceModalContent';
import type { ReactNode } from 'react';

export type AttendanceModalProps = {
  pools: Pool[];
  title: string;
  isMeeting?: boolean;
  children: (props: { toggleModal: (tabIndex: number) => void }) => ReactNode;
};

const AttendanceModal = ({
  pools,
  title = 'Status',
  isMeeting = false,
  children,
}: AttendanceModalProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  const toggleModal = (tabIndex = 0) => {
    setModalVisible(!modalVisible);
    setSelectedTab(tabIndex);
  };

  return (
    <>
      {children({ toggleModal })}
      <Modal
        isOpen={modalVisible}
        onOpenChange={(isOpen) => !isOpen && toggleModal()}
        title={title}
      >
        <AttendanceModalContent
          selectedPool={selectedTab}
          togglePool={(tabIndex) => setSelectedTab(tabIndex)}
          pools={pools}
          isMeeting={isMeeting}
        />
      </Modal>
    </>
  );
};

export default AttendanceModal;
