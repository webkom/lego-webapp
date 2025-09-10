import { createSlice } from '@reduxjs/toolkit';
import { LendableObjects } from '~/redux/actionTypes';
import createLegoAdapter from '~/redux/legoAdapter/createLegoAdapter';
import { EntityType } from '~/redux/models/entities';
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
export const {
  selectById: selectLendableObjectById,
  selectAll: selectAllLendableObjects,
} = legoAdapter.getSelectors((state: RootState) => state.lendableObjects);
