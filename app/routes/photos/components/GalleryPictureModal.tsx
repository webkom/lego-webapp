import { Flex, Icon } from '@webkom/lego-bricks';
import throttle from 'lodash/throttle';
import { Component, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSwipeable, RIGHT, LEFT } from 'react-swipeable';
import CommentView from 'app/components/Comments/CommentView';
import { Content } from 'app/components/Content';
import Dropdown from 'app/components/Dropdown';
import { Image } from 'app/components/Image';
import Modal from 'app/components/Modal';
import ProgressiveImage from 'app/components/ProgressiveImage';
import type { EntityID } from 'app/types';
import { Keyboard } from 'app/utils/constants';
import GalleryDetailsRow from './GalleryDetailsRow';
import styles from './GalleryPictureModal.css';
import type { History } from 'history';
import type { ReactNode } from 'react';

type Props = {
  picture: Record<string, any>;
  pictureId: number;
  currentUser: Record<string, any>;
  loggedIn: boolean;
  gallery: Record<string, any>;
  push: History['push'];
  updateGalleryCover: (arg0: number, arg1: number) => Promise<any>;
  deletePicture: (arg0: number, arg1: number) => Promise<any>;
  comments: Array<Record<string, any>>;
  actionGrant: Array<string>;
  pictures: Array<Record<string, any>>;
  hasMore: boolean;
  fetchSiblingGallerPicture: (
    arg0: EntityID,
    arg1: EntityID,
    arg2: boolean
  ) => Promise<any>;
  isFirstImage: boolean;
  isLastImage: boolean;
};
type State = {
  showMore: boolean;
  clickedDeletePicture: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

const OnKeyDownHandler = ({
  handler,
}: {
  handler: (arg0: KeyboardEvent) => void;
}) => {
  useEffect(() => {
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handler]);
  return null;
};

const Taggees = ({ taggees }: { taggees: Array<Record<string, any>> }) => {
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
              <span
                style={{
                  marginRight: '5px',
                }}
              >
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
  id: number;
  handleDelete: (arg0: number) => void;
  clickedDeletePicture: number;
}) => (
  <button onClick={() => handleDelete(id)}>
    {clickedDeletePicture === id ? 'Er du sikker?' : 'Slett'}
    <Icon name="trash-outline" />
  </button>
);

const Swipeable = (props: {
  onSwiping: (arg0: { dir: string }) => void;
  children: ReactNode;
}) => {
  const handlers = useSwipeable({
    onSwiped: (eventData) => props.onSwiping(eventData),
  });
  return <div {...handlers}>{props.children}</div>;
};

export default class GalleryPictureModal extends Component<Props, State> {
  state = {
    showMore: false,
    clickedDeletePicture: 0,
    hasNext: !this.props.isLastImage,
    hasPrevious: !this.props.isFirstImage,
  };
  toggleDropdown = () => {
    this.setState({
      showMore: !this.state.showMore,
      clickedDeletePicture: 0,
    });
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
    {
      trailing: false,
    }
  );
  nextGalleryPicture = throttle(() => this.siblingGalleryPicture(true), 500, {
    trailing: false,
  });
  handleKeyDown = (e: KeyboardEvent): void => {
    // Don't handle events inside the comment form... :smile:
    if (
      e.target instanceof Element &&
      e.target.className === 'notranslate public-DraftEditor-content'
    ) {
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
    } = this.props;
    const { showMore } = this.state;

    return (
      <Modal
        onHide={() => push(`/photos/${gallery.id}`)}
        show
        contentClassName={styles.content}
      >
        <Swipeable onSwiping={this.handleSwipe}>
          <OnKeyDownHandler handler={this.handleKeyDown} />
          <Content>
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
                  <Link to={`/photos/${gallery.id}`}>{gallery.title}</Link>
                  <GalleryDetailsRow small gallery={gallery} />
                </Flex>
              </Flex>

              <Dropdown
                show={showMore}
                toggle={this.toggleDropdown}
                closeOnContentClick
                className={styles.dropdown}
                contentClassName={styles.dropdownContent}
                iconName="options-outline"
              >
                <Dropdown.List>
                  <Dropdown.ListItem>
                    <a
                      href={picture.rawFile}
                      download
                      onClick={this.toggleDropdown}
                      className={styles.dropdownLink}
                    >
                      Last ned
                      <Icon name="download-outline" size={24} />
                    </a>
                  </Dropdown.ListItem>
                  {actionGrant &&
                    actionGrant.includes('edit') && [
                      <Dropdown.ListItem key="edit">
                        <Link
                          to="#"
                          onClick={this.onUpdate}
                          className={styles.dropdownLink}
                        >
                          Rediger
                          <Icon name="create-outline" size={24} />
                        </Link>
                      </Dropdown.ListItem>,
                      <Dropdown.ListItem key="cover">
                        <Link
                          onClick={this.onUpdateGalleryCover}
                          to="#"
                          className={styles.dropdownLink}
                        >
                          Sett som album cover
                          <Icon name="image-outline" size={24} />
                        </Link>
                      </Dropdown.ListItem>,
                      <Dropdown.Divider key="divider" />,
                      <Dropdown.ListItem
                        key="delete"
                        danger
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
              alt={picture.description}
            />
          </Flex>

          <Content>
            <Flex justifyContent="center">
              {this.state.hasPrevious && (
                <Link
                  to="#"
                  onClick={this.previousGalleryPicture}
                  style={{
                    marginRight: '50px',
                  }}
                >
                  <Icon name="arrow-back-circle-outline" size={64} />
                </Link>
              )}
              {this.state.hasNext && (
                <Link to="#" onClick={this.nextGalleryPicture}>
                  <Icon name="arrow-forward-circle-outline" size={64} />
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
                  style={{
                    width: '100%',
                  }}
                  formEnabled
                  user={currentUser}
                  contentTarget={picture.contentTarget}
                  loggedIn={loggedIn}
                  comments={comments}
                />
              </Flex>
            )}
          </Content>
        </Swipeable>
      </Modal>
    );
  }
}
