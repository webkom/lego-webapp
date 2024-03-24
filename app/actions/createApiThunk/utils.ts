import { omit } from 'lodash';
import { IS_API_ACTION } from 'app/actions/createApiThunk/index';
import { configWithSSR } from 'app/config';
import createQueryString from 'app/utils/createQueryString';
import type { EntityId } from '@reduxjs/toolkit';
import type { EntityType } from 'app/store/models/entities';
import type { Query } from 'app/utils/createQueryString';
import type { schema } from 'normalizr';
import type { Primitive } from 'utility-types';

/**
 *  ValueOrCreator is a type that represents a value or a function that creates a value.
 */
export type ValueOrCreator<T, Arg> = T | ((arg: Arg) => T);
// Get the value of a value or value-creator
export const getValue = <T extends Primitive | object, Arg>(
  valueOrCreator: ValueOrCreator<T, Arg>,
  arg: Arg,
): T =>
  typeof valueOrCreator === 'function' ? valueOrCreator(arg) : valueOrCreator;

/**
 * urlFor returns the entire URL for a given endpoint (and querystring).
 */
export const urlFor = (resource: string) => {
  if (resource.match(/^\/\//)) {
    return configWithSSR.baseUrl + resource.replace(/^\//, '');
  } else if (resource.match(/^http?:/) || resource.match(/^https:/)) {
    return resource;
  }

  return configWithSSR.serverUrl + resource;
};

export const createApiThunkMeta = <ExtraMeta extends object | Primitive>(
  endpoint: string,
  entityType: EntityType | string,
  query: Query | undefined,
  deleteId: EntityId | undefined,
  extraMeta: ExtraMeta,
) => ({
  [IS_API_ACTION]: true as const,
  paginationKey: getPaginationKey(endpoint, query),
  entityType,
  deleteId,
  extra: extraMeta,
});

/**
 * Extract schema key (EntityType) from a schema
 */
export const getSchemaKey = (
  schema: schema.Entity | schema.Entity[],
): string => {
  if (Array.isArray(schema)) {
    return schema[0].key;
  }
  return schema.key;
};

/**
 * Get a pagination key for a given endpoint and query
 */
export const getPaginationKey = (endpoint: string, query?: Query) =>
  `${endpoint}${createQueryString(omit(query, 'cursor'))}`;
