// @flow

import React from 'react';
import Tag from './Tag';
import styles from './Tag.css';

type Props = {
  /** Make small */
  children: React.Element<Tag>
};

/**
 * A basic tag component for displaying tags
 */
function Tags({ children }: Props) {
  return <div className={styles.tags}>{children}</div>;
}

export default Tags;
