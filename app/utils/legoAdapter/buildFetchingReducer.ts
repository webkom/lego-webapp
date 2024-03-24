import { isAsyncActionType } from 'app/types';
import {
  isAsyncApiActionBegin,
  isAsyncApiActionFailure,
  isAsyncApiActionSuccess,
} from 'app/utils/legoAdapter/asyncApiActions';
import type { ActionReducerMapBuilder, AsyncThunk } from '@reduxjs/toolkit';
import type { AsyncThunkConfig } from '@reduxjs/toolkit/src/createAsyncThunk';
import type { AsyncActionType } from 'app/types';

type StateWithFetching = {
  fetching: boolean;
};

const buildFetchingReducer = (
  builder: ActionReducerMapBuilder<StateWithFetching>,
  actionTypes:
    | AsyncActionType[]
    | AsyncThunk<unknown, unknown, AsyncThunkConfig>[],
) => {
  const legacyActionTypes = actionTypes.filter(isAsyncActionType);
  const asyncThunks = actionTypes.filter(
    (at) => !isAsyncActionType(at),
  ) as AsyncThunk<unknown, unknown, AsyncThunkConfig>[];
  builder.addMatcher(
    isAsyncApiActionBegin.matching(legacyActionTypes),
    (state) => {
      state.fetching = true;
    },
  );
  builder.addMatcher(
    isAsyncApiActionFailure.matching(legacyActionTypes),
    (state) => {
      state.fetching = false;
    },
  );
  builder.addMatcher(
    isAsyncApiActionSuccess.matching(legacyActionTypes),
    (state) => {
      state.fetching = false;
    },
  );

  builder.addMatcher(
    (action) => asyncThunks.some((at) => at.pending.match(action)),
    (state) => {
      state.fetching = true;
    },
  );
  builder.addMatcher(
    (action) => asyncThunks.some((at) => at.rejected.match(action)),
    (state) => {
      state.fetching = false;
    },
  );
  builder.addMatcher(
    (action) => asyncThunks.some((at) => at.fulfilled.match(action)),
    (state) => {
      state.fetching = false;
    },
  );
};

export default buildFetchingReducer;
