import { produce } from 'immer';
import { approve, unapprove } from 'app/actions/QuoteActions';
import type Quote from 'app/store/models/Quote';
import { getInitialEntityReducerState } from 'app/store/utils/entityReducer';
import quotes, { QuotesState } from '../quotes';

describe('reducers', () => {
  describe('quotes', () => {
    const baseState: QuotesState = {
      ...getInitialEntityReducerState(),
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
          previous: null,
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
          previous: null,
          items: [3],
        },
      },
      items: [3, 4],
      byId: {
        3: {
          id: 3,
          approved: false,
        } as Quote,
        4: {
          id: 4,
          approved: true,
        } as Quote,
      },
    };

    it('Quote.APPROVE.SUCCESS', () => {
      const prevState = baseState;
      const action = approve.success({
        payload: {},
        meta: {
          quoteId: 3,
        } as any,
      });

      expect(quotes(prevState, action)).toEqual(
        produce(prevState, (state) => {
          state.paginationNext['?approved=false'].items = [];
          state.byId[3].approved = true;
        })
      );
    });

    it('Quote.UNAPPROVE.SUCCESS', () => {
      const prevState = baseState;
      const action = unapprove.success({
        payload: {},
        meta: {
          quoteId: 4,
        } as any,
      });

      expect(quotes(prevState, action)).toEqual(
        produce(prevState, (state) => {
          state.paginationNext['?approved=true'].items = [];
          state.byId[4].approved = false;
        })
      );
    });
  });
});
