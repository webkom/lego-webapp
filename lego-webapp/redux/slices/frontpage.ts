import { createSlice } from '@reduxjs/toolkit';
import { sortBy } from 'lodash-es';
import moment from 'moment-timezone';
import { createSelector } from 'reselect';
import { Frontpage } from '~/redux/actionTypes';
import buildFetchingReducer from '~/redux/legoAdapter/buildFetchingReducer';
import { EntityType } from '~/redux/models/entities';
import { selectArticles } from './articles';
import { selectAllEvents } from './events';

import type { AnyAction, EntityId } from '@reduxjs/toolkit';
import type { PublicArticle } from '~/redux/models/Article';
import type { FrontpageEvent } from '~/redux/models/Event';
import type { RootState } from '~/redux/rootReducer';

type NormalizedFrontpage = {
  articles?: EntityId[];
  events?: EntityId[];
};

const frontpageSlice = createSlice({
  name: 'frontpage',
  initialState: {
    fetching: false,
    articleIds: [] as EntityId[],
    eventIds: [] as EntityId[],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(Frontpage.FETCH.SUCCESS, (state, action: AnyAction) => {
      const frontpage = Object.values<NormalizedFrontpage>(
        action.payload.entities.frontpage ?? {},
      )[0];
      state.articleIds = frontpage?.articles ?? [];
      state.eventIds = frontpage?.events ?? [];
    });
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

export const selectFrontpageItems = createSelector(
  selectArticles<PublicArticle>,
  selectAllEvents<FrontpageEvent>,
  (state: RootState) => state.frontpage.articleIds,
  (state: RootState) => state.frontpage.eventIds,
  (articles, events, articleIds, eventIds) => {
    const frontpageArticleIds = new Set(articleIds);
    const frontpageEventIds = new Set(eventIds);

    return sortBy(
      [
        ...articles
          .filter((article) => frontpageArticleIds.has(article.id))
          .map(addArticleType),
        ...events
          .filter((event) => frontpageEventIds.has(event.id))
          .map(addEventType),
      ],
      [
        (object) => (object.pinned ? 0 : 1), // Sort pinned objects first
        (object) => Math.abs(moment().diff(frontpageObjectDate(object))), // Sort by most recently published/starting soonest
        (object) => object.id,
      ],
    ) satisfies (ArticleWithType | EventWithType)[];
  },
);

const FEATURED_WINDOW_DAYS = 7;
const MAX_FEATURED = 3;

const isCurrent = (object: ArticleWithType | EventWithType) => {
  const date = frontpageObjectDate(object);

  return isEvent(object)
    ? date.isBefore(moment().add(FEATURED_WINDOW_DAYS, 'days'))
    : date.isAfter(moment().subtract(FEATURED_WINDOW_DAYS, 'days'));
};

export const selectFeaturedItems = createSelector(
  selectFrontpageItems,
  (items) => {
    const featured = items
      .filter((object) => object.pinned || isCurrent(object))
      .slice(0, MAX_FEATURED);

    return featured.length > 0 ? featured : items.slice(0, 1);
  },
);
