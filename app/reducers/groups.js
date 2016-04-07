import createReducer from '../utils/createReducer';
import { Group } from '../actions/ActionTypes';

const initialState = {
  items: [],
  isFetching: false,
  lastUpdated: null
};

function replaceGroup(groups, newGroup) {
  newGroup.users = newGroup.users.map(u => u.username);
  const existing = groups.find(group => group.id === newGroup.id);
  if (existing) {
    return groups.map(group => group.id === newGroup.id ? newGroup : group);
  }

  return groups.concat(newGroup);
}

export default createReducer(initialState, {
  [Group.FETCH_ALL_BEGIN]: (state, action) => ({ ...state, isFetching: true }),
  [Group.FETCH_ALL_FAILURE]: (state, action) => ({ ...state, isFetching: false }),
  [Group.FETCH_ALL_SUCCESS]: (state, action) => ({
    ...state, isFetching: false, items: action.payload
  }),
  [Group.FETCH_SUCCESS]: (state, action) => ({
    ...state,
    isFetching: false,
    items: replaceGroup(state.items, action.payload)
  }),
  [Group.UPDATE_SUCCESS]: (state, action) => ({
    ...state,
    isFetching: false,
    items: replaceGroup(state.items, action.payload)
  })
});
