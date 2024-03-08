import { Flex, Icon, LoadingIndicator, Modal } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import throttle from 'lodash/throttle';
import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useSwipeable, RIGHT, LEFT } from 'react-swipeable';
import { fetchGallery, updateGalleryCover } from 'app/actions/GalleryActions';
import {
  deletePicture,
  fetchGalleryPicture,
  fetchSiblingGallerPicture,
} from 'app/actions/GalleryPictureActions';
import CommentView from 'app/components/Comments/CommentView';
import { Content } from 'app/components/Content';
import Dropdown from 'app/components/Dropdown';
import { Image } from 'app/components/Image';
import ProgressiveImage from 'app/components/ProgressiveImage';
import PropertyHelmet, {
  type PropertyGenerator,
} from 'app/components/PropertyHelmet';
import config from 'app/config';
import { selectGalleryById } from 'app/reducers/galleries';
import {
  SelectGalleryPicturesByGalleryId,
  selectCommentsForGalleryPicture,
  selectGalleryPictureById,
} from 'app/reducers/galleryPictures';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { Keyboard } from 'app/utils/constants';
import GalleryDetailsRow from './GalleryDetailsRow';
import styles from './GalleryPictureModal.css';
import type { DetailedGallery } from 'app/store/models/Gallery';
import type { GalleryListPicture } from 'app/store/models/GalleryPicture';
import type { ReactNode } from 'react';

const propertyGenerator: PropertyGenerator<{
  gallery: DetailedGallery;
  picture: GalleryListPicture;
}> = (props, config) => {
  if (!props.picture) return;
  const url = `${config?.webUrl}/photos/${props.gallery.id}/picture/${props.picture.id}/`;
  // Becuase the parent route sets the title and description
  // based on the metadata of the gallery, we don't have to do it
  // explicitly here.
  return [
    {
      property: 'og:url',
      content: url,
    },
    {
      property: 'og:image',
      content: props.picture.file,
    },
  ];
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

const GalleryPictureModal = () => {
  const { galleryId, pictureId } = useParams<{
    galleryId: string;
    pictureId: string;
  }>();
  const pictures = useAppSelector((state) =>
    SelectGalleryPicturesByGalleryId(state, {
      galleryId,
    }),
  );
  const picture = useAppSelector((state) =>
    selectGalleryPictureById(state, {
      pictureId,
    }),
  );
  const comments = useAppSelector((state) =>
    selectCommentsForGalleryPicture(state, {
      pictureId,
    }),
  );
  const fetching = useAppSelector(
    (state) => state.galleries.fetching || state.galleryPictures.fetching,
  );
  const hasMore = useAppSelector((state) => state.galleryPictures.hasMore);
  const gallery = useAppSelector((state) =>
    selectGalleryById(state, {
      galleryId,
    }),
  );
  const actionGrant = gallery?.actionGrant || [];

  let isFirstImage = false;
  let isLastImage = false;
  if (pictures.length > 0 && pictureId) {
    if (Number(pictures[0].id) === Number(pictureId)) {
      isFirstImage = true;
    }

    if (
      Number(pictures[pictures.length - 1].id) === Number(pictureId) &&
      !hasMore
    ) {
      isLastImage = true;
    }
  }

  const [showMore, setShowMore] = useState(false);
  const [clickedDeletePicture, setClickedDeletePicture] = useState(0);
  const [hasNext, setHasNext] = useState(!isLastImage);
  const [hasPrevious, setHasPrevious] = useState(!isFirstImage);

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchGalleryPicture',
    () =>
      galleryId &&
      Promise.allSettled([
        dispatch(fetchGallery(galleryId)),
        pictureId && dispatch(fetchGalleryPicture(galleryId, pictureId)),
      ]),
    [],
  );

  const navigate = useNavigate();

  const toggleDropdown = () => {
    setShowMore(!showMore);
    setClickedDeletePicture(0);
  };

  const onUpdate = () => {
    navigate(`/photos/${gallery.id}/picture/${picture.id}/edit`);
  };

  const onUpdateGalleryCover = () => {
    dispatch(updateGalleryCover(gallery.id, picture.id));
    toggleDropdown();
  };

  const handleDelete = (currentClickedDeletePicture: number) => {
    if (clickedDeletePicture === currentClickedDeletePicture) {
      dispatch(deletePicture(gallery.id, picture.id)).then(() => {
        navigate(`/photos/${gallery.id}`);
      });
    } else {
      setClickedDeletePicture(currentClickedDeletePicture);
    }
  };

  const siblingGalleryPicture = (next: boolean) => {
    return dispatch(
      fetchSiblingGallerPicture(gallery.id, pictureId, next),
    ).then((result) => {
      setHasNext(!!result.payload.next);
      setHasPrevious(!!result.payload.previous);
      return (
        result.payload.result.length > 0 &&
        navigate(`/photos/${gallery.id}/picture/${result.payload.result[0]}`)
      );
    });
  };

  const previousGalleryPicture = throttle(
    () => siblingGalleryPicture(false),
    500,
    {
      trailing: false,
    },
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

  if (!gallery || !picture) {
    return (
      <Content>
        <LoadingIndicator loading={fetching} />
      </Content>
    );
  }

  return (
    <Modal
      onHide={() => navigate(`/photos/${gallery.id}`)}
      show
      contentClassName={styles.content}
    >
      <PropertyHelmet
        propertyGenerator={propertyGenerator}
        options={{ gallery, picture }}
      >
        <link
          rel="canonical"
          href={`${config?.webUrl}/photos/${gallery.id}/picture/${picture.id}`}
        />
      </PropertyHelmet>

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
              contentTarget={picture.contentTarget}
              comments={comments}
            />
          )}
        </Content>
      </Swipeable>
    </Modal>
  );
};

export default GalleryPictureModal;
