import { isArray } from 'lodash-es';
import createQueryString from 'app/utils/createQueryString';
import { createInitialPagination } from 'app/utils/legoAdapter/buildPaginationReducer';
import type { RootState } from 'app/store/createRootReducer';
import type { EntityType } from 'app/store/models/entities';
import type { Pagination } from 'app/utils/legoAdapter/buildPaginationReducer';
import type { schema, Schema } from 'normalizr';
import type { ParsedQs } from 'qs';

export const selectPaginationNext =
  ({
    endpoint,
    query,
    schema,
    entity,
  }: {
    endpoint: string;
    query: ParsedQs;
    schema?: Schema;
    entity?: EntityType;
  }) =>
  (state: RootState) => {
    const paginationKey = `${endpoint}${createQueryString(query)}`;
    const schemaKey =
      entity ||
      ((isArray(schema)
        ? (schema[0] as schema.Entity).key
        : (schema as schema.Entity).key) as EntityType);

    return {
      pagination: (state[schemaKey].paginationNext[paginationKey] || {
        ...createInitialPagination(query),
        hasMore: true,
      }) as Pagination,
      paginationKey,
    };
  };
