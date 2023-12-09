import { Button } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom-v5-compat';
import { fetch } from 'app/actions/GalleryActions';
import { Content } from 'app/components/Content';
import EmptyState from 'app/components/EmptyState';
import Gallery from 'app/components/Gallery';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import { selectGalleries } from 'app/reducers/galleries';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import styles from './Overview.css';

const Overview = () => {
  const galleries = useAppSelector(selectGalleries);
  const fetching = useAppSelector((state) => state.galleries.fetching);
  const hasMore = useAppSelector((state) => state.galleries.hasMore);
  const actionGrant = useAppSelector((state) => state.galleries.actionGrant);

  const dispatch = useAppDispatch();

  usePreparedEffect('fetchGalleryList', () => dispatch(fetch()), []);

  const navigate = useNavigate();

  return (
    <Content>
      <Helmet title="Album" />
      {actionGrant && actionGrant.includes('create') && (
        <NavigationTab title="Album">
          <NavigationLink to="/photos/new">Nytt album</NavigationLink>
        </NavigationTab>
      )}

      <Gallery
        hasMore={hasMore}
        fetching={fetching}
        fetchNext={() =>
          dispatch(
            fetch({
              next: true,
            })
          )
        }
        onClick={(gallery) => navigate(`/photos/${gallery.id}#list`)}
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
                <Button flat onClick={() => navigate('/photos/new')}>
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
};

export default Overview;
