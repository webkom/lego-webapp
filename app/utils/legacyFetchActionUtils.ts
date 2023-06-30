import type { ID } from 'app/store/models';
import type { EntityType } from 'app/store/models/entities';
import type Entities from 'app/store/models/entities';
import type { AnyAction } from '@reduxjs/toolkit';

interface LegacyAsyncActionSuccess {
  type: string;
  meta: unknown; // TODO
  success: true;
  payload: {
    actionGrant?: string[];
    entities: Partial<Entities>;
    result?: ID[];
    next: unknown;
    previous: unknown;
  };
}

export const isLegacyAsyncActionSuccess = (
  action: AnyAction
): action is LegacyAsyncActionSuccess =>
  action.type.endsWith('.SUCCESS') &&
  action.success &&
  'entities' in action.payload;

interface LegacyAsyncActionSuccessWithEntityType<T extends EntityType>
  extends LegacyAsyncActionSuccess {
  payload: LegacyAsyncActionSuccess['payload'] & {
    entities: Pick<Entities, T>;
  };
}
export const isLegacyAsyncActionSuccessWithEntityType =
  <T extends EntityType>(entityType: T) =>
  (action: AnyAction): action is LegacyAsyncActionSuccessWithEntityType<T> =>
    isLegacyAsyncActionSuccess(action) && entityType in action.payload.entities;
