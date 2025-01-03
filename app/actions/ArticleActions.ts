import { omit } from 'lodash';
import { normalize } from 'normalizr';
import callAPI, { urlFor } from 'app/actions/callAPI';
import { articleSchema } from 'app/reducers';
import { selectArticleByIdOrSlug } from 'app/reducers/articles';
import { createRequestThunk, executeRequest } from 'app/reducers/requests';
import { createFetchHook } from 'app/store/utils/createFetchHook';
import { entitiesReceived } from 'app/utils/legoAdapter/actions';
import { Article } from './ActionTypes';
import type { EntityId } from '@reduxjs/toolkit';
import type { RequestState } from 'app/reducers/requests';
import type { AppDispatch } from 'app/store/createStore';
import type { DetailedArticle } from 'app/store/models/Article';
import type { GetState } from 'app/types';
import type { Schema } from 'normalizr';

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

const apiFetchRequest = async <T = unknown>(
  endpoint: string,
  thunkAPI: { dispatch: AppDispatch; getState: GetState },
  resultTransformer: (result: unknown) => T = (result) => result as T,
): Promise<RequestState<T>> =>
  executeRequest(
    endpoint,
    async () =>
      resultTransformer(
        await fetch(urlFor(endpoint)).then((response) => response.json()),
      ),
    thunkAPI,
  );

const normalizeFetchResult =
  (schema: Schema, thunkAPI: { dispatch: AppDispatch }) =>
  (result: unknown) => {
    const normalized = normalize(result, schema);
    thunkAPI.dispatch(entitiesReceived(normalized.entities));
    return normalized.result;
  };

export const fetchArticleById = createRequestThunk(
  'articles/fetchById',
  (articleId: string) => `/articles/${articleId}/`,
  async (url, _, thunkAPI) =>
    await apiFetchRequest<EntityId>(
      url,
      thunkAPI,
      normalizeFetchResult(articleSchema, thunkAPI),
    ),
);

export const useArticleByIdOrSlug = createFetchHook(
  'articles/fetchById',
  fetchArticleById,
  (state, request, arg) => ({
    ...request,
    data: selectArticleByIdOrSlug(state, arg)!,
  }),
);

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
