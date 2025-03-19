import styles from './Brainrot.module.css';
import { Button } from '@webkom/lego-bricks';
import React, { useState } from 'react';

type Props = {
  count: number;
  onClick: () => void;
};

const BrainrotButton = ({ count, onClick }: Props) => {
  return (
    <div className={styles.brainrotButtonContainer}>
      <Button onPress={onClick}>Click me😛</Button>
      {count > 0 && (
        <p className={styles.brainrotButtonText}>Clicked {count} times</p>
      )}
    </div>
  );
};

export default BrainrotButton;
