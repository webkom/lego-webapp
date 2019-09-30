import notificationSettings from '../notificationSettings';
import { NotificationSettings } from '../../actions/ActionTypes';

describe('reducers', () => {
  const prevState = {
    channels: [],
    notificationTypes: [],
    settings: {}
  };
  describe('notificationSettings', () => {
    it('NotificationSettings.FETCH_ALTERNATIVES.SUCCESS', () => {
      const action = {
        type: NotificationSettings.FETCH_ALTERNATIVES.SUCCESS,
        payload: {
          channels: ['email', 'push'],
          notificationTypes: ['events', 'weekly']
        }
      };
      expect(notificationSettings(prevState, action)).toEqual({
        channels: ['email', 'push'],
        notificationTypes: ['events', 'weekly'],
        settings: {}
      });
    });
    it('NotificationSettings.FETCH.SUCCESS', () => {
      const action = {
        type: NotificationSettings.FETCH.SUCCESS,
        payload: [
          { notificationType: 'weekly', enabled: true, channels: ['push'] }
        ]
      };
      expect(notificationSettings(prevState, action)).toEqual({
        channels: [],
        notificationTypes: [],
        settings: {
          weekly: {
            notificationType: 'weekly',
            enabled: true,
            channels: ['push']
          }
        }
      });
    });
    it('NotificationSettings.UPDATE.SUCCESS', () => {
      const action = {
        type: NotificationSettings.UPDATE.SUCCESS,
        payload: {
          notificationType: 'comment',
          enabled: true,
          channels: ['email']
        }
      };
      expect(notificationSettings(prevState, action)).toEqual({
        channels: [],
        notificationTypes: [],
        settings: {
          comment: {
            notificationType: 'comment',
            enabled: true,
            channels: ['email']
          }
        }
      });
    });
  });
});
