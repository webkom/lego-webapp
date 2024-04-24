import { useAppSelector } from 'app/store/hooks';
import type { EntityId } from '@reduxjs/toolkit';
import type { EntityState } from '@reduxjs/toolkit/src/entities/models';
import type { NoInfer } from '@reduxjs/toolkit/src/tsHelpers';
import type createApiThunk from 'app/actions/createApiThunk/index';
import type { NormalizedApiPayload } from 'app/actions/createApiThunk/normalizePayload';
import type { EntityType } from 'app/store/models/entities';
import type { Primitive } from 'utility-types';

type Callable<T> = T extends (...args: any[]) => any
  ? (...args: Parameters<T>) => ReturnType<T>
  : never;

export const useApiThunk = <
  Arg,
  Entity extends EntityType,
  Type,
  Payload extends NormalizedApiPayload<unknown, Type>,
>(
  apiThunk: Callable<
    ReturnType<typeof createApiThunk<Arg, Entity, object | Primitive, Payload>>
  > &
    Omit<
      ReturnType<
        typeof createApiThunk<Arg, Entity, object | Primitive, Payload>
      >,
      ''
    >,
  arg: Arg,
) => {
  const { pagination } = useAppSelector(apiThunk.selectPagination(arg));
  const ids = pagination.ids;
  const entityType = apiThunk.entityType;
  const entities: Type[] = useAppSelector((state) =>
    ids.map(
      (id) =>
        (
          state[entityType!] as EntityState<
            Payload['entities'][Entity][EntityId],
            EntityId
          >
        ).entities[id],
    ),
  );

  return {
    fetch: apiThunk(arg),
    entities,
    ...pagination,
  };
};
