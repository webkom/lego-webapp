// @flow

import { Quote } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';
import { createSelector } from 'reselect';
import { mutateReactions } from 'app/reducers/reactions';
import joinReducers from 'app/utils/joinReducers';
import type { ID } from 'app/models';
import { type ReactionEntity } from 'app/reducers/reactions';

export type QuoteEntity = {
  id: ID,
  text: string,
  source: string,
  approved: boolean,
  contentTarget: string,
  reactionsGrouped: Array<ReactionEntity>,
  reactions: Array<ReactionEntity>,
  createdAt?: string
};

function mutateQuote(state: any, action: any) {
  switch (action.type) {
    case Quote.UNAPPROVE.SUCCESS: {
      const { quoteId } = action.meta;
      return {
        ...state,
        byId: {
          ...state.byId,
          [quoteId]: {
            ...state.byId[quoteId],
            approved: false
          }
        }
      };
    }
    case Quote.APPROVE.SUCCESS: {
      const { quoteId } = action.meta;
      return {
        ...state,
        byId: {
          ...state.byId,
          [quoteId]: {
            ...state.byId[quoteId],
            approved: true
          }
        }
      };
    }
    default:
      return state;
  }
}

const mutate = joinReducers(mutateReactions('quotes'), mutateQuote);

export default createEntityReducer({
  key: 'quotes',
  types: {
    fetch: Quote.FETCH,
    mutate: Quote.ADD,
    delete: Quote.DELETE
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
  (state, props) => ({ filter: props.filter }),
  (quotes, query) => {
    return quotes
      .filter(
        quote =>
          typeof quote !== 'undefined' &&
          quote.approved === (query.filter !== 'unapproved')
      )
      .sort(compareByDate);
  }
);
