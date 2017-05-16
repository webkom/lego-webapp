// @flow

import { Article } from './ActionTypes';
import { articleSchema } from 'app/reducers';
import callAPI from 'app/actions/callAPI';
import createQueryString from 'app/utils/createQueryString';
import type { EntityID, ArticleEntity } from 'app/types';
import { push } from 'react-router-redux';

export function fetchArticle(articleId: EntityID) {
  return callAPI({
    types: Article.FETCH,
    endpoint: `/articles/${articleId}/`,
    schema: articleSchema,
    meta: {
      errorMessage: 'Fetching article failed'
    },
    propagateError: true
  });
}

export function createArticle({ title, content, tags, cover }: ArticleEntity) {
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
          author: 1,
          description: 'nice article'
        },
        meta: {
          errorMessage: 'Creating article failed'
        }
      })
    ).then(res => dispatch(push(`/articles/${res.payload.result}/`)));
}

export function editArticle({ id, title, content }: ArticleEntity) {
  return dispatch =>
    dispatch(
      callAPI({
        types: Article.EDIT,
        endpoint: `/articles/${id}/`,
        method: 'PUT',
        schema: articleSchema,
        body: {
          title,
          content,
          author: 1,
          description: 'nice article'
        },
        meta: {
          errorMessage: 'Editing article failed'
        }
      })
    ).then(res => dispatch(push(`/articles/${id}/`)));
}

export function fetchAll(
  { year, month }: { year: string, month: string } = {}
) {
  return callAPI({
    types: Article.FETCH,
    endpoint: `/articles/${createQueryString({ year, month })}`,
    schema: [articleSchema],
    meta: {
      errorMessage: 'Fetching articles failed'
    },
    propagateError: true
  });
}
