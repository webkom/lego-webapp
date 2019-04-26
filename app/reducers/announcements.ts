import { createSelector } from 'reselect';
import { Announcements } from '../actions/ActionTypes';
import createEntityReducer from 'app/utils/createEntityReducer';
import moment from 'moment-timezone';

export default createEntityReducer({
  key: 'announcements',
  types: {
    fetch: Announcements.FETCH_ALL,
    mutate: Announcements.CREATE
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
      case Announcements.DELETE.SUCCESS:
        return {
          ...state,
          items: state.items.filter(id => action.meta.announcementId !== id)
        };
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
