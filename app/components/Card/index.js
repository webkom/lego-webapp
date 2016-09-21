// @flow

import React from 'react';
import styles from './Card.css';

type Props = {
  children: any;
}

function Card({ children }: Props) {
  return (
    <div className={styles.card}>
      {children}
    </div>
  );
}

export default Card;
