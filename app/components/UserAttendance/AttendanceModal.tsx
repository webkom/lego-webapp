import { useState } from 'react';
import Modal from 'app/components/Modal';
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
  title,
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
      <Modal show={modalVisible} onHide={() => toggleModal()}>
        <AttendanceModalContent
          title={title}
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
