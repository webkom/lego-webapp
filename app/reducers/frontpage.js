import { createSelector } from 'reselect';
import { selectArticles } from './articles';
import { selectEvents } from './events';

export const selectFrontpage = createSelector(
  selectArticles,
  selectEvents,
  (articles, events) => {
    return articles.concat(events);
  }
);
