// @flow

import { Quote } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';
import { createSelector } from 'reselect';
import { mutateReactions } from 'app/reducers/reactions';
import joinReducers from 'app/utils/joinReducers';
import type { ID } from 'app/models';
import { type ReactionEntity } from 'app/reducers/reactions';
import produce from 'immer';

export type QuoteEntity = {
  id: ID,
  text: string,
  source: string,
  approved: boolean,
  contentTarget: string,
  reactionsGrouped: Array<ReactionEntity>,
  reactions: Array<ReactionEntity>,
  createdAt?: string,
};

type State = any;

const mutateQuote = produce((newState: State, action: any): void => {
  switch (action.type) {
    case Quote.UNAPPROVE.SUCCESS:
      newState.byId[action.meta.quoteId].approved = false;
      break;

    case Quote.APPROVE.SUCCESS:
      newState.byId[action.meta.quoteId].approved = true;
      break;

    case Quote.FETCH_RANDOM.SUCCESS:
      newState.randomQuote = action.payload.result;
      break;
  }
});

const mutate = joinReducers(mutateReactions('quotes'), mutateQuote);

export default createEntityReducer({
  key: 'quotes',
  types: {
    fetch: [Quote.FETCH, Quote.FETCH_RANDOM],
    mutate: Quote.ADD,
    delete: Quote.DELETE,
  },
  mutate,
});

const compareByDate = (a, b) => {
  const date1 = new Date(a.createdAt);
  const date2 = new Date(b.createdAt);
  return date2.getTime() - date1.getTime();
};

export const selectQuotes = createSelector(
  (state) => state.quotes.byId,
  (state) => state.quotes.items,
  (quotesById, ids) => {
    if (!quotesById || !ids) return [];
    return ids.map((quoteId) => quotesById[quoteId]);
  }
);

export const selectQuoteById = createSelector(
  selectQuotes,
  (state, quoteId) => quoteId,
  (quotes, quoteId) => {
    if (!quotes || !quoteId) return {};
    return quotes.find((quote) => Number(quote.id) === Number(quoteId));
  }
);

export const selectSortedQuotes = createSelector(
  selectQuotes,
  (state, props) => ({ filter: props.filter }),
  (quotes, query) => {
    return quotes
      .filter(
        (quote) =>
          typeof quote !== 'undefined' &&
          quote.approved === (query.filter !== 'unapproved')
      )
      .sort(compareByDate);
  }
);

export const selectRandomQuote = createSelector(
  (state) => state.quotes.byId,
  (state) => state.quotes.randomQuote,
  (quotes, randomQuoteId) => {
    if (!quotes || !randomQuoteId) return {};
    return quotes[randomQuoteId];
  }
);
