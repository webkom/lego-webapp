// @flow

import styles from './Overview.css';
import Time from 'app/components/Time';

import { eventTypeToString } from 'app/routes/events/utils';
import type { Event, Article } from 'app/models';
import Tag from 'app/components/Tags/Tag';
import Tags from 'app/components/Tags';
import truncateString from 'app/utils/truncateString';

export const renderMeta = (
  item: (Event | Article) & { documentType: string }
) => {
  const isEvent = item.eventType ? true : false;
  return (
    <span className={styles.itemInfo}>
      <Time
        //$FlowFixMe[incompatible-type]
        time={isEvent ? item.startTime : item.createdAt}
        format="DD.MMM HH:mm"
      />

      {item.location !== '-' && isEvent && (
        <span>
          <span className={styles.dot}> . </span>
          <span> {truncateString(item.location, 8)} </span>
        </span>
      )}

      <span>
        <span className={styles.dot}> . </span>
        <span>
          {' '}
          {isEvent ? eventTypeToString(item.eventType) : 'Artikkel'}{' '}
        </span>
      </span>

      {item.tags && item.tags.length > 0 && (
        <Tags className={styles.tagline}>
          {item.tags.slice(0, 3).map((tag) => (
            <Tag className={styles.tag} tag={tag} key={tag} />
          ))}
        </Tags>
      )}
    </span>
  );
};
