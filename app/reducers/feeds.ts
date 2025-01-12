import { createSlice } from '@reduxjs/toolkit';
import { union } from 'lodash-es';
import { createSelector } from 'reselect';
import { selectFeedActivityEntities } from 'app/reducers/feedActivities';
import { asArray } from 'app/reducers/utils';
import { EntityType } from 'app/store/models/entities';
import createLegoAdapter from 'app/utils/legoAdapter/createLegoAdapter';
import { Feed } from '../actions/ActionTypes';
import type { AnyAction } from '@reduxjs/toolkit';
import type { RootState } from 'app/store/createRootReducer';

const legoAdapter = createLegoAdapter(EntityType.Feeds);

const feedsSlice = createSlice({
  name: EntityType.Feeds,
  initialState: legoAdapter.getInitialState(),
  reducers: {},
  extraReducers: legoAdapter.buildReducers({
    fetchActions: [Feed.FETCH],
    extraCases(addCase) {
      addCase(Feed.FETCH.SUCCESS, (state, action: AnyAction) => {
        const { feedId } = action.meta;

        if (!feedId) {
          return state;
        }

        legoAdapter.upsertOne(state, {
          id: feedId,
          type: feedId.split('-')[0],
          activities: union(
            (state.entities[feedId] ? state.entities[feedId].activities : []) ||
              [],
            asArray(action.payload.result),
          ),
        });
      });
    },
  }),
});

export default feedsSlice.reducer;

export const feedIdByUserId = (userId: string) => `user-${userId}`;

export const { selectById: selectFeedById } = legoAdapter.getSelectors(
  (state: RootState) => state.feeds,
);

export const selectFeedActivitiesByFeedId = createSelector(
  selectFeedById,
  selectFeedActivityEntities,
  (feed, feedActivityEntities) => {
    if (!feed) {
      return [];
    }

    return feed.activities.map((id) => feedActivityEntities[id]);
  },
);
