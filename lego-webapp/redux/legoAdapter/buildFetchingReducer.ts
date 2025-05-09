import {
  isAsyncApiActionBegin,
  isAsyncApiActionFailure,
  isAsyncApiActionSuccess,
} from '~/redux/legoAdapter/asyncApiActions';
import type { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import type { AsyncActionType } from 'app/types';

type StateWithFetching = {
  fetching: boolean;
};

const buildFetchingReducer = (
  builder: ActionReducerMapBuilder<StateWithFetching>,
  actionTypes: AsyncActionType[],
) => {
  builder.addMatcher(isAsyncApiActionBegin.matching(actionTypes), (state) => {
    state.fetching = true;
  });
  builder.addMatcher(isAsyncApiActionFailure.matching(actionTypes), (state) => {
    state.fetching = false;
  });
  builder.addMatcher(isAsyncApiActionSuccess.matching(actionTypes), (state) => {
    state.fetching = false;
  });
};

export default buildFetchingReducer;
