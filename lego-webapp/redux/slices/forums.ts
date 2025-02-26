import { createSlice } from '@reduxjs/toolkit';
import { Forum } from '~/redux/actionTypes';
import createLegoAdapter from '~/redux/legoAdapter/createLegoAdapter';
import { EntityType } from '~/redux/models/entities';
import type { RootState } from '~/redux/rootReducer';

const legoAdapter = createLegoAdapter(EntityType.Forums);

const forumsSlice = createSlice({
  name: EntityType.Forums,
  initialState: legoAdapter.getInitialState(),
  reducers: {},
  extraReducers: legoAdapter.buildReducers({
    fetchActions: [Forum.FETCH_ALL],
    deleteActions: [Forum.DELETE],
  }),
});

export default forumsSlice.reducer;

export const { selectAll: selectAllForums, selectById: selectForumById } =
  legoAdapter.getSelectors((state: RootState) => state.forums);
