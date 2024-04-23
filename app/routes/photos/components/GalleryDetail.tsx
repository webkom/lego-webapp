import { Button, Icon, LoadingIndicator } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchGallery, fetchGalleryMetadata } from 'app/actions/GalleryActions';
import {
  fetchGalleryPictures,
  uploadAndCreateGalleryPicture,
} from 'app/actions/GalleryPictureActions';
import { Content } from 'app/components/Content';
import EmptyState from 'app/components/EmptyState';
import Gallery from 'app/components/Gallery';
import { LoginRequiredPage } from 'app/components/LoginForm';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import PropertyHelmet, {
  type PropertyGenerator,
} from 'app/components/PropertyHelmet';
import ImageUpload from 'app/components/Upload/ImageUpload';
import config from 'app/config';
import { useIsLoggedIn } from 'app/reducers/auth';
import { selectGalleryById } from 'app/reducers/galleries';
import {
  clearGallery,
  selectGalleryPicturesByGalleryId,
} from 'app/reducers/galleryPictures';
import { selectPaginationNext } from 'app/reducers/selectors';
import HTTPError from 'app/routes/errors/HTTPError';
import { downloadFiles, zipFiles } from 'app/routes/photos/components/utils';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { EntityType } from 'app/store/models/entities';
import GalleryDetailsRow from './GalleryDetailsRow';
import styles from './Overview.css';
import type { DropFile } from 'app/components/Upload/ImageUpload';
import type { DetailedGallery } from 'app/store/models/Gallery';
import type { GalleryListPicture } from 'app/store/models/GalleryPicture';

const propertyGenerator: PropertyGenerator<{
  gallery: DetailedGallery;
}> = ({ gallery }, config) => {
  if (!gallery) return;
  return [
    {
      property: 'og:title',
      content: gallery.title,
    },
    {
      property: 'og:description',
      content: gallery.description,
    },
    {
      property: 'og:url',
      content: `${config?.webUrl}/gallery/${gallery.id}`,
    },
    {
      property: 'og:image',
      content: gallery.cover?.file,
    },
  ];
};

const GalleryDetail = () => {
  const navigate = useNavigate();
  const [upload, setUpload] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const { galleryId } = useParams<{ galleryId: string }>();
  const gallery = useAppSelector((state) =>
    selectGalleryById<DetailedGallery>(state, galleryId),
  );
  const pictures = useAppSelector((state) =>
    selectGalleryPicturesByGalleryId(state, Number(galleryId)),
  );
  const fetchingGalleries = useAppSelector((state) => state.galleries.fetching);
  const fetchingGalleryPictures = useAppSelector(
    (state) => state.galleryPictures.fetching,
  );
  const { pagination } = useAppSelector(
    selectPaginationNext({
      endpoint: `/galleries/${galleryId}/pictures/`,
      entity: EntityType.GalleryPictures,
      query: {},
    }),
  );
  const hasMore = pagination.hasMore;
  const loggedIn = useIsLoggedIn();

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchGalleryDetail',
    () =>
      galleryId &&
      Promise.allSettled([
        dispatch(fetchGalleryPictures(galleryId)).catch(),
        dispatch(fetchGallery(galleryId)).catch(() =>
          dispatch(fetchGalleryMetadata(galleryId)),
        ),
      ]),
    [],
  );

  if (!gallery || fetchingGalleries) {
    return (
      <Content>
        <LoadingIndicator loading />
      </Content>
    );
  }

  const toggleUpload = (response?: File | DropFile[]) => {
    if (response) {
      dispatch(uploadAndCreateGalleryPicture(gallery.id, response));
    }

    setUpload(!upload);
  };

  const handleClick = (picture: GalleryListPicture) => {
    navigate(`/photos/${gallery.id}/picture/${picture.id}`);
  };

  const downloadGallery = () => {
    setDownloading(true);
    // Force re-fetch to avoid expired image urls
    dispatch(clearGallery(gallery.id));

    const finishDownload = () => setDownloading(false);

    downloadNext(0, [])
      .then((blobs) => {
        const names = pictures.map((picture) => picture.file.split('/').pop()!);
        zipFiles(gallery.title, names, blobs).finally(finishDownload);
      })
      .catch(finishDownload);
  };

  const downloadNext = async (
    index: number,
    blobsAccum: Blob[],
  ): Promise<Blob[]> => {
    await dispatch(
      fetchGalleryPictures(gallery.id, {
        next: true,
        query: {},
      }),
    );
    const urls = pictures.slice(index).map((picture) => picture.rawFile);
    const blobs = await downloadFiles(urls);
    blobsAccum.push(...blobs);

    if (hasMore) {
      return downloadNext(pictures.length, blobsAccum);
    }

    return blobsAccum;
  };

  const actionGrant = gallery && gallery.actionGrant;

  // Some galleries are open to the public
  if (gallery && gallery.createdAt) {
    return (
      <Content>
        <PropertyHelmet
          propertyGenerator={propertyGenerator}
          options={{ gallery }}
        >
          <title>{gallery.title}</title>
          <link
            rel="canonical"
            href={`${config?.webUrl}/photos/${gallery.id}`}
          />
        </PropertyHelmet>

        <NavigationTab
          title={gallery.title}
          back={{
            label: 'Tilbake',
            path: '/photos',
          }}
          details={
            <>
              <GalleryDetailsRow gallery={gallery} showDescription />
              <div>
                <Button onClick={downloadGallery} pending={downloading}>
                  <Icon name="download-outline" size={19} />
                  Last ned album
                </Button>
              </div>
            </>
          }
        >
          {actionGrant?.includes('edit') && (
            <>
              <NavigationLink
                to={`/photos/${gallery.id}?upload`}
                onClick={() => toggleUpload()}
              >
                Last opp bilder
              </NavigationLink>
              <NavigationLink to={`/photos/${gallery.id}/edit`}>
                Rediger
              </NavigationLink>
            </>
          )}
        </NavigationTab>

        <Gallery
          photos={pictures}
          hasMore={pagination.hasMore}
          fetching={fetchingGalleryPictures}
          fetchNext={() =>
            dispatch(
              fetchGalleryPictures(gallery.id, {
                next: true,
              }),
            )
          }
          onClick={handleClick}
          getSrc={(photo) => photo.file}
          renderEmpty={() => (
            <EmptyState className={styles.emptyState} icon="images-outline">
              <h1>Ingen bilder</h1>
              <h4>
                Trykk{' '}
                <Button flat onClick={() => toggleUpload()}>
                  <b>her</b>
                </Button>{' '}
                for å legge inn bilder
              </h4>
            </EmptyState>
          )}
        />

        {upload && (
          <ImageUpload
            inModal
            multiple
            crop={false}
            onClose={toggleUpload}
            onSubmit={toggleUpload}
          />
        )}
      </Content>
    );
  }

  if (fetchingGalleryPictures) {
    return (
      <Content>
        <LoadingIndicator loading />
      </Content>
    );
  }

  if (!loggedIn) {
    return <LoginRequiredPage />;
  }

  return <HTTPError />;
};

export default GalleryDetail;
