// @flow

import React, { Component, cloneElement } from 'react';
import GalleryDetailsRow from './GalleryDetailsRow';
import Button from 'app/components/Button';
import EmptyState from 'app/components/EmptyState';
import { Link } from 'react-router';
import { ImageUpload } from 'app/components/Upload';
import { Flex } from 'app/components/Layout';
import Gallery from 'app/components/Gallery';
import styles from './Overview.css';

type Props = {
  gallery: Object,
  loggedIn: Object,
  currentUser: boolean,
  pictures: [],
  loading: boolean,
  children: ReactElement,
  fetchAll: () => Promise,
  push: string => Promise,
  addPictures: () => Promise
};

type State = {
  upload: boolean
};

export default class GalleryDetail extends Component {
  props: Props;

  state: State = {
    upload: false
  };

  toggleUpload = response => {
    if (response) {
      this.props.addPictures(this.props.gallery.id, response);
    }

    this.setState({ upload: !this.state.upload });
  };

  handleClick = (picture: Object) => {
    this.props.push(`/photos/${this.props.gallery.id}/picture/${picture.id}`);
  };

  render() {
    const { gallery, pictures, children, push, loggedIn, currentUser } = this.props;
    const { upload } = this.state;

    return (
      <section className={styles.root}>
        <Flex wrap alignItems="center" justifyContent="space-between">
          <h1 className={styles.header}>{gallery.title}</h1>

          <div className={styles.galleryActions}>
            <Button onClick={() => this.toggleUpload()}>Last opp bilder</Button>
            <Button>
              <Link to={`/photos/${gallery.id}/edit`}>Rediger</Link>
            </Button>
          </div>
        </Flex>
        <GalleryDetailsRow gallery={gallery} showDescription />
        <Flex>
          <Gallery
            photos={pictures}
            onClick={this.handleClick}
            srcKey="file"
            renderEmpty={
              <EmptyState icon="photos-outline">
                <h1>Ingen bilder</h1>
                <h4>
                  Trykk <a onClick={() => this.toggleUpload()}>her</a> for å legge inn bilder
                </h4>
              </EmptyState>
            }
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

        {children && cloneElement(children, { gallery, push, loggedIn, currentUser })}
      </section>
    );
  }
}
