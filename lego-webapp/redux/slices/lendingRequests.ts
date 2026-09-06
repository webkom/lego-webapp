import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { LendingRequests } from '~/redux/actionTypes';
import createLegoAdapter from '~/redux/legoAdapter/createLegoAdapter';
import { TransformedLendingRequest } from '~/redux/models/LendingRequest';
import { EntityType } from '~/redux/models/entities';
import { RootState } from '~/redux/rootReducer';
import { selectAllLendableObjects } from '~/redux/slices/lendableObjects';

const legoAdapter = createLegoAdapter(EntityType.LendingRequests);

const lendingRequestSlice = createSlice({
  name: EntityType.LendingRequests,
  initialState: legoAdapter.getInitialState(),
  reducers: {},
  extraReducers: legoAdapter.buildReducers({
    fetchActions: [LendingRequests.FETCH, LendingRequests.FETCH_ADMIN],
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
    const lendableObjectsById = new Map(
      lendableObjects.map((lendableObject) => [
        lendableObject.id,
        lendableObject,
      ]),
    );

    return lendingRequests.reduce<TransformedLendingRequest[]>(
      (result, lendingRequest) => {
        const lendableObject = lendableObjectsById.get(
          lendingRequest.lendableObject,
        );

        if (!lendableObject) {
          return result;
        }

        result.push({
          ...lendingRequest,
          lendableObject,
        });
        return result;
      },
      [],
    );
  },
);
