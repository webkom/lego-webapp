import { Button, Modal } from '@webkom/lego-bricks';
import { useState } from 'react';
import styles from './ArcadeGame.module.css';
import ArcadeGameBox from './ArcadeGameCanvas';

type ArcadeGameModalProps = {
  dateNr?: number;
};

const ArcadeGameModal = ({ dateNr = 1 }: ArcadeGameModalProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div>
      <Button onPress={() => setIsOpen(true)}>ArcadeGame</Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        contentClassName={styles.modal}
        title={`ArcadeGame`}
      >
        <p>Trykk på space for å starte! </p>
        <ArcadeGameBox dateNr={dateNr} />
        <p>Vanskelighetsgrad: Lett</p>
      </Modal>
    </div>
  );
};

export default ArcadeGameModal;
