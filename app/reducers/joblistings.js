import { Joblistings } from '../actions/ActionTypes';
import { fetchBegin, fetchSuccess, fetchFailure, defaultEntityState } from './entities';

const initialState = {
  ...defaultEntityState
};

export default function joblistings(state = initialState, action) {
  switch (action.type) {
    case Joblistings.FETCH_BEGIN:
      return fetchBegin(state, action);

    case Joblistings.FETCH_SUCCESS:
      return fetchSuccess(state, action);

    case Joblistings.FETCH_FAILURE:
      return fetchFailure(state, action);

    default:
      return state;
  }
}
