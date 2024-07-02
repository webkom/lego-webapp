import { Image } from '@webkom/lego-bricks';
import Paginator from 'app/components/Paginator';
import styles from './Gallery.css';
import type { ListGallery } from 'app/store/models/Gallery';
import type { GalleryListPicture } from 'app/store/models/GalleryPicture';
import type { ReactNode } from 'react';

type Props<T> = {
  photos: T[];
  getSrc: (photo: T) => string;
  hasMore: boolean;
  fetchNext: () => Promise<unknown>;
  fetching: boolean;
  onClick?: (photo: T) => unknown;
  renderOverlay?: (photo: T) => ReactNode;
  renderTop?: (photo: T) => ReactNode;
  renderBottom?: (photo: T) => ReactNode;
  renderEmpty?: () => ReactNode;
};

const Gallery = <T extends ListGallery | GalleryListPicture>({
  onClick = () => {},
  renderOverlay,
  renderTop,
  renderBottom,
  renderEmpty,
  getSrc,
  photos,
  hasMore,
  fetchNext,
  fetching,
}: Props<T>) => {
  return (
    <div className={styles.galleryContainer}>
      <Paginator
        hasMore={hasMore}
        fetching={fetching}
        fetchNext={fetchNext}
        className={styles.gallery}
        loaderClassName={styles.loadingIndicator}
      >
        {photos.map((photo) => (
          <div
            key={photo.id}
            onClick={() => onClick(photo)}
            className={styles.galleryPhoto}
          >
            {renderTop && renderTop(photo)}
            <Image
              className={styles.image}
              src={getSrc(photo)}
              alt={'description' in photo ? photo.description : photo.title}
            />
            {renderOverlay && (
              <div className={styles.overlay}>{renderOverlay(photo)}</div>
            )}
            {renderBottom && renderBottom(photo)}
          </div>
        ))}
        {!photos.length && !fetching && renderEmpty && (
          <div className={styles.noPhotosWrapper}>{renderEmpty()}</div>
        )}
      </Paginator>
    </div>
  );
};

export default Gallery;
