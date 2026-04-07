import { createSlice } from '@reduxjs/toolkit';
import { LendableObjects } from '~/redux/actionTypes';
import createLegoAdapter from '~/redux/legoAdapter/createLegoAdapter';
import { EntityType } from '~/redux/models/entities';
import type { EntityId } from '@reduxjs/toolkit';
import type { AnyAction } from '@reduxjs/toolkit';
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
export const {
  selectById: selectLendableObjectById,
  selectAll: selectAllLendableObjects,
} = legoAdapter.getSelectors((state: RootState) => state.lendableObjects);

export const selectAvailableLendableObjectIds = (state: RootState) =>
  state.lendableObjects.availableIds;
