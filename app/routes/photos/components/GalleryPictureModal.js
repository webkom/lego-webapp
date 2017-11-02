// @flow

import React, { Component } from 'react';
import GalleryDetailsRow from './GalleryDetailsRow';
import { Flex, Content } from 'app/components/Layout';
import Icon from 'app/components/Icon';
import ProgressiveImage from 'app/components/ProgressiveImage';
import Dropdown from 'app/components/Dropdown';
import { Link } from 'react-router';
import CommentView from 'app/components/Comments/CommentView';
import Modal from 'app/components/Modal';
import styles from './GalleryPictureModal.css';

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

const Taggees = ({ taggees }: { taggees: Array<Object> }) => {
  if (taggees.length === 1) {
    return (
      <span>
        <br />
        <span>med </span>
        <Link key={taggees[0].id} to={`/users/${taggees[0].username}`}>
          {taggees[0].fullName}
        </Link>
      </span>
    );
  } else {
    return (
      <span>
        <br />
        <span>med </span>
        {taggees.map((taggee, index) => (
          <span key={taggee.id}>
            {taggees.length === index + 1 ? (
              <span>
                <span>{'og '}</span>
                <Link to={`/users/${taggee.username}`}>{taggee.fullName}</Link>
              </span>
            ) : (
              <span style={{ marginRight: '5px' }}>
                <Link to={`/users/${taggee.username}`}>{taggee.fullName}</Link>
                {taggees.length === index + 2 ? null : <span>,</span>}
              </span>
            )}
          </span>
        ))}
      </span>
    );
  }
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
        backdropClassName={styles.backdrop}
        backdrop
        show
        contentClassName={styles.content}
      >
        <Content className={styles.topContent}>
          <Flex width="100%" justifyContent="space-between" alignItems="center">
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
              placement="bottom"
              toggle={this.toggleDropdown}
              className={styles.dropdown}
              iconName="more"
            >
              <Dropdown.List>
                <Dropdown.ListItem>
                  <a
                    href={picture.rawFile}
                    download
                    onClick={this.toggleDropdown}
                    style={{ color: '#333' }}
                  >
                    <strong>Last ned</strong>
                    <Icon name="download-outline" size={24} />
                  </a>
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
        </Content>
        <Flex className={styles.pictureContainer}>
          <ProgressiveImage src={picture.file} alt="some alt" />
        </Flex>
        <Content className={styles.bottomContent}>
          <Flex className={styles.pictureDescription}>
            <p>
              {picture.description}
              {picture.taggees.length > 0 && (
                <Taggees taggees={picture.taggees} />
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
                comments={comments}
              />
            </Flex>
          )}
        </Content>
      </Modal>
    );
  }
}
