import { CheckBox } from 'app/components/Form';
import styles from './UserSettingsNotifications.css';
import type { UserEntity } from 'app/reducers/users';

type Props = {
  currentUser: UserEntity;
  updateUser: (
    arg0: Record<string, any>,
    arg1: {
      noRedirect: boolean;
    }
  ) => Promise<void>;
  alternatives: {
    channels: Array<string>;
    notificationTypes: Array<string>;
  };
  settings: Record<string, any>;
  updateNotificationSetting: (
    notificationType: string,
    channels: Array<any>
  ) => void;
};
const notificationTypeTraslations = {
  weekly_mail: 'Ukesmail',
  event_bump: 'Rykker opp fra venteliste på arrangement',
  event_admin_registration: 'Adminregistrering',
  event_admin_unregistration: 'Adminavregistrering',
  event_payment_overdue: 'Manglende betaling for arrangement',
  event_payment_overdue_creator: 'Adminoversikt over manglene betaling',
  meeting_invite: 'Invitasjon til møte',
  meeting_invitation_reminder: 'Ubesvarte møteinvitasjoner',
  penalty_creation: 'Ny prikk',
  restricted_mail_sent:
    'Engangs-e-poster som sendes til bestemte grupper (begrenset e-post)',
  company_interest_created: 'Ny bedriftsinteresse',
  comment: 'Ny kommentar',
  comment_reply: 'Svar på kommentar',
  announcement: 'Kunngjøring/Viktig melding',
  survey_created: 'Ny spørreundersøkelse',
  registration_reminder: 'Påminnelse om påmelding til arrangementer',
  inactive_warning:
    'Varsel om at kontoen din snart blir slettet grunnet inaktivitet',
  deleted_warning:
    'Varsel om at kontoen din har blitt slettet grunnet inaktivitet',
};

const UserSettingsNotifications = (props: Props) => {
  const defaultNotificationSetting = (notificationType) => ({
    notificationType,
    enabled: true,
    channels: props.alternatives.channels,
  });

  return (
    <div>
      <h2>Notifikasjoner</h2>

      <p>
        Abakus sender ut notifikasjoner for forskjellige hendleser som skjer.
        Her kan du selv velge hva du vil motta og på hvilken kanal.
      </p>
      <p>
        <b>Viktig: </b> Hvis du deaktiverer {"'"}
        <i>E-poster som sendes direkte til deg</i>
        {"'"} kan du gå glipp av viktig informasjon! Du vil ikke motta noen
        e-poster som sendes til deg som bruker, eller de mailinglistene du er en
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
            <td>E-poster som sendes direkte til deg</td>
            <td>
              <CheckBox
                value={props.currentUser.emailListsEnabled}
                onChange={(event) => {
                  const target = event.target;
                  const value = target.checked;
                  props.updateUser(
                    { ...props.currentUser, emailListsEnabled: value },
                    {
                      noRedirect: true,
                    }
                  );
                }}
              />
            </td>
          </tr>
          {props.alternatives.notificationTypes.map((notificationType, key) => {
            const setting =
              props.settings[notificationType] ||
              defaultNotificationSetting(notificationType);

            const channnelSetting = (channel) =>
              setting.channels.includes(channel) && setting.enabled;

            const changeSetting = (changeChannel, value) => {
              props.updateNotificationSetting(
                notificationType,
                props.alternatives.channels.filter((channel) =>
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
                      onChange={(event) => {
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
