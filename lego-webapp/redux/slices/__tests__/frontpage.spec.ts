import moment from 'moment-timezone';
import { describe, it, expect } from 'vitest';
import { Frontpage } from '~/redux/actionTypes';
import frontpage, { selectPinned } from '../frontpage';
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

  describe('selectPinned', () => {
    it('ignores entities in the store that were not part of the frontpage response', () => {
      const state = createState({
        articleIds: [],
        eventIds: [3],
        articles: {},
        events: {
          3: {
            id: 3,
            pinned: false,
            startTime: moment().add(1, 'day').toISOString(),
          },
          99: {
            id: 99,
            pinned: false,
            startTime: moment().add(1, 'minute').toISOString(),
          },
        },
      });
      expect(selectPinned(state)?.id).toBe(3);
    });

    it('sorts pinned frontpage objects first', () => {
      const state = createState({
        articleIds: [6],
        eventIds: [3],
        articles: {
          6: {
            id: 6,
            pinned: true,
            createdAt: moment().subtract(1, 'month').toISOString(),
          },
        },
        events: {
          3: {
            id: 3,
            pinned: false,
            startTime: moment().add(1, 'minute').toISOString(),
          },
        },
      });
      expect(selectPinned(state)?.id).toBe(6);
    });

    it('returns undefined before the frontpage has been fetched', () => {
      const state = createState({
        articleIds: [],
        eventIds: [],
        articles: {},
        events: {
          99: {
            id: 99,
            pinned: false,
            startTime: moment().add(1, 'minute').toISOString(),
          },
        },
      });
      expect(selectPinned(state)).toBeUndefined();
    });
  });
});
