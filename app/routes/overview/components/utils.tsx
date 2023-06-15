import moment from 'moment-timezone';
import Tags from 'app/components/Tags';
import Tag from 'app/components/Tags/Tag';
import Time from 'app/components/Time';
import type { WithDocumentType } from 'app/reducers/frontpage';
import { isArticle, isEvent } from 'app/reducers/frontpage';
import type { ArticleWithAuthorDetails } from 'app/routes/articles/ArticleListRoute';
import { eventTypeToString } from 'app/routes/events/utils';
import type { PublicArticle } from 'app/store/models/Article';
import type { PublicEvent } from 'app/store/models/Event';
import truncateString from 'app/utils/truncateString';
import styles from './Overview.css';

export const itemUrl = (
  item: WithDocumentType<ArticleWithAuthorDetails | PublicArticle | PublicEvent>
) => {
  return `/${item.documentType === 'event' ? 'events' : 'articles'}/${item.id}`;
};

export const renderMeta = (
  item: WithDocumentType<ArticleWithAuthorDetails | PublicArticle | PublicEvent>
) => {
  let itemTime;
  if (isEvent(item)) {
    itemTime = item.startTime;
  } else if (isArticle(item)) {
    itemTime = item.createdAt;
  }

  let format =
    moment().year() === moment(itemTime).year() ? 'DD. MMM' : 'DD. MMM YYYY';
  if (isEvent(item)) {
    format += ' HH:mm';
  }

  return (
    <span className={styles.itemInfo}>
      <Time time={itemTime} format={format} />
      {isEvent(item) && item.location !== '-' && (
        <span>
          <span> • </span>
          <span> {truncateString(item.location, 8)} </span>
        </span>
      )}

      <span> • </span>
      <span className={styles.type}>
        {' '}
        {isEvent(item) ? eventTypeToString(item.eventType) : 'Artikkel'}{' '}
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
