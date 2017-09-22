// @flow

import React from 'react';

import { CheckBox } from 'app/components/Form';
import styles from './UserSettingsNotifications.css';

type Props = {
  alternatives: {
    channels: Array<string>,
    notificationTypes: Array<string>
  },
  settings: Object,
  updateNotificationSetting: (notificationType: string, channels: Array<*>) => void
};

const UserSettingsNotifications = (props: Props) => {
  const defaultNotificationSetting = notificationType => ({
    notificationType,
    enabled: true,
    channels: props.alternatives.channels
  });

  return (
    <div>
      <h1>Notifikasjoner</h1>

      <p>
        Abakus sender ut notifikasjoner for forskjellige hendleser som skjer. Her kan du selv velge
        hva du vil motta og på hvilken kanal.
      </p>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Type</th>
            {props.alternatives.channels.map((channel, key) => <th key={key}>{channel}</th>)}
          </tr>
        </thead>
        <tbody>
          {props.alternatives.notificationTypes.map((notificationType, key) => {
            const setting =
              props.settings[notificationType] || defaultNotificationSetting(notificationType);
            const channnelSetting = channel =>
              setting.channels.includes(channel) && setting.enabled;
            const changeSetting = (changeChannel, value) => {
              props.updateNotificationSetting(
                notificationType,
                props.alternatives.channels.filter(
                  channel => (changeChannel === channel ? value : channnelSetting(channel))
                )
              );
            };
            return (
              <tr key={key}>
                <td>{notificationType.replace(/_/g, ' ')}</td>
                {props.alternatives.channels.map((channel, key) => (
                  <td key={key}>
                    <CheckBox
                      value={channnelSetting(channel)}
                      onChange={event => {
                        const target = event.target;
                        const value = target.checked;
                        changeSetting(channel, value);
                      }}
                    />
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UserSettingsNotifications;
