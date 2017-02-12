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

export function createArticle({ content }) {
  return callAPI({
    types: Article.CREATE,
    endpoint: '/articles/',
    method: 'POST',
    schema: articleSchema,
    body: {
      content,
      author: 1,
      description: 'nice article',
      title: 'Test'
    },
    meta: {
      errorMessage: 'Fetching article failed'
    }
  })
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
