import { LinkButton, Page } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Images } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router';
import EmptyState from 'app/components/EmptyState';
import Gallery from 'app/components/Gallery';
import { fetchGalleries } from '~/redux/actions/GalleryActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { EntityType } from '~/redux/models/entities';
import { selectAllGalleries } from '~/redux/slices/galleries';
import { selectPaginationNext } from '~/redux/slices/selectors';
import styles from './Overview.module.css';
import type { ListGallery } from '~/redux/models/Gallery';

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
          <EmptyState
            iconNode={<Images />}
            header="Fant ingen synlige album ..."
            body={
              actionGrant?.includes('create') && (
                <span>
                  Trykk <Link to="/photos/new">her</Link> for å lage et nytt et
                </span>
              )
            }
          />
        )}
        photos={galleries}
        getSrc={(gallery) => gallery.cover?.file ?? ''}
      />
    </Page>
  );
};

export default Overview;
