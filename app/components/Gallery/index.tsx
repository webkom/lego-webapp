import { get } from 'lodash';
import { Image } from 'app/components/Image';
import Paginator from 'app/components/Paginator';
import styles from './Gallery.css';
import type { ReactNode } from 'react';

export type Photo = Record<string, any>;
type Props = {
  photos: Photo[];
  srcKey: string;
  hasMore: boolean;
  fetchNext: () => any;
  fetching: boolean;
  onClick?: (arg0: Photo) => unknown;
  renderOverlay?: (arg0: Photo) => ReactNode;
  renderTop?: (arg0: Photo) => ReactNode;
  renderBottom?: (arg0: Photo) => ReactNode;
  renderEmpty?: () => ReactNode;
};

const Gallery = ({
  onClick = () => {},
  renderOverlay,
  renderTop,
  renderBottom,
  renderEmpty,
  srcKey,
  photos,
  hasMore,
  fetchNext,
  fetching,
}: Props) => {
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
              src={get(photo, srcKey, 'src')}
              alt={photo.alt}
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
