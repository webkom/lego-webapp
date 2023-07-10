import FileSaver from 'file-saver';
import JsZip from 'jszip';
import { Component, cloneElement } from 'react';
import { Helmet } from 'react-helmet-async';
import Button from 'app/components/Button';
import { Content } from 'app/components/Content';
import EmptyState from 'app/components/EmptyState';
import Gallery from 'app/components/Gallery';
import LoadingIndicator from 'app/components/LoadingIndicator';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import ImageUpload from 'app/components/Upload/ImageUpload';
import type { DropFile } from 'app/components/Upload/ImageUpload';
import type { ID, ActionGrant } from 'app/models';
import type { GalleryPictureEntity } from 'app/reducers/galleryPictures';
import GalleryDetailsRow from './GalleryDetailsRow';
import type { Element } from 'react';

type Props = {
  gallery: Record<string, any>;
  loggedIn: boolean;
  currentUser: boolean;
  pictures: Array<GalleryPictureEntity>;
  hasMore: boolean;
  fetching: boolean;
  children: Element<any>;
  fetch: (
    galleryId: number,
    args: {
      next: boolean;
    }
  ) => Promise<any>;
  clear: (galleryId: number) => Promise<any>;
  push: (arg0: string) => Promise<any>;
  uploadAndCreateGalleryPicture: (
    arg0: ID,
    arg1: File | Array<DropFile>
  ) => Promise<any>;
  actionGrant: ActionGrant;
};
type State = {
  upload: boolean;
  downloading: boolean;
};
export default class GalleryDetail extends Component<Props, State> {
  state = {
    upload: false,
    downloading: false,
  };
  toggleUpload = (response?: File | Array<DropFile>) => {
    if (response) {
      this.props.uploadAndCreateGalleryPicture(this.props.gallery.id, response);
    }

    this.setState({
      upload: !this.state.upload,
    });
  };
  handleClick = (picture: Record<string, any>) => {
    this.props.push(`/photos/${this.props.gallery.id}/picture/${picture.id}`);
  };
  downloadGallery = () => {
    this.setState({
      downloading: true,
    });
    // Force re-fetch to avoid expired image urls
    this.props.clear(this.props.gallery.id);

    const finishDownload = () =>
      this.setState({
        downloading: false,
      });

    this.downloadNext(0, [])
      .then((blobs) => {
        const names = this.props.pictures.map((picture) =>
          picture.file.split('/').pop()
        );
        this.zipFiles(this.props.gallery.title, names, blobs).finally(
          finishDownload
        );
      })
      .catch(finishDownload);
  };
  downloadNext = (index: number, blobsAccum: Blob[]) => {
    return this.props
      .fetch(this.props.gallery.id, {
        next: true,
        filters: {},
      })
      .then(() => {
        const urls = this.props.pictures
          .slice(index)
          .map((picture) => picture.rawFile);
        return this.downloadFiles(urls).then((blobs) => {
          blobsAccum.push(...blobs);

          if (this.props.hasMore) {
            return this.downloadNext(this.props.pictures.length, blobsAccum);
          }

          return blobsAccum;
        });
      });
  };
  downloadFiles = (urls: string[]) =>
    Promise.all(
      urls.map(async (url) => await fetch(url).then((res) => res.blob()))
    );
  zipFiles = (zipTitle: string, fileNames: string[], blobs: Blob[]) => {
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

  render() {
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
    } = this.props;
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
                {this.state.downloading ? (
                  <LoadingIndicator loading={true} small margin={0} />
                ) : (
                  <Button flat={true} onClick={this.downloadGallery}>
                    Last ned album
                  </Button>
                )}
              </div>
            </>
          }
        >
          {actionGrant?.includes('edit') && (
            <div>
              <NavigationLink to="#" onClick={() => this.toggleUpload()}>
                Last opp bilder
              </NavigationLink>
              <NavigationLink to={`/photos/${gallery.id}/edit`}>
                Rediger
              </NavigationLink>
            </div>
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
          onClick={this.handleClick}
          srcKey="file"
          renderEmpty={() => (
            <EmptyState icon="photos-outline">
              <h1>Ingen bilder</h1>
              <h4>
                Trykk{' '}
                <Button flat onClick={() => this.toggleUpload()}>
                  <b>her</b>
                </Button>{' '}
                for å legge inn bilder
              </h4>
            </EmptyState>
          )}
        />

        {this.state.upload && (
          <ImageUpload
            inModal
            multiple
            crop={false}
            onClose={this.toggleUpload}
            onSubmit={this.toggleUpload}
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
  }
}
