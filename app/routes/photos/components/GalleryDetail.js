// @flow
import { Flex } from 'app/components/Layout';

import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import React, { Fragment, Component, cloneElement, type Element } from 'react';
import Tooltip from 'app/components/Tooltip';
import GalleryDetailsRow from './GalleryDetailsRow';
import EmptyState from 'app/components/EmptyState';
import ImageUpload from 'app/components/Upload/ImageUpload';
import { Content } from 'app/components/Content';
import Card from 'app/components/Card';
import Gallery from 'app/components/Gallery';
import type { DropFile } from 'app/components/Upload';
import type { ID } from 'app/models';
import type { GalleryPictureEntity } from 'app/reducers/galleryPictures';
import type { UploadStatus } from 'app/reducers/galleryPictures';

type Props = {
  gallery: Object,
  loggedIn: boolean,
  currentUser: boolean,
  pictures: Array<GalleryPictureEntity>,
  hasMore: boolean,
  fetching: boolean,
  children: Element<*>,
  fetch: (galleryId: Number, args: { next: boolean }) => Promise<*>,
  push: string => Promise<*>,
  uploadAndCreateGalleryPicture: (ID, File | Array<DropFile>) => Promise<*>,
  actionGrant: Array<string>,
  uploadStatus?: UploadStatus
};

type State = {
  upload: boolean
};

export default class GalleryDetail extends Component<Props, State> {
  props: Props;

  state: State = {
    upload: false
  };

  toggleUpload = (response?: File | Array<DropFile>) => {
    if (response) {
      this.props.uploadAndCreateGalleryPicture(this.props.gallery.id, response);
    }

    this.setState({ upload: !this.state.upload });
  };

  handleClick = (picture: Object) => {
    this.props.push(`/photos/${this.props.gallery.id}/picture/${picture.id}`);
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
      uploadStatus
    } = this.props;
    const actionGrant = gallery && gallery.actionGrant;
    const lastUploadedImageId = uploadStatus && uploadStatus.lastUploadedImage;
    const lastImage: ?GalleryPictureEntity =
      pictures &&
      pictures.find(pic => Number(pic.id) === Number(lastUploadedImageId));

    return (
      <Content>
        <NavigationTab
          title={gallery.title}
          details={<GalleryDetailsRow gallery={gallery} showDescription />}
        >
          <NavigationLink to={'/photos'}>
            <i className="fa fa-angle-left" /> Tilbake
          </NavigationLink>
          {actionGrant &&
            actionGrant.includes('edit') && (
              <div>
                <NavigationLink onClick={() => this.toggleUpload()}>
                  Last opp bilder
                </NavigationLink>
                <NavigationLink to={`/photos/${gallery.id}/edit`}>
                  Rediger
                </NavigationLink>
              </div>
            )}
        </NavigationTab>
        {
          <Card
            style={{
              zIndex: 2,
              margin: 40,
              position: 'fixed',
              bottom: 0,
              left: 0
            }}
          >
            {uploadStatus && (
              <Fragment>
                {uploadStatus.successCount + uploadStatus.failCount ===
                uploadStatus.imageCount ? (
                  <Fragment>
                    <h3>{uploadStatus.successCount} bilder ble lastet opp </h3>
                  </Fragment>
                ) : (
                  <Fragment>
                    <h3>Laster opp bilder</h3>
                    <p>
                      <b>Status</b>: {uploadStatus.successCount} av{' '}
                      {uploadStatus.imageCount}
                    </p>
                  </Fragment>
                )}
                {uploadStatus.failCount ? (
                  <p>
                    <b>Antall feil</b>:{' '}
                    <Tooltip
                      content={
                        <Flex column>
                          {uploadStatus.failedImages.map(name => (
                            <Flex>{name}</Flex>
                          ))}
                        </Flex>
                      }
                    >
                      {' '}
                      {uploadStatus.failCount}{' '}
                    </Tooltip>
                  </p>
                ) : null}

                {lastImage && (
                  <img
                    alt="Last"
                    style={{ width: 250, height: 100, objectFit: 'cover' }}
                    src={lastImage && lastImage.file}
                  />
                )}
              </Fragment>
            )}
          </Card>
        }
        <Gallery
          photos={pictures}
          hasMore={hasMore}
          fetching={fetching}
          fetchNext={() => fetch(gallery.id, { next: true })}
          onClick={this.handleClick}
          srcKey="file"
          renderEmpty={() => (
            <EmptyState icon="photos-outline">
              <h1>Ingen bilder</h1>
              <h4>
                Trykk <a onClick={() => this.toggleUpload()}>her</a> for å legge
                inn bilder
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
          cloneElement(children, { gallery, push, loggedIn, currentUser })}
      </Content>
    );
  }
}
