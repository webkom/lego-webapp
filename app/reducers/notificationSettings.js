// @flow

import keyBy from 'lodash/keyBy';

import { NotificationSettings } from 'app/actions/ActionTypes';
import type { Action } from 'app/types';
import produce from 'immer';

type State = {
  channels: Array<string>,
  notificationTypes: Array<string>,
  settings: Object
};

const initialState = {
  channels: [],
  notificationTypes: [],
  settings: {}
};

const notificationSettings = produce(
  (newState: State, action: Action): void => {
    switch (action.type) {
      case NotificationSettings.FETCH_ALTERNATIVES.SUCCESS:
        newState.channels = action.payload.channels;
        newState.notificationTypes = action.payload.notificationTypes;
        break;

      case NotificationSettings.FETCH.SUCCESS:
        newState.settings = transform(action.payload);
        break;

      case NotificationSettings.UPDATE.SUCCESS: {
        newState.settings[action.payload.notificationType] = action.payload;
      }
    }
  },
  initialState
);

export default notificationSettings;

export const transform = (settings: any) => keyBy(settings, 'notificationType');

export const selectNotificationSettingsAlternatives = (state: Object) => ({
  channels: state.notificationSettings.channels,
  notificationTypes: state.notificationSettings.notificationTypes
});

export const selectNotificationSettings = (state: Object) =>
  state.notificationSettings.settings || {};
