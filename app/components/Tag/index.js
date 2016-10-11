// @flow

import React from 'react';
import { Link } from 'react-router';
import styles from './Tag.css';

type Props = {
  tag: string;
  small?: boolean
}

function Tag({ tag, small }: Props) {
  const className = small ? styles.tagLinkSmall : styles.tagLink;
  return (
    <div className={styles.linkSpacing}>
      <Link className={className} to={'/'}>
        #{tag}
      </Link>
    </div>
  );
}

export default Tag;
