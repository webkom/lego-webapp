import { Page } from './ActionTypes';
import { pageSchema } from 'app/reducers';
import callAPI from 'app/actions/callAPI';

export function fetchPage(pageSlug) {
  return callAPI({
    types: Page.FETCH,
    endpoint: `/pages/${pageSlug}/`,
    schema: pageSchema,
    meta: {
      errorMessage: 'Fetching page failed'
    }
  });
}

export function fetchHierarchy(pageSlug) {
  return callAPI({
    types: Page.FETCH_HIERARCHY,
    endpoint: `/pages/${pageSlug}/hierarchy/`,
    meta: {
      errorMessage: 'Fetching page hierarchy failed'
    }
  });
}
