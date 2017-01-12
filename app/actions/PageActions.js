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
