// @flow

import { Quote } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';
import { createSelector } from 'reselect';
import { mutateComments } from 'app/reducers/comments';
import joinReducers from 'app/utils/joinReducers';

export type QuoteEntity = {
  id: number,
  text: string,
  source: string,
  approved: boolean,
  comments: Array<number>,
  commentCount: string
};

function mutateQuote(state: any, action: any) {
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

const mutate = joinReducers(mutateComments('quotes'), mutateQuote);

export default createEntityReducer({
  key: 'quotes',
  types: {
    fetch: Quote.FETCH
  },
  mutate
});

const compareByDate = (a, b) => {
  const date1 = new Date(a.createdAt);
  const date2 = new Date(b.createdAt);
  return date2.getTime() - date1.getTime();
};

export const selectQuotes = createSelector(
  state => state.quotes.byId,
  state => state.quotes.items,
  (quotesById, ids) => {
    if (!quotesById || !ids) return [];
    return ids.map(quoteId => quotesById[quoteId]);
  }
);

export const selectQuoteById = createSelector(
  selectQuotes,
  (state, quoteId) => quoteId,
  (quotes, quoteId) => {
    if (!quotes || !quoteId) return {};
    return quotes.find(quote => Number(quote.id) === Number(quoteId));
  }
);

export const selectSortedQuotes = createSelector(
  selectQuotes,
  (state, props) => (props.location ? props.location.query : {}),
  (quotes, query) => {
    return quotes
      .filter(
        quote =>
          quote !== undefined &&
          quote.approved === (query.filter !== 'unapproved')
      )
      .sort(compareByDate);
  }
);

export const selectCommentsForQuote = createSelector(
  selectQuoteById,
  state => state.comments.byId,
  (quote, commentsById) => {
    if (!quote || !commentsById) return [];
    return (quote.comments || []).map(commentId => commentsById[commentId]);
  }
);
