import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment-timezone';
import { createSelector } from 'reselect';
import { Quote } from '~/redux/actionTypes';
import createLegoAdapter from '~/redux/legoAdapter/createLegoAdapter';
import { EntityType } from '~/redux/models/entities';
import { addReactionCases } from '~/redux/slices/reactions';
import type { EntityId } from '@reduxjs/toolkit';
import type { AnyAction } from 'redux';
import type { RootState } from '~/redux/rootReducer';

const legoAdapter = createLegoAdapter(EntityType.Quotes, {
  sortComparer: (a, b) => moment(a.createdAt).diff(moment(b.createdAt)),
});

type ExtraQuotesState = {
  randomQuote: EntityId | undefined;
};

const quotesSlice = createSlice({
  name: EntityType.Quotes,
  initialState: legoAdapter.getInitialState({
    randomQuote: undefined,
  } satisfies ExtraQuotesState),
  reducers: {},
  extraReducers: legoAdapter.buildReducers({
    fetchActions: [Quote.FETCH, Quote.FETCH_RANDOM],
    deleteActions: [Quote.DELETE],
    extraCases: (addCase) => {
      addReactionCases(EntityType.Quotes, addCase);

      addCase(Quote.UNAPPROVE.SUCCESS, (state, action: AnyAction) => {
        state.entities[action.meta.quoteId].approved = false;
        // Explicitly remove the quote from the paginated list to remove it from the list shown to the user
        // note: this will _not_ add it to the other pagination lists, since we cannot guarantee the order
        // as well as the other filtering
        Object.keys(state.paginationNext).forEach((paginationKey) => {
          const paginationEntry = state.paginationNext[paginationKey];

          if (
            paginationEntry.ids.includes(action.meta.quoteId) &&
            paginationEntry.query.approved === 'true'
          ) {
            paginationEntry.ids = paginationEntry.ids.filter(
              (item) => item !== action.meta.quoteId,
            );
          }
        });
      });

      addCase(Quote.APPROVE.SUCCESS, (state, action: AnyAction) => {
        state.entities[action.meta.quoteId].approved = true;
        // Explicitly remove the quote from the paginated list to remove it from the list shown to the user
        // note: this will _not_ add it to the other pagination lists, since we cannot guarntee the order
        // as well as the other filtering
        Object.keys(state.paginationNext).forEach((paginationKey) => {
          const paginationEntry = state.paginationNext[paginationKey];

          if (
            paginationEntry.ids.includes(action.meta.quoteId) &&
            paginationEntry.query.approved === 'false'
          ) {
            paginationEntry.ids = paginationEntry.ids.filter(
              (item) => item !== action.meta.quoteId,
            );
          }
        });
      });
      addCase(Quote.FETCH_RANDOM.SUCCESS, (state, action: AnyAction) => {
        state.randomQuote = action.payload.result;
      });
    },
  }),
});

export default quotesSlice.reducer;

export const {
  selectAllPaginated: selectQuotes,
  selectById: selectQuoteById,
  selectEntities: selectQuoteEntities,
} = legoAdapter.getSelectors((state: RootState) => state.quotes);

export const selectRandomQuote = createSelector(
  selectQuoteEntities,
  (state: RootState) => state.quotes.randomQuote,
  (quotes, randomQuoteId) => {
    if (!quotes || !randomQuoteId) return undefined;
    return quotes[randomQuoteId];
  },
);
