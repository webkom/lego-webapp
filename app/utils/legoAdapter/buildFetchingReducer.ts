import type { AsyncActionType } from 'app/types';
import {
  isAsyncActionBegin,
  isAsyncActionFailure,
  isAsyncActionSuccess,
} from 'app/utils/legoAdapter/legacyAsyncActions';
import type { ActionReducerMapBuilder } from '@reduxjs/toolkit/src/mapBuilders';

type StateWithFetching = {
  fetching: boolean;
};

const buildFetchingReducer = (
  builder: ActionReducerMapBuilder<StateWithFetching>,
  actionTypes: AsyncActionType[]
) => {
  builder.addMatcher(isAsyncActionBegin.matching(actionTypes), (state) => {
    state.fetching = true;
  });
  builder.addMatcher(isAsyncActionFailure.matching(actionTypes), (state) => {
    state.fetching = false;
  });
  builder.addMatcher(isAsyncActionSuccess.matching(actionTypes), (state) => {
    state.fetching = false;
  });
};

export default buildFetchingReducer;
