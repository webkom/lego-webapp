import { get } from 'lodash';

export const selectPagination = (entityName, { queryString }) => state =>
  get(state, [entityName, 'pagination', queryString, 'nextPage']) !== null;
