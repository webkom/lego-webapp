import { Quote } from '../actions/ActionTypes';
import { fetchBegin, fetchSuccess, fetchFailure, defaultEntityState } from './entities';

const initialState = {
  ...defaultEntityState
};

export default function quotes(state = initialState, action) {
  switch (action.type) {
    case Quote.FETCH_BEGIN:
      return fetchBegin(state, action);

    case Quote.FETCH_SUCCESS:
      return fetchSuccess(state, action);

    case Quote.FETCH_FAILURE:
      return fetchFailure(state, action);

    case Quote.LIKE_SUCCESS:
    case Quote.UNLIKE_SUCCESS:
    case Quote.APPROVE_SUCCESS:
    case Quote.UNAPPROVE_SUCCESS:
    case Quote.ADD_SUCCESS:
      return fetchSuccess(state, action);

    case Quote.DELETE_SUCCESS:
      return {
        ...state,
        items: state.items.filter((id) => action.meta.quoteId !== id)
      };

    default:
      return state;
  }
}
