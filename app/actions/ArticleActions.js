import { arrayOf } from 'normalizr';
import { Article } from './ActionTypes';
import { articleSchema } from 'app/reducers';
import callAPI from 'app/actions/callAPI';
import createQueryString from 'app/utils/createQueryString';

export function fetchArticle(articleId) {
  return callAPI({
    types: Article.FETCH,
    endpoint: `/articles/${articleId}/`,
    schema: articleSchema,
    meta: {
      errorMessage: 'Fetching article failed'
    }
  });
}

export function createArticle({ title, content, tags }) {
  return callAPI({
    types: Article.CREATE,
    endpoint: '/articles/',
    method: 'POST',
    schema: articleSchema,
    body: {
      title,
      content,
      tags,
      author: 1,
      description: 'nice article'
    },
    meta: {
      errorMessage: 'Creating article failed'
    }
  });
}

export function editArticle({ id, title, content }) {
  return callAPI({
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
  });
}

export function fetchAll({ year, month } = {}) {
  return callAPI({
    types: Article.FETCH,
    endpoint: `/articles/${createQueryString({ year, month })}`,
    schema: arrayOf(articleSchema),
    meta: {
      errorMessage: 'Fetching articles failed'
    }
  });
}
