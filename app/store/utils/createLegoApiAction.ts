import type { CallAPIOptions } from 'app/actions/callAPI';
import type { ID } from 'app/store/models';
import type Entities from 'app/store/models/Entities';
import type { EntityType } from 'app/store/models/Entities';
import type { RootState } from 'app/store/rootReducer';
import type { AppDispatch, AppThunk } from 'app/store/store';
import type { Action } from '@reduxjs/toolkit';
// callAPI needs ot be imported async to avoid circular dependencies (callAPI -> UserActions -> MetaActions -> createLegoApiAction -> callAPI)
const callApiPromise = import('app/actions/callAPI').then(
  (module) => module.default
);

interface ApiActionMeta {
  queryString?: string;
  cursor?: string;
  endpoint?: string;
  enableOptimistic?: boolean;
  success?: boolean;
  schemaKey?: string | null;
}

export interface DefaultExtraMeta extends Record<string, unknown> {
  errorMessage?: string;
  successMessage?: string;
  paginationKey?: string;
  query?: string | Record<string, string | boolean>;
  id?: ID;
  optimisticId?: ID;
}

export interface LegoApiBeginAction<
  T extends `${string}.BEGIN` = `${string}.BEGIN`,
  ExtraMeta extends DefaultExtraMeta = DefaultExtraMeta
> extends Action<T> {
  payload: null;
  success?: undefined;
  error?: undefined;
  meta: ApiActionMeta & ExtraMeta;
}

export interface LegoApiSuccessAction<
  T extends `${string}.SUCCESS` = `${string}.SUCCESS`,
  Payload = Record<string, unknown>,
  ExtraMeta extends DefaultExtraMeta = DefaultExtraMeta
> extends Action<T> {
  payload: Payload;
  success: true;
  error?: false;
  meta: ApiActionMeta & ExtraMeta;
}

export interface LegoApiFailureAction<
  T extends `${string}.FAILURE` = `${string}.FAILURE`,
  Payload = Record<string, unknown>,
  ExtraMeta extends DefaultExtraMeta = DefaultExtraMeta
> extends Action<T> {
  payload: Payload;
  success?: false;
  error: true;
  meta: ApiActionMeta & ExtraMeta;
}

export type LegoApiAction =
  | LegoApiBeginAction
  | LegoApiSuccessAction
  | LegoApiFailureAction;

export const isLegoApiBeginAction = (
  action: Action<string>
): action is LegoApiBeginAction => action.type.endsWith('.BEGIN');

export const isLegoApiSuccessAction = (
  action: Action<string>
): action is LegoApiSuccessAction =>
  action.type.endsWith('.SUCCESS') && action['success'];

export const isLegoApiFailureAction = (
  action: Action<string>
): action is LegoApiFailureAction =>
  action.type.endsWith('.ERROR') && action['error'];

export const isLegoApiAction = (
  action: Action<string>
): action is LegoApiBeginAction | LegoApiSuccessAction | LegoApiFailureAction =>
  isLegoApiBeginAction(action) ||
  isLegoApiSuccessAction(action) ||
  isLegoApiFailureAction(action);

interface BaseLegoApiActionCreator<
  T extends string,
  ActionType extends Action<T>
> {
  type: T;
  match: (action: Action<unknown>) => action is ActionType;
}

export interface LegoApiBeginActionCreator<
  T extends `${string}.BEGIN`,
  ExtraMeta extends DefaultExtraMeta = DefaultExtraMeta,
  ActionType extends LegoApiBeginAction<T, ExtraMeta> = LegoApiBeginAction<
    T,
    ExtraMeta
  >
> extends BaseLegoApiActionCreator<T, ActionType> {
  ({ meta }: { meta: ActionType['meta'] }): ActionType;
}

export interface LegoApiSuccessActionCreator<
  T extends `${string}.SUCCESS`,
  Payload = unknown,
  ExtraMeta extends DefaultExtraMeta = DefaultExtraMeta,
  ActionType extends LegoApiSuccessAction<
    T,
    Payload,
    ExtraMeta
  > = LegoApiSuccessAction<T, Payload, ExtraMeta>
> extends BaseLegoApiActionCreator<T, ActionType> {
  ({
    payload,
    meta,
  }: {
    payload: ActionType['payload'];
    meta: ActionType['meta'];
  }): ActionType;
}

export interface LegoApiFailureActionCreator<
  T extends `${string}.FAILURE`,
  Payload = unknown,
  ExtraMeta extends DefaultExtraMeta = DefaultExtraMeta,
  ActionType extends LegoApiFailureAction<
    T,
    Payload,
    ExtraMeta
  > = LegoApiFailureAction<T, Payload, ExtraMeta>
> extends BaseLegoApiActionCreator<T, ActionType> {
  ({
    payload,
    meta,
  }: {
    payload: ActionType['payload'];
    meta: ActionType['meta'];
  }): ActionType;
}

