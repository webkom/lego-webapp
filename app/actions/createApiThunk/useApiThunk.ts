import { useAppSelector } from 'app/store/hooks';
import type { EntityId } from '@reduxjs/toolkit';
import type createApiThunk from 'app/actions/createApiThunk/index';
import type { NormalizedApiPayload } from 'app/actions/createApiThunk/normalizePayload';
import type { EntityType, EntityTypeMap } from 'app/store/models/entities';
import type { Primitive } from 'utility-types';

export const useApiThunk = <
  Arg,
  Entity extends EntityType,
  TypeMap extends EntityTypeMap<Entity>,
  Ids extends EntityId[],
  Payload extends NormalizedApiPayload<TypeMap, Ids>,
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
        (id) => state[entityType satisfies EntityType].entities[id],
      ) as TypeMap[Entity][],
  );
  const actionGrant = useAppSelector(
    (state) => state[entityType satisfies EntityType].actionGrant,
  );

  return {
    entities,
    fetching: pagination.fetching,
    next: pagination.next,
    previous: pagination.previous,
    actionGrant,
  } as {
    entities: TypeMap[Entity][];
  };
};
