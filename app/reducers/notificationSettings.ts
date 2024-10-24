import { createSlice } from '@reduxjs/toolkit';
import { keyBy } from 'lodash-es';
import { createSelector } from 'reselect';
import { NotificationSettings } from 'app/actions/ActionTypes';
import type { RootState } from 'app/store/createRootReducer';
import type { AnyAction } from 'redux';

type State = {
  channels: string[];
  notificationTypes: string[];
  settings: Record<
    string,
    {
      notificationType: string;
      enabled: boolean;
      channels: string[];
    }
  >;
};
const initialState: State = {
  channels: [],
  notificationTypes: [],
  settings: {},
};
const notificationSettingsSlice = createSlice({
  name: 'notificationSettings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      NotificationSettings.FETCH_ALTERNATIVES.SUCCESS,
      (state, action: AnyAction) => {
        state.channels = action.payload.channels;
        state.notificationTypes = action.payload.notificationTypes;
      },
    );
    builder.addCase(
      NotificationSettings.FETCH.SUCCESS,
      (state, action: AnyAction) => {
        state.settings = keyBy(action.payload, 'notificationType');
      },
    );
    builder.addCase(
      NotificationSettings.UPDATE.SUCCESS,
      (state, action: AnyAction) => {
        state.settings[action.payload.notificationType] = action.payload;
      },
    );
  },
});

export default notificationSettingsSlice.reducer;

export const selectNotificationSettingsAlternatives = createSelector(
  (state: RootState) => state.notificationSettings.channels,
  (state: RootState) => state.notificationSettings.notificationTypes,
  (channels, notificationTypes) => ({
    channels,
    notificationTypes,
  }),
);
export const selectNotificationSettings = (state: RootState) =>
  state.notificationSettings.settings;
