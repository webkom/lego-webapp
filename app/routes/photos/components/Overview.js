// @flow

import React, { Component } from 'react';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import EmptyState from 'app/components/EmptyState';
import { Content } from 'app/components/Content';
import Gallery, { type Photo } from 'app/components/Gallery';
import styles from './Overview.css';
import Button from 'app/components/Button';

type Props = {
  fetching: boolean,
  hasMore: boolean,
  galleries: Array<Photo>,
  fetch: ({ next?: boolean }) => Promise<*>,
  push: string => Promise<*>,
  actionGrant: Array<string>
};

export default class Overview extends Component<Props> {
  render() {
    const {
      galleries,
      push,
      hasMore,
      fetch,
      fetching,
      actionGrant
    } = this.props;
    return (
      <Content>
        {actionGrant && actionGrant.includes('create') && (
          <NavigationTab title="Albumer">
            <NavigationLink to="/photos/new">Nytt album</NavigationLink>
          </NavigationTab>
        )}

        <Gallery
          hasMore={hasMore}
          fetching={fetching}
          fetchNext={() => fetch({ next: true })}
          onClick={gallery => push(`/photos/${gallery.id}`)}
          renderBottom={photo => (
            <div className={styles.galleryInfo}>
              <h4 className={styles.galleryTitle}>{photo.title}</h4>
              <span className={styles.galleryDescription}>{`${
                photo.pictureCount
              } - bilder`}</span>
            </div>
          )}
          renderEmpty={() => (
            <EmptyState icon="photos-outline">
              <h1>Ingen synlige albumer</h1>
              {actionGrant && actionGrant.includes('create') && (
                <h4>
                  Trykk{' '}
                  <Button flat onClick={() => push('/photos/new')}>
                    <b>her</b>
                  </Button>{' '}
                  for å lage et nytt album
                </h4>
              )}
            </EmptyState>
          )}
          photos={galleries}
          srcKey="cover.file"
        />
      </Content>
    );
  }
}
