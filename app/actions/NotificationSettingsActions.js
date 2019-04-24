// @flow
import callAPI from './callAPI';

import { NotificationSettings } from './ActionTypes';

export function fetchNotificationAlternatives() {
  return callAPI({
    types: NotificationSettings.FETCH_ALTERNATIVES,
    endpoint: '/notification-settings/alternatives/',
    meta: {
      errorMessage: 'Henting av varslingsalternativer feilet'
    },
    propagateError: true
  });
}

export function fetchNotificationSettings() {
  return callAPI({
    types: NotificationSettings.FETCH,
    endpoint: '/notification-settings/',
    meta: {
      errorMessage: 'Henting av varslingsinntillinger feilet'
    },
    propagateError: true
  });
}

export function updateNotificationSetting(
  notificationType: string,
  channels: Array<string>
) {
  return callAPI({
    types: NotificationSettings.UPDATE,
    endpoint: '/notification-settings/',
    method: 'POST',
    body: {
      notificationType,
      enabled: true,
      channels
    },
    meta: {
      errorMessage: 'Oppdatering av varslingsinntillinger feilet',
      successMessage: 'Varslingsinnstillinger oppdatert'
    }
  });
}
