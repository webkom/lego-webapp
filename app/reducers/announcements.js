// @flow

import { createSelector } from 'reselect';
import { Announcements } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';
import moment from 'moment-timezone';
import produce from 'immer';

export default createEntityReducer({
  key: 'announcements',
  types: {
    fetch: Announcements.FETCH_ALL,
    mutate: Announcements.CREATE,
    delete: Announcements.DELETE
  },
  mutate: (state, action) =>
    produce(state, newState => {
      switch (action.type) {
        case Announcements.SEND.SUCCESS:
          newState.byId[action.meta.announcementId].sent = moment();
          break;
      }
    })
});

export const selectAnnouncements = createSelector(
  state => state.announcements.byId,
  state => state.announcements.items,
  (announcementsById, announcementIds) =>
    announcementIds.map(id => announcementsById[id])
);
