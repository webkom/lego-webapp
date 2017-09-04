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
  comments: Array<number>
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

export const selectSortedQuotes = createSelector(
  state => state.quotes.byId,
  state => state.quotes.items,
  (state, props) => props.query || {},
  (byId, ids, query) => {
    return ids
      .map(id => byId[id])
      .filter(
        quote =>
          quote !== undefined &&
          quote.approved === (query.filter !== 'unapproved')
      )
      .sort(compareByDate);
  }
);

export const selectCommentsForQuote = createSelector(
  (state, quoteId) => state.quotes.byId[quoteId],
  state => state.comments.byId,
  (quote, commentsById) => {
    if (!quote || !commentsById) return [];
    return (quote.comments || []).map(commentId => commentsById[commentId]);
  }
);
