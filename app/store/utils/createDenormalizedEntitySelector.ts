import { denormalize } from 'normalizr';
import { createSelector } from 'reselect';
import type { EntityId } from '@reduxjs/toolkit';
import type { RootState } from 'app/store/createRootReducer';
import type Entities from 'app/store/models/entities';
import type { Schema } from 'normalizr';

const getEntities = (state: RootState, type: string) => {
  return state[type].entities;
};

export const createDenormalizedEntitySelector = <T>(
  schema: Schema,
): ((state: RootState, entityId?: EntityId) => T) => {
  const getNestedEntitySchemas = (schema: Schema): string[] => {
    const nestedSchemas: string[] = [];

    const recursive = (schema: Schema) =>
      Object.values(schema).forEach((value) => {
        const discoveredSchema = Array.isArray(value) ? value[0] : value;

        if (!nestedSchemas.includes(discoveredSchema['_key'])) {
          nestedSchemas.push(discoveredSchema['_key']);
          recursive(discoveredSchema.schema);
        }
      });
    recursive(schema);
    return nestedSchemas;
  };
  const nestedEntityKeys = getNestedEntitySchemas(schema['schema']);

  return createSelector(
    [
      (state, entityId) => getEntities(state, schema['_key'])[entityId],
      ...nestedEntityKeys.map(
        (key) => (state: RootState) => getEntities(state, key),
      ),
    ] satisfies ((
      state: RootState,
      entityId?: EntityId,
    ) => Partial<Entities>)[],
    (baseEntity, ...nestedEntities) =>
      denormalize(
        baseEntity,
        schema,
        nestedEntityKeys.reduce(
          (collector, key, i) => ({ ...collector, [key]: nestedEntities[i] }),
          {} as Partial<Entities>,
        ),
      ) as T,
  );
};
