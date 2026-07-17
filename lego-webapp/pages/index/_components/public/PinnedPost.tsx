import { Image } from '@webkom/lego-bricks';
import moment from 'moment-timezone';
import Tag from '~/components/Tags/Tag';
import Time from '~/components/Time';
import { displayNameForEventType } from '~/pages/events/utils';
import { itemUrl } from '~/pages/index/utils';
import { useAppSelector } from '~/redux/hooks';
import { frontpageObjectDate, isEvent } from '~/redux/slices/frontpage';
import styles from './PinnedPost.module.css';
import useSectionReveal from './useSectionReveal';
import type { CSSProperties } from 'react';
import type { ArticleWithType, EventWithType } from '~/redux/slices/frontpage';

type Props = {
  item?: ArticleWithType | EventWithType;
  style?: CSSProperties;
};

const PinnedPost = ({ item, style }: Props) => {
  const fetching = useAppSelector((state) => state.frontpage.fetching);
  const sectionRef = useSectionReveal<HTMLAnchorElement>();
  const url = itemUrl(item);

  let timeFormat =
    item && moment().year() === moment(frontpageObjectDate(item)).year()
      ? 'DD. MMM'
      : 'DD. MMM YYYY';
  if (item && isEvent(item)) {
    timeFormat += ' HH:mm';
  }

  return (
    <a href={url} className={styles.card} style={style} ref={sectionRef}>
      <div className={styles.imageWrapper}>
        <Image
          className={styles.image}
          src={item?.cover || ''}
          placeholder={item?.coverPlaceholder}
          height={500}
          width={1667}
          alt={`Forsidebildet til ${item?.title}`}
        />
        <span className={styles.badge}>
          {fetching || item?.pinned ? '// Festet oppslag' : '// Oppslag'}
        </span>
      </div>
      <div className={styles.body}>
        <span className={styles.title}>{item?.title}</span>
        {item && (
          <div className={styles.meta}>
            <Time time={frontpageObjectDate(item)} format={timeFormat} />
            <span>·</span>
            <span>
              {isEvent(item)
                ? displayNameForEventType(item.eventType)
                : 'Artikkel'}
            </span>
            {item.tags?.slice(0, 2).map((tag) => <Tag key={tag} tag={tag} />)}
          </div>
        )}
      </div>
    </a>
  );
};

export default PinnedPost;
