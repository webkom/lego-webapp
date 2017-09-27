// @flow

import { Article } from './ActionTypes';
import { articleSchema } from 'app/reducers';
import callAPI from 'app/actions/callAPI';
import createQueryString from 'app/utils/createQueryString';
import type { EntityID, ArticleEntity } from 'app/types';

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

export function createArticle({ title, content, tags, cover }: ArticleEntity) {
  return callAPI({
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
      errorMessage: 'Opprettelse av artikkel feilet'
    }
  });
}

export function editArticle({ id, title, content, tags }: ArticleEntity) {
  return callAPI({
    types: Article.EDIT,
    endpoint: `/articles/${id}/`,
    method: 'PUT',
    schema: articleSchema,
    body: {
      title,
      content,
      tags,
      author: 1,
      description: 'nice article'
    },
    meta: {
      errorMessage: 'Endring av artikkel feilet'
    }
  });
}

export function fetchAll(
  { year, month }: { year: string, month: string } = {}
) {
  return callAPI({
    types: Article.FETCH,
    endpoint: `/articles/${createQueryString({ year, month })}`,
    schema: [articleSchema],
    meta: {
      errorMessage: 'Henting av artikler feilet'
    },
    propagateError: true
  });
}
