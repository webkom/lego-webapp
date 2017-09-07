// @flow

import callAPI from './callAPI';

import { OAuth2 } from './ActionTypes';
import { oauth2ApplicationSchema, oauth2GrantSchema } from 'app/reducers';

export function fetchOAuth2Applications() {
  return callAPI({
    types: OAuth2.FETCH_APPLICATIONS,
    endpoint: '/oauth2-applications/',
    schema: [oauth2ApplicationSchema],
    meta: {
      errorMessage: 'Fetching OAuth2 applications failed.'
    },
    propagateError: true
  });
}

export function fetchOAuth2Application(applicationId: number) {
  return callAPI({
    types: OAuth2.FETCH_APPLICATION,
    endpoint: `/oauth2-applications/${applicationId}/`,
    schema: oauth2ApplicationSchema,
    meta: {
      errorMessage: 'Fetching OAuth2 application failed.'
    },
    propagateError: true
  });
}

export function updateOAuth2Application(application: Object) {
  return callAPI({
    types: OAuth2.UPDATE_APPLICATION,
    method: 'PATCH',
    endpoint: `/oauth2-applications/${application.id}/`,
    schema: oauth2ApplicationSchema,
    body: application,
    meta: {
      errorMessage: 'Updating OAuth2 application failed.'
    },
    propagateError: true
  });
}

export function createOAuth2Application(application: Object) {
  return callAPI({
    types: OAuth2.CREATE_APPLICATION,
    method: 'POST',
    endpoint: '/oauth2-applications/',
    schema: oauth2ApplicationSchema,
    body: application,
    meta: {
      errorMessage: 'Creating OAuth2 application failed.'
    },
    propagateError: true
  });
}

export function fetchOAuth2Grants() {
  return callAPI({
    types: OAuth2.FETCH_GRANTS,
    endpoint: '/oauth2-access-tokens/',
    schema: [oauth2GrantSchema],
    meta: {
      errorMessage: 'Fetching OAuth2 grants failed.'
    },
    propagateError: true
  });
}

export function deleteOAuth2Grant(grantId: number) {
  return callAPI({
    types: OAuth2.DELETE_GRANT,
    method: 'DELETE',
    endpoint: `/oauth2-access-tokens/${grantId}/`,
    schema: oauth2GrantSchema,
    meta: {
      errorMessage: 'Deleting OAuth2 grant failed.',
      grantId
    },
    propagateError: true
  });
}
