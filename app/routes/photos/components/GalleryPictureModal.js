// @flow

import React, { Component } from 'react';
import { Keyboard } from '../../../utils/constants';
import GalleryDetailsRow from './GalleryDetailsRow';
import { Flex } from 'app/components/Layout';
import { Content } from 'app/components/Content';
import Icon from 'app/components/Icon';
import throttle from 'lodash/throttle';
import ProgressiveImage from 'app/components/ProgressiveImage';
import Dropdown from 'app/components/Dropdown';
import { Link } from 'react-router-dom';
import CommentView from 'app/components/Comments/CommentView';
import Modal from 'app/components/Modal';
import styles from './GalleryPictureModal.css';
import { Swipeable, RIGHT, LEFT } from 'react-swipeable';
import type { EntityID } from 'app/types';
import type { ID } from 'app/models';
import Button from 'app/components/Button';
import { Image } from 'app/components/Image';
import { useEffect } from 'react';

type Props = {
  picture: Object,
  pictureId: number,
  currentUser: Object,
  loggedIn: boolean,
  gallery: Object,
  push: (string) => void,
  updateGalleryCover: (number, number) => Promise<*>,
  deletePicture: (number, number) => Promise<*>,
  comments: Array<Object>,
  actionGrant: Array<string>,
  pictures: Array<Object>,
  hasMore: Boolean,
  fetchSiblingGallerPicture: (EntityID, EntityID, boolean) => Promise<*>,
  isFirstImage: Boolean,
  isLastImage: Boolean,
  deleteComment: (id: ID, contentTarget: string) => Promise<*>,
};

type State = {
  showMore: boolean,
  clickedDeletePicture: number,
  hasNext: boolean,
  hasPrevious: boolean,
};
const OnKeyDownHandler = ({
  handler,
}: {
  handler: (KeyboardEvent) => void,
}) => {
  useEffect(() => {
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handler]);
  return null;
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
  clickedDeletePicture,
}: {
  id: number,
  handleDelete: (number) => void,
  clickedDeletePicture: number,
}) => (
  <div>
    <Button flat onClick={() => handleDelete(id)}>
      <i
        className="fa fa-minus-circle"
        style={{ color: '#C24538', padding: '15px' }}
      />
      {clickedDeletePicture === id ? 'Er du sikker?' : 'Slett'}
    </Button>
  </div>
);

export default class GalleryPictureModal extends Component<Props, State> {
  state = {
    showMore: false,
    clickedDeletePicture: 0,
    hasNext: !this.props.isLastImage,
    hasPrevious: !this.props.isFirstImage,
  };

  toggleDropdown = () => {
    this.setState({ showMore: !this.state.showMore, clickedDeletePicture: 0 });
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
        clickedDeletePicture,
      });
    }
  };

  siblingGalleryPicture = (next: boolean) => {
    const { pictureId, gallery, push } = this.props;
    return this.props
      .fetchSiblingGallerPicture(gallery.id, pictureId, next)
      .then((result) => {
        this.setState({
          hasNext: !!result.payload.next,
          hasPrevious: !!result.payload.previous,
        });
        return (
          result.payload.result.length > 0 &&
          push(`/photos/${gallery.id}/picture/${result.payload.result[0]}`)
        );
      });
  };

  previousGalleryPicture = throttle(
    () => this.siblingGalleryPicture(false),
    500,
    { trailing: false }
  );
  nextGalleryPicture = throttle(() => this.siblingGalleryPicture(true), 500, {
    trailing: false,
  });

  handleKeyDown = (e: KeyboardEvent): void => {
    // Dont handle events inside the comment form... :smile:
    // $FlowFixMe
    if (e.target.className === 'notranslate public-DraftEditor-content') {
      return;
    }
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

  handleSwipe = ({ dir }: { dir: string }) => {
    dir === RIGHT && this.previousGalleryPicture();
    dir === LEFT && this.nextGalleryPicture();
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
      actionGrant,
      deleteComment,
    } = this.props;
    const { showMore } = this.state;

    return (
      <Swipeable onSwiping={this.handleSwipe}>
        <Modal
          onHide={() => push(`/photos/${gallery.id}`)}
          show
          backdrop
          contentClassName={styles.content}
        >
          <OnKeyDownHandler handler={this.handleKeyDown} />
          <Content className={styles.topContent}>
            <Flex
              width="100%"
              justifyContent="space-between"
              alignItems="center"
            >
              <Flex justifyContent="space-between">
                <Image
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
                      style={{ color: 'var(--lego-color-gray)' }}
                    >
                      <strong>Last ned</strong>
                      <Icon name="download-outline" size={24} />
                    </a>
                  </Dropdown.ListItem>
                  {actionGrant &&
                    actionGrant.includes('edit') && [
                      <Dropdown.ListItem key="edit">
                        <Link
                          to="#"
                          onClick={this.onUpdate}
                          style={{ color: 'var(--lego-color-gray)' }}
                        >
                          <strong>Rediger</strong>
                          <Icon name="gear" size={24} />
                        </Link>
                      </Dropdown.ListItem>,
                      <Dropdown.ListItem key="cover">
                        <Link
                          onClick={this.onUpdateGalleryCover}
                          to="#"
                          style={{ color: 'var(--lego-color-gray)' }}
                        >
                          <strong>Sett som album cover</strong>
                          <Icon name="image" size={24} />
                        </Link>
                      </Dropdown.ListItem>,
                      <Dropdown.Divider key="divider" />,
                      <Dropdown.ListItem
                        key="delete"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        <RenderGalleryPicture
                          handleDelete={this.handleDelete}
                          id={pictureId}
                          clickedDeletePicture={this.state.clickedDeletePicture}
                        />
                      </Dropdown.ListItem>,
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
              {this.state.hasPrevious && (
                <Link
                  to="#"
                  onClick={this.previousGalleryPicture}
                  style={{ marginRight: '50px' }}
                >
                  <Icon name="arrow-dropleft" size={64} />
                </Link>
              )}
              {this.state.hasNext && (
                <Link to="#" onClick={this.nextGalleryPicture}>
                  <Icon name="arrow-dropright" size={64} />
                </Link>
              )}
            </Flex>
            <Flex className={styles.pictureDescription}>
              <p>
                {picture.description}
                {picture.taggees.length > 0 && (
                  <Taggees taggees={picture.taggees} />
                )}
              </p>
            </Flex>
            {picture.contentTarget && (
              <Flex className={styles.pictureDescription}>
                <CommentView
                  style={{ width: '100%' }}
                  formEnabled
                  user={currentUser}
                  contentTarget={picture.contentTarget}
                  loggedIn={loggedIn}
                  comments={comments}
                  deleteComment={deleteComment}
                />
              </Flex>
            )}
          </Content>
        </Modal>
      </Swipeable>
    );
  }
}
