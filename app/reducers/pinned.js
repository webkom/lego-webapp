// @flow
import moment from 'moment-timezone';
import { createSelector } from 'reselect';
import createEntityReducer from 'app/utils/createEntityReducer';
import { Pinned } from '../actions/ActionTypes';

export type PinnedEntity = {};

const deletePinned = (state: any, action: any) => {
  switch (action.type) {
    case Pinned.DELETE.SUCCESS:
      return {
        ...state,
        items: state.items.filter(id => id !== action.meta.pinnedId)
      };
    default:
      return state;
  }
};

export default createEntityReducer({
  key: 'pinned',
  types: {
    fetch: Pinned.FETCH,
    mutate: Pinned.CREATE
  },
  mutate: deletePinned
});

function transformPinned(pinned) {
  return {
    ...pinned,
    pinnedFrom: moment(pinned.pinnedFrom),
    pinnedTo: moment(pinned.pinnedTo)
  };
}

export const selectPinned = createSelector(
  state => state.pinned.byId,
  state => state.pinned.items,
  (pinnedById, pinnedIds) => {
    return pinnedIds.map(id => transformPinned(pinnedById[id]));
  }
);

export const selectPinnedById = createSelector(
  selectPinned,
  (state, pinnedId) => pinnedId,
  (pinned, pinnedId) => {
    if (!pinned || !pinnedId) return {};
    return transformPinned(
      pinned.find(pin => Number(pin.id) === Number(pinnedId))
    );
  }
);
