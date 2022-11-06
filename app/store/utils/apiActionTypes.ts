import type { Action } from '@reduxjs/toolkit';

interface ApiActionMeta {
  queryString: string;
  query?: Record<string, string>;
  paginationKey: string;
  cursor: string;
  errorMessage: string;
  enableOptimistic: boolean;
  endpoint: string;
  success: string;
  schemaKey: string;
}

export interface ApiActionPayload<
  ID extends string | number = string | number
> {
  entities: Record<string, Record<ID, any>>;
  result: ID | ID[];
  actionGrant: string[];
  next: string | null;
  previous: string | null;
}

export interface ApiBeginAction extends Action<`${string}.BEGIN`> {
  payload: null;
  meta: ApiActionMeta;
}

export interface ApiSuccessAction extends Action<`${string}.SUCCESS`> {
  payload: ApiActionPayload;
  success: true;
  meta: ApiActionMeta;
}

export interface ApiFailureAction extends Action<`${string}.FAILURE`> {
  payload: Record<string, never>;
  error: true;
  meta: ApiActionMeta;
}

export type ApiAction = ApiBeginAction | ApiFailureAction | ApiSuccessAction;

export const isApiPendingAction = (
  action: Action
): action is ApiBeginAction => {
  return action.type.endsWith('.BEGIN');
};

export const isApiSuccessAction = (
  action: Action
): action is ApiSuccessAction => {
  return action.type.endsWith('.SUCCESS');
};

export const isApiFailureAction = (
  action: Action
): action is ApiFailureAction => {
  return action.type.endsWith('.FAILURE');
};

export const isApiAction = (action: Action): action is ApiAction => {
  return (
    isApiPendingAction(action) ||
    isApiSuccessAction(action) ||
    isApiFailureAction(action)
  );
};
