// @flow

import { createSelector } from 'reselect';
import { Announcements } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';
import moment from 'moment-timezone';
import { without } from 'lodash';
import produce from 'immer';

type State = any;

export default createEntityReducer({
  key: 'announcements',
  types: {
    fetch: Announcements.FETCH_ALL,
    mutate: Announcements.CREATE,
    delete: Announcements.DELETE
  },
  mutate: produce(
    (newState: State, action: any): void => {
      switch (action.type) {
        case Announcements.SEND.SUCCESS:
          newState.byId[action.meta.announcementId].sent = moment();
          break;
<<<<<<< HEAD
=======
        case Announcements.DELETE.SUCCESS:
          newState.items = without(newState.items, action.meta.announcementId);
          break;
>>>>>>> Use lodash pull and remove instead of filter in reducers
      }
    }
  )
});

export const selectAnnouncements = createSelector(
  state => state.announcements.byId,
  state => state.announcements.items,
  (announcementsById, announcementIds) =>
    announcementIds.map(id => announcementsById[id])
);
