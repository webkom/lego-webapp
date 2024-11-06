import {
  Button,
  Icon,
  LinkButton,
  LoadingPage,
  Page,
} from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { ImageDown, ImagePlus, Images, Pencil } from 'lucide-react';
import { useState } from 'react';
import { useParams, useNavigate, Outlet } from 'react-router-dom';
import { fetchGallery, fetchGalleryMetadata } from 'app/actions/GalleryActions';
import {
  fetchGalleryPictures,
  uploadAndCreateGalleryPicture,
} from 'app/actions/GalleryPictureActions';
import EmptyState from 'app/components/EmptyState';
import Gallery from 'app/components/Gallery';
import { LoginRequiredPage } from 'app/components/LoginForm';
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
import useQuery from 'app/utils/useQuery';
import GalleryDetailsRow from './GalleryDetailsRow';
import styles from './Overview.module.css';
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

const galleryDetailDefaultQuery = {
  upload: 'false',
};

const GalleryDetail = () => {
  const navigate = useNavigate();
  const { query, setQueryValue } = useQuery(galleryDetailDefaultQuery);
  const upload = query.upload === 'true';
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
    return <LoadingPage loading={fetchingGalleries} />;
  }

  const toggleUpload = (response?: File | DropFile[]) => {
    if (response) {
      dispatch(uploadAndCreateGalleryPicture(gallery.id, response));
    }
    setQueryValue('upload')(String(!upload));
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
      <Page
        title={gallery.title}
        back={{
          href: '/photos',
        }}
        actionButtons={[
          actionGrant?.includes('edit') && (
            <LinkButton
              key="upload"
              href={`/photos/${gallery.id}/?upload=true`}
              onPress={() => toggleUpload()}
            >
              <Icon iconNode={<ImagePlus />} size={19} />
              Last opp bilder
            </LinkButton>
          ),
          actionGrant?.includes('edit') && (
            <LinkButton key="edit" href={`/photos/${gallery.id}/edit`}>
              <Icon iconNode={<Pencil />} size={19} />
              Rediger
            </LinkButton>
          ),
          <Button
            key="download"
            onPress={downloadGallery}
            isPending={downloading}
          >
            <Icon iconNode={<ImageDown />} size={19} />
            Last ned album
          </Button>,
        ]}
      >
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

        <Outlet />

        <GalleryDetailsRow gallery={gallery} showDescription />

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
            <EmptyState
              iconNode={<Images />}
              header="Albumet er tomt ..."
              body={
                <span>
                  Trykk{' '}
                  <b
                    className={styles.toggleButton}
                    onClick={() => toggleUpload()}
                  >
                    her
                  </b>{' '}
                  for å legge inn bilder
                </span>
              }
            />
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
      </Page>
    );
  }

  if (fetchingGalleryPictures) {
    return <LoadingPage loading={fetchingGalleryPictures} />;
  }

  if (!loggedIn) {
    return <LoginRequiredPage />;
  }

  return <HTTPError />;
};

export default GalleryDetail;
