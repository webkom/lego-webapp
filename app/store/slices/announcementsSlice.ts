import { createSelector } from 'reselect';
import { Announcements } from 'app/actions/ActionTypes';
import moment from 'moment-timezone';
import { RootState } from 'app/store/rootReducer';
import { Dateish } from 'app/models';
import addEntityReducer, {
  EntityReducerState,
  getInitialEntityReducerState,
} from '../utils/entityReducer';
import { createSlice } from '@reduxjs/toolkit';
import { ApiSuccessAction } from 'app/store/utils/apiActionTypes';
import { fetchAll } from 'app/actions/AnnouncementsActions';

interface AnnouncementEntity {
  id: number;
  message: string;
  fromGroup: any;
  sent: false | Dateish;
  users: any[];
  groups: any[];
  events: any[];
  meetings: any[];
}

type ActionGrant = 'delete' | 'view' | 'send' | 'list' | 'create' | 'edit';

type AnnouncementsState = EntityReducerState<
  AnnouncementEntity,
  number,
  ActionGrant
>;

const initialState: AnnouncementsState = getInitialEntityReducerState();

const announcementsSlice = createSlice({
  name: 'announcements',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        Announcements.SEND.SUCCESS,
        (state, action: ApiSuccessAction) => {
          state.byId[action.meta.announcementId].sent = moment();
        }
      )
      .addCase(fetchAll.fulfilled, (state, action) => {
        const payload = action.payload;
      });

    addEntityReducer(builder, 'announcements', {
      fetch: Announcements.FETCH_ALL,
      mutate: Announcements.CREATE,
      delete: Announcements.DELETE,
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
