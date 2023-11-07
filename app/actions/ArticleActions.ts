import { push } from 'connected-react-router';
import callAPI from 'app/actions/callAPI';
import { articleSchema } from 'app/reducers';
import { Article } from './ActionTypes';
import type { ID } from 'app/store/models';
import type { ArticleEntity, Thunk } from 'app/types';

export function fetchArticle(articleId: ID): Thunk<Promise<void>> {
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
export function createArticle({ ...data }: ArticleEntity): Thunk<any> {
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
    ).then((res) =>
      dispatch(push(`/articles/${(res as any).payload.result}/`))
    );
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
export function editArticle({ id, ...data }: ArticleEntity): Thunk<any> {
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
    ).then(() => dispatch(push(`/articles/${id}/`)));
}
export function fetchAll({
  query,
  next = false,
}: {
  query?: Record<string, any>;
  next?: boolean;
} = {}): Thunk<any> {
  return callAPI({
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
