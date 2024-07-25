import { useAppSelector } from 'app/store/hooks';
import type { EntityId } from '@reduxjs/toolkit';
import type createApiThunk from 'app/actions/createApiThunk/index';
import type { NormalizedApiPayload } from 'app/actions/createApiThunk/normalizePayload';
import type { EntityType, EntityTypeMap } from 'app/store/models/entities';
import type { Primitive } from 'utility-types';

type Callable<T> = T extends (...args: unknown[]) => unknown
  ? (...args: Parameters<T>) => ReturnType<T>
  : never;

export const useApiThunk = <
  Arg,
  Entity extends EntityType,
  Ids extends EntityId | EntityId[],
  Payload extends NormalizedApiPayload<EntityTypeMap, Ids>,
>(
  apiThunk: ReturnType<
    typeof createApiThunk<Arg, Entity, object | Primitive, Payload>
  >,
  arg: Arg,
) => {
  const { pagination } = useAppSelector(apiThunk.selectPagination(arg));
  const ids = pagination.ids;
  const entityType = apiThunk.entityType;
  if (!entityType) {
    throw new Error('api thunk must have valid entityType');
  }
  const entities = useAppSelector(
    (state) =>
      ids.map(
        (id) => state[entityType as EntityType].entities[id],
      ) as unknown as Ids[],
  );

  return {
    fetch: apiThunk(arg),
    entities,
    ...pagination,
  };
};
