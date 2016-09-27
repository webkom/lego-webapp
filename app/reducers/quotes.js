import { Quote } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';

export default createEntityReducer({
  key: 'quotes',
  types: [Quote.FETCH.BEGIN, Quote.FETCH.SUCCESS, Quote.FETCH.FAILURE],
  mutate(state, action) {
    switch (action.type) {
      case Quote.DELETE.SUCCESS:
        return {
          ...state,
          items: state.items.filter((id) => action.meta.quoteId !== id)
        };

      default:
        return state;
    }
  }
});
