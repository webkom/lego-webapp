// @flow

import React from 'react';

import { CheckBox } from 'app/components/Form';
import styles from './UserSettingsNotifications.css';
import type { UserEntity } from 'app/reducers/users';

type Props = {
  currentUser: UserEntity,
  updateUser: (Object, { noRedirect: boolean }) => Promise<void>,
  alternatives: {
    channels: Array<string>,
    notificationTypes: Array<string>
  },
  settings: Object,
  updateNotificationSetting: (
    notificationType: string,
    channels: Array<*>
  ) => void
};

const notificationTypeTraslations = {
  weekly_mail: 'Ukesmail',
  event_bump: 'Rykker opp fra venteliste på arrangement',
  event_admin_registration: 'Adminregistrering',
  event_admin_unregistration: 'Adminavregistrering',
  event_payment_overdue: 'Manglende betaling for arrangement',
  event_payment_overdue_creator: 'Adminoversikt over manglene betaling',
  meeting_invite: 'Invitasjon til møte',
  penalty_creation: 'Ny prikk',
  restricted_mail_sent: 'Utsending av begrenset epost',
  company_interest_created: 'Ny bedriftsinteresse',
  comment: 'Ny kommentar',
  comment_reply: 'Svar på kommentar',
  announcement: 'Viktig melding',
  survey_created: 'Ny spørreundersøkelse'
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
        Abakus sender ut notifikasjoner for forskjellige hendleser som skjer.
        Her kan du selv velge hva du vil motta og på hvilken kanal.
      </p>
      <p>
        <b>Viktig: </b> Hvis du deaktiverer {"'"}
        <i>Eposter som sendes direkte til deg</i>
        {"'"} kan du gå glipp av viktig informasjon! Du vil ikke motta noen
        eposter som sendes til deg som bruker, eller de mailinglistene du er en
        del av.
      </p>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Type</th>
            {props.alternatives.channels.map((channel, key) => (
              <th key={key}>{channel}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr key="emailLists">
            <td>Eposter som sendes direkte til deg</td>
            <td>
              <CheckBox
                value={props.currentUser.emailListsEnabled}
                onChange={event => {
                  const target = event.target;
                  const value = target.checked;
                  props.updateUser(
                    { ...props.currentUser, emailListsEnabled: value },
                    { noRedirect: true }
                  );
                }}
              />
            </td>
          </tr>
          {props.alternatives.notificationTypes.map((notificationType, key) => {
            const setting =
              props.settings[notificationType] ||
              defaultNotificationSetting(notificationType);
            const channnelSetting = channel =>
              setting.channels.includes(channel) && setting.enabled;
            const changeSetting = (changeChannel, value) => {
              props.updateNotificationSetting(
                notificationType,
                props.alternatives.channels.filter(
                  channel =>
                    changeChannel === channel ? value : channnelSetting(channel)
                )
              );
            };
            return (
              <tr key={key}>
                <td>
                  {notificationTypeTraslations[notificationType] ||
                    notificationType.replace(/_/g, ' ')}
                </td>
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
