import { createSlice } from '@reduxjs/toolkit';
import { LendingRequests } from '~/redux/actionTypes';
import createLegoAdapter from '~/redux/legoAdapter/createLegoAdapter';
import { EntityType } from '~/redux/models/entities';
import { RootState } from '~/redux/rootReducer';
import { createSelector } from 'reselect';
import { selectAllLendableObjects } from '~/redux/slices/lendableObjects';

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

export const selectTransformedLendingRequests = createSelector(
  selectAllLendingRequests,
  selectAllLendableObjects,
  (lendingRequests, lendableObjects) => {
    return lendingRequests.map((lendingRequest) => {
      const lendableObject = lendableObjects.find(
        (lendableObject) => lendableObject.id === lendingRequest.lendableObject,
      );
      return {
        ...lendingRequest,
        lendableObject,
      };
    });
  },
);
