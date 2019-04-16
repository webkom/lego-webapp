

import keyBy from 'lodash/keyBy';

import { NotificationSettings } from 'app/actions/ActionTypes';
import { Action } from 'app/types';

type State = {
  channels: Array<string>;
  notificationTypes: Array<string>;
  settings: Object;
};

const initialState = {
  channels: [],
  notificationTypes: [],
  settings: {}
};

export default function notificationSettings(
  state: State = initialState,
  action: Action
): State {
  switch (action.type) {
    case NotificationSettings.FETCH_ALTERNATIVES.SUCCESS: {
      return {
        ...state,
        ...action.payload
      };
    }
    case NotificationSettings.FETCH.SUCCESS: {
      return {
        ...state,
        settings: transform(action.payload)
      };
    }
    case NotificationSettings.UPDATE.SUCCESS: {
      return {
        ...state,
        settings: {
          ...state.settings,
          ...transform([action.payload])
        }
      };
    }
    default:
      return state;
  }
}

export const transform = (settings: any) => keyBy(settings, 'notificationType');

export const selectNotificationSettingsAlternatives = (state: Object) => ({
  channels: state.notificationSettings.channels,
  notificationTypes: state.notificationSettings.notificationTypes
});

export const selectNotificationSettings = (state: Object) =>
  state.notificationSettings.settings || {};
