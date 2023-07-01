// is often expanded with additional properties
import type { AnyAction } from '@reduxjs/toolkit';
import type { ID } from 'app/store/models';
import type Entities from 'app/store/models/entities';
import type {
  EntityType,
  NormalizedEntityPayload,
} from 'app/store/models/entities';
import type { AsyncActionType } from 'app/types';

interface BaseMeta {
  queryString: string;
  cursor: string;
  errorMessage: string;
  enableOptimistic: boolean;
  endpoint: string;
  schemaKey: string;
}
export interface FetchMeta extends BaseMeta {
  paginationKey?: string;
  query?: {
    [key: string]: string;
  };
}
export interface DeleteMeta extends BaseMeta {
  id: ID;
}

export interface FetchPayload {
  actionGrant?: string[];
  entities: Partial<Entities>;
  result?: ID[];
  next?: string;
  previous?: string;
}

interface AsyncApiAction<Meta extends BaseMeta = BaseMeta, Payload = null> {
  type: string;
  meta: Meta;
  payload: Payload;
}

export interface AsyncApiActionBegin<Meta extends BaseMeta = BaseMeta>
  extends AsyncApiAction<Meta> {
  type: `${string}.BEGIN`;
}

export interface AsyncApiActionFailure<Meta extends BaseMeta = BaseMeta>
  extends AsyncApiAction<Meta> {
  type: `${string}.FAILURE`;
}

export interface AsyncApiActionSuccess<
  Meta extends BaseMeta = BaseMeta,
  Payload extends FetchPayload | [] | null = FetchPayload | [] | null
> extends AsyncApiAction<Meta, Payload> {
  type: `${string}.SUCCESS`;
}

export interface AsyncApiActionSuccessWithEntityType<T extends EntityType>
  extends AsyncApiActionSuccess<FetchMeta, FetchPayload> {
  payload: AsyncApiActionSuccess['payload'] & NormalizedEntityPayload<T>;
}

const isAsyncApiAction = (action: AnyAction): action is AsyncApiAction =>
  action.meta && action.meta.endpoint;

export const isAsyncApiActionBegin = (
  action: AnyAction
): action is AsyncApiActionBegin =>
  isAsyncApiAction(action) && action.type.endsWith('.BEGIN');
isAsyncApiActionBegin.matching =
  <Meta extends BaseMeta = BaseMeta>(actionTypes: AsyncActionType[]) =>
  (action: AnyAction): action is AsyncApiActionBegin<Meta> =>
    isAsyncApiActionBegin(action) &&
    actionTypes.map((t) => t.BEGIN).includes(action.type);

export const isAsyncApiActionFailure = (
  action: AnyAction
): action is AsyncApiActionFailure =>
  isAsyncApiAction(action) && action.type.endsWith('.FAILURE');
isAsyncApiActionFailure.matching =
  <Meta extends BaseMeta = BaseMeta>(actionTypes: AsyncActionType[]) =>
  (action: AnyAction): action is AsyncApiActionFailure<Meta> =>
    isAsyncApiActionFailure(action) &&
    actionTypes.map((t) => t.FAILURE).includes(action.type);

export const isAsyncApiActionSuccess = (
  action: AnyAction
): action is AsyncApiActionSuccess =>
  isAsyncApiAction(action) && action.type.endsWith('.SUCCESS');
isAsyncApiActionSuccess.matching =
  <Meta extends BaseMeta = BaseMeta>(actionTypes: AsyncActionType[]) =>
  (action: AnyAction): action is AsyncApiActionSuccess<Meta> =>
    isAsyncApiActionSuccess(action) &&
    actionTypes.map((t) => t.SUCCESS).includes(action.type);
isAsyncApiActionSuccess.containingEntity =
  <T extends EntityType>(entityType: T) =>
  (action: AnyAction): action is AsyncApiActionSuccessWithEntityType<T> =>
    isAsyncApiActionSuccess(action) &&
    !!action.payload &&
    'entities' in action.payload &&
    entityType in action.payload.entities;
