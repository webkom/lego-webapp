// @flow

import React from 'react';
import styles from './Pill.css';

type Props = {

};

function Pill(props: Props) {
  return (
    <span
      className={styles.pill}
      {...props}
    />
  );
}

export default Pill;
