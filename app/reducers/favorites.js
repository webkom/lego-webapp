import { Favorite } from '../actions/ActionTypes';
import { fetchSuccess, defaultEntityState } from './entities';

const initialState = {
  ...defaultEntityState
};

export default function favorites(state = initialState, action) {
  switch (action.type) {
    case Favorite.FETCH_ALL.SUCCESS:
      return fetchSuccess(state, action);

    default:
      return state;
  }
}
