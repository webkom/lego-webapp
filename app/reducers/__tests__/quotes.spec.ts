import { describe, it, expect } from 'vitest';
import { Quote } from '../../actions/ActionTypes';
import quotes from '../quotes';

describe('reducers', () => {
  describe('quotes', () => {
    const baseState = {
      actionGrant: [],
      pagination: {},
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
          items: [4],
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
          items: [3],
        },
      },
      items: [3, 4],
      byId: {
        3: {
          id: 3,
          approved: false,
        },
        4: {
          id: 4,
          approved: true,
        },
      },
    };
    it('Quote.APPROVE.SUCCESS', () => {
      const prevState = baseState;
      const action = {
        type: Quote.APPROVE.SUCCESS,
        meta: {
          quoteId: 3,
        },
      };
      expect(quotes(prevState, action)).toEqual({
        actionGrant: [],
        pagination: {},
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
            items: [4],
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
            items: [],
          },
        },
        items: [3, 4],
        byId: {
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
    it('Quote.UNAPPROVE.SUCCESS', () => {
      const prevState = baseState;
      const action = {
        type: Quote.UNAPPROVE.SUCCESS,
        meta: {
          quoteId: 4,
        },
      };
      expect(quotes(prevState, action)).toEqual({
        actionGrant: [],
        pagination: {},
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
            items: [],
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
            items: [3],
          },
        },
        items: [3, 4],
        byId: {
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
