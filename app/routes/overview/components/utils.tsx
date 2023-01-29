import moment from 'moment-timezone';
import Tags from 'app/components/Tags';
import Tag from 'app/components/Tags/Tag';
import Time from 'app/components/Time';
import type { Event, Article } from 'app/models';
import { eventTypeToString } from 'app/routes/events/utils';
import truncateString from 'app/utils/truncateString';
import styles from './Overview.css';

export const renderMeta = (item: Event | Article) => {
  const isEvent = item.eventType ? true : false;

  let format =
    moment().year() === moment(item.startTime).year()
      ? 'DD. MMM'
      : 'DD. MMM YYYY';
  if (isEvent) {
    format += ' HH:mm';
  }

  return (
    <span className={styles.itemInfo}>
      <Time time={isEvent ? item.startTime : item.createdAt} format={format} />

      {item.location !== '-' && isEvent && (
        <span>
          <span> • </span>
          <span> {truncateString(item.location, 8)} </span>
        </span>
      )}

      <span> • </span>
      <span className={styles.type}>
        {' '}
        {isEvent ? eventTypeToString(item.eventType) : 'Artikkel'}{' '}
      </span>

      {item.tags?.length > 0 && (
        <Tags className={styles.tagline}>
          {item.tags.slice(0, 3).map((tag) => (
            <Tag tag={tag} key={tag} link={`/articles/?tag=${tag}`} />
          ))}
        </Tags>
      )}
    </span>
  );
};
