import { Quote } from '../actions/ActionTypes';
import { fetchBegin, fetchSuccess, fetchFailure, defaultEntityState } from './entities';

const initialState = {
  ...defaultEntityState
};

export default function quotes(state = initialState, action) {
  switch (action.type) {
    case Quote.FETCH.BEGIN:
      return fetchBegin(state, action);

    case Quote.FETCH.SUCCESS:
      return fetchSuccess(state, action);

    case Quote.FETCH.FAILURE:
      return fetchFailure(state, action);

    case Quote.LIKE.SUCCESS:
    case Quote.UNLIKE.SUCCESS:
    case Quote.APPROVE.SUCCESS:
    case Quote.UNAPPROVE.SUCCESS:
    case Quote.ADD.SUCCESS:
      return fetchSuccess(state, action);

    case Quote.DELETE.SUCCESS:
      return {
        ...state,
        items: state.items.filter((id) => action.meta.quoteId !== id)
      };

    default:
      return state;
  }
}
