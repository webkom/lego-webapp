import cx from 'classnames';
import { useState } from 'react';
import { Dialog, Modal, ModalOverlay } from 'react-aria-components';
import AbaIdBack from './AbaIdBack';
import styles from './AbaIdCard.module.css';
import AbaIdFront from './AbaIdFront';
import useCardTilt from './useCardTilt';
import type { EntityId } from '@reduxjs/toolkit';

export type AbaIdGroup = {
  id: EntityId;
  name: string;
  logo: string;
};

type Props = {
  fullName: string;
  username: string;
  grade?: string;
  groups: AbaIdGroup[];
};

/** Mounts with the overlay, so the card always opens on its front. */
const AbaIdStage = ({ fullName, username, grade, groups }: Props) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const zoneRef = useCardTilt();

  return (
    <div className={styles.stage}>
      <div className={styles.fit}>
        <div ref={zoneRef} className={styles.zone}>
          <div className={styles.tilt}>
            <div className={cx(styles.flip, isFlipped && styles.flipped)}>
              <AbaIdFront
                fullName={fullName}
                username={username}
                grade={grade}
                hidden={isFlipped}
              />
              <AbaIdBack
                username={username}
                groups={groups}
                hidden={!isFlipped}
              />
            </div>
          </div>
          <button
            type="button"
            className={styles.flipButton}
            aria-label="Snu kortet"
            aria-pressed={isFlipped}
            onClick={() => setIsFlipped((flipped) => !flipped)}
          />
        </div>
      </div>
    </div>
  );
};

const AbaIdCard = (props: Props) => (
  <ModalOverlay isDismissable className={styles.overlay}>
    <Modal className={styles.modal}>
      <Dialog aria-label="ABA-ID" className={styles.dialog}>
        <AbaIdStage {...props} />
      </Dialog>
    </Modal>
  </ModalOverlay>
);

export default AbaIdCard;
