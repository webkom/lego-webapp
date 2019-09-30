// @flow

import { Quote } from '../actions/ActionTypes';
import { createSelector } from 'reselect';

const initialState = {
  item: undefined
};

export default function mutateRandomQuote(
  state: any = initialState,
  action: any
) {
  switch (action.type) {
    case Quote.FETCH.SUCCESS: {
      return {
        item: action.payload.result
      };
    }
    default:
      return state;
  }
}
export const selectRandomQuote = createSelector(
  state => state.quotes.byId,
  state => state.randomQuote.item,
  (quotes, randomQuoteId) => {
    if (!quotes || !randomQuoteId) return {};
    return quotes[randomQuoteId];
  }
);
