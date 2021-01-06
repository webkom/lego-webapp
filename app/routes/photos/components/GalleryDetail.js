// @flow

import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import type { Element } from 'react';
import { Component, cloneElement } from 'react';
import GalleryDetailsRow from './GalleryDetailsRow';
import EmptyState from 'app/components/EmptyState';
import ImageUpload from 'app/components/Upload/ImageUpload';
import { Content } from 'app/components/Content';
import Gallery from 'app/components/Gallery';
import type { DropFile } from 'app/components/Upload';
import type { ID, ActionGrant } from 'app/models';
import type { GalleryPictureEntity } from 'app/reducers/galleryPictures';
import Button from 'app/components/Button';

type Props = {
  gallery: Object,
  loggedIn: boolean,
  currentUser: boolean,
  pictures: Array<GalleryPictureEntity>,
  hasMore: boolean,
  fetching: boolean,
  children: Element<*>,
  fetch: (galleryId: Number, args: { next: boolean }) => Promise<*>,
  push: (string) => Promise<*>,
  uploadAndCreateGalleryPicture: (ID, File | Array<DropFile>) => Promise<*>,
  actionGrant: ActionGrant,
};

type State = {
  upload: boolean,
};

export default class GalleryDetail extends Component<Props, State> {
  state = {
    upload: false,
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
    } = this.props;
    const actionGrant = gallery && gallery.actionGrant;

    return (
      <Content>
        <NavigationTab
          title={gallery.title}
          details={<GalleryDetailsRow gallery={gallery} showDescription />}
        >
          <NavigationLink
            onClick={(e: Event) => {
              // TODO fix this hack when react-router is done
              if (!window.location.hash) return;
              window.history.back();
              e.preventDefault();
            }}
            to="/photos"
          >
            <i className="fa fa-angle-left" /> Tilbake
          </NavigationLink>
          {actionGrant && actionGrant.includes('edit') && (
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
          fetchNext={() => fetch(gallery.id, { next: true })}
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
          cloneElement(children, { gallery, push, loggedIn, currentUser })}
      </Content>
    );
  }
}
