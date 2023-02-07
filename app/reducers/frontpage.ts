import { sortBy } from 'lodash';
import moment from 'moment-timezone';
import { createSelector } from 'reselect';
import { Frontpage } from 'app/actions/ActionTypes';
import type { Event } from 'app/models';
import type { UnknownArticle } from 'app/store/models/Article';
import { fetching } from 'app/utils/createEntityReducer';
import { selectArticles } from './articles';
import { selectEvents } from './events';

export type WithDocumentType<T> = T & {
  documentType: 'event' | 'article';
};

export const isEvent = <T extends Event>(
  item: WithDocumentType<T | unknown>
): item is WithDocumentType<T> => item.documentType === 'event';

export const isArticle = <T extends UnknownArticle>(
  item: WithDocumentType<T | unknown>
): item is WithDocumentType<T> => item.documentType === 'article';

export default fetching(Frontpage.FETCH);
export const selectFrontpage = createSelector(
  selectArticles,
  selectEvents,
  (articles, events) => {
    const articlesWithType = articles.map((article) => ({
      ...article,
      documentType: 'article' as const,
    }));
    const eventsWithType = events.map((event) => ({
      ...event,
      documentType: 'event' as const,
    }));
    const now = moment();
    return sortBy(
      [...articlesWithType, ...eventsWithType],
      [
        // Always sort pinned items first:
        (item) => !item.pinned,
        (item) => {
          // For events, we care about when the event starts, whereas for articles
          // we look at when it was written:
          const timeField = isEvent(item) ? item.startTime : item.createdAt;
          return Math.abs(now.diff(timeField));
        },
        (item) => item.id,
      ]
    );
  }
);
