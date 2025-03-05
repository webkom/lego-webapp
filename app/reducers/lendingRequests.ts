import { createSlice } from '@reduxjs/toolkit';
import { LendingRequests } from 'app/actions/ActionTypes';
import { EntityType } from 'app/store/models/entities';
import createLegoAdapter from 'app/utils/legoAdapter/createLegoAdapter';
import type { RootState } from 'app/store/createRootReducer';

const legoAdapter = createLegoAdapter(EntityType.LendingRequests);

const lendingRequestSlice = createSlice({
  name: EntityType.LendingRequests,
  initialState: legoAdapter.getInitialState(),
  reducers: {},
  extraReducers: legoAdapter.buildReducers({
    fetchActions: [LendingRequests.FETCH],
  }),
});

export default lendingRequestSlice.reducer;
export const {
  selectById: selectLendingRequestById,
  selectAllPaginated: selectAllLendingRequests,
} = legoAdapter.getSelectors((state: RootState) => state.lendingRequests);
