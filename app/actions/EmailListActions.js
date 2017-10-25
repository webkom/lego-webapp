// @flow

import { EmailList } from './ActionTypes';
import { emailListSchema } from 'app/reducers';
import callAPI from 'app/actions/callAPI';
import { type EmailListEntity } from 'app/reducers/emailLists';
import type { EntityID, Thunk } from 'app/types';

export function fetchEmailList(emailListId: EntityID) {
  return callAPI({
    types: EmailList.FETCH,
    endpoint: `/email-lists/${emailListId}/`,
    schema: emailListSchema,
    meta: {
      errorMessage: 'Henting av epostliste feilet'
    },
    propagateError: true
  });
}

export function createEmailList(emailList: EmailListEntity) {
  return callAPI({
    types: EmailList.CREATE,
    endpoint: '/email-lists/',
    method: 'POST',
    schema: emailListSchema,
    body: emailList,
    meta: {
      errorMessage: 'Opprettelse av epostlisten feilet'
    }
  });
}

export function editEmailList(emailList: EmailListEntity) {
  return callAPI({
    types: EmailList.EDIT,
    endpoint: `/email-lists/${emailList.id}/`,
    method: 'PUT',
    schema: emailListSchema,
    body: emailList,
    meta: {
      errorMessage: 'Endring av artikkel feilet'
    }
  });
}

export function fetch(
  { next, filters }: { next: boolean, filters: Object } = {}
): Thunk<*> {
  return (dispatch, getState) => {
    const cursor = next ? getState().emailLists.pagination.next : {};

    return dispatch(
      callAPI({
        types: EmailList.FETCH,
        endpoint: '/email-lists/',
        useCache: false,
        query: {
          ...cursor,
          ...filters
        },
        schema: [emailListSchema],
        meta: {
          errorMessage: 'Henting av epostlister feilet'
        },
        propagateError: true
      })
    );
  };
}
