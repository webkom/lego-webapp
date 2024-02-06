import { chunk, get } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { Image } from 'app/components/Image';
import Paginator from 'app/components/Paginator';
import styles from './Gallery.css';
import type { ReactNode } from 'react';

export type Photo = Record<string, any>;
type Props = {
  onClick?: (arg0: Photo) => unknown;
  renderOverlay?: (arg0: Photo) => ReactNode;
  renderTop?: (arg0: Photo) => ReactNode;
  renderBottom?: (arg0: Photo) => ReactNode;
  renderEmpty?: () => ReactNode;
  margin?: number;
  srcKey: string;
  photos: Array<Photo>;
  hasMore: boolean;
  fetchNext: () => any;
  fetching: boolean;
};

const Gallery = ({
  onClick = () => {},
  renderOverlay,
  renderTop,
  renderBottom,
  renderEmpty,
  margin = 3,
  srcKey,
  photos,
  hasMore,
  fetchNext,
  fetching,
}: Props) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const galleryRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (galleryRef.current) {
        setContainerWidth(Math.floor(galleryRef.current.clientWidth));
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (
      galleryRef.current &&
      galleryRef.current.clientWidth !== containerWidth
    ) {
      setContainerWidth(Math.floor(galleryRef.current.clientWidth));
    }
  }, [galleryRef.current?.clientWidth, containerWidth]);

  const handleClick = (photo: Photo) => {
    onClick(photo);
  };

  const cols = containerWidth < 900 ? 2 : containerWidth < 550 ? 1 : 3;
  const photoNodes = chunk(photos, cols).map((column, columnIndex) => (
    <div key={columnIndex} className={styles.galleryRow}>
      {column.map((photo) => (
        <div
          key={photo.id}
          onClick={() => handleClick(photo)}
          className={styles.galleryPhoto}
        >
          <Image
            className={styles.image}
            src={get(photo, srcKey, 'src')}
            alt={photo.alt}
          />
          <div className={styles.top}>{renderTop && renderTop(photo)}</div>
          <div className={styles.overlay}>
            {renderOverlay && renderOverlay(photo)}
          </div>
          <div className={styles.bottom}>
            {renderBottom && renderBottom(photo)}
          </div>
        </div>
      ))}
    </div>
  ));

  return (
    <div
      className={styles.galleryContainer}
      style={{
        margin: `-${String(margin)}px`,
        width: `calc(100% + ${6 * 2}px)`,
      }}
    >
      <div className={styles.gallery} ref={galleryRef}>
        {fetchNext && (
          <Paginator
            hasMore={hasMore}
            fetching={fetching}
            fetchNext={fetchNext}
          >
            {photoNodes}
          </Paginator>
        )}
        {!fetchNext && photoNodes}
        {!photos.length && !fetching && renderEmpty && renderEmpty()}
      </div>
    </div>
  );
};

export default Gallery;
