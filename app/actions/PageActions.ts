import callAPI from 'app/actions/callAPI';
import { pageSchema } from 'app/reducers';
import { Page } from './ActionTypes';
import type { Thunk } from 'app/types';

export function fetchPage(pageSlug: string): Thunk<any> {
  return callAPI({
    types: Page.FETCH,
    endpoint: `/pages/${pageSlug}/`,
    schema: pageSchema,
    meta: {
      errorMessage: 'Henting av side feilet',
    },
    propagateError: true,
  });
}
export function deletePage(pageSlug: string): Thunk<any> {
  return callAPI({
    types: Page.DELETE,
    endpoint: `/pages/${pageSlug}/`,
    method: 'DELETE',
    meta: {
      id: pageSlug,
      errorMessage: 'Sletting av side feilet',
    },
  });
}
export function fetchAll(): Thunk<any> {
  return callAPI({
    types: Page.FETCH,
    endpoint: '/pages/',
    schema: [pageSchema],
    meta: {
      errorMessage: 'Henting av sider feilet',
    },
    propagateError: true,
  });
}
export function updatePage(
  slug: string,
  body: Record<string, any>
): Thunk<any> {
  return callAPI({
    types: Page.UPDATE,
    endpoint: `/pages/${slug}/`,
    method: 'PATCH',
    body,
    schema: pageSchema,
    meta: {
      errorMessage: 'Oppdatering av sider feilet',
    },
  });
}
export function createPage(body: Record<string, any>): Thunk<any> {
  return callAPI({
    types: Page.CREATE,
    endpoint: `/pages/`,
    method: 'POST',
    body,
    schema: pageSchema,
    meta: {
      errorMessage: 'Creating page failed',
    },
  });
}
