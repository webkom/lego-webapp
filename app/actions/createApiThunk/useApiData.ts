import { usePreparedEffect } from '@webkom/react-prepare';
import { schema } from 'normalizr';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { useAppDispatch } from 'app/store/hooks';
import type { EntityId } from '@reduxjs/toolkit';
import type createApiThunk from 'app/actions/createApiThunk/index';
import type { NormalizedApiPayload } from 'app/actions/createApiThunk/normalizePayload';
import type { RootState } from 'app/store/createRootReducer';
import type { EntityType, EntityTypeMap } from 'app/store/models/entities';
import type { Primitive } from 'utility-types';

const selectEntityTypeEntities = createSelector(
  (state: RootState) => state,
  (_: RootState, entityType: EntityType) => entityType,
  (state, entityType) => state[entityType].entities,
);

const selectEntitiesByEntityTypeAndIds = createSelector(
  (state: RootState) => state,
  (_: RootState, entityType: EntityType) => entityType,
  (_: RootState, __: EntityType, ids: EntityId[]) => ids,
  (state, entityType, ids) => {
    const entities = selectEntityTypeEntities(state, entityType);
    return ids.map((id) => entities[id]);
  },
);

const selectEntitiesByEntityTypesAndIds = createSelector(
  (state: RootState) => state,
  (_: RootState, entityTypeIds: Partial<Record<EntityType, EntityId[]>>) =>
    entityTypeIds,
  (state, entityTypeIds) => {
    const entities: Partial<Record<EntityType, unknown[]>> = {};
    Object.entries(entityTypeIds).forEach(([entityType, ids]) => {
      entities[entityType as EntityType] = selectEntitiesByEntityTypeAndIds(
        state,
        entityType as EntityType,
        ids,
      );
    });
    return entities;
  },
);

type ApiData<E> =
  | {
      fetching: true;
      error: false;
      entities: undefined;
    }
  | {
      fetching: false;
      error: true;
      entities: undefined;
    }
  | {
      fetching: false;
      error: false;
      entities: E;
    };

export const useApiData = <
  Arg,
  Entity extends EntityType,
  ExtraMeta extends object | Primitive,
  Test extends EntityTypeMap,
  Payload extends NormalizedApiPayload<EntityTypeMap, EntityId | EntityId[]>,
>(
  prepareId: string,
  test: Test,
  apiThunk: ReturnType<typeof createApiThunk<Arg, Entity, ExtraMeta, Payload>>,
  thunkArg: NoInfer<Arg>,
): ApiData<Payload['entities']> => {
  const dispatch = useAppDispatch();
  const [fetched, setFetched] = useState<Payload>();
  const [error, setError] = useState(false);
  usePreparedEffect(
    `useApiData-${prepareId}`,
    () => {
      setError(false);
      setFetched(undefined);
      dispatch(apiThunk(thunkArg)).then((res) => {
        if (apiThunk.fulfilled.match(res)) {
          setFetched(res.payload);
        } else {
          setError(true);
        }
      });
    },
    [apiThunk, thunkArg],
  );

  const entityTypeIds = {};
  if (fetched) {
    Object.entries(fetched.entities).forEach(([entityType, entities]) => {
      entityTypeIds[entityType] = Object.keys(entities as object);
    });
  }

  const reduxEntities = useSelector((state: RootState) =>
    fetched
      ? selectEntitiesByEntityTypesAndIds(state, entityTypeIds)
      : undefined,
  ) as Payload['entities'] | undefined;

  return {
    fetching: !fetched,
    error,
    entities: reduxEntities,
  } as ApiData<Payload['entities']>;
};
