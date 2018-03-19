// @flow

import React, { type Node } from 'react';
import styles from './Tag.css';

type Props = {
  /** Make small */
  children: Node,
  className?: string
};

/**
 * A basic tag component for displaying tags
 */
function Tags({ children, className }: Props) {
  return <div className={className ? className : styles.tags}>{children}</div>;
}

export default Tags;
