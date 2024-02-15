import { createSelector } from '@reduxjs/toolkit';
import { LendableObject } from 'app/actions/ActionTypes';
import type { RootState } from 'app/store/createRootReducer';
import createEntityReducer from 'app/utils/createEntityReducer';
import type { EntityId } from '@reduxjs/toolkit';

export default createEntityReducer({
  key: 'lendableObjects',
  types: {
    fetch: LendableObject.FETCH,
    mutate: LendableObject.CREATE,
    delete: LendableObject.DELETE,
  },
});
export const selectLendableObjects = createSelector(
  (state: RootState) => state.lendableObjects.byId,
  (state: RootState) => state.lendableObjects.items,
  (lendableObjectsById, lendableObjectIds) =>
    lendableObjectIds.map((id) => lendableObjectsById[id])
);
export const selectLendableObjectById = createSelector(
  (state: RootState) => state.lendableObjects.byId,
  (state) => state.groups.byId,
  (_: RootState, props) => props.lendableObjectId,
  (lendableObjectsById, groupsById, lendableObjectId) => {
    const lendableObject = lendableObjectsById[lendableObjectId];

    if (!lendableObject) {
      return {
        responsibleGroups: [],
      }
    }
    return {
      ...lendableObject,
      responsibleGroups: lendableObject.responsibleGroups.map(
        (groupId) => groupsById[groupId]
      ),
    }
  }
);
