// @flow

import { push } from 'connected-react-router';

import callAPI from 'app/actions/callAPI';
import { articleSchema } from 'app/reducers';
import type { ArticleEntity, EntityID, Thunk } from 'app/types';
import { Article } from './ActionTypes';

export function fetchArticle(articleId: EntityID): Thunk<any> {
  return callAPI({
    types: Article.FETCH,
    endpoint: `/articles/${articleId}/`,
    schema: articleSchema,
    meta: {
      errorMessage: 'Henting av artikkel feilet',
    },
    propagateError: true,
  });
}

export function createArticle({ id, ...data }: ArticleEntity): Thunk<*> {
  return (dispatch) =>
    dispatch(
      callAPI({
        types: Article.CREATE,
        endpoint: '/articles/',
        method: 'POST',
        schema: articleSchema,
        body: data,
        meta: {
          errorMessage: 'Opprettelse av artikkel feilet',
        },
      })
    ).then((res) => dispatch(push(`/articles/${(res: any).payload.result}/`)));
}

export function deleteArticle(id: number): Thunk<any> {
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

export function editArticle({ id, ...data }: ArticleEntity): Thunk<*> {
  return (dispatch) =>
    dispatch(
      callAPI({
        types: Article.EDIT,
        endpoint: `/articles/${id}/`,
        method: 'PUT',
        schema: articleSchema,
        body: data,
        meta: {
          errorMessage: 'Endring av artikkel feilet',
        },
      })
    ).then((res) => dispatch(push(`/articles/${id}/`)));
}

export function fetchAll({
  query,
  next = false,
}: { query?: Object, next?: boolean } = {}): Thunk<*> {
  return callAPI({
    types: Article.FETCH,
    endpoint: '/articles/',
    schema: [articleSchema],
    query,
    pagination: { fetchNext: next },
    meta: {
      errorMessage: 'Henting av artikler feilet',
    },
    propagateError: true,
  });
}
