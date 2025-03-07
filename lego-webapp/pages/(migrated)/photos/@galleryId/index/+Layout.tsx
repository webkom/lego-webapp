import {
  Button,
  Icon,
  LinkButton,
  LoadingPage,
  Page,
} from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { ImageDown, ImagePlus, Images, Pencil } from 'lucide-react';
import { PropsWithChildren, useState } from 'react';
import { navigate } from 'vike/client/router';
import HTTPError from 'app/routes/errors/HTTPError';
import EmptyState from '~/components/EmptyState';
import Gallery from '~/components/Gallery';
import PropertyHelmet, {
  type PropertyGenerator,
} from '~/components/PropertyHelmet';
import ImageUpload from '~/components/Upload/ImageUpload';
import LoginPage from '~/pages/(migrated)/auth/+Page';
import { downloadFiles, zipFiles } from '~/pages/(migrated)/photos/utils';
import {
  fetchGallery,
  fetchGalleryMetadata,
} from '~/redux/actions/GalleryActions';
import {
  fetchGalleryPictures,
  uploadAndCreateGalleryPicture,
} from '~/redux/actions/GalleryPictureActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { EntityType } from '~/redux/models/entities';
import { useIsLoggedIn } from '~/redux/slices/auth';
import { selectGalleryById } from '~/redux/slices/galleries';
import {
  clearGallery,
  selectGalleryPicturesByGalleryId,
} from '~/redux/slices/galleryPictures';
import { selectPaginationNext } from '~/redux/slices/selectors';
import { appConfig } from '~/utils/appConfig';
import { useParams } from '~/utils/useParams';
import useQuery from '~/utils/useQuery';
import GalleryDetailsRow from '../../GalleryDetailsRow';
import styles from '../../Overview.module.css';
import type { DropFile } from '~/components/Upload/ImageUpload';
import type { DetailedGallery } from '~/redux/models/Gallery';
import type { GalleryListPicture } from '~/redux/models/GalleryPicture';

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

const GalleryDetail = ({ children }: PropsWithChildren) => {
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
            href={`${appConfig?.webUrl}/photos/${gallery.id}`}
          />
        </PropertyHelmet>

        {children}

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
    return <LoginPage loginRequired />;
  }

  return <HTTPError />;
};

export default GalleryDetail;
