import { Button, Icon } from '@webkom/lego-bricks';
import FileSaver from 'file-saver';
import JsZip from 'jszip';
import { cloneElement, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Content } from 'app/components/Content';
import EmptyState from 'app/components/EmptyState';
import Gallery from 'app/components/Gallery';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import ImageUpload from 'app/components/Upload/ImageUpload';
import GalleryDetailsRow from './GalleryDetailsRow';
import type { DropFile } from 'app/components/Upload/ImageUpload';
import type { ID, ActionGrant } from 'app/models';
import type { GalleryPictureEntity } from 'app/reducers/galleryPictures';
import type { History } from 'history';
import type { ReactNode } from 'react';

type Props = {
  gallery: Record<string, any>;
  loggedIn: boolean;
  currentUser: boolean;
  pictures: Array<GalleryPictureEntity>;
  hasMore: boolean;
  fetching: boolean;
  children: ReactNode;
  fetch: (
    galleryId: number,
    args: {
      next: boolean;
    }
  ) => Promise<any>;
  clear: (galleryId: number) => Promise<any>;
  push: History['push'];
  uploadAndCreateGalleryPicture: (
    arg0: ID,
    arg1: File | Array<DropFile>
  ) => Promise<any>;
  actionGrant: ActionGrant;
};

const GalleryDetail = (props: Props) => {
  const [upload, setUpload] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const toggleUpload = (response?: File | DropFile[]) => {
    if (response) {
      props.uploadAndCreateGalleryPicture(props.gallery.id, response);
    }

    setUpload(!upload);
  };

  const handleClick = (picture) => {
    props.push(`/photos/${props.gallery.id}/picture/${picture.id}`);
  };

  const downloadGallery = () => {
    setDownloading(true);
    // Force re-fetch to avoid expired image urls
    props.clear(props.gallery.id);

    const finishDownload = () => setDownloading(false);

    downloadNext(0, [])
      .then((blobs) => {
        const names = props.pictures.map((picture) =>
          picture.file.split('/').pop()
        );
        zipFiles(props.gallery.title, names, blobs).finally(finishDownload);
      })
      .catch(finishDownload);
  };

  const downloadNext = (index: number, blobsAccum: Blob[]) => {
    return props
      .fetch(props.gallery.id, {
        next: true,
        filters: {},
      })
      .then(() => {
        const urls = props.pictures
          .slice(index)
          .map((picture) => picture.rawFile);
        return downloadFiles(urls).then((blobs) => {
          blobsAccum.push(...blobs);

          if (props.hasMore) {
            return downloadNext(props.pictures.length, blobsAccum);
          }

          return blobsAccum;
        });
      });
  };

  const downloadFiles = (urls: string[]) =>
    Promise.all(
      urls.map(async (url) => await fetch(url).then((res) => res.blob()))
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

  const {
    gallery,
    pictures,
    children,
    push,
    loggedIn,
    currentUser,
    hasMore,
    fetch,
    fetching,
  } = props;

  const actionGrant = gallery && gallery.actionGrant;

  return (
    <Content>
      <Helmet title={gallery.title} />
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
            <NavigationLink to="#" onClick={() => toggleUpload()}>
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
          fetch(gallery.id, {
            next: true,
          })
        }
        onClick={handleClick}
        srcKey="file"
        renderEmpty={() => (
          <EmptyState icon="photos-outline">
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

      {children &&
        cloneElement(children, {
          gallery,
          push,
          loggedIn,
          currentUser,
        })}
    </Content>
  );
};

export default GalleryDetail;
