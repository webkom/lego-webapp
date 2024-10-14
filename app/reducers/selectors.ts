import { isArray } from 'lodash';
import createQueryString from 'app/utils/createQueryString';
import { createCurriedSelector } from 'app/utils/curriedSelector';
import { createInitialPagination } from 'app/utils/legoAdapter/buildPaginationReducer';
import type { EntityType } from 'app/store/models/entities';
import type { Pagination } from 'app/utils/legoAdapter/buildPaginationReducer';
import type { schema, Schema } from 'normalizr';
import type { ParsedQs } from 'qs';

type SelectPaginationNextArgs = {
  endpoint: string;
  query: ParsedQs;
  schema?: Schema;
  entity?: EntityType;
};

export const selectPaginationNext = createCurriedSelector(
  [(state) => state, (_, args: SelectPaginationNextArgs) => args],
  (state, { endpoint, query, schema, entity }) => {
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
  },
);
