import moment from 'moment-timezone';
import { sortBy } from 'lodash';
import { createSelector } from 'reselect';
import { selectArticles } from './articles';
import { selectEvents } from './events';

export const selectFrontpage = createSelector(
  selectArticles,
  selectEvents,
  (articles, events) =>
    sortBy(articles.concat(events), [
      // Always sort pinned items first:
      item => !item.pinned,
      item => {
        // For events we care about when the event starts, whereas for articles
        // we look at when it was written:
        const timeField = item.eventType ? item.startTime : item.createdAt;
        return Math.abs(moment().diff(timeField));
      },
      item => item.id
    ])
);
