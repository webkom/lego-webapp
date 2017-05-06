// @flow

import { Quote } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';
import { createSelector } from 'reselect';

export default createEntityReducer({
  key: 'quotes',
  types: {
    fetch: Quote.FETCH
  },
  mutate(state, action) {
    switch (action.type) {
      case Quote.DELETE.SUCCESS:
      case Quote.UNAPPROVE.SUCCESS:
      case Quote.APPROVE.SUCCESS:
        return {
          ...state,
          items: state.items.filter(id => id !== action.meta.quoteId)
        };

      default:
        return state;
    }
  }
});

export const selectCommentsForQuote = createSelector(
  (state, quoteId) =>
    state.quotes.byId.length === 0
      ? state.quotes.byId.find(quote => quote.id === Number(quoteId))
      : {},
  state => state.comments.byId,
  (quote, commentsById) => {
    if (!quote || !commentsById) return [];
    return (quote.comments || []).map(commentId => commentsById[commentId]);
  }
);
