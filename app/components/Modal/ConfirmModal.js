// @flow

import styles from './ConfirmModal.css';
import React from 'react';
import Button from '../Button';

type Props = {
  onConfirm: () => any,
  onCancel: () => any,
  message: string,
  title: string
};

const ConfirmModal = ({ message, onConfirm, onCancel, title }: Props) => (
  <div className={styles.overlay}>
    <div className={styles.confirmContainer}>
      <div className={styles.confirmTitle}>{title}</div>
      <div className={styles.confirmMessage}>{message}</div>
      <div className={styles.buttonGroup}>
        <Button onClick={onCancel}>nei</Button>
        <Button onClick={onConfirm}>ja</Button>
      </div>
    </div>
  </div>
);

export default ConfirmModal;
