import callAPI from 'app/actions/callAPI';
import { emailListSchema } from 'app/reducers';
import type { EmailListEntity } from 'app/reducers/emailLists';
import type { EntityID, Thunk } from 'app/types';
import { EmailList } from './ActionTypes';

export function fetchEmailList(emailListId: EntityID): Thunk<any> {
  return callAPI({
    types: EmailList.FETCH,
    endpoint: `/email-lists/${emailListId}/`,
    schema: emailListSchema,
    meta: {
      errorMessage: 'Henting av epostliste feilet',
    },
    propagateError: true,
  });
}
export function createEmailList(emailList: EmailListEntity): Thunk<any> {
  return callAPI({
    types: EmailList.CREATE,
    endpoint: '/email-lists/',
    method: 'POST',
    schema: emailListSchema,
    body: emailList,
    meta: {
      errorMessage: 'Opprettelse av epostlisten feilet',
    },
  });
}
export function editEmailList(emailList: EmailListEntity): Thunk<any> {
  return callAPI({
    types: EmailList.EDIT,
    endpoint: `/email-lists/${emailList.id}/`,
    method: 'PUT',
    schema: emailListSchema,
    body: emailList,
    meta: {
      errorMessage: 'Endring av epostliste feilet',
    },
  });
}
export function fetch({
  next,
  query,
}: {
  next?: boolean;
  query?: Record<string, string | number>;
} = {}): Thunk<any> {
  return callAPI({
    types: EmailList.FETCH,
    endpoint: '/email-lists/',
    pagination: {
      fetchNext: !!next,
    },
    query,
    schema: [emailListSchema],
    meta: {
      errorMessage: 'Henting av epostlister feilet',
    },
    propagateError: true,
  });
}
