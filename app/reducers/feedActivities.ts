import { createSlice } from '@reduxjs/toolkit';
import { EntityType } from 'app/store/models/entities';
import createLegoAdapter from 'app/utils/legoAdapter/createLegoAdapter';
import { Feed } from '../actions/ActionTypes';
import type { RootState } from 'app/store/createRootReducer';

const legoAdapter = createLegoAdapter(EntityType.FeedActivities);

const feedActivitiesSlice = createSlice({
  name: EntityType.FeedActivities,
  initialState: legoAdapter.getInitialState(),
  reducers: {},
  extraReducers: legoAdapter.buildReducers({
    fetchActions: [Feed.FETCH],
  }),
});

export default feedActivitiesSlice.reducer;

export const { selectEntities: selectFeedActivityEntities } =
  legoAdapter.getSelectors((state: RootState) => state.feedActivities);
