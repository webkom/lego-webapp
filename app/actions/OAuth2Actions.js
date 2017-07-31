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
    }
  });
}

export function fetchOAuth2Grants() {
  return callAPI({
    types: OAuth2.FETCH_GRANTS,
    endpoint: '/oauth2-access-tokens/',
    schema: [oauth2GrantSchema],
    meta: {
      errorMessage: 'Fetching OAuth2 grants failed.'
    }
  });
}
