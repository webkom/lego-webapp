import { isArray } from 'lodash';
import { normalize } from 'normalizr';
import type { EntityId } from '@reduxjs/toolkit';
import type { ActionGrant } from 'app/models';
import type { EntityTypeMap } from 'app/store/models/entities';
import type { schema } from 'normalizr';

export type NormalizedEntities<
  E extends EntityTypeMap,
  Ids extends EntityId | EntityId[],
> = {
  entities: {
    [K in keyof E]: Record<EntityId, E[K]>;
  };
  result: Ids;
};

export type NormalizedApiPayload<
  E extends EntityTypeMap,
  Ids extends EntityId | EntityId[],
> = {
  actionGrant?: ActionGrant;
  next?: string;
  previous?: string;
} & NormalizedEntities<E, Ids>;

export const createPayloadNormalizer =
  <E extends EntityTypeMap, Ids extends EntityId | EntityId[]>(
    schema: Ids extends Array<EntityId> ? schema.Entity[] : schema.Entity,
  ) =>
  (payload: unknown): NormalizedApiPayload<E, Ids> => {
    if (typeof payload !== 'object' || payload === null) {
      throw new Error('Invalid payload for schema normalization');
    }

    const entities =
      isArray(schema) && 'results' in payload ? payload.results : payload;

    const normalized = normalize(entities, schema) as NormalizedEntities<
      E,
      Ids
    >;

    return {
      ...normalized,
      next: 'next' in payload ? (payload.next as string) : undefined,
      previous:
        'previous' in payload ? (payload.previous as string) : undefined,
      actionGrant:
        'actionGrant' in payload
          ? (payload.actionGrant as ActionGrant)
          : undefined,
    };
  };
