// @flow

import React, { Component } from 'react';
import { Keyboard } from '../../../utils/constants';
import GalleryDetailsRow from './GalleryDetailsRow';
import { Flex } from 'app/components/Layout';
import { Content } from 'app/components/Content';
import Icon from 'app/components/Icon';
import ProgressiveImage from 'app/components/ProgressiveImage';
import Dropdown from 'app/components/Dropdown';
import { Link } from 'react-router';
import CommentView from 'app/components/Comments/CommentView';
import Modal from 'app/components/Modal';
import styles from './GalleryPictureModal.css';
import Swipeable from 'react-swipeable';

type Props = {
  picture: Object,
  pictureId: number,
  currentUser: Object,
  loggedIn: boolean,
  gallery: Object,
  push: string => void,
  updateGalleryCover: (number, number) => Promise<*>,
  deletePicture: (number, number) => Promise<*>,
  comments: Array<Object>,
  actionGrant: Array<string>,
  pictures: Array<Object>
};

type State = {
  showMore: boolean,
  clickedDeletePicture: number
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

const RenderGalleryPicture = ({
  id,
  handleDelete,
  clickedDeletePicture
}: {
  id: number,
  handleDelete: number => void,
  clickedDeletePicture: number
}) => (
  <div>
    <a onClick={() => handleDelete(id)}>
      <i
        className="fa fa-minus-circle"
        style={{ color: '#C24538', marginRight: '5px' }}
      />
      {clickedDeletePicture === id ? 'Er du sikker?' : 'Slett'}
    </a>
  </div>
);

export default class GalleryPictureModal extends Component<Props, State> {
  state: State = {
    showMore: false,
    clickedDeletePicture: 0
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

  handleDelete = (clickedDeletePicture: number) => {
    if (this.state.clickedDeletePicture === clickedDeletePicture) {
      this.props
        .deletePicture(this.props.gallery.id, this.props.picture.id)
        .then(() => this.props.push(`/photos/${this.props.gallery.id}`));
    } else {
      this.setState({
        clickedDeletePicture
      });
    }
  };

  previousGalleryPicture = () => {
    const { pictures, pictureId, gallery, push } = this.props;
    const currentIndex = pictures
      .map(picture => picture.id)
      .indexOf(Number(pictureId));
    const previousGalleryPictureId =
      currentIndex > 0
        ? pictures[currentIndex - 1].id
        : pictures[pictures.length - 1].id;
    return push(`/photos/${gallery.id}/picture/${previousGalleryPictureId}`);
  };

  nextGalleryPicture = () => {
    const { pictures, pictureId, gallery, push } = this.props;
    const currentIndex = pictures
      .map(picture => picture.id)
      .indexOf(Number(pictureId));
    const hasNext = pictures.length - 1 > currentIndex;
    const nextGalleryPictureId = hasNext
      ? pictures[currentIndex + 1].id
      : pictures[0].id;
    return push(`/photos/${gallery.id}/picture/${nextGalleryPictureId}`);
  };

  handleKeyDown = (e: KeyboardEvent) => {
    switch (e.which) {
      case Keyboard.LEFT:
        e.preventDefault();
        this.previousGalleryPicture();
        break;

      case Keyboard.RIGHT:
        e.preventDefault();
        this.nextGalleryPicture();
        break;

      default:
    }
  };

  handleSwipeRight = () => {
    this.nextGalleryPicture();
  };

  handleSwipeLeft = () => {
    this.previousGalleryPicture();
  };

  render() {
    const {
      picture,
      pictureId,
      comments,
      currentUser,
      loggedIn,
      push,
      gallery,
      actionGrant
    } = this.props;
    const { showMore } = this.state;

    return (
      <Swipeable
        onSwipingLeft={this.handleSwipeLeft}
        onSwipingRight={this.handleSwipeRight}
      >
        <Modal
          onHide={() => push(`/photos/${gallery.id}`)}
          backdropClassName={styles.backdrop}
          backdrop
          show
          contentClassName={styles.content}
          autoFocus
          onKeyDown={this.handleKeyDown}
        >
          <Content className={styles.topContent}>
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
                  {actionGrant &&
                    actionGrant.includes('edit') && [
                      <Dropdown.ListItem key="edit">
                        <Link onClick={this.onUpdate} style={{ color: '#333' }}>
                          <strong>Rediger</strong>
                          <Icon name="gear" size={24} />
                        </Link>
                      </Dropdown.ListItem>,
                      <Dropdown.ListItem key="cover">
                        <Link
                          onClick={this.onUpdateGalleryCover}
                          style={{ color: '#333' }}
                        >
                          <strong>Sett som album cover</strong>
                          <Icon name="image" size={24} />
                        </Link>
                      </Dropdown.ListItem>,
                      <Dropdown.Divider key="divider" />,
                      <Dropdown.ListItem
                        key="delete"
                        onClick={e => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        <RenderGalleryPicture
                          handleDelete={this.handleDelete}
                          id={pictureId}
                          clickedDeletePicture={this.state.clickedDeletePicture}
                        />
                      </Dropdown.ListItem>
                    ]}
                </Dropdown.List>
              </Dropdown>
            </Flex>
          </Content>
          <Flex className={styles.pictureContainer}>
            <ProgressiveImage
              key={picture.id}
              src={picture.file}
              alt="some alt"
            />
          </Flex>
          <Content className={styles.bottomContent}>
            <Flex justifyContent="center">
              <Link
                onClick={this.previousGalleryPicture}
                style={{ marginRight: '50px' }}
              >
                <Icon name="arrow-dropleft" size={64} />
              </Link>
              <Link onClick={this.nextGalleryPicture}>
                <Icon name="arrow-dropright" size={64} />
              </Link>
            </Flex>
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
      </Swipeable>
    );
  }
}
