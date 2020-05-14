import quotes from '../quotes';
import { Quote } from '../../actions/ActionTypes';

describe('reducers', () => {
  describe('quotes', () => {
    const baseState = {
      actionGrant: [],
      pagination: {},
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
