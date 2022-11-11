import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment-timezone';
import { createSelector } from 'reselect';
import {
  createAnnouncement,
  deleteAnnouncement,
  fetchAll,
  sendAnnouncement,
} from 'app/actions/AnnouncementsActions';
import type Announcement from 'app/store/models/Announcement';
import { EntityType } from 'app/store/models/Entities';
import type { RootState } from 'app/store/rootReducer';
import addEntityReducer, {
  EntityReducerState,
  getInitialEntityReducerState,
} from 'app/store/utils/entityReducer';

export type AnnouncementsState = EntityReducerState<Announcement>;

const initialState: AnnouncementsState = getInitialEntityReducerState();

const announcementsSlice = createSlice({
  name: EntityType.Announcements,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(sendAnnouncement.success, (state, action) => {
      state.byId[action.meta.announcementId].sent = moment();
    });

    addEntityReducer(builder, EntityType.Announcements, {
      fetch: fetchAll,
      mutate: createAnnouncement,
      delete: deleteAnnouncement,
    });
  },
});

export default announcementsSlice.reducer;

export const selectAnnouncements = createSelector(
  (state: RootState) => state.announcements.byId,
  (state: RootState) => state.announcements.items,
  (announcementsById, announcementIds) =>
    announcementIds.map((id) => announcementsById[id])
);
