import moment from 'moment-timezone';
import { describe, it, expect } from 'vitest';
import { Frontpage } from '~/redux/actionTypes';
import frontpage, {
  selectFeaturedItems,
  selectFrontpageEvents,
} from '../frontpage';
import type { RootState } from '~/redux/rootReducer';

describe('reducers', () => {
  describe('frontpage', () => {
    it('stores returned article and event ids on Frontpage.FETCH.SUCCESS', () => {
      const action = {
        type: Frontpage.FETCH.SUCCESS,
        payload: {
          entities: {
            frontpage: {
              undefined: { articles: [6], events: [3, 32], poll: null },
            },
          },
          result: undefined,
        },
      };
      expect(frontpage(undefined, action)).toEqual({
        fetching: false,
        articleIds: [6],
        eventIds: [3, 32],
      });
    });
  });
});

describe('selectors', () => {
  const entityStateBase = {
    actionGrant: [],
    fetching: false,
    paginationNext: {},
  };
  const createState = ({
    articleIds,
    eventIds,
    articles,
    events,
  }: {
    articleIds: number[];
    eventIds: number[];
    articles: Record<number, object>;
    events: Record<number, object>;
  }) =>
    ({
      frontpage: { fetching: false, articleIds, eventIds },
      articles: {
        ...entityStateBase,
        ids: Object.keys(articles).map(Number),
        entities: articles,
      },
      events: {
        ...entityStateBase,
        ids: Object.keys(events).map(Number),
        entities: events,
      },
    }) as unknown as RootState;

  const article = (id: number, pinned: boolean, ago: number) => ({
    id,
    pinned,
    createdAt: moment().subtract(ago, 'days').toISOString(),
  });
  const event = (id: number, pinned: boolean, ahead: number) => ({
    id,
    pinned,
    startTime: moment().add(ahead, 'days').toISOString(),
  });

  describe('selectFrontpageEvents', () => {
    it('ignores events in the store that were not part of the frontpage response', () => {
      const state = createState({
        articleIds: [],
        eventIds: [3, 4],
        articles: {},
        events: {
          3: event(3, false, 1),
          4: event(4, false, 2),
          99: event(99, false, 0),
        },
      });
      expect(selectFrontpageEvents(state).map((e) => e.id)).toEqual([3, 4]);
    });

    it('is empty before the frontpage has been fetched', () => {
      const state = createState({
        articleIds: [],
        eventIds: [],
        articles: {},
        events: { 99: event(99, false, 1) },
      });
      expect(selectFrontpageEvents(state)).toEqual([]);
    });
  });

  describe('selectFeaturedItems', () => {
    it('ignores entities in the store that were not part of the frontpage response', () => {
      const state = createState({
        articleIds: [],
        eventIds: [3],
        articles: {},
        events: { 3: event(3, false, 1), 99: event(99, false, 0) },
      });
      expect(selectFeaturedItems(state).map((o) => o.id)).toEqual([3]);
    });

    it('shows every pinned object, article and event alike', () => {
      const state = createState({
        articleIds: [6],
        eventIds: [3],
        articles: { 6: article(6, true, 30) },
        events: { 3: event(3, true, 1) },
      });
      expect(selectFeaturedItems(state).map((o) => o.id)).toEqual([3, 6]);
    });

    it('shows only the pinned object when a single one is pinned', () => {
      const state = createState({
        articleIds: [6],
        eventIds: [3, 4],
        articles: { 6: article(6, true, 30) },
        events: { 3: event(3, false, 1), 4: event(4, false, 2) },
      });
      expect(selectFeaturedItems(state).map((o) => o.id)).toEqual([6]);
    });

    it('keeps a pinned object however old it is', () => {
      const state = createState({
        articleIds: [6],
        eventIds: [],
        articles: { 6: article(6, true, 400) },
        events: {},
      });
      expect(selectFeaturedItems(state).map((o) => o.id)).toEqual([6]);
    });

    it('falls back to the nearest upcoming event when nothing is pinned', () => {
      const state = createState({
        articleIds: [6],
        eventIds: [3, 4],
        articles: { 6: article(6, false, 1) },
        events: { 3: event(3, false, 30), 4: event(4, false, 2) },
      });
      expect(selectFeaturedItems(state).map((o) => o.id)).toEqual([4]);
    });

    it('ignores events that have already started when falling back', () => {
      const state = createState({
        articleIds: [],
        eventIds: [3, 4],
        articles: {},
        events: { 3: event(3, false, -1), 4: event(4, false, 5) },
      });
      expect(selectFeaturedItems(state).map((o) => o.id)).toEqual([4]);
    });

    it('never falls back to an article', () => {
      const state = createState({
        articleIds: [6],
        eventIds: [],
        articles: { 6: article(6, false, 1) },
        events: {},
      });
      expect(selectFeaturedItems(state)).toEqual([]);
    });

    it('is empty before the frontpage has been fetched', () => {
      const state = createState({
        articleIds: [],
        eventIds: [],
        articles: {},
        events: { 99: event(99, false, 1) },
      });
      expect(selectFeaturedItems(state)).toEqual([]);
    });
  });
});
