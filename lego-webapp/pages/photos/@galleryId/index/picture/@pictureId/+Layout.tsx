import {
  Flex,
  Icon,
  Modal,
  Image,
  LoadingIndicator,
} from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import throttle from 'lodash/throttle';
import { Download, Pencil } from 'lucide-react';
import { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { useSwipeable, RIGHT, LEFT } from 'react-swipeable';
import { navigate } from 'vike/client/router';
import CommentView from '~/components/Comments/CommentView';
import Dropdown from '~/components/Dropdown';
import PropertyHelmet, {
  type PropertyGenerator,
} from '~/components/PropertyHelmet';
import { updateGalleryCover } from '~/redux/actions/GalleryActions';
import {
  deletePicture,
  fetchGalleryPicture,
  fetchGalleryPictures,
} from '~/redux/actions/GalleryPictureActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { EntityType } from '~/redux/models/entities';
import { selectCommentsByIds } from '~/redux/slices/comments';
import { selectGalleryById } from '~/redux/slices/galleries';
import {
  selectGalleryPicturesByGalleryId,
  selectGalleryPictureById,
} from '~/redux/slices/galleryPictures';
import { selectPaginationNext } from '~/redux/slices/selectors';
import { appConfig } from '~/utils/appConfig';
import { Keyboard } from '~/utils/constants';
import { useParams } from '~/utils/useParams';
import GalleryDetailsRow from '../../../../GalleryDetailsRow';
import styles from './GalleryPictureModal.module.css';
import type { ReactNode } from 'react';
import type { DetailedGallery } from '~/redux/models/Gallery';
import type { GalleryListPicture } from '~/redux/models/GalleryPicture';
import type { PublicUser } from '~/redux/models/User';

const propertyGenerator: PropertyGenerator<{
  gallery: DetailedGallery;
  picture: GalleryListPicture;
}> = (props, config) => {
  if (!props.picture) return;
  const url = `${config?.webUrl}/photos/${props.gallery.id}/picture/${props.picture.id}/`;
  // Because the parent route sets the title and description
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

const Taggees = ({ taggees }: { taggees: PublicUser[] }) => {
  if (taggees.length === 1) {
    return (
      <span>
        <span>med </span>
        <a key={taggees[0].id} href={`/users/${taggees[0].username}`}>
          {taggees[0].fullName}
        </a>
      </span>
    );
  } else {
    return (
      <span>
        <span>med </span>
        {taggees.map((taggee, index) => (
          <span key={taggee.id}>
            {taggees.length === index + 1 ? (
              <span>
                <span>{'og '}</span>
                <a href={`/users/${taggee.username}`}>{taggee.fullName}</a>
              </span>
            ) : (
              <span
                style={{
                  marginRight: '5px',
                }}
              >
                <a href={`/users/${taggee.username}`}>{taggee.fullName}</a>
                {taggees.length === index + 2 ? null : <span>,</span>}
              </span>
            )}
          </span>
        ))}
      </span>
    );
  }
};

const Swipeable = (props: {
  onSwiping: (arg0: { dir: string }) => void;
  children: ReactNode;
}) => {
  const handlers = useSwipeable({
    onSwiped: (eventData) => props.onSwiping(eventData),
  });
  return <div {...handlers}>{props.children}</div>;
};

const GalleryPictureModal = ({ children }: PropsWithChildren) => {
  const { galleryId, pictureId } = useParams<{
    galleryId: string;
    pictureId: string;
  }>();
  const pictures = useAppSelector((state) =>
    selectGalleryPicturesByGalleryId(state, galleryId),
  );
  const picture = useAppSelector((state) =>
    selectGalleryPictureById(state, pictureId),
  );
  const comments = useAppSelector((state) =>
    selectCommentsByIds(state, picture?.comments),
  );
  const fetching = useAppSelector(
    (state) => state.galleries.fetching || state.galleryPictures.fetching,
  );
  const { pagination } = useAppSelector(
    selectPaginationNext({
      endpoint: `/galleries/${galleryId}/pictures/`,
      entity: EntityType.GalleryPictures,
      query: {},
    }),
  );
  const gallery = useAppSelector((state) =>
    selectGalleryById<DetailedGallery>(state, galleryId),
  );

  const modalRef = useRef<HTMLElement>(null);

  const actionGrant = gallery?.actionGrant || [];

  const isFirstImage =
    !pictures?.length || String(pictures[0].id) === String(pictureId);
  const isLastLoadedImage =
    !pictures?.length ||
    String(pictures[pictures.length - 1].id) === String(pictureId);
  const isLastImage = !pagination.hasMore && isLastLoadedImage;

  const pictureIndex = pictures.findIndex(
    (pic) => String(pic.id) === String(pictureId),
  );

  const [showMore, setShowMore] = useState(false);
  const [clickedDeletePicture, setClickedDeletePicture] = useState(0);

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchGalleryPicture',
    () =>
      galleryId &&
      pictureId &&
      !pictures.find((pic) => String(pic.id) === String(pictureId)) &&
      dispatch(fetchGalleryPicture(galleryId, pictureId)),
    [dispatch, galleryId, pictureId, pictures],
  );

  useEffect(() => {
    if (pagination.hasMore && isLastLoadedImage && galleryId) {
      dispatch(
        fetchGalleryPictures(galleryId, {
          next: true,
        }),
      );
    }
  }, [
    dispatch,
    galleryId,
    isLastLoadedImage,
    pagination.hasMore,
    pictures.length,
  ]);

  if (!gallery || !picture) {
    return (
      <Modal
        onOpenChange={(open) => !open && navigate(`/photos/${galleryId}`)}
        isOpen
        contentClassName={styles.content}
      >
        <LoadingIndicator loading={fetching} />;
      </Modal>
    );
  }

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

  const siblingGalleryPicture = async (next: boolean) => {
    if ((next && isLastLoadedImage) || (!next && isFirstImage)) return;
    navigate(
      `/photos/${gallery.id}/picture/${pictures[pictureIndex + (next ? 1 : -1)].id}`,
    );
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

    switch (e.key) {
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

  return (
    <Modal
      onOpenChange={(open) => !open && navigate(`/photos/${gallery.id}`)}
      isOpen
      contentClassName={styles.content}
      aria-label={`Bilde ${picture.id} av ${gallery.title}`}
      ref={modalRef}
    >
      <PropertyHelmet
        propertyGenerator={propertyGenerator}
        options={{ gallery, picture }}
      >
        <title>{`${gallery.title} (${picture.id})`}</title>
        <link
          rel="canonical"
          href={`${appConfig?.webUrl}/photos/${gallery.id}/picture/${picture.id}`}
        />
      </PropertyHelmet>

      <Swipeable onSwiping={handleSwipe}>
        <OnKeyDownHandler handler={handleKeyDown} />
        <Flex column gap="var(--spacing-md)">
          <Flex width="100%" justifyContent="space-between" alignItems="center">
            <Flex justifyContent="space-between" gap="var(--spacing-md)">
              <Image
                className={styles.galleryThumbnail}
                alt="Forsidebilde til album"
                src={gallery.cover?.thumbnail ?? ''}
              />

              <Flex column justifyContent="space-around">
                <a href={`/photos/${gallery.id}`}>{gallery.title}</a>
                <GalleryDetailsRow small gallery={gallery} />
              </Flex>
            </Flex>

            <Dropdown
              show={showMore}
              toggle={toggleDropdown}
              closeOnContentClick
              className={styles.dropdown}
              iconName="ellipsis-horizontal"
              container={modalRef.current}
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
                    <Icon iconNode={<Download />} size={24} />
                  </a>
                </Dropdown.ListItem>
                {actionGrant &&
                  actionGrant.includes('edit') && [
                    <Dropdown.ListItem key="edit">
                      <a
                        href="#"
                        onClick={onUpdate}
                        className={styles.dropdownLink}
                      >
                        Rediger
                        <Icon iconNode={<Pencil />} size={24} />
                      </a>
                    </Dropdown.ListItem>,
                    <Dropdown.ListItem key="cover">
                      <a
                        onClick={onUpdateGalleryCover}
                        href="#"
                        className={styles.dropdownLink}
                      >
                        Sett som album cover
                        <Icon name="image-outline" size={24} />
                      </a>
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
                      <button onClick={() => handleDelete(Number(pictureId))}>
                        {clickedDeletePicture === Number(pictureId)
                          ? 'Er du sikker?'
                          : 'Slett'}
                        <Icon name="trash-outline" />
                      </button>
                    </Dropdown.ListItem>,
                  ]}
              </Dropdown.List>
            </Dropdown>
          </Flex>

          <Flex justifyContent="center" className={styles.pictureContainer}>
            <Image
              key={picture.id}
              src={picture.file}
              placeholder={picture.thumbnail}
              alt={picture.description}
              className={styles.picture}
            />
          </Flex>

          {(picture.description || picture.taggees.length > 0) && (
            <span className={styles.pictureDescription}>
              {picture.description}
              {picture.taggees.length > 0 && (
                <Taggees taggees={picture.taggees} />
              )}
            </span>
          )}

          <Flex
            justifyContent="center"
            alignItems="center"
            gap="var(--spacing-lg)"
          >
            <Icon
              onPress={previousGalleryPicture}
              name="arrow-back-outline"
              size={40}
              disabled={isFirstImage}
            />
            {isLastLoadedImage && !isLastImage ? (
              <LoadingIndicator loading className={styles.loadingIndicator} />
            ) : (
              <Icon
                onPress={nextGalleryPicture}
                name="arrow-forward-outline"
                size={40}
                disabled={isLastLoadedImage}
              />
            )}
          </Flex>

          {children}

          {picture.contentTarget && (
            <CommentView
              contentTarget={picture.contentTarget}
              comments={comments}
            />
          )}
        </Flex>
      </Swipeable>
    </Modal>
  );
};

export default GalleryPictureModal;
