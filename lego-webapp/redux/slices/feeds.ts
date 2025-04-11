import { createSlice } from '@reduxjs/toolkit';
import { union } from 'lodash-es';
import moment from 'moment-timezone';
import { createSelector } from 'reselect';
import { Feed } from '~/redux/actionTypes';
import createLegoAdapter from '~/redux/legoAdapter/createLegoAdapter';
import { EntityType } from '~/redux/models/entities';
import { selectFeedActivityEntities } from '~/redux/slices/feedActivities';
import { asArray } from '~/redux/slices/utils';
import type { AnyAction } from '@reduxjs/toolkit';
import type { RootState } from '~/redux/rootReducer';

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
      addCase('SOCKET_NEW_NOTIFICATION', (state, action: AnyAction) => {
        legoAdapter.upsertOne(state, {
          id: 'notifications',
          type: 'notifications',
          activities: union(
            state.entities.notifications
              ? state.entities.notifications.activities || []
              : [],
            [action.payload.id],
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

export const selectNotifications = createSelector(
  (state: RootState) => selectFeedActivitiesByFeedId(state, 'notifications'),
  (notifications) =>
    notifications.sort((a, b) => moment(b.updatedAt).diff(a.updatedAt)),
);
