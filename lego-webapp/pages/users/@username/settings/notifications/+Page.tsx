import { Card } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { ContentMain } from '~/components/Content';
import { CheckBox } from '~/components/Form';
import {
  fetchNotificationAlternatives,
  fetchNotificationSettings,
  updateNotificationSetting,
} from '~/redux/actions/NotificationSettingsActions';
import { updateUser } from '~/redux/actions/UserActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { useCurrentUser } from '~/redux/slices/auth';
import {
  selectNotificationSettings,
  selectNotificationSettingsAlternatives,
} from '~/redux/slices/notificationSettings';
import styles from './UserSettingsNotifications.module.css';

const notificationTypeTranslations = {
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
  comment_reply: 'Svar på kommentar',
  announcement: 'Kunngjøring/Viktig melding',
  survey_created: 'Ny spørreundersøkelse',
  registration_reminder: 'Påminnelse om påmelding til arrangementer',
  inactive_warning:
    'Varsel om at kontoen din snart blir slettet grunnet inaktivitet',
  deleted_warning:
    'Varsel om at kontoen din har blitt slettet grunnet inaktivitet',
};

const UserSettingsNotifications = () => {
  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchUserSettingsNotifications',
    () =>
      Promise.allSettled([
        dispatch(fetchNotificationAlternatives()),
        dispatch(fetchNotificationSettings()),
      ]),
    [],
  );

  const alternatives = useAppSelector(selectNotificationSettingsAlternatives);
  const settings = useAppSelector(selectNotificationSettings);

  const defaultNotificationSetting = (notificationType) => ({
    notificationType,
    enabled: true,
    channels: alternatives.channels,
  });

  const currentUser = useCurrentUser();

  if (!currentUser) {
    return null;
  }

  return (
    <ContentMain>
      <span>
        Abakus sender ut notifikasjoner for forskjellige hendleser som skjer.
        Her kan du selv velge hva du vil motta og på hvilken kanal.
      </span>

      <Card severity="warning">
        <Card.Header>Pass på!</Card.Header>
        <span>
          Hvis du deaktiverer {"'"}
          <i>E-poster som sendes direkte til deg</i>
          {"'"} kan du gå glipp av viktig informasjon! Du vil ikke motta noen
          e-poster som sendes til deg som bruker, eller de mailinglistene du er
          en del av.
        </span>
      </Card>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Type</th>
            {alternatives.channels.map((channel, key) => (
              <th key={key}>{channel}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr key="emailLists">
            <td>E-poster som sendes direkte til deg</td>
            <td>
              <CheckBox
                checked={currentUser.emailListsEnabled}
                onChange={(event) => {
                  dispatch(
                    updateUser({ ...currentUser, emailListsEnabled: event }),
                  );
                }}
              />
            </td>
          </tr>
          {alternatives.notificationTypes.map((notificationType, key) => {
            const setting =
              settings[notificationType] ||
              defaultNotificationSetting(notificationType);

            const channnelSetting = (channel) =>
              setting.channels.includes(channel) && setting.enabled;

            const changeSetting = (changeChannel, value) => {
              dispatch(
                updateNotificationSetting(
                  notificationType,
                  alternatives.channels.filter((channel) =>
                    changeChannel === channel
                      ? value
                      : channnelSetting(channel),
                  ),
                ),
              );
            };

            return (
              <tr key={key}>
                <td>
                  {notificationTypeTranslations[notificationType] ||
                    notificationType.replace(/_/g, ' ')}
                </td>
                {alternatives.channels.map((channel, key) => (
                  <td key={key}>
                    <CheckBox
                      checked={channnelSetting(channel)}
                      onChange={(event) => {
                        changeSetting(channel, event);
                      }}
                    />
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </ContentMain>
  );
};

export default UserSettingsNotifications;
