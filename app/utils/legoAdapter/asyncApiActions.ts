// is often expanded with additional properties
import { isNotNullish } from 'app/utils';
import type {
  EntityId,
  AnyAction,
  PayloadAction,
  UnknownAction,
} from '@reduxjs/toolkit';
import type Entities from 'app/store/models/entities';
import type {
  EntityType,
  NormalizedEntityPayload,
} from 'app/store/models/entities';
import type { AsyncActionType } from 'app/types';

// is often expanded with additional properties
interface BaseMeta {
  queryString: string;
  cursor: string;
  errorMessage: string;
  enableOptimistic: boolean;
  endpoint: string;
  schemaKey: string;
  entityType?: string;
}
export interface FetchMeta extends BaseMeta {
  paginationKey?: string;
  query?: {
    [key: string]: string;
  };
}
export interface DeleteMeta extends BaseMeta {
  id: EntityId;
}

type AnyPayload = FetchPayload | [] | null;
export interface FetchPayload {
  actionGrant?: string[];
  entities: Partial<Entities>;
  result?: EntityId[];
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
  Payload extends AnyPayload = AnyPayload,
> extends AsyncApiAction<Meta, Payload> {
  type: `${string}.SUCCESS`;
}

const isAsyncApiAction = (action: AnyAction): action is AsyncApiAction =>
  action.meta && (action.meta.endpoint || action.meta.entityType);

export const isAsyncApiActionBegin = (
  action: AnyAction,
): action is AsyncApiActionBegin =>
  isAsyncApiAction(action) && action.type.endsWith('.BEGIN');
isAsyncApiActionBegin.matching =
  <Meta extends BaseMeta = BaseMeta>(actionTypes: AsyncActionType[]) =>
  (action: AnyAction): action is AsyncApiActionBegin<Meta> =>
    isAsyncApiActionBegin(action) &&
    actionTypes.map((t) => t.BEGIN).includes(action.type);

export const isAsyncApiActionFailure = (
  action: AnyAction,
): action is AsyncApiActionFailure =>
  isAsyncApiAction(action) && action.type.endsWith('.FAILURE');
isAsyncApiActionFailure.matching =
  <Meta extends BaseMeta = BaseMeta>(actionTypes: AsyncActionType[]) =>
  (action: AnyAction): action is AsyncApiActionFailure<Meta> =>
    isAsyncApiActionFailure(action) &&
    actionTypes.map((t) => t.FAILURE).includes(action.type);

export const isAsyncApiActionSuccess = (
  action: AnyAction,
): action is AsyncApiActionSuccess =>
  isAsyncApiAction(action) &&
  (action.type.endsWith('.SUCCESS') ||
    ('requestStatus' in action.meta &&
      action.meta.requestStatus === 'fulfilled'));
isAsyncApiActionSuccess.matching =
  <Meta extends BaseMeta = BaseMeta, Payload extends AnyPayload = null>(
    actionTypes: AsyncActionType[],
  ) =>
  (action: AnyAction): action is AsyncApiActionSuccess<Meta, Payload> =>
    isAsyncApiActionSuccess(action) &&
    actionTypes.map((t) => t.SUCCESS).includes(action.type);
isAsyncApiActionSuccess.withSchemaKey =
  <Meta extends BaseMeta = BaseMeta>(entityType: EntityType) =>
  (action: AnyAction): action is AsyncApiActionSuccess<Meta> =>
    isAsyncApiActionSuccess(action) &&
    (action.meta.schemaKey === entityType ||
      action.meta.entityType === entityType);

export const isPayloadAction = (
  action: UnknownAction,
): action is PayloadAction => action.payload !== undefined;

export const isNormalizedEntitiesContainingType = <T extends EntityType>(
  payload: unknown,
  entityType: T,
): payload is NormalizedEntityPayload<T> =>
  !!payload &&
  typeof payload === 'object' &&
  'entities' in payload &&
  !!payload.entities &&
  typeof payload.entities === 'object' &&
  'result' in payload &&
  isNotNullish(payload.result) &&
  entityType in payload.entities;

export const isNormalizedEntitiesActionContainingType =
  <T extends EntityType>(entityType: T) =>
  (
    action: UnknownAction,
  ): action is PayloadAction<NormalizedEntityPayload<T>> =>
    isPayloadAction(action) &&
    isNormalizedEntitiesContainingType<T>(action.payload, entityType);
