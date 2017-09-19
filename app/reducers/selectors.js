export const selectHasMore = entityName => state =>
  state[entityName].pagination.nextPage;
