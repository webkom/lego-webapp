import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment-timezone';
import type { RootState } from 'app/store/createRootReducer';
import { EntityType } from 'app/store/models/entities';
import createLegoAdapter from 'app/utils/legoAdapter/createLegoAdapter';
import { Announcements } from '../actions/ActionTypes';
import type { AnyAction } from '@reduxjs/toolkit';

const legoAdapter = createLegoAdapter(EntityType.Announcements, {
  fetchActions: [Announcements.FETCH_ALL],
  deleteActions: [Announcements.DELETE],
});

const announcementsSlice = createSlice({
  name: EntityType.Announcements,
  initialState: legoAdapter.getInitialState(),
  reducers: {},
  extraReducers: legoAdapter.buildReducers((builder) => {
    builder.addCase(Announcements.SEND.SUCCESS, (state, action: AnyAction) => {
      const announcement = state.entities[action.meta.announcementId];
      if (announcement) {
        announcement.sent = moment();
      }
    });
  }),
});

export default announcementsSlice.reducer;
export const { selectAll: selectAllAnnouncements } = legoAdapter.getSelectors(
  (state: RootState) => state.announcements
);
