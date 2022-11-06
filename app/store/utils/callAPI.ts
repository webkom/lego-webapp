import type { Schema } from 'normalizr';
import { normalize } from 'normalizr';
import type {
  HttpRequestOptions,
  HttpMethod,
  HttpResponse,
} from 'app/utils/fetchJSON';
import fetchJSON from 'app/utils/fetchJSON';
import { configWithSSR } from 'app/config';
import { isArray } from 'lodash';
import createQueryString from 'app/utils/createQueryString';
import { logout } from 'app/actions/UserActions';
import getCachedRequest from 'app/utils/getCachedRequest';
import { setStatusCode } from 'app/store/slices/routerSlice';
import type { Thunk } from 'app/types';
import { selectIsLoggedIn } from 'app/store/slices/authSlice';
import { selectPaginationNext } from 'app/store/slices/selectorsSlice';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch, AsyncThunkConfig } from 'app/store/store';

function urlFor(resource: string) {
  if (resource.match(/^\/\//)) {
    return configWithSSR.baseUrl + resource.replace(/^\//, '');
  } else if (resource.match(/^http?:/) || resource.match(/^https:/)) {
    return resource;
  }

  return configWithSSR.serverUrl + resource;
}

function handleError(
  error: any,
  dispatch: AppDispatch,
  propagateError: boolean,
  endpoint: string,
  loggedIn: boolean
) {
  const statusCode = error.response && error.response.status;

  if (statusCode) {
    if (statusCode === 401 && loggedIn) {
      dispatch(logout());
    }

    if (propagateError) {
      const serverRenderer = !__CLIENT__;

      if ((serverRenderer && statusCode < 500) || !serverRenderer) {
        dispatch(setStatusCode(statusCode));
      }
    }
  }

  throw error;
}

interface MultipleAPIResponse<
  ID extends string | number = string | number,
  Entity = unknown,
  ActionGrant = string
> {
  actionGrant?: ActionGrant[];
  next?: null | string;
  previous?: null | string;
  results: Entity[];
}

type SingleApiResponse<Entity = unknown, ActionGrant = string> = Entity & {
  actionGrant?: ActionGrant[];
  results?: never;
  next?: never;
  previous?: never;
};

type APIResponse<
  ID extends string | number = string | number,
  Entity = unknown,
  ActionGrant = string
> =
  | MultipleAPIResponse<ID, Entity, ActionGrant>
  | SingleApiResponse<Entity, ActionGrant>;

const isMultipleApiResponse = <ID extends string | number, Entity, ActionGrant>(
  apiResponse: APIResponse<ID, Entity, ActionGrant>
): apiResponse is MultipleAPIResponse<ID, Entity, ActionGrant> =>
  isArray(apiResponse.results);

type CreateApiCallThunkOptions = {
  endpoint: string;
  method?: HttpMethod;
  headers?: Record<string, string>;
  schema?: Schema;
  body?: Record<string, any> | string;
  query?: Record<string, any>;
  json?: boolean;
  meta?: Record<string, unknown>;
  files?: Array<any>;
  force?: boolean;
  useCache?: boolean;
  cacheSeconds?: number;
  propagateError?: boolean;
  enableOptimistic?: boolean;
  requiresAuthentication?: boolean;
  timeout?: number;
  pagination?: {
    fetchNext: boolean;
  };
};

function normalizeJsonResponse<T extends APIResponse>(
  response:
    | HttpResponse<T>
    | {
        jsonData: T;
      },
  schema: Schema
) {
  const jsonData = response.jsonData;

  if (!jsonData) {
    return [];
  }

  const { results, actionGrant, next, previous } = jsonData;
  const payload = Array.isArray(results) ? results : jsonData;

  if (schema) {
    return {
      ...normalize(payload, schema),
      actionGrant,
      next,
      previous,
    };
  }

  return payload;
}

interface APICallThunkReturn<T = any> {
  payload: T;
}

const createAPICallThunk = <T, ThunkArg>(
  typePrefix: string,
  optionsCreator: (arg: ThunkArg) => CreateApiCallThunkOptions
) =>
  createAsyncThunk<APICallThunkReturn<T>, ThunkArg, AsyncThunkConfig>(
    typePrefix,
    async (arg: ThunkArg, { getState, dispatch }) => {
      const {
        body,
        files,
        query,
        schema,
        timeout,
        endpoint,
        // useCache,
        pagination,
        json = true,
        headers = {},
        method = 'GET',
        // cacheSeconds = 10,
        propagateError = false,
        requiresAuthentication = true,
      } = optionsCreator(arg);

      // const shouldUseCache = useCache ?? method.toUpperCase() === 'GET';

      const requestOptions: HttpRequestOptions = {
        method,
        body,
        files,
        headers,
        json,
        timeout,
      };

      const state = getState();
      const loggedIn = selectIsLoggedIn(state);
      const jwt = state.auth.token;
      console.log(state.auth.token);

      if (jwt && requiresAuthentication) {
        requestOptions.headers.Authorization = `Bearer ${jwt}`;
      }

      let schemaKey = null;

      if (schema) {
        if (isArray(schema)) {
          schemaKey = schema[0].key;
        } else {
          schemaKey = schema.key;
        }
      }

      const paginationForRequest =
        pagination &&
        schemaKey &&
        selectPaginationNext({
          endpoint,
          query: query || {},
          schema,
        })(state);
      const cursor =
        pagination &&
        pagination.fetchNext &&
        paginationForRequest &&
        paginationForRequest.pagination &&
        paginationForRequest.pagination.next
          ? paginationForRequest.pagination.next.cursor
          : '';

      // TODO: Fix cache
      // if (shouldUseCache) {
      //   const cachedRequest = getCachedRequest(
      //     state,
      //     endpoint,
      //     paginationForRequest ? paginationForRequest.paginationKey : '',
      //     cursor,
      //     cacheSeconds
      //   );
      //
      //   if (cachedRequest) {
      //     return Promise.resolve(dispatch(cachedRequest));
      //   }
      // }

      const qs =
        query || cursor
          ? createQueryString({
              cursor,
              ...query,
            })
          : '';

      try {
        const response: HttpResponse<any> = await fetchJSON(
          urlFor(`${endpoint}${qs}`),
          requestOptions
        );
        const normalized = normalizeJsonResponse(response, schema);

        return {
          payload: normalized,
          meta: {},
        };
      } catch (error) {
        throw handleError(error, dispatch, propagateError, endpoint, loggedIn);
      }

      // return dispatch({
      //   types,
      //   payload: optimisticPayload,
      //   meta: {
      //     queryString: qsWithoutPagination,
      //     query,
      //     paginationKey:
      //       paginationForRequest && paginationForRequest.paginationKey,
      //     cursor,
      //     ...(meta as Record<string, any>),
      //     optimisticId: optimisticPayload
      //       ? optimisticPayload.result
      //       : undefined,
      //     enableOptimistic,
      //     endpoint,
      //     success: shouldUseCache && types.SUCCESS,
      //     body,
      //     schemaKey,
      //   },
      //   promise: promise
      //     .then((response) => normalizeJsonResponse(response))
      //     .catch((error) =>
      //       dispatch(handleError(error, propagateError, endpoint, loggedIn))
      //     ),
      // });
    },
    {
      getPendingMeta: ({ arg }, { getState }) => {
        const {
          body,
          files,
          schema,
          timeout,
          json = true,
          headers = {},
          method = 'GET',
          enableOptimistic = false,
          requiresAuthentication = true,
        } = optionsCreator(arg);

        const requestOptions: HttpRequestOptions = {
          method,
          body,
          files,
          headers,
          json,
          timeout,
        };

        const state = getState();
        const jwt = state.auth.token;

        if (jwt && requiresAuthentication) {
          requestOptions.headers.Authorization = `Bearer ${jwt}`;
        }

        // @todo: better id gen (cuid or something)
        const optimisticId = Math.floor(Date.now() * Math.random() * 1000);
        const optimisticPayload =
          enableOptimistic && body && typeof body === 'object'
            ? normalizeJsonResponse<
                SingleApiResponse<{ id: number; __persisted: boolean }>
              >(
                {
                  jsonData: {
                    id: optimisticId,
                    __persisted: false,
                    ...body,
                  },
                },
                schema
              )
            : null;

        return { optimisticPayload, optimisticId };
      },
    }
  );

export default createAPICallThunk;
