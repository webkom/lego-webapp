import { createSelector } from "@reduxjs/toolkit";
import { LendingRequest } from "app/actions/ActionTypes";
import { RootState } from "app/store/createRootReducer";
import createEntityReducer from "app/utils/createEntityReducer";


export default createEntityReducer({
    key: 'lendingRequests',
    types: {
      fetch: LendingRequest.FETCH,
      mutate: LendingRequest.CREATE,
     delete: LendingRequest.DELETE,
    },
  });

  export const selectLendingRequests = createSelector(
    (state: RootState) => state.lendingRequests.byId,
    (state: RootState) => state.lendingRequests.items,
    (state: RootState) => state.lendableObjects.byId,
    (lendingRequestsById, lendingRequestsIds, lendableObjectsById) =>
      lendingRequestsIds.map((id) => {
        const lendingRequest = lendingRequestsById[id];
        const lendableObject = lendableObjectsById[lendingRequest.lendableObject];

        return {
          ...lendingRequest,
          lendableObject,
        };
      })
  );

  export const selectLendingRequestById = createSelector(
    (state: RootState) => state.lendingRequests.byId,
    (_: RootState, props) => props.lendingRequestId,
    (lendingRequestsById, lendingRequestId) => {
      const lendingRequest = lendingRequestsById[lendingRequestId];
      if (!lendingRequest) {
        return {
          lendableObject: {},
        };
      }
      return lendingRequest;
    }
  );

  export const selectLendingRequestsByLendableObjectId = createSelector(
    (state: RootState) => state.lendingRequests.byId,
    (_: RootState, props) => props.lendableObjectId,
    (lendingRequestsById, lendableObjectId) =>
      Object.values(lendingRequestsById).filter(
        (lendingRequest) => lendingRequest.lendableObject?.id === lendableObjectId
      )
  );