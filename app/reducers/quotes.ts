import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import {
  addQuotes,
  approve,
  deleteQuote,
  fetchAll,
  fetchQuote,
  fetchRandomQuote,
  unapprove,
} from 'app/actions/QuoteActions';
import { addMutateReactionsReducer } from 'app/reducers/reactions';
import type { ReactionsGrouped } from 'app/reducers/reactions';
import type { ID } from 'app/store/models';
import { EntityType } from 'app/store/models/Entities';
import type Quote from 'app/store/models/Quote';
import { RootState } from 'app/store/rootReducer';
import addEntityReducer, {
  EntityReducerState,
  getInitialEntityReducerState,
  PaginationNext,
} from 'app/store/utils/entityReducer';

export interface QuoteEntity extends Quote {
  reactions: ReactionsGrouped[];
}

export type QuotesState = EntityReducerState<Quote> & {
  randomQuote?: ID;
};

const initialState: QuotesState = getInitialEntityReducerState();

const announcementsSlice = createSlice({
  name: 'announcements',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(unapprove.success, (state, action) => {
        state.byId[action.meta.quoteId].approved = false;
        // Explicitly remove the quote from the paginated list to remove it from the list shown to the user
        // note: this will _not_ add it to the other pagination lists, since we cannot guarantee the order
        // as well as the other filtering
        Object.keys(state.paginationNext).forEach((paginationKey) => {
          const paginationEntry = state.paginationNext[paginationKey];

          if (
            paginationEntry.items.includes(action.meta.quoteId) &&
            paginationEntry.query.approved === 'true'
          ) {
            paginationEntry.items = paginationEntry.items.filter(
              (item) => item !== action.meta.quoteId
            );
          }
        });
      })
      .addCase(approve.success, (state, action) => {
        state.byId[action.meta.quoteId].approved = true;
        // Explicitly remove the quote from the paginated list to remove it from the list shown to the user
        // note: this will _not_ add it to the other pagination lists, since we cannot guarntee the order
        // as well as the other filtering
        Object.keys(state.paginationNext).forEach((paginationKey) => {
          const paginationEntry = state.paginationNext[paginationKey];

          if (
            paginationEntry.items.includes(action.meta.quoteId) &&
            paginationEntry.query.approved === 'false'
          ) {
            paginationEntry.items = paginationEntry.items.filter(
              (item) => item !== action.meta.quoteId
            );
          }
        });
      })
      .addCase(fetchRandomQuote.success, (state, action) => {
        state.randomQuote = action.payload.result;
      });

    addMutateReactionsReducer(builder, EntityType.Quotes);

    addEntityReducer(builder, EntityType.Quotes, {
      fetch: [fetchAll, fetchQuote, fetchRandomQuote],
      mutate: [addQuotes],
      delete: [deleteQuote],
    });
  },
});

export default announcementsSlice.reducer;

export const selectQuotes = createSelector(
  (state: RootState) => state.quotes.byId,
  (state: RootState) => state.quotes.items,
  (_: RootState, { pagination }: { pagination?: PaginationNext[string] }) =>
    pagination,
  (quotesById, items, pagination) =>
    (pagination ? pagination.items : items).map(
      (quoteId) => quotesById[quoteId]
    )
);

export const selectQuoteById = createSelector(
  selectQuotes,
  (state: RootState, quoteId: ID) => quoteId,
  (quotes, quoteId) => {
    if (!quotes || !quoteId) return {};
    return quotes.find((quote) => Number(quote.id) === Number(quoteId));
  }
);

export const selectRandomQuote = createSelector(
  (state: RootState) => state.quotes.byId,
  (state: RootState) => state.quotes.randomQuote,
  (quotes, randomQuoteId) => {
    if (randomQuoteId) {
      return quotes[randomQuoteId];
    }
  }
);
