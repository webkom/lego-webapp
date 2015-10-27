import createReducer from '../util/createReducer';
import { Groups } from '../actions/ActionTypes';

const initialState = {
  items: [],
  isFetching: false,
  lastUpdated: null
};

function replaceGroup(groups, newGroup) {
  const existing = groups.find(group => group.id === newGroup.id);
  if (existing) {
    return groups.map(group => group.id === newGroup.id ? newGroup : group);
  }

  return groups.concat(newGroup);
}

export default createReducer(initialState, {
  [Groups.FETCH_ALL_BEGIN]: (state, action) => ({ ...state, isFetching: true }),
  [Groups.FETCH_ALL_FAILURE]: (state, action) => ({ ...state, isFetching: false }),
  [Groups.FETCH_ALL_SUCCESS]: (state, action) => ({ ...state, isFetching: false, items: action.payload }),
  [Groups.FETCH_GROUP_SUCCESS]: (state, action) => ({
    ...state,
    isFetching: false,
    items: replaceGroup(state.items, action.payload)
  })
});
