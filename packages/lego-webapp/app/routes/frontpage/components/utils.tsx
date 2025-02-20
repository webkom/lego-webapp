import { Flex } from '@webkom/lego-bricks';
import moment from 'moment-timezone';
import Tags from 'app/components/Tags';
import Tag from 'app/components/Tags/Tag';
import Time from 'app/components/Time';
import { displayNameForEventType } from 'app/routes/events/utils';
import truncateString from 'app/utils/truncateString';
import { frontpageObjectDate, isEvent } from '~/redux/slices/frontpage';
import styles from './AuthenticatedFrontpage.module.css';
import type { ArticleWithType, EventWithType } from '~/redux/slices/frontpage';

export const itemUrl = (item?: ArticleWithType | EventWithType) => {
  if (!item) return '';
  return `/${isEvent(item) ? 'events' : 'articles'}/${item.slug}`;
};

export const renderMeta = (item?: ArticleWithType | EventWithType) => {
  if (!item) return <></>;

  const itemTime = frontpageObjectDate(item);

  let format =
    moment().year() === moment(itemTime).year() ? 'DD. MMM' : 'DD. MMM YYYY';
  if (isEvent(item)) {
    format += ' HH:mm';
  }

  return (
    <Flex
      wrap
      alignItems="center"
      justifyContent="center"
      gap="var(--spacing-sm)"
      className={styles.meta}
    >
      <Time time={itemTime} format={format} />

      {isEvent(item) && item.location !== '-' && (
        <>
          <span> • </span>
          <span> {truncateString(item.location, 8)} </span>
        </>
      )}

      <span> • </span>
      <span>
        {isEvent(item) ? displayNameForEventType(item.eventType) : 'Artikkel'}
      </span>

      {item.tags?.length > 0 && (
        <Tags>
          {item.tags.slice(0, 3).map((tag) => (
            <Tag tag={tag} key={tag} />
          ))}
        </Tags>
      )}
    </Flex>
  );
};
