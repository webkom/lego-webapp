import moment from 'moment-timezone';
import { sortBy } from 'lodash';
import { createSelector } from 'reselect';
import { selectArticles } from './articles';
import { selectEvents } from './events';

export const selectFrontpage = createSelector(
  selectArticles,
  selectEvents,
  (articles, events) =>
    sortBy(articles.concat(events), item => {
      const timeField = item.eventType ? item.startTime : item.createdAt;
      return Math.abs(moment() - moment(timeField));
    })
);