export interface LegoApiThunkAction<
  PrefixType extends string = string,
  SuccessPayload = unknown,
  FailurePayload = unknown,
  ExtraMeta extends DefaultExtraMeta = DefaultExtraMeta,
  Args extends unknown[] = unknown[]
> {
  (...args: Args): AppThunk<
    Promise<
      LegoApiSuccessAction<`${PrefixType}.SUCCESS`, SuccessPayload, ExtraMeta>
    >
  >;
  begin: LegoApiBeginActionCreator<`${PrefixType}.BEGIN`, ExtraMeta>;
  success: LegoApiSuccessActionCreator<
    `${PrefixType}.SUCCESS`,
    SuccessPayload,
    ExtraMeta
  >;
  failure: LegoApiFailureActionCreator<
    `${PrefixType}.FAILURE`,
    FailurePayload,
    ExtraMeta
  >;
}

// helper for creating a function with certain object-properties with correct typescript types
const createFunctionObject = <Args extends unknown[], Return, T>(
  func: (...args: Args) => Return,
  object: T
): {
  (...args: Args): Return;
} & T => {
  return Object.assign(func, object);
};

export interface LegoApiSuccessPayload<T extends EntityType> {
  result: ID | ID[];
  entities: Pick<Entities, T>;
}

interface LegoApiFailurePayload {
  response: {
    jsonData: {
      detail: string;
    };
    textString: string;
  };
}

/*
Helper for creating a lego-api action.
The action will be a thunk that returns a promise that resolves to a "success" or "failure"-action. The thunk will also dispatch a "begin"-action.
All actions will have the same meta, which can be extended by specifying the ExtraMeta generic, in addition to adding it to the "meta" property in the callAPI-options.
 */
const createLegoApiAction =
  <SuccessPayload, FailurePayload = LegoApiFailurePayload>() =>
  <
    ExtraMeta extends DefaultExtraMeta,
    PrefixType extends string,
    Args extends unknown[]
  >(
    prefixType: PrefixType,
    callApiOptionsCreator: (
      thunkAPI: { dispatch: AppDispatch; getState: () => RootState },
      ...args: Args
    ) => Omit<CallAPIOptions<PrefixType, ExtraMeta>, 'types'>,
    {
      onSuccess,
      onFailure,
    }: {
      onSuccess?: (
        response: LegoApiSuccessAction<
          `${PrefixType}.SUCCESS`,
          SuccessPayload,
          ExtraMeta
        >,
        dispatch: AppDispatch
      ) => void;
      onFailure?: (
        response: LegoApiFailureAction<
          `${PrefixType}.FAILURE`,
          FailurePayload,
          ExtraMeta
        >,
        dispatch: AppDispatch
      ) => void;
    } = {}
  ): LegoApiThunkAction<
    PrefixType,
    SuccessPayload,
    FailurePayload,
    ExtraMeta,
    Args
  > =>
    createFunctionObject(
      (...args: Args) =>
        async (dispatch: AppDispatch, getState: () => RootState) => {
          const callAPI = await callApiPromise;

          return dispatch(
            callAPI<PrefixType, SuccessPayload, ExtraMeta>({
              ...callApiOptionsCreator({ dispatch, getState }, ...args),
              types: {
                BEGIN: `${prefixType}.BEGIN`,
                SUCCESS: `${prefixType}.SUCCESS`,
                FAILURE: `${prefixType}.FAILURE`,
              },
            })
          ).then(
            (response) => {
              onSuccess?.(response, dispatch);
              return response;
            },
            (error) => {
              onFailure?.(error, dispatch);
              throw error;
            }
          );
        },
      {
        begin: createFunctionObject(
          ({ meta }) => ({
            type: `${prefixType}.BEGIN`,
            payload: null,
            meta,
          }),
          {
            type: `${prefixType}.BEGIN`,
            match: (
              action: Action<unknown>
            ): action is LegoApiBeginAction<`${PrefixType}.BEGIN`, ExtraMeta> =>
              action.type === `${prefixType}.BEGIN`,
          }
        ),
        success: createFunctionObject(
          ({ meta, payload }) => ({
            type: `${prefixType}.SUCCESS`,
            success: true,
            payload,
            meta,
          }),
          {
            type: `${prefixType}.SUCCESS`,
            match: (
              action: Action<unknown>
            ): action is LegoApiSuccessAction<
              `${PrefixType}.SUCCESS`,
              SuccessPayload,
              ExtraMeta
            > => action.type === `${prefixType}.SUCCESS`,
          }
        ),
        failure: createFunctionObject(
          ({ meta, payload }) => ({
            type: `${prefixType}.FAILURE`,
            error: true,
            payload,
            meta,
          }),
          {
            type: `${prefixType}.FAILURE`,
            match: (
              action: Action<unknown>
            ): action is LegoApiFailureAction<
              `${PrefixType}.FAILURE`,
              FailurePayload,
              ExtraMeta
            > => action.type === `${prefixType}.FAILURE`,
          }
        ),
      }
    );

export default createLegoApiAction;
