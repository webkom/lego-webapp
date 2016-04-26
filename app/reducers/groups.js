import { Group } from '../actions/ActionTypes';
import { fetchBegin, fetchSuccess, fetchFailure, defaultEntityState } from './entities';

const initialState = {
  ...defaultEntityState
};

export default function groups(state = initialState, action) {
  switch (action.type) {
    case Group.FETCH_ALL_BEGIN:
      return fetchBegin(state, action);
    case Group.FETCH_ALL_FAILURE:
      return fetchFailure(state, action);
    case Group.FETCH_ALL_SUCCESS:
      return fetchSuccess(state, action);
    case Group.UPDATE_SUCCESS:
      return fetchSuccess(state, action);
    default:
      return state;
  }
}
