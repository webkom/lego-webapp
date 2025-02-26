import { NotificationSettings } from '~/redux/actionTypes';
import callAPI from './callAPI';
import type { Thunk } from 'app/types';

export function fetchNotificationAlternatives(): Thunk<any> {
  return callAPI({
    types: NotificationSettings.FETCH_ALTERNATIVES,
    endpoint: '/notification-settings/alternatives/',
    meta: {
      errorMessage: 'Henting av varslingsalternativer feilet',
    },
    propagateError: true,
  });
}
export function fetchNotificationSettings(): Thunk<any> {
  return callAPI({
    types: NotificationSettings.FETCH,
    endpoint: '/notification-settings/',
    meta: {
      errorMessage: 'Henting av varslingsinnstillinger feilet',
    },
    propagateError: true,
  });
}
export function updateNotificationSetting(
  notificationType: string,
  channels: Array<string>,
): Thunk<any> {
  return callAPI({
    types: NotificationSettings.UPDATE,
    endpoint: '/notification-settings/',
    method: 'POST',
    body: {
      notificationType,
      enabled: true,
      channels,
    },
    meta: {
      errorMessage: 'Oppdatering av varslingsinnstillinger feilet',
      successMessage: 'Varslingsinnstillinger oppdatert',
    },
  });
}
