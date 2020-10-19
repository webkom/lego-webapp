// @flow

import { get, omit, isArray } from 'lodash';
import { type Schema } from 'normalizr';
import createQueryString from 'app/utils/createQueryString';

export const selectPagination = (
  entityName: string,
  { queryString }: { queryString: string }
) => (state: any) =>
  get(state, [entityName, 'pagination', queryString, 'nextPage']) !== null;

export const selectPaginationNext = ({
  endpoint,
  query,
  schema,
  entity,
}: {
  endpoint: string,
  query: ?Object,
  schema?: Schema,
  entity?: string,
}) => (state: any) => {
  const paginationKey = `${endpoint}${createQueryString(
    omit(query, 'cursor')
  )}`;
  let schemaKey = entity;
  if (!schemaKey) {
    if (isArray(schema)) {
      schemaKey = schema[0].key;
    } else {
      schemaKey = schema.key;
    }
  }
  return {
    pagination: state[schemaKey].pagination[paginationKey] || {
      hasMore: true,
      next: '',
    },
    paginationKey,
  };
};
