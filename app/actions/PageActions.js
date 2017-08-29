// @flow

import { Page } from './ActionTypes';
import { pageSchema } from 'app/reducers';
import callAPI from 'app/actions/callAPI';
import isRequestNeeded from 'app/utils/isRequestNeeded';

const reducerKey = 'pages';

export function fetchPage(pageSlug: string) {
  return callAPI({
    types: Page.FETCH,
    endpoint: `/pages/${pageSlug}/`,
    schema: pageSchema,
    meta: {
      errorMessage: 'Fetching page failed'
    }
  });
}

export function fetchAll() {
  return callAPI({
    types: Page.FETCH,
    endpoint: '/pages/',
    schema: [pageSchema],
    meta: {
      errorMessage: 'Fetching pages failed'
    }
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
      errorMessage: 'Updating page failed'
    }
  });
}
