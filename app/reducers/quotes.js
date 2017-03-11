import { Quote } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';
import { createSelector } from 'reselect';

export default createEntityReducer({
  key: 'quotes',
  types: {
    fetch: Quote.FETCH,
    mutate: Quote.ADD
  },
  mutate(state, action) {
    switch (action.type) {
      case Quote.DELETE.SUCCESS:
        return {
          ...state,
          items: state.items.filter(id => action.meta.quoteId !== id)
        };

      default:
        return state;
    }
  }
});

export const selectQuotes = createSelector(
  state => state.quotes.items,
  state => state.quotes.byId,
  (quoteIds, quotesById) => quoteIds.map(quoteId => quotesById[quoteId])
);

export const selectQuote = createSelector(
  selectQuotes,
  (state, props) => props.quoteId,
  (quotes, quoteId) => quotes.find(quote => quote.id === Number(quoteId)) || {}
);

export const selectCommentsForQuote = createSelector(
  selectQuote,
  state => state.comments.byId,
  (quote, commentsById) => {
    if (!quote || !commentsById) return [];
    return (quote.comments || []).map(commentId => commentsById[commentId]);
  }
);
