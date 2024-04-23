import { createSlice } from '@reduxjs/toolkit';
import { Forum } from 'app/actions/ActionTypes';
import { EntityType } from 'app/store/models/entities';
import createLegoAdapter from 'app/utils/legoAdapter/createLegoAdapter';
import type { RootState } from 'app/store/createRootReducer';

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
