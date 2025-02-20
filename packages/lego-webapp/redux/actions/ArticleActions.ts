import { omit } from 'lodash';
import { Article } from '~/redux/actionTypes';
import callAPI from '~/redux/actions/callAPI';
import { articleSchema } from '~/redux/schemas';
import type { EntityId } from '@reduxjs/toolkit';
import type { DetailedArticle } from '~/redux/models/Article';

export function fetchArticle(articleId: EntityId) {
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

export function createArticle(data) {
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

export function deleteArticle(id: EntityId) {
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

export function editArticle({ id, ...data }) {
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
      errorMessage: 'Henting av artikler feilet totalt',
    },
    propagateError: true,
  });
}
