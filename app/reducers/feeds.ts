import { union } from 'lodash';
import { createSelector } from 'reselect';
import createEntityReducer from 'app/utils/createEntityReducer';
import { Feed } from '../actions/ActionTypes';

function arrayOf(value) {
  if (Array.isArray(value)) return value;
  return [value];
}

export default createEntityReducer({
  key: 'feeds',
  types: {},

  mutate(state, action) {
    switch (action.type) {
      case Feed.FETCH.SUCCESS: {
        const { feedId } = action.meta;

        if (!feedId) {
          return state;
        }

        return {
          ...state,
          byId: {
            ...state.byId,
            [feedId]: {
              type: feedId.split('-')[0],
              activities: union(
                (state.byId[feedId] ? state.byId[feedId].activities : []) || [],
                arrayOf(action.payload.result)
              ),
            },
          },
          items: union(state.items, [feedId]),
        };
      }

      default: {
        return state;
      }
    }
  },
});
export const feedIdByUserId = (userId: string) => `user-${userId}`;
export const selectFeeds = createSelector(
  (state) => state.feeds.byId,
  (state) => state.feeds.items,
  (feedsById, feedIds) => feedIds.map((id) => feedsById[id])
);
export const selectFeedById = createSelector(
  (state) => state.feeds.byId,
  (state, props) => props.feedId,
  (feedsById, feedId) => feedsById[feedId]
);
export const selectFeedActivitesByFeedId = createSelector(
  selectFeedById,
  (state) => state.feedActivities.byId,
  (feed, activiesById) => {
    if (!feed) {
      return [];
    }

    return feed.activities.map((id) => activiesById[id]);
  }
);
