// @flow

import React, { Component } from 'react';
import Button from 'app/components/Button';
import { Flex } from 'app/components/Layout';
import Gallery from 'app/components/Gallery';
import styles from './Overview.css';

type Props = {
  galleries: [],
  fetchAll: () => Promise<*>,
  push: string => Promise<*>
};

export default class Overview extends Component {
  props: Props;

  render() {
    const { galleries, push } = this.props;

    return (
      <section className={styles.root}>
        <Flex wrap alignItems="center" justifyContent="space-between">
          <h1>Alle albumer</h1>
          <Button>Nytt Album</Button>
        </Flex>

        <Flex>
          <Gallery
            onClick={gallery => push(`/photos/${gallery.id}`)}
            renderBottom={photo =>
              <div className={styles.galleryInfo}>
                <h4 className={styles.galleryTitle}>
                  {photo.title}
                </h4>
                <span
                  className={styles.galleryDescription}
                >{`${photo.pictureCount} - bilder`}</span>
              </div>}
            photos={galleries}
            srcKey="cover.file"
          />
        </Flex>
      </section>
    );
  }
}
