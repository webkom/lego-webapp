import { get, isArray } from 'lodash';
import createQueryString from 'app/utils/createQueryString';
import type { RootState } from 'app/store/createRootReducer';
import type { Query } from 'app/utils/createQueryString';
import type { schema, Schema } from 'normalizr';

export const selectPagination =
  (
    entityName: string,
    {
      queryString,
    }: {
      queryString: string;
    },
  ) =>
  (state: RootState) =>
    get(state, [entityName, 'pagination', queryString, 'nextPage']) !== null;
export const selectPaginationNext =
  ({
    endpoint,
    query,
    schema,
    entity,
  }: {
    endpoint: string;
    query: Query;
    schema?: Schema;
    entity?: string;
  }) =>
  (state: RootState) => {
    const paginationKey = `${endpoint}${createQueryString(query)}`;
    const schemaKey =
      entity ||
      (isArray(schema)
        ? (schema[0] as schema.Entity).key
        : (schema as schema.Entity).key);

    return {
      pagination: state[schemaKey].paginationNext[paginationKey] || {
        hasMore: true,
        hasMoreBackwards: false,
        query,
        next: { ...query, cursor: '' },
        previous: false,
        items: [], // TODO: Remove this when all usage of createEntityReducer is removed
        ids: [],
      },
      paginationKey,
    };
  };
