import { push } from 'connected-react-router';
import type { ID } from 'app/store/models';
import type {
  NormalizedEntityPayload,
  EntityType,
} from 'app/store/models/Entities';
import { articleSchema } from 'app/store/schemas';
import createLegoApiAction from 'app/store/utils/createLegoApiAction';
import type { ArticleEntity } from 'app/types';

export const fetchArticle = createLegoApiAction()(
  'Article.FETCH',
  (_, id: ID) => ({
    endpoint: `/articles/${id}/`,
    schema: articleSchema,
    meta: {
      errorMessage: 'Henting av artikkel feilet',
    },
    propagateError: true,
  })
);

interface CreateArticleSuccessPayload
  extends NormalizedEntityPayload<EntityType.Articles> {
  result: ID;
}

export const createArticle = createLegoApiAction<
  CreateArticleSuccessPayload,
  unknown
>()(
  'Article.CREATE',
  (_, data: ArticleEntity) => ({
    endpoint: '/articles/',
    method: 'POST',
    schema: articleSchema,
    body: data,
    meta: {
      errorMessage: 'Opprettelse av artikkel feilet',
    },
  }),
  {
    onSuccess: (action, dispatch) => {
      dispatch(push(`/articles/${action.payload.result}/`));
    },
  }
);

export const deleteArticle = createLegoApiAction()(
  'Article.DELETE',
  (_, id: ID) => ({
    endpoint: `/articles/${id}/`,
    method: 'DELETE',
    meta: {
      id,
      errorMessage: 'Sletting av artikkel feilet',
    },
  })
);

export const editArticle = createLegoApiAction()(
  'Article.EDIT',
  (_, id: ID, data: ArticleEntity) => ({
    endpoint: `/articles/${id}/`,
    method: 'PUT',
    schema: articleSchema,
    body: data,
    meta: {
      id,
      errorMessage: 'Endring av artikkel feilet',
    },
  }),
  {
    onSuccess: (action, dispatch) => {
      dispatch(push(`/articles/${action.meta.id}/`));
    },
  }
);

interface FetchAllArticlesOptions {
  query?: {
    tag?: string;
  };
  next?: boolean;
}

export const fetchAll = createLegoApiAction()(
  'Article.FETCH_ALL',
  (_, { query, next = false }: FetchAllArticlesOptions = {}) => ({
    endpoint: '/articles/',
    schema: [articleSchema],
    query,
    pagination: {
      fetchNext: next,
    },
    meta: {
      errorMessage: 'Henting av artikler feilet',
    },
    propagateError: true,
  })
);
