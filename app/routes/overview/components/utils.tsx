// @flow

import styles from './Overview.css';
import Time from 'app/components/Time';

import { eventTypeToString } from 'app/routes/events/utils';
import type { Event, Article } from 'app/models';
import Tag from 'app/components/Tags/Tag';
import Tags from 'app/components/Tags';
import truncateString from 'app/utils/truncateString';
import moment from 'moment-timezone';

export const renderMeta = (
  item: (Event | Article) & { documentType: string }
) => {
  const isEvent = item.eventType ? true : false;
  return (
    <span className={styles.itemInfo}>
      <Time
        //$FlowFixMe[incompatible-type]
        time={isEvent ? item.startTime : item.createdAt}
        format={
          moment().year() === moment(item.startTime).year()
            ? 'DD. MMM HH:mm'
            : 'DD. MMM YYYY HH:mm'
        }
      />

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
            <Tag tag={tag} key={tag} />
          ))}
        </Tags>
      )}
    </span>
  );
};
