// @flow

import React from 'react';
import { Flex } from 'app/components/Layout';
import { Link } from 'react-router-dom';
import moment from 'moment-timezone';
import styles from './GalleryDetailsRow.css';

type Props = {
  gallery: Object,
  showDescription?: boolean,
  size?: 'small' | 'large'
};

const GalleryDetailsRow = ({
  gallery,
  showDescription = false,
  size = 'large'
}: Props) => (
  <Flex className={styles.details} column>
    <div
      className={size === 'small' ? styles.smallDetails : styles.largeDetails}
    >
      {gallery.event && (
        <span className={styles.detail}>
          <Link to={`/events/${gallery.event.id}`}>{gallery.event.title}</Link>
        </span>
      )}

      {gallery.takenAt && (
        <span className={styles.detail}>
          {moment(gallery.takenAt).format('ll')}
        </span>
      )}

      {gallery.location && (
        <span className={styles.detail}>{gallery.location}</span>
      )}
    </div>

    {showDescription && (
      <p className={styles.description}>{gallery.description}</p>
    )}
  </Flex>
);

export default GalleryDetailsRow;
