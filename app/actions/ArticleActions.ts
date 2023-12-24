import { omit } from 'lodash';
import callAPI from 'app/actions/callAPI';
import { articleSchema } from 'app/reducers';
import { Article } from './ActionTypes';
import type { ID } from 'app/store/models';
import type { DetailedArticle } from 'app/store/models/Article';
import type { ArticleEntity } from 'app/types';

export function fetchArticle(articleId: ID) {
  return callAPI<DetailedArticle>({
    types: Article.FETCH,
    endpoint: `/articles/${articleId}/`,
    schema: articleSchema,
    meta: {
      errorMessage: 'Henting av artikkel feilet',
    },
    propagateError: true,
  });
}

export function createArticle(data: ArticleEntity) {
  return callAPI<DetailedArticle>({
    types: Article.CREATE,
    endpoint: '/articles/',
    method: 'POST',
    schema: articleSchema,
    body: omit(data, ['id']),
    meta: {
      errorMessage: 'Opprettelse av artikkel feilet',
    },
  });
}

export function deleteArticle(id: ID) {
  return callAPI({
    types: Article.DELETE,
    endpoint: `/articles/${id}/`,
    method: 'DELETE',
    meta: {
      id,
      errorMessage: 'Sletting av artikkel feilet',
    },
  });
}

export function editArticle({ id, ...data }: ArticleEntity) {
  return callAPI<DetailedArticle>({
    types: Article.EDIT,
    endpoint: `/articles/${id}/`,
    method: 'PUT',
    schema: articleSchema,
    body: data,
    meta: {
      errorMessage: 'Endring av artikkel feilet',
    },
  });
}

export function fetchAll({
  query,
  next = false,
}: {
  query?: Record<string, string>;
  next?: boolean;
} = {}) {
  return callAPI<DetailedArticle[]>({
    types: Article.FETCH,
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
  });
}
