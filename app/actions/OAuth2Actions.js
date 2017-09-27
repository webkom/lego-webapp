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
      errorMessage: 'Henting av OAuth2 applikasjoner feilet'
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
      errorMessage: 'Henting av OAuth2 applikasjon feilet'
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
      errorMessage: 'Oppdatering av OAuth2 applikasjon feilet'
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
      errorMessage: 'Opprettelse av OAuth2 applikasjon feilet'
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
      errorMessage: 'Henting av OAuth2 stipend feilet'
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
      errorMessage: 'Sletting av OAuth2 stipend feilet.',
      grantId
    },
    propagateError: true
  });
}
