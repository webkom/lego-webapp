import React, { ReactNode } from 'react';
import styles from './Tag.css';

type Props = {
  /** Make small */
  children: ReactNode;
  className?: string;
};

/**
 * A basic tag component for displaying tags
 */
function Tags({ children, className }: Props) {
  return <div className={className ? className : styles.tags}>{children}</div>;
}

export default Tags;
