import { Flex } from '@webkom/lego-bricks';
import moment from 'moment-timezone';
import Tags from '~/components/Tags';
import Tag from '~/components/Tags/Tag';
import Time from '~/components/Time';
import {
  colorForEventType,
  displayNameForEventType,
} from '~/pages/events/utils';
import { frontpageObjectDate, isEvent } from '~/redux/slices/frontpage';
import truncateString from '~/utils/truncateString';
import styles from './AuthenticatedFrontpage.module.css';
import type { EntityId } from '@reduxjs/toolkit';
import type { Dateish } from 'app/models';
import type { ArticleWithType, EventWithType } from '~/redux/slices/frontpage';

const itemTimeFormat = (item: ArticleWithType | EventWithType) => {
  const format =
    moment().year() === moment(frontpageObjectDate(item)).year()
      ? 'DD. MMM'
      : 'DD. MMM YYYY';

  return isEvent(item) ? `${format} HH:mm` : format;
};

export const itemUrl = (item?: ArticleWithType | EventWithType) => {
  if (!item) return '';
  return `/${isEvent(item) ? 'events' : 'articles'}/${item.slug}`;
};

export const renderMeta = (item?: ArticleWithType | EventWithType) => {
  if (!item) return <></>;

  const itemTime = frontpageObjectDate(item);
  const format = itemTimeFormat(item);

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

export type SpotlightItem = {
  id: EntityId;
  url: string;
  title: string;
  cover?: string;
  coverPlaceholder?: string;
  /** Shown beside the dot, e.g. an event type or "Artikkel" */
  category: string;
  categoryColor: string;
  location?: string;
  time: Dateish;
  timeFormat: string;
  pinned?: boolean;
};

export const toSpotlightItems = (
  items: (ArticleWithType | EventWithType)[],
): SpotlightItem[] =>
  items.map((item) => ({
    id: item.id,
    url: itemUrl(item),
    title: item.title,
    cover: item.cover,
    coverPlaceholder: item.coverPlaceholder ?? undefined,
    category: isEvent(item)
      ? displayNameForEventType(item.eventType)
      : 'Artikkel',
    categoryColor: isEvent(item)
      ? (colorForEventType(item.eventType) ?? 'var(--lego-font-color)')
      : 'var(--lego-font-color)',
    // '-' is the stand-in for an event with nowhere to be
    location:
      isEvent(item) && item.location !== '-' ? item.location : undefined,
    // Raw, not a moment: <Time> stringifies this into the datetime attribute
    time: isEvent(item) ? item.startTime : item.createdAt,
    timeFormat: itemTimeFormat(item),
    pinned: item.pinned,
  }));
