import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { LendableObjects } from '~/redux/actionTypes';
import createLegoAdapter from '~/redux/legoAdapter/createLegoAdapter';
import { EntityType } from '~/redux/models/entities';
import { selectPaginationNext } from '~/redux/slices/selectors';
import type { ListLendableObject } from '~/redux/models/LendableObject';
import type { RootState } from '~/redux/rootReducer';

const legoAdapter = createLegoAdapter(EntityType.LendableObjects);

const lendableObjectsSlice = createSlice({
  name: EntityType.LendableObjects,
  initialState: legoAdapter.getInitialState(),
  reducers: {},
  extraReducers: legoAdapter.buildReducers({
    fetchActions: [LendableObjects.FETCH],
    deleteActions: [LendableObjects.DELETE],
    extraCases: (addCase) => {
      addCase(LendableObjects.FETCH_AVAILABILITY.SUCCESS, (state, action) => {
        const id = action.meta.id;
        legoAdapter.updateOne(state, {
          id,
          changes: {
            availability: action.payload,
          },
        });
      });
    },
  }),
});

export default lendableObjectsSlice.reducer;

const baseSelectors = legoAdapter.getSelectors(
  (state: RootState) => state.lendableObjects,
);

export const {
  selectById: selectLendableObjectById,
  selectAll: selectAllLendableObjects,
} = baseSelectors;

export const selectLendableObjectsForIndex = createSelector(
  (state: RootState) => state,
  selectPaginationNext({
    endpoint: '/lending/objects/',
    query: {},
    entity: EntityType.LendableObjects,
  }),
  (state, pagination) =>
    baseSelectors.selectAllPaginated<ListLendableObject>(state, pagination),
);
