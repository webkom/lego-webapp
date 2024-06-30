import { LinkButton, Page } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { fetchGalleries } from 'app/actions/GalleryActions';
import EmptyState from 'app/components/EmptyState';
import Gallery from 'app/components/Gallery';
import { selectAllGalleries } from 'app/reducers/galleries';
import { selectPaginationNext } from 'app/reducers/selectors';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { EntityType } from 'app/store/models/entities';
import styles from './Overview.css';
import type { ListGallery } from 'app/store/models/Gallery';

const Overview = () => {
  const galleries = useAppSelector(selectAllGalleries<ListGallery>);
  const { pagination } = useAppSelector(
    selectPaginationNext({
      endpoint: '/galleries/',
      entity: EntityType.Galleries,
      query: {},
    }),
  );
  const actionGrant = useAppSelector((state) => state.galleries.actionGrant);

  const dispatch = useAppDispatch();

  usePreparedEffect('fetchGalleryList', () => dispatch(fetchGalleries()), []);

  const navigate = useNavigate();

  return (
    <Page
      title="Album"
      actionButtons={
        actionGrant?.includes('create') && (
          <LinkButton href="/photos/new">Nytt album</LinkButton>
        )
      }
    >
      <Helmet title="Album" />

      <Gallery
        hasMore={pagination.fetching || pagination.hasMore}
        fetching={pagination.fetching}
        fetchNext={() =>
          dispatch(
            fetchGalleries({
              next: true,
            }),
          )
        }
        onClick={(gallery) => navigate(`/photos/${gallery.id}#list`)}
        renderBottom={(photo) => (
          <div className={styles.galleryInfo}>
            <h4 className={styles.galleryTitle}>{photo.title}</h4>
            <span
              className={styles.galleryDescription}
            >{`${photo.pictureCount} bilder`}</span>
          </div>
        )}
        renderEmpty={() => (
          <EmptyState className={styles.emptyState} icon="images-outline">
            <h1>Ingen synlige albumer</h1>
            {actionGrant && actionGrant.includes('create') && (
              <h4>
                Trykk{' '}
                <LinkButton flat href="/photos/new">
                  <b>her</b>
                </LinkButton>{' '}
                for å lage et nytt album
              </h4>
            )}
          </EmptyState>
        )}
        photos={galleries}
        getSrc={(gallery) => gallery.cover?.file ?? ''}
      />
    </Page>
  );
};

export default Overview;
