import keyBy from 'lodash/keyBy';
import { NotificationSettings } from 'app/actions/ActionTypes';
import { produce } from 'immer';
type State = {
  channels: Array<string>;
  notificationTypes: Array<string>;
  settings: Record<string, any>;
};
const initialState = {
  channels: [],
  notificationTypes: [],
  settings: {},
};
const notificationSettings = produce<State>(
  (newState: State, action: any): void => {
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
        break;
      }

      default:
        break;
    }
  },
  initialState
);
export default notificationSettings;
export const transform = (settings: any) =>
  keyBy<any, string>(settings, 'notificationType');
export const selectNotificationSettingsAlternatives = (
  state: Record<string, any>
) => ({
  channels: state.notificationSettings.channels,
  notificationTypes: state.notificationSettings.notificationTypes,
});
export const selectNotificationSettings = (state: Record<string, any>) =>
  state.notificationSettings.settings || {};
