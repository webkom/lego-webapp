// @flow

import React from 'react';
import { Link } from 'react-router';
import cx from 'classnames';
import styles from './Tag.css';

type Props = {
  /** The tag value - the text */
  tag: string,
  /** Make small */
  small?: boolean,
  color?: 'pink' | 'red' | 'orange' | 'green' | 'cyan' | 'blue' | 'purple',
  link?: string
};

/**
 * A basic tag component for displaying tags
 */
function Tag({ tag, color, link, small = false }: Props) {
  const className = small ? styles.tagLinkSmall : styles.tagLink;
  const colorClassName = styles[color];

  return (
    <div className={styles.linkSpacing}>
      {link && (
        <Link className={cx(styles.link, className, colorClassName)} to={link}>
          {tag}
        </Link>
      )}
      {!link && <span className={cx(className, colorClassName)}>{tag}</span>}
    </div>
  );
}

export default Tag;
