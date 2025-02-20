import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment-timezone';
import { Announcements } from '~/redux/actionTypes';
import createLegoAdapter from '~/redux/legoAdapter/createLegoAdapter';
import { EntityType } from '~/redux/models/entities';
import type { AnyAction } from '@reduxjs/toolkit';
import type { RootState } from '~/redux/rootReducer';

const legoAdapter = createLegoAdapter(EntityType.Announcements);

const announcementsSlice = createSlice({
  name: EntityType.Announcements,
  initialState: legoAdapter.getInitialState(),
  reducers: {},
  extraReducers: legoAdapter.buildReducers({
    fetchActions: [Announcements.FETCH_ALL],
    deleteActions: [Announcements.DELETE],
    extraCases: (addCase) => {
      addCase(Announcements.SEND.SUCCESS, (state, action: AnyAction) => {
        const announcement = state.entities[action.meta.announcementId];
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
