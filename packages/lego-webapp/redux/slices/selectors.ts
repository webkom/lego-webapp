import { isArray } from 'lodash';
import createQueryString from 'app/utils/createQueryString';
import { createInitialPagination } from '~/redux/legoAdapter/buildPaginationReducer';
import type { schema, Schema } from 'normalizr';
import type { ParsedQs } from 'qs';
import type { Pagination } from '~/redux/legoAdapter/buildPaginationReducer';
import type { EntityType } from '~/redux/models/entities';
import type { RootState } from '~/redux/rootReducer';

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
