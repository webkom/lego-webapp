import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment-timezone';
import { EntityType } from 'app/store/models/entities';
import createLegoAdapter from 'app/utils/legoAdapter/createLegoAdapter';
import { Poll } from '../actions/ActionTypes';

import type { RootState } from 'app/store/createRootReducer';

const legoAdapter = createLegoAdapter(EntityType.Polls, {
  sortComparer: (a, b) => moment(b.createdAt).diff(a.createdAt),
});

const pollsSlice = createSlice({
  name: EntityType.Polls,
  initialState: legoAdapter.getInitialState(),
  reducers: {},
  extraReducers: legoAdapter.buildReducers({
    fetchActions: [Poll.FETCH, Poll.FETCH_ALL],
    deleteActions: [Poll.DELETE],
  }),
});

export default pollsSlice.reducer;

export const {
  selectAll: selectAllPolls,
  selectById: selectPollById,
  selectByField: selectPollsByField,
} = legoAdapter.getSelectors((state: RootState) => state.polls);

export const selectPinnedPoll = (state: RootState) =>
  selectPollsByField('pinned').single(state, true);
