import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment-timezone';
import { Poll } from '~/redux/actionTypes';
import createLegoAdapter from '~/redux/legoAdapter/createLegoAdapter';
import { EntityType } from '~/redux/models/entities';

import type { RootState } from '~/redux/rootReducer';

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
