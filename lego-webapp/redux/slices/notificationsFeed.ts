import { createSlice } from '@reduxjs/toolkit';
import { NotificationsFeed } from '~/redux/actionTypes';
import { RootState } from '~/redux/rootReducer';

const initialState = {
  unreadCount: 0,
  unseenCount: 0,
};
const notificationsFeed = createSlice({
  name: 'notificationsFeed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(NotificationsFeed.FETCH_DATA.SUCCESS, (state, action) => {
      state.unreadCount = action.payload.unreadCount;
      state.unseenCount = action.payload.unseenCount;
    });
    builder.addCase(NotificationsFeed.MARK_ALL.SUCCESS, () => initialState);
    builder.addCase(NotificationsFeed.MARK_ALL.BEGIN, () => initialState);
    builder.addCase('SOCKET_NEW_NOTIFICATION', (state) => {
      state.unreadCount += 1;
      state.unseenCount += 1;
    });
  },
});

export default notificationsFeed.reducer;

export const selectUnreadNotificationsCount = (state: RootState) =>
  state.notificationsFeed.unreadCount;
export const selectUnseenNotificationsCount = (state: RootState) =>
  state.notificationsFeed.unseenCount;
