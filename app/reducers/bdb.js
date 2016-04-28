import { Bdb } from '../actions/ActionTypes';
import { fetchBegin, fetchSuccess, fetchFailure, defaultEntityState } from './entities';

const initialState = {
  ...defaultEntityState
};

export default function bdb(state = initialState, action) {
  switch (action.type) {
    case Bdb.FETCH_BEGIN:
      return fetchBegin(state, action);

    case Bdb.FETCH_SUCCESS:
      return fetchSuccess(state, action);

    case Bdb.FETCH_FAILURE:
      return fetchFailure(state, action);

    default:
      return state;
  }
}
