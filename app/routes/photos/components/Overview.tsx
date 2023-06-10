import { Component } from 'react';
import { Helmet } from 'react-helmet-async';
import Button from 'app/components/Button';
import { Content } from 'app/components/Content';
import EmptyState from 'app/components/EmptyState';
import type { Photo } from 'app/components/Gallery';
import Gallery from 'app/components/Gallery';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import styles from './Overview.module.css';

type Props = {
  fetching: boolean;
  hasMore: boolean;
  galleries: Array<Photo>;
  fetch: (arg0: { next?: boolean }) => Promise<any>;
  push: (arg0: string) => Promise<any>;
  actionGrant: Array<string>;
};
export default class Overview extends Component<Props> {
  render() {
    const { galleries, push, hasMore, fetch, fetching, actionGrant } =
      this.props;
    return (
      <Content>
        <Helmet title="Albumer" />
        {actionGrant && actionGrant.includes('create') && (
          <NavigationTab title="Albumer">
            <NavigationLink to="/photos/new">Nytt album</NavigationLink>
          </NavigationTab>
        )}

        <Gallery
          hasMore={hasMore}
          fetching={fetching}
          fetchNext={() =>
            fetch({
              next: true,
            })
          }
          onClick={(gallery) => push(`/photos/${gallery.id}#list`)}
          renderBottom={(photo) => (
            <div className={styles.galleryInfo}>
              <h4 className={styles.galleryTitle}>{photo.title}</h4>
              <span
                className={styles.galleryDescription}
              >{`${photo.pictureCount} - bilder`}</span>
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
