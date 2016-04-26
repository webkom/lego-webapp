import { User } from '../actions/ActionTypes';
import { fetchBegin, fetchSuccess, fetchFailure, defaultEntityState } from './entities';

const initialState = {
  ...defaultEntityState
};

export default function users(state = initialState, action) {
  switch (action.type) {
    case User.FETCH_BEGIN:
      return fetchBegin(state, action);
    case User.FETCH_SUCCESS:
      return fetchSuccess(state, action);
    case User.FETCH_FAILURE:
      return fetchFailure(state, action);
    default:
      return state;
  }
}
