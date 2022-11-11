import type { EmailListEntity } from 'app/reducers/emailLists';
import type { ID } from 'app/store/models';
import { emailListSchema } from 'app/store/schemas';
import createLegoApiAction from 'app/store/utils/createLegoApiAction';

export const fetchEmailList = createLegoApiAction()(
  'EmailList.FETCH',
  (_, emailListId: ID) => ({
    endpoint: `/email-lists/${emailListId}/`,
    schema: emailListSchema,
    meta: {
      errorMessage: 'Henting av epostliste feilet',
    },
    propagateError: true,
  })
);

export const createEmailList = createLegoApiAction()(
  'EmailList.CREATE',
  (_, emailList: EmailListEntity) => ({
    endpoint: '/email-lists/',
    method: 'POST',
    schema: emailListSchema,
    body: emailList,
    meta: {
      errorMessage: 'Opprettelse av epostlisten feilet',
    },
  })
);

export const editEmailList = createLegoApiAction()(
  'EmailList.EDIT',
  (_, emailList: EmailListEntity) => ({
    endpoint: `/email-lists/${emailList.id}/`,
    method: 'PUT',
    schema: emailListSchema,
    body: emailList,
    meta: {
      errorMessage: 'Endring av epostliste feilet',
    },
  })
);

interface FetchEmailListArgs {
  next?: boolean;
  query?: Record<string, string>;
}

export const fetch = createLegoApiAction()(
  'EmailList.FETCH_ALL',
  (_, { next, query }: FetchEmailListArgs = {}) => ({
    endpoint: '/email-lists/',
    useCache: false,
    pagination: {
      fetchNext: !!next,
    },
    query,
    schema: [emailListSchema],
    meta: {
      errorMessage: 'Henting av epostlister feilet',
    },
    propagateError: true,
  })
);
