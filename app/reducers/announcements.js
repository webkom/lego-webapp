// @flow

import { createSelector } from 'reselect';
import { Announcements } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';

export default createEntityReducer({
  key: 'announcements',
  types: {
    fetch: Announcements.FETCH_ALL
  }
});

export const selectAnnouncements = createSelector(
  state => state.announcements.byId,
  state => state.announcements.items,
  (announcementsById, announcementIds) =>
    announcementIds.map(id => announcementsById[id])
);
