import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment-timezone';
import {
  fetchAllAnnouncements,
  sendAnnouncement,
} from 'app/actions/AnnouncementsActions';
import { EntityType } from 'app/store/models/entities';
import createLegoAdapter from 'app/utils/legoAdapter/createLegoAdapter';
import type { RootState } from 'app/store/createRootReducer';

const legoAdapter = createLegoAdapter(EntityType.Announcements);

const announcementsSlice = createSlice({
  name: EntityType.Announcements,
  initialState: legoAdapter.getInitialState(),
  reducers: {},
  extraReducers: legoAdapter.buildReducers({
    fetchActions: [fetchAllAnnouncements],
    extraCases: (addCase) => {
      addCase(sendAnnouncement.fulfilled, (state, action) => {
        const announcement = state.entities[action.meta.extra.announcementId];
        if (announcement) {
          announcement.sent = moment().toISOString();
        }
      });
    },
  }),
});

export default announcementsSlice.reducer;
export const { selectAll: selectAnnouncements } = legoAdapter.getSelectors(
  (state: RootState) => state.announcements,
);
