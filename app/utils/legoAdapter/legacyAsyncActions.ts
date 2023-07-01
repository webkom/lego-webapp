// is often expanded with additional properties
import type { ID } from 'app/store/models';
import type Entities from 'app/store/models/entities';
import type { EntityType } from 'app/store/models/entities';
import type { AsyncActionType } from 'app/types';
import type { AnyAction } from '@reduxjs/toolkit';

interface BaseMeta {
  queryString: string;
  cursor: string;
  errorMessage: string;
  enableOptimistic: boolean;
  endpoint: string;
  schemaKey: string;
}

interface AsyncAction {
  type: string;
  meta: BaseMeta;
  payload: object | null;
}

interface AsyncActionBegin extends AsyncAction {
  type: `${string}.BEGIN`;
}

interface AsyncActionFailure extends AsyncAction {
  type: `${string}.FAILURE`;
}

interface AsyncActionSuccess extends AsyncAction {
  type: `${string}.SUCCESS`;
  payload: {
    actionGrant?: string[];
    entities: Partial<Entities>;
    result?: ID[];
    next: unknown;
    previous: unknown;
  };
}

interface AsyncActionSuccessWithEntityType<T extends EntityType>
  extends AsyncActionSuccess {
  payload: AsyncActionSuccess['payload'] & {
    entities: Pick<Entities, T>;
  };
}

export const isAsyncActionBegin = (
  action: AnyAction
): action is AsyncActionBegin => action.type.endsWith('.BEGIN');
isAsyncActionBegin.matching =
  (actionTypes: AsyncActionType[]) =>
  (action: AnyAction): action is AsyncActionBegin =>
    actionTypes.map((t) => t.BEGIN).includes(action.type);

export const isAsyncActionFailure = (
  action: AnyAction
): action is AsyncActionFailure => action.type.endsWith('.FAILURE');
isAsyncActionFailure.matching =
  (actionTypes: AsyncActionType[]) =>
  (action: AnyAction): action is AsyncActionFailure =>
    actionTypes.map((t) => t.FAILURE).includes(action.type);

export const isAsyncActionSuccess = (
  action: AnyAction
): action is AsyncActionSuccess => action.type.endsWith('.SUCCESS');
isAsyncActionSuccess.matching =
  (actionTypes: AsyncActionType[]) =>
  (action: AnyAction): action is AsyncActionSuccess =>
    actionTypes.map((t) => t.SUCCESS).includes(action.type);
isAsyncActionSuccess.containingEntity =
  <T extends EntityType>(entityType: T) =>
  (action: AnyAction): action is AsyncActionSuccessWithEntityType<T> =>
    isAsyncActionSuccess(action) && entityType in action.payload.entities;
