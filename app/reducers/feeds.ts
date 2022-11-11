import { createSlice } from '@reduxjs/toolkit';
import { union } from 'lodash';
import { createSelector } from 'reselect';
import { fetchFeed } from 'app/actions/FeedActions';
import type { ID } from 'app/store/models';
import { EntityType } from 'app/store/models/Entities';
import type Feed from 'app/store/models/Feed';
import type { FeedID, FeedType } from 'app/store/models/Feed';
import type { RootState } from 'app/store/rootReducer';
import addEntityReducer, {
  EntityReducerState,
  getInitialEntityReducerState,
} from 'app/store/utils/entityReducer';

function arrayOf<T>(value: T | T[]): T[] {
  if (Array.isArray(value)) return value;
  return [value];
}
export const feedTypeByFeedId = (feedId: FeedID): FeedType =>
  feedId.split('-')[0] as FeedType;
export const feedIdByUserId = (userId: ID): FeedID => `user-${userId}`;

export type FeedsState = EntityReducerState<Feed>;

const initialState: FeedsState = getInitialEntityReducerState();

const feedsSlice = createSlice({
  name: EntityType.Feed,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchFeed.success, (state, action) => {
      const { feedId } = action.meta;

      state.byId[feedId] = {
        type: feedTypeByFeedId(feedId),
        activities: union(
          (state.byId[feedId] ? state.byId[feedId].activities : []) || [],
          arrayOf(action.payload.result)
        ),
      };
      state.items = union(state.items, [feedId]);
    });

    addEntityReducer(builder, EntityType.Announcements, {});
  },
});

export default feedsSlice.reducer;

export const selectFeeds = createSelector(
  (state: RootState) => state.feeds.byId,
  (state: RootState) => state.feeds.items,
  (feedsById, feedIds) => feedIds.map((id) => feedsById[id])
);

export const selectFeedById = createSelector(
  (state: RootState) => state.feeds.byId,
  (state: RootState, props: { feedId: ID }) => props.feedId,
  (feedsById, feedId) => feedsById[feedId]
);

export const selectFeedActivitesByFeedId = createSelector(
  selectFeedById,
  (state: RootState) => state.feedActivities.byId,
  (feed, activitiesById) => {
    if (!feed) {
      return [];
    }

    return feed.activities.map((id) => activitiesById[id]);
  }
);
