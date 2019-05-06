// @flow

import { createSelector } from 'reselect';
import { Announcements } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';
import moment from 'moment-timezone';

export default createEntityReducer({
  key: 'announcements',
  types: {
    fetch: Announcements.FETCH_ALL,
    mutate: Announcements.CREATE,
    delete: Announcements.DELETE
  },
  mutate(state, action) {
    switch (action.type) {
      case Announcements.SEND.SUCCESS: {
        const { announcementId } = action.meta;
        return {
          ...state,
          byId: {
            ...state.byId,
            [announcementId]: {
              ...state.byId[announcementId],
              sent: moment()
            }
          }
        };
      }
      default:
        return state;
    }
  }
});

export const selectAnnouncements = createSelector(
  state => state.announcements.byId,
  state => state.announcements.items,
  (announcementsById, announcementIds) =>
    announcementIds.map(id => announcementsById[id])
);
