import { describe, it, expect } from 'vitest';
import { Quote } from 'app/actions/ActionTypes';
import quotes from '../quotes';
import type QuoteType from 'app/store/models/Quote';

describe('reducers', () => {
  describe('quotes', () => {
    const baseState: ReturnType<typeof quotes> = {
      randomQuote: undefined,
      actionGrant: [],
      fetching: false,
      paginationNext: {
        '?approved=true': {
          hasMore: true,
          hasMoreBackwards: false,
          query: {
            approved: 'true',
          },
          next: {
            cursor: 'next-cur',
            approved: 'true',
          },
          ids: [4],
        },
        '?approved=false': {
          hasMore: true,
          hasMoreBackwards: false,
          query: {
            approved: 'false',
          },
          next: {
            cursor: 'next-cur',
            approved: 'false',
          },
          ids: [3],
        },
      },
      ids: [3, 4],
      entities: {
        3: {
          id: 3,
          approved: false,
        } as QuoteType,
        4: {
          id: 4,
          approved: true,
        } as QuoteType,
      },
    };
    it('Updates .approved on Quote.APPROVE.SUCCESS', () => {
      const prevState = baseState;
      const action = {
        type: Quote.APPROVE.SUCCESS,
        meta: {
          quoteId: 3,
        },
      };
      expect(quotes(prevState, action)).toEqual({
        ...baseState,
        paginationNext: {
          '?approved=true': {
            hasMore: true,
            hasMoreBackwards: false,
            query: {
              approved: 'true',
            },
            next: {
              cursor: 'next-cur',
              approved: 'true',
            },
            ids: [4],
          },
          '?approved=false': {
            hasMore: true,
            hasMoreBackwards: false,
            query: {
              approved: 'false',
            },
            next: {
              cursor: 'next-cur',
              approved: 'false',
            },
            ids: [],
          },
        },
        entities: {
          3: {
            id: 3,
            approved: true,
          },
          4: {
            id: 4,
            approved: true,
          },
        },
      });
    });
    it('Updates .approved on Quote.UNAPPROVE.SUCCESS', () => {
      const prevState = baseState;
      const action = {
        type: Quote.UNAPPROVE.SUCCESS,
        meta: {
          quoteId: 4,
        },
      };
      expect(quotes(prevState, action)).toEqual({
        ...baseState,
        paginationNext: {
          '?approved=true': {
            hasMore: true,
            hasMoreBackwards: false,
            query: {
              approved: 'true',
            },
            next: {
              cursor: 'next-cur',
              approved: 'true',
            },
            ids: [],
          },
          '?approved=false': {
            hasMore: true,
            hasMoreBackwards: false,
            query: {
              approved: 'false',
            },
            next: {
              cursor: 'next-cur',
              approved: 'false',
            },
            ids: [3],
          },
        },
        entities: {
          3: {
            id: 3,
            approved: false,
          },
          4: {
            id: 4,
            approved: false,
          },
        },
      });
    });
  });
});
