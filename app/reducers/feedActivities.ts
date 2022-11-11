import { createSlice } from '@reduxjs/toolkit';
import { fetchFeed } from 'app/actions/FeedActions';
import { EntityType } from 'app/store/models/Entities';
import type FeedActivity from 'app/store/models/FeedActivity';
import type { EntityReducerState } from 'app/store/utils/entityReducer';
import addEntityReducer, {
  getInitialEntityReducerState,
} from 'app/store/utils/entityReducer';

export type FeedActivitiesState = EntityReducerState<FeedActivity>;

const initialState: FeedActivitiesState = getInitialEntityReducerState();

const feedActivitiesSlice = createSlice({
  name: EntityType.FeedActivity,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    addEntityReducer(builder, EntityType.FeedActivity, {
      fetch: fetchFeed,
    });
  },
});

export default feedActivitiesSlice.reducer;
