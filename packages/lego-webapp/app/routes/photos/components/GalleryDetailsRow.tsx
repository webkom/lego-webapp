import { Flex } from '@webkom/lego-bricks';
import { Link } from 'react-router';
import Time from 'app/components/Time';
import styles from './GalleryDetailsRow.module.css';
import type { DetailedGallery } from 'app/store/models/Gallery';

type Props = {
  gallery: DetailedGallery;
  showDescription?: boolean;
  small?: boolean;
};

const GalleryDetailsRow = ({
  gallery,
  showDescription = false,
  small = false,
}: Props) => (
  <Flex column className={styles.detailRow}>
    <div className={small ? styles.smallDetails : undefined}>
      {gallery.event && (
        <span className={styles.detail}>
          <Link to={`/events/${gallery.event.id}`}>{gallery.event.title}</Link>
        </span>
      )}

      {gallery.takenAt && (
        <span className={styles.detail}>
          <Time time={gallery.takenAt} format="DD.MM.YYYY" />
        </span>
      )}

      {gallery.location && (
        <span className={styles.detail}>{gallery.location}</span>
      )}
    </div>

    {showDescription && <p>{gallery.description}</p>}
  </Flex>
);

export default GalleryDetailsRow;
