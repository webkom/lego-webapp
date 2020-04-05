// @flow

import React from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import styles from './Tag.css';

type Props = {
  /** The tag value - the text */
  tag: string,
  /** Make small */
  small?: boolean,
  color?: 'pink' | 'red' | 'orange' | 'green' | 'cyan' | 'blue' | 'purple',
  link?: string,
  className?: string
};

/**
 * A basic tag component for displaying tags
 */
function Tag({ tag, color, link, className, small = false }: Props) {
  const internalClassName = small ? styles.tagLinkSmall : styles.tagLink;
  const colorClassName = styles[color];

  return (
    <div className={styles.linkSpacing}>
      {link && (
        <Link
          className={cx(
            styles.link,
            internalClassName,
            colorClassName,
            className
          )}
          to={link}
        >
          {tag}
        </Link>
      )}
      {!link && (
        <span className={cx(internalClassName, colorClassName, className)}>
          {tag}
        </span>
      )}
    </div>
  );
}

export default Tag;
