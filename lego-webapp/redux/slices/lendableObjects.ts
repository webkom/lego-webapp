import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { LendableObjects } from '~/redux/actionTypes';
import createLegoAdapter from '~/redux/legoAdapter/createLegoAdapter';
import { EntityType } from '~/redux/models/entities';
import type { EntityId } from '@reduxjs/toolkit';
import type { AnyAction } from '@reduxjs/toolkit';
import { selectPaginationNext } from '~/redux/slices/selectors';
import type { ListLendableObject } from '~/redux/models/LendableObject';
import type { RootState } from '~/redux/rootReducer';

const legoAdapter = createLegoAdapter(EntityType.LendableObjects);

const lendableObjectsSlice = createSlice({
  name: EntityType.LendableObjects,
  initialState: legoAdapter.getInitialState({
    availableIds: null as EntityId[] | null,
  }),
  reducers: {},
  extraReducers: legoAdapter.buildReducers({
    fetchActions: [LendableObjects.FETCH],
    deleteActions: [LendableObjects.DELETE],
    extraCases: (addCase) => {
      addCase(LendableObjects.FETCH_AVAILABLE.SUCCESS, (state, action: AnyAction) => {
        state.availableIds = action.payload;
      });
      addCase(LendableObjects.FETCH_AVAILABILITY.SUCCESS, (state, action: AnyAction) => {
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

export const selectAvailableLendableObjectIds = (state: RootState) =>
  state.lendableObjects.availableIds;

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
