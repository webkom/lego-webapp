import { Modal, Flex } from '@webkom/lego-bricks';
import { QRCode } from 'react-qrcode-logo';
import styles from './ProfileCard.module.css';

interface Props {
  fullName: string;
  userName: string;
  grade: string;
}

export const ProfileCard = () => {
  return (
    <Modal title="ABA-ID">
      <div className={styles.divider}></div>
      <Flex column justifyContent="center">
        <div className={styles.info}>
          <QRCode value={"Felixvik" ?? ''} />
          <h2>CHRISTOFFER NGUYEN</h2>
          <p>2. KLASSE CYBDAT</p>
        </div>
      </Flex>
    </Modal>
  );
};

export default ProfileCard;
