import { Flex, Icon, Modal } from '@webkom/lego-bricks';
import throttle from 'lodash/throttle';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSwipeable, RIGHT, LEFT } from 'react-swipeable';
import CommentView from 'app/components/Comments/CommentView';
import { Content } from 'app/components/Content';
import Dropdown from 'app/components/Dropdown';
import { Image } from 'app/components/Image';
import ProgressiveImage from 'app/components/ProgressiveImage';
import { Keyboard } from 'app/utils/constants';
import GalleryDetailsRow from './GalleryDetailsRow';
import styles from './GalleryPictureModal.css';
import type { EntityID } from 'app/types';
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

const GalleryPictureModal = (props: Props) => {
  const [showMore, setShowMore] = useState(false);
  const [clickedDeletePicture, setClickedDeletePicture] = useState(0);
  const [hasNext, setHasNext] = useState(!props.isLastImage);
  const [hasPrevious, setHasPrevious] = useState(!props.isFirstImage);

  const toggleDropdown = () => {
    setShowMore(!showMore);
    setClickedDeletePicture(0);
  };

  const onUpdate = () => {
    props.push(`/photos/${props.gallery.id}/picture/${props.picture.id}/edit`);
  };

  const onUpdateGalleryCover = () => {
    props.updateGalleryCover(props.gallery.id, props.picture.id);
    toggleDropdown();
  };

  const handleDelete = (currentClickedDeletePicture: number) => {
    if (clickedDeletePicture === currentClickedDeletePicture) {
      props
        .deletePicture(props.gallery.id, props.picture.id)
        .then(() => props.push(`/photos/${props.gallery.id}`));
    } else {
      setClickedDeletePicture(currentClickedDeletePicture);
    }
  };

  const siblingGalleryPicture = (next: boolean) => {
    const { pictureId, gallery, push } = props;
    return props
      .fetchSiblingGallerPicture(gallery.id, pictureId, next)
      .then((result) => {
        setHasNext(!!result.payload.next);
        setHasPrevious(!!result.payload.previous);
        return (
          result.payload.result.length > 0 &&
          push(`/photos/${gallery.id}/picture/${result.payload.result[0]}`)
        );
      });
  };

  const previousGalleryPicture = throttle(
    () => siblingGalleryPicture(false),
    500,
    {
      trailing: false,
    }
  );

  const nextGalleryPicture = throttle(() => siblingGalleryPicture(true), 500, {
    trailing: false,
  });

  const handleKeyDown = (e: KeyboardEvent): void => {
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
        previousGalleryPicture();
        break;

      case Keyboard.RIGHT:
        e.preventDefault();
        nextGalleryPicture();
        break;

      default:
    }
  };

  const handleSwipe = ({ dir }: { dir: string }) => {
    dir === RIGHT && previousGalleryPicture();
    dir === LEFT && nextGalleryPicture();
  };

  const {
    picture,
    pictureId,
    comments,
    currentUser,
    loggedIn,
    push,
    gallery,
    actionGrant,
  } = props;

  return (
    <Modal
      onHide={() => push(`/photos/${gallery.id}`)}
      show
      contentClassName={styles.content}
    >
      <Swipeable onSwiping={handleSwipe}>
        <OnKeyDownHandler handler={handleKeyDown} />
        <Content>
          <Flex width="100%" justifyContent="space-between" alignItems="center">
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
              toggle={toggleDropdown}
              closeOnContentClick
              className={styles.dropdown}
              contentClassName={styles.dropdownContent}
              iconName="ellipsis-horizontal"
            >
              <Dropdown.List>
                <Dropdown.ListItem>
                  <a
                    href={picture.rawFile}
                    download
                    onClick={toggleDropdown}
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
                        onClick={onUpdate}
                        className={styles.dropdownLink}
                      >
                        Rediger
                        <Icon name="create-outline" size={24} />
                      </Link>
                    </Dropdown.ListItem>,
                    <Dropdown.ListItem key="cover">
                      <Link
                        onClick={onUpdateGalleryCover}
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
                        handleDelete={handleDelete}
                        id={pictureId}
                        clickedDeletePicture={clickedDeletePicture}
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
          <Flex justifyContent="center" gap="2.5rem">
            {hasPrevious && (
              <Icon
                onClick={previousGalleryPicture}
                name="arrow-back-outline"
                size={40}
              />
            )}
            {hasNext && (
              <Icon
                onClick={nextGalleryPicture}
                name="arrow-forward-outline"
                size={40}
              />
            )}
          </Flex>
          {(picture.description || picture.taggees.length > 0) && (
            <Flex className={styles.pictureDescription}>
              <p>
                {picture.description}
                {picture.taggees.length > 0 && (
                  <Taggees taggees={picture.taggees} />
                )}
              </p>
            </Flex>
          )}
          {picture.contentTarget && (
            <CommentView
              formEnabled
              user={currentUser}
              contentTarget={picture.contentTarget}
              loggedIn={loggedIn}
              comments={comments}
            />
          )}
        </Content>
      </Swipeable>
    </Modal>
  );
};

export default GalleryPictureModal;
