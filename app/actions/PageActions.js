// @flow

import { Page } from './ActionTypes';
import { pageSchema } from 'app/reducers';
import callAPI from 'app/actions/callAPI';

export function fetchPage(pageSlug: string) {
  return callAPI({
    types: Page.FETCH,
    endpoint: `/pages/${pageSlug}/tree`,
    schema: [pageSchema],
    meta: {
      errorMessage: 'Henting av side feilet'
    },
    propagateError: true
  });
}

export function fetchAll() {
  return callAPI({
    types: Page.FETCH,
    endpoint: '/pages/',
    schema: [pageSchema],
    meta: {
      errorMessage: 'Henting av sider feilet'
    },
    propagateError: true
  });
}

export function updatePage(slug: string, body: Object) {
  return callAPI({
    types: Page.UPDATE,
    endpoint: `/pages/${slug}/`,
    method: 'PATCH',
    body,
    schema: pageSchema,
    meta: {
      errorMessage: 'Oppdatering av sider feilet'
    }
  });
}

export function createPage(body) {
  return callAPI({
    types: Page.CREATE,
    endpoint: `/pages/`,
    method: 'POST',
    body,
    schema: pageSchema,
    meta: {
      errorMessage: 'Creating page failed'
    }
  });
}
