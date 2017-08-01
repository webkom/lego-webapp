// @flow

import React, { Component } from 'react';
import moment from 'moment';
import { Flex } from 'app/components/Layout';
import Button from 'app/components/Button';
import Icon from 'app/components/Icon';
import Dropdown from 'app/components/Dropdown';
import { Link } from 'react-router';
import CommentView from 'app/components/Comments/CommentView';
import Modal from 'app/components/Modal';
import styles from './GalleryPictureModal.css';

const Keyboard = {
  ESCAPE: 27,
  RIGHT: 39,
  LEFT: 37
};

type Props = {
  picture: Object,
  gallery: Object,
  push: () => void,
  comments: []
};

export default class GalleryPictureModal extends Component {
  props: Props;

  state: State = {
    showMore: false,
    edit: false,
    loading: false
  };

  toggleDropdown = () => {
    this.setState({ showMore: !this.state.showMore });
  };

  edit = () => {
    this.toggleDropdown();
    this.setState({ edit: true });
  };

  cover = () => {
    this.toggleDropdown();
  };

  delete = () => {
    this.toggleDropdown();
  };

  handleKeyDown = (e: Event) => {
    const { gallery, picture, push } = this.props;

    switch (e.which) {
      case Keyboard.LEFT:
        e.preventDefault();
        const previousPicture =
          gallery.pictures[gallery.pictures.indexOf(picture.id) - 1];

        if (previousPicture) {
          push(`/photos/${gallery.id}/picture/${previousPicture}`);
        }
        break;

      case Keyboard.RIGHT:
        e.preventDefault();
        const nextPicture =
          gallery.pictures[gallery.pictures.indexOf(picture.id) + 1];

        if (nextPicture) {
          push(`/photos/${gallery.id}/picture/${nextPicture}`);
        }
        break;

      case Keyboard.ESCAPE:
        e.preventDefault();
        push(`/photos/${gallery.id}`);
        break;

      default:
    }
  };

  render() {
    const {
      picture,
      comments,
      currentUser,
      loggedIn,
      push,
      gallery
    } = this.props;
    const { showMore } = this.state;

    return (
      <Modal
        onHide={() => push(`/photos/${gallery.id}`)}
        backdrop
        onKeyDown={this.handleKeyDown}
        show
        contentClassName={styles.content}
      >
        <Flex justifyContent="center" alignItems="center">
          <Flex className={styles.pictureContainer}>
            <div className={styles.picture}>
              <img src={picture.file} alt="some alt" />
            </div>
          </Flex>
          <div className={styles.contentContainer}>
            <Flex
              width="100%"
              justifyContent="space-between"
              alignItems="center"
            >
              <Flex justifyContent="space-between">
                <img
                  className={styles.galleryThumbnail}
                  src={gallery.cover.thumbnail}
                />

                <div>
                  <h5 className={styles.header}>
                    <Link to={`/photos/${gallery.id}`}>
                      {gallery.title}
                    </Link>
                  </h5>
                  <h5 className={styles.header}>
                    {moment(gallery.takenAt).utc().format('YYYY-MM-DD')}
                  </h5>
                </div>
              </Flex>

              <Dropdown
                show={showMore}
                placement="bottom"
                toggle={this.toggleDropdown}
                iconName="more"
              >
                <Dropdown.List>
                  <Dropdown.ListItem>
                    <Link
                      href={picture.rawFile}
                      download
                      onClick={this.toggleDropdown}
                      style={{ color: '#333' }}
                    >
                      <strong>Last ned</strong>
                      <Icon name="download-outline" size={24} />
                    </Link>
                  </Dropdown.ListItem>
                  <Dropdown.ListItem>
                    <Link onClick={this.edit} style={{ color: '#333' }}>
                      <strong>Rediger</strong>
                      <Icon name="gear" size={24} />
                    </Link>
                  </Dropdown.ListItem>
                  <Dropdown.ListItem>
                    <Link onClick={this.cover} style={{ color: '#333' }}>
                      <strong>Sett som album cover</strong>
                      <Icon name="image" size={24} />
                    </Link>
                  </Dropdown.ListItem>
                  <Dropdown.Divider />
                  <Dropdown.ListItem>
                    <Link onClick={this.delete}>
                      Slett
                      <Icon name="trash-outline" size={44} />
                    </Link>
                  </Dropdown.ListItem>
                </Dropdown.List>
              </Dropdown>
            </Flex>

            <Flex className={styles.pictureDescription} width="100%">
              <p>
                {picture.description}
              </p>
            </Flex>

            {picture.commentTarget &&
              <Flex className={styles.pictureDescription} width="100%">
                <CommentView
                  formEnabled
                  user={currentUser}
                  commentTarget={picture.commentTarget}
                  loggedIn={loggedIn}
                  comments={comments}
                />
              </Flex>}
          </div>
        </Flex>
      </Modal>
    );
  }
}
