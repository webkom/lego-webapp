import { Button, Icon, LoadingIndicator } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import FileSaver from 'file-saver';
import JsZip from 'jszip';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchGallery, fetchGalleryMetadata } from 'app/actions/GalleryActions';
import {
  fetch,
  clear,
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
import { selectGalleryById } from 'app/reducers/galleries';
import { SelectGalleryPicturesByGalleryId } from 'app/reducers/galleryPictures';
import { useUserContext } from 'app/routes/app/AppRoute';
import HTTPError from 'app/routes/errors/HTTPError';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import GalleryDetailsRow from './GalleryDetailsRow';
import styles from './Overview.css';
import type { DropFile } from 'app/components/Upload/ImageUpload';
import type { DetailedGallery } from 'app/store/models/Gallery';

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
      content: gallery.cover.file,
    },
  ];
};

const GalleryDetail = () => {
  const [upload, setUpload] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const { galleryId } = useParams<{ galleryId: string }>();
  const gallery = useAppSelector((state) =>
    selectGalleryById(state, { galleryId }),
  );
  const pictures = useAppSelector((state) =>
    SelectGalleryPicturesByGalleryId(state, { galleryId }),
  );
  const fetching = useAppSelector(
    (state) => state.galleries.fetching || state.galleryPictures.fetching,
  );
  const hasMore = useAppSelector((state) => state.galleryPictures.hasMore);
  const { loggedIn } = useUserContext();

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchGalleryDetail',
    () =>
      galleryId &&
      Promise.allSettled([
        dispatch(fetch(galleryId)).catch(),
        dispatch(fetchGallery(galleryId)).catch(() =>
          dispatch(fetchGalleryMetadata(galleryId)),
        ),
      ]),
    [],
  );

  const toggleUpload = (response?: File | DropFile[]) => {
    if (response) {
      dispatch(uploadAndCreateGalleryPicture(gallery.id, response));
    }

    setUpload(!upload);
  };

  const navigate = useNavigate();

  const handleClick = (picture) => {
    navigate(`/photos/${gallery.id}/picture/${picture.id}`);
  };

  const downloadGallery = () => {
    setDownloading(true);
    // Force re-fetch to avoid expired image urls
    clear(gallery.id);

    const finishDownload = () => setDownloading(false);

    downloadNext(0, [])
      .then((blobs) => {
        const names = pictures.map((picture) => picture.file.split('/').pop());
        zipFiles(gallery.title, names, blobs).finally(finishDownload);
      })
      .catch(finishDownload);
  };

  const downloadNext = (index: number, blobsAccum: Blob[]) => {
    return dispatch(
      fetch(gallery.id, {
        next: true,
        filters: {},
      }),
    ).then(() => {
      const urls = pictures.slice(index).map((picture) => picture.rawFile);
      return downloadFiles(urls).then((blobs) => {
        blobsAccum.push(...blobs);

        if (hasMore) {
          return downloadNext(pictures.length, blobsAccum);
        }

        return blobsAccum;
      });
    });
  };

  const downloadFiles = (urls: string[]) =>
    Promise.all(
      urls.map(async (url) => await fetch(url).then((res) => res.blob())),
    );

  const zipFiles = (zipTitle: string, fileNames: string[], blobs: Blob[]) => {
    const zip = JsZip();
    blobs.forEach((blob, i) => {
      zip.file(fileNames[i], blob);
    });
    return zip
      .generateAsync({
        type: 'blob',
      })
      .then((zipFile) => FileSaver.saveAs(zipFile, `${zipTitle}.zip`));
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
          hasMore={hasMore}
          fetching={fetching}
          fetchNext={() =>
            dispatch(
              fetch(gallery.id, {
                next: true,
              }),
            )
          }
          onClick={handleClick}
          srcKey="file"
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

  if (fetching) {
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
