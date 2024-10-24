import { createSlice } from '@reduxjs/toolkit';
import { LendableObjects } from 'app/actions/ActionTypes';
import { EntityType } from 'app/store/models/entities';
import createLegoAdapter from 'app/utils/legoAdapter/createLegoAdapter';
import type { RootState } from 'app/store/createRootReducer';

const legoAdapter = createLegoAdapter(EntityType.LendableObjects);

const lendableObjectsSlice = createSlice({
  name: EntityType.LendableObjects,
  initialState: legoAdapter.getInitialState(),
  reducers: {},
  extraReducers: legoAdapter.buildReducers({
    fetchActions: [LendableObjects.FETCH],
    deleteActions: [LendableObjects.DELETE],
  }),
});

export default lendableObjectsSlice.reducer;
export const {
  selectById: selectLendableObjectById,
  selectAll: selectAllLendableObjects,
} = legoAdapter.getSelectors((state: RootState) => state.lendableObjects);
