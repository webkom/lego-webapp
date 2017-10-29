// @flow

import React, { Component } from 'react';
import GalleryDetailsRow from './GalleryDetailsRow';
import { Flex } from 'app/components/Layout';
import Icon from 'app/components/Icon';
import Dropdown from 'app/components/Dropdown';
import { Link } from 'react-router';
import CommentView from 'app/components/Comments/CommentView';
import Modal from 'app/components/Modal';
import styles from './GalleryPictureModal.css';
import { Keyboard } from 'app/utils/constants';

type Props = {
  picture: Object,
  currentUser: Object,
  loggedIn: boolean,
  gallery: Object,
  push: string => void,
  updateGalleryCover: (number, number) => Promise<*>,
  deletePicture: (number, number) => Promise<*>,
  comments: Array<Object>
};

type State = {
  showMore: boolean
};

export default class GalleryPictureModal extends Component<Props, State> {
  state: State = {
    showMore: false
  };

  toggleDropdown = () => {
    this.setState({ showMore: !this.state.showMore });
  };

  onUpdate = () => {
    this.props.push(
      `/photos/${this.props.gallery.id}/picture/${this.props.picture.id}/edit`
    );
  };

  onUpdateGalleryCover = () => {
    this.props.updateGalleryCover(this.props.gallery.id, this.props.picture.id);

    this.toggleDropdown();
  };

  onDeletePicture = () => {
    this.props.deletePicture(this.props.gallery.id, this.props.picture.id);

    this.props.push(`/photos/${this.props.gallery.id}`);
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
        show
        contentClassName={styles.content}
      >
        <Flex
          className={styles.container}
          justifyContent="flex-start"
          alignItems="center"
        >
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
                  alt="some alt"
                  src={gallery.cover.thumbnail}
                />

                <Flex column justifyContent="space-around">
                  <h5 className={styles.header}>
                    <Link to={`/photos/${gallery.id}`}>{gallery.title}</Link>
                  </h5>
                  <GalleryDetailsRow size="small" gallery={gallery} />
                </Flex>
              </Flex>

              <Dropdown
                show={showMore}
                placement="left"
                toggle={this.toggleDropdown}
                className={styles.dropdown}
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
                    <Link onClick={this.onUpdate} style={{ color: '#333' }}>
                      <strong>Rediger</strong>
                      <Icon name="gear" size={24} />
                    </Link>
                  </Dropdown.ListItem>
                  <Dropdown.ListItem>
                    <Link
                      onClick={this.onUpdateGalleryCover}
                      style={{ color: '#333' }}
                    >
                      <strong>Sett som album cover</strong>
                      <Icon name="image" size={24} />
                    </Link>
                  </Dropdown.ListItem>
                  <Dropdown.Divider />
                  <Dropdown.ListItem>
                    <Link onClick={this.onDeletePicture}>
                      Slett
                      <Icon name="trash-outline" size={44} />
                    </Link>
                  </Dropdown.ListItem>
                </Dropdown.List>
              </Dropdown>
            </Flex>

            <Flex className={styles.pictureDescription}>
              <p>
                {picture.description}
                {picture.taggees.length > 0 && (
                  <span>
                    <br />
                    <i>
                      med
                      {picture.taggees.map(taggee => (
                        <Link key={taggee.id} to={`/users/${taggee.username}`}>
                          <span> {taggee.fullName} </span>
                        </Link>
                      ))}
                    </i>
                  </span>
                )}
              </p>
            </Flex>

            {picture.commentTarget && (
              <Flex className={styles.pictureDescription}>
                <CommentView
                  style={{ width: '100%' }}
                  formEnabled
                  user={currentUser}
                  commentTarget={picture.commentTarget}
                  loggedIn={loggedIn}
                  style={{ width: '100%' }}
                  comments={comments}
                />
              </Flex>
            )}
          </div>
        </Flex>
      </Modal>
    );
  }
}
