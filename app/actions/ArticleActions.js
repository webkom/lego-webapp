// @flow

import { Article } from './ActionTypes';
import { articleSchema } from 'app/reducers';
import callAPI from 'app/actions/callAPI';
import type { EntityID, ArticleEntity, Thunk } from 'app/types';
import { push } from 'react-router-redux';

export function fetchArticle(articleId: EntityID) {
  return callAPI({
    types: Article.FETCH,
    endpoint: `/articles/${articleId}/`,
    schema: articleSchema,
    meta: {
      errorMessage: 'Henting av artikkel feilet'
    },
    propagateError: true
  });
}

export function createArticle({
  description,
  author,
  title,
  content,
  tags,
  cover,
  pinned
}: ArticleEntity): Thunk<*> {
  return dispatch =>
    dispatch(
      callAPI({
        types: Article.CREATE,
        endpoint: '/articles/',
        method: 'POST',
        schema: articleSchema,
        body: {
          title,
          content,
          tags,
          cover,
          author,
          description,
          pinned
        },
        meta: {
          errorMessage: 'Opprettelse av artikkel feilet'
        }
      })
    ).then(res => dispatch(push(`/articles/${(res: any).payload.result}/`)));
}

export function editArticle({
  id,
  title,
  content,
  author,
  description,
  tags,
  cover,
  pinned
}: ArticleEntity): Thunk<*> {
  return dispatch =>
    dispatch(
      callAPI({
        types: Article.EDIT,
        endpoint: `/articles/${id}/`,
        method: 'PUT',
        schema: articleSchema,
        body: {
          title,
          cover,
          tags,
          content,
          author,
          description,
          pinned
        },
        meta: {
          errorMessage: 'Endring av artikkel feilet'
        }
      })
    ).then(res => dispatch(push(`/articles/${id}/`)));
}

export function fetchAll({
  year,
  month,
  next = false
}: { year: string, month: string, next: boolean } = {}): Thunk<*> {
  return (dispatch, getState) => {
    const cursor = next ? getState().articles.pagination.next : {};
    return dispatch(
      callAPI({
        types: Article.FETCH,
        endpoint: '/articles/',
        schema: [articleSchema],
        query: {
          ...cursor,
          month,
          year
        },
        meta: {
          errorMessage: 'Henting av artikler feilet'
        },
        propagateError: true
      })
    );
  };
}
