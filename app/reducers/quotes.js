// @flow

import { produce } from 'immer';
import { createSelector } from 'reselect';

import type { ID } from 'app/models';
import { type ReactionEntity, mutateReactions } from 'app/reducers/reactions';
import createEntityReducer from 'app/utils/createEntityReducer';
import joinReducers from 'app/utils/joinReducers';
import { Quote } from '../actions/ActionTypes';

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
      // Explicitly remove the quote from the paginated list to remove it from the list shown to the user
      // note: this will _not_ add it to the other pagination lists, since we cannot guarntee the order
      // as well as the other filtering
      Object.keys(newState.paginationNext).forEach((paginationKey) => {
        const paginationEntry = newState.paginationNext[paginationKey];
        if (
          paginationEntry.items.includes(action.meta.quoteId) &&
          paginationEntry.query.approved === 'true'
        ) {
          paginationEntry.items = paginationEntry.items.filter(
            (item) => item !== action.meta.quoteId
          );
        }
      });
      break;

    case Quote.APPROVE.SUCCESS:
      newState.byId[action.meta.quoteId].approved = true;
      // Explicitly remove the quote from the paginated list to remove it from the list shown to the user
      // note: this will _not_ add it to the other pagination lists, since we cannot guarntee the order
      // as well as the other filtering
      Object.keys(newState.paginationNext).forEach((paginationKey) => {
        const paginationEntry = newState.paginationNext[paginationKey];
        if (
          paginationEntry.items.includes(action.meta.quoteId) &&
          paginationEntry.query.approved === 'false'
        ) {
          paginationEntry.items = paginationEntry.items.filter(
            (item) => item !== action.meta.quoteId
          );
        }
      });
      break;

    case Quote.FETCH_RANDOM.SUCCESS:
      newState.randomQuote = action.payload.result;
      break;

    default:
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

export const selectQuotes = createSelector(
  (state) => state.quotes.byId,
  (state) => state.quotes.items,
  (_, props) => props?.pagination,
  (quotesById, items, pagination) =>
    (pagination ? pagination.items : items).map(
      (quoteId) => quotesById[quoteId]
    )
);

export const selectQuoteById = createSelector(
  selectQuotes,
  (state, quoteId) => quoteId,
  (quotes, quoteId) => {
    if (!quotes || !quoteId) return {};
    return quotes.find((quote) => Number(quote.id) === Number(quoteId));
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
