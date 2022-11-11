import type { EmailUserEntity } from 'app/reducers/emailUsers';
import type { ID } from 'app/store/models';
import type { EntityType } from 'app/store/models/Entities';
import { emailUserSchema } from 'app/store/schemas';
import createLegoApiAction, {
  LegoApiSuccessPayload,
} from 'app/store/utils/createLegoApiAction';

export const fetchEmailUser = createLegoApiAction<
  LegoApiSuccessPayload<
    EntityType.EmailUsers | EntityType.Users | EntityType.Groups
  >
>()('EmailUser.FETCH', (_, userId: ID) => ({
  endpoint: `/email-users/${userId}/`,
  schema: emailUserSchema,
  meta: {
    errorMessage: 'Henting av epostliste feilet',
  },
  propagateError: true,
}));

export const createEmailUser = createLegoApiAction()(
  'EmailUser.CREATE',
  (_, emailUser: EmailUserEntity) => ({
    endpoint: '/email-users/',
    method: 'POST',
    schema: emailUserSchema,
    body: emailUser,
    meta: {
      errorMessage: 'Opprettelse av epostliste feilet',
    },
  })
);

export const editEmailUser = createLegoApiAction()(
  'EmailUser.EDIT',
  (_, emailUser: EmailUserEntity) => ({
    endpoint: `/email-users/${emailUser.id}/`,
    method: 'PUT',
    schema: emailUserSchema,
    body: emailUser,
    meta: {
      errorMessage: 'Endring av epostliste feilet',
    },
  })
);

interface FetchEmailUserArgs {
  next?: boolean;
  query?: Record<string, string>;
}

export const fetch = createLegoApiAction<
  LegoApiSuccessPayload<
    EntityType.EmailUsers | EntityType.Users | EntityType.Groups
  >
>()('EmailUser.FETCH', (_, { next, query }: FetchEmailUserArgs = {}) => ({
  endpoint: '/email-users/',
  useCache: false,
  query,
  pagination: {
    fetchNext: !!next,
  },
  schema: [emailUserSchema],
  meta: {
    errorMessage: 'Henting av epostlister feilet',
  },
  propagateError: true,
}));
