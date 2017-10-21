// @flow

import React, { type Node } from 'react';
import styles from './Tag.css';

type Props = {
  /** Make small */
  children: Node
};

/**
 * A basic tag component for displaying tags
 */
function Tags({ children }: Props) {
  return <div className={styles.tags}>{children}</div>;
}

export default Tags;
