// @flow

import React, { Component, cloneElement, type Element } from 'react';
import GalleryDetailsRow from './GalleryDetailsRow';
import Button from 'app/components/Button';
import EmptyState from 'app/components/EmptyState';
import { Link } from 'react-router';
import ImageUpload from 'app/components/Upload/ImageUpload';
import { Flex } from 'app/components/Layout';
import Gallery from 'app/components/Gallery';
import LoadingIndicator from 'app/components/LoadingIndicator';
import styles from './Overview.css';
import type { DropFile } from 'app/components/Upload';
import type { Photo, ID } from 'app/models';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';

type Props = {
  gallery: Object,
  loggedIn: Object,
  currentUser: boolean,
  pictures: Array<Photo>,
  loading: boolean,
  children: Element<*>,
  fetchAll: () => Promise<*>,
  push: string => Promise<*>,
  addPictures: (ID, File | Array<DropFile>) => Promise<*>
};

type State = {
  upload: boolean
};

export default class GalleryDetail extends Component<Props, State> {
  state = {
    upload: false
  };

  toggleUpload = (response?: File | Array<DropFile>) => {
    if (response) {
      this.props.addPictures(this.props.gallery.id, response);
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
      loading
    } = this.props;
    const { upload } = this.state;
    if (loading) return <LoadingIndicator loading />;
    return (
      <section className={styles.root}>
        <Flex wrap alignItems="center" justifyContent="space-between">
          <NavigationTab title={gallery.title} className={styles.detailTitle}>
            <NavigationLink to="/photos">
              <i className="fa fa-angle-left" /> Tilbake
            </NavigationLink>
            <NavigationLink to="">
              <Button onClick={() => this.toggleUpload()}>
                Last opp bilder
              </Button>
            </NavigationLink>
            <NavigationLink to="">
              <Button>
                <Link to={`/photos/${gallery.id}/edit`}>Rediger</Link>
              </Button>
            </NavigationLink>
          </NavigationTab>
        </Flex>

        <GalleryDetailsRow gallery={gallery} showDescription />
        <Flex>
          <Gallery
            photos={pictures}
            onClick={this.handleClick}
            srcKey="file"
            renderEmpty={() => (
              <EmptyState icon="photos-outline">
                <h1>Ingen bilder</h1>
                <h4>
                  Trykk <a onClick={() => this.toggleUpload()}>her</a> for å
                  legge inn bilder
                </h4>
              </EmptyState>
            )}
          />
        </Flex>

        {upload && (
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
      </section>
    );
  }
}
