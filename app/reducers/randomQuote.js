// @flow

import { Quote } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';
import { createSelector } from 'reselect';
import { mutateReactions } from 'app/reducers/reactions';
import joinReducers from 'app/utils/joinReducers';

function mutateQuote(state: any, action: any) {
  switch (action.type) {
    case Quote.FETCH.SUCCESS: {
      const entity = action.payload.entities.randomQuote;
      return {
        ...state,
        byId: {
          0: entity[Object.keys(entity)[0]]
        }
      };
    }
    default:
      return state;
  }
}

const mutate = joinReducers(mutateReactions('randomQuote'), mutateQuote);

export default createEntityReducer({
  key: 'randomQuote',
  types: {
    fetch: Quote.FETCH
  },
  mutate
});

export const selectRandomQuote = createSelector(
  state => state.randomQuote.byId,
  randomQuote => {
    if (!randomQuote) return {};
    return randomQuote[0];
  }
);
