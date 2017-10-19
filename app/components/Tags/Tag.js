// @flow

import React from 'react';
import { Link } from 'react-router';
import styles from './Tag.css';

type Props = {
  /** The tag value - the text */
  tag: string,
  /** Make small */
  small?: boolean
};

/**
 * A basic tag component for displaying tags
 */
function Tag({ tag, small = false }: Props) {
  const className = small ? styles.tagLinkSmall : styles.tagLink;
  return (
    <div className={styles.linkSpacing}>
      <Link className={className} to={`search?q=${tag}`}>
        #{tag}
      </Link>
    </div>
  );
}

export default Tag;
