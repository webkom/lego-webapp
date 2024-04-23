import { createSlice } from '@reduxjs/toolkit';
import { LendingRequest } from 'app/actions/ActionTypes';
import { EntityType } from 'app/store/models/entities';
import createLegoAdapter from 'app/utils/legoAdapter/createLegoAdapter';
import type { RootState } from 'app/store/createRootReducer';


const legoAdapter = createLegoAdapter(EntityType.LendingRequests);

const lendingRequestsSlice = createSlice({
  name: EntityType.LendingRequests,
  initialState: legoAdapter.getInitialState(),
  reducers: {},
  extraReducers: legoAdapter.buildReducers({
    fetchActions: [LendingRequest.FETCH_ALL],
    deleteActions: [LendingRequest.DELETE],
  }),
});

export default lendingRequestsSlice.reducer;

export const {
  selectById: selectLendingRequestById,
  selectAll: selectLendingRequests,
  selectByField: selectLendingRequestsByField,
} = legoAdapter.getSelectors((state: RootState) => state.lendingRequests);



export const selectLendingRequestsByLendableObjectId = selectLendingRequestsByField('lendableObjectId');