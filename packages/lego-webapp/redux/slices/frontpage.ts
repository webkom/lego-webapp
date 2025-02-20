import { createSlice } from '@reduxjs/toolkit';
import { sortBy } from 'lodash';
import moment from 'moment-timezone';
import { createSelector } from 'reselect';
import { Frontpage } from '~/redux/actionTypes';
import buildFetchingReducer from '~/redux/legoAdapter/buildFetchingReducer';
import { EntityType } from '~/redux/models/entities';
import { selectArticles } from './articles';
import { selectAllEvents } from './events';

import type { PublicArticle } from '~/redux/models/Article';
import type { FrontpageEvent } from '~/redux/models/Event';

const frontpageSlice = createSlice({
  name: 'frontpage',
  initialState: {
    fetching: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    buildFetchingReducer(builder, [Frontpage.FETCH]);
  },
});
export default frontpageSlice.reducer;

// Selector for currently pinned object
export type ArticleWithType = PublicArticle & {
  entityType: EntityType.Articles;
};
export type EventWithType = FrontpageEvent & {
  entityType: EntityType.Events;
};

export const addArticleType = (article: PublicArticle): ArticleWithType => ({
  ...article,
  entityType: EntityType.Articles,
});
export const addEventType = (article: FrontpageEvent): EventWithType => ({
  ...article,
  entityType: EntityType.Events,
});

export const isEvent = (
  object: ArticleWithType | EventWithType,
): object is EventWithType => object.entityType === EntityType.Events;
export const isArticle = (
  object: ArticleWithType | EventWithType,
): object is ArticleWithType => object.entityType === EntityType.Articles;

export const frontpageObjectDate = (object: ArticleWithType | EventWithType) =>
  object.entityType === EntityType.Events
    ? moment(object.startTime)
    : moment(object.createdAt);

export const selectPinned = createSelector(
  selectArticles<PublicArticle>,
  selectAllEvents<FrontpageEvent>,
  (articles, events) => {
    const pinnedObjects = sortBy(
      [...articles.map(addArticleType), ...events.map(addEventType)],
      [
        (object) => (object.pinned ? 0 : 1), // Sort pinned objects first
        (object) => Math.abs(moment().diff(frontpageObjectDate(object))), // Sort by most recently published/starting soonest
        (object) => object.id,
      ],
    );

    return pinnedObjects[0] satisfies
      | ArticleWithType
      | EventWithType
      | undefined;
  },
);
