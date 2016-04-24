import union from 'lodash/union';
import { Event } from '../actions/ActionTypes';
import { fetchBegin, fetchSuccess, fetchFailure, defaultEntityState } from './entities';

const initialState = {
  ...defaultEntityState
};

export type EventEntity = {
  id: number;
  name: string;
  comments: Array<number>;
};

export default function events(state = initialState, action) {
  switch (action.type) {
    case Event.FETCH_BEGIN:
      return fetchBegin(state, action);

    case Event.FETCH_FAILURE:
      return fetchFailure(state, action);

    case Event.FETCH_SUCCESS:
      return fetchSuccess({
        ...state,
        items: union(state.items, action.payload.result)
      }, action);

    default:
      return state;
  }
}
