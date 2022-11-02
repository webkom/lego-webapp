import { get, isArray } from "lodash";
import type { Schema } from "normalizr";
import "normalizr";
import createQueryString from "app/utils/createQueryString";
export const selectPagination = (entityName: string, {
  queryString
}: {
  queryString: string;
}) => (state: any) => get(state, [entityName, 'pagination', queryString, 'nextPage']) !== null;
export const selectPaginationNext = ({
  endpoint,
  query,
  schema,
  entity
}: {
  endpoint: string;
  query: Record<string, any>;
  schema?: Schema;
  entity?: string;
}) => (state: any) => {
  const paginationKey = `${endpoint}${createQueryString(query)}`;
  let schemaKey = entity;

  if (!schemaKey) {
    if (isArray(schema)) {
      schemaKey = schema[0].key;
    } else {
      schemaKey = schema.key;
    }
  }

  return {
    pagination: state[schemaKey].paginationNext[paginationKey] || {
      hasMore: true,
      hasMoreBackwards: false,
      query,
      next: { ...query,
        cursor: ''
      },
      previous: false,
      items: []
    },
    paginationKey
  };
};