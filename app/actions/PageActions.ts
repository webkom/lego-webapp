import callAPI from 'app/actions/callAPI';
import { pageSchema } from 'app/reducers';
import { Page } from './ActionTypes';
import type { ApiRequestBody } from 'app/routes/pages/components/PageEditor';
import type { AuthDetailedPage } from 'app/store/models/Page';

export function fetchPage(pageSlug: string) {
  return callAPI<AuthDetailedPage>({
    types: Page.FETCH,
    endpoint: `/pages/${pageSlug}/`,
    schema: pageSchema,
    meta: {
      errorMessage: 'Henting av side feilet',
    },
    propagateError: true,
  });
}

export function deletePage(pageSlug: string) {
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

export function fetchAll() {
  return callAPI<AuthDetailedPage>({
    types: Page.FETCH,
    endpoint: '/pages/',
    schema: [pageSchema],
    meta: {
      errorMessage: 'Henting av sider feilet',
    },
    propagateError: true,
  });
}

export function updatePage(slug: string, body: ApiRequestBody) {
  return callAPI<AuthDetailedPage>({
    types: Page.UPDATE,
    endpoint: `/pages/${slug}/`,
    method: 'PATCH',
    body,
    schema: pageSchema,
    meta: {
      errorMessage: 'Oppdatering av side feilet',
    },
  });
}

export function createPage(body: ApiRequestBody) {
  return callAPI<AuthDetailedPage>({
    types: Page.CREATE,
    endpoint: `/pages/`,
    method: 'POST',
    body,
    schema: pageSchema,
    meta: {
      errorMessage: 'Opprettelse av side feilet',
    },
  });
}
