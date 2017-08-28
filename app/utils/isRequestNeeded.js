import { get } from 'lodash';

// Number of seconds that will be awaited until new request is allowed
const cacheSeconds = 10 * 1000;

const getLastFetched = (state, reducerKey, id) =>
  id
    ? get(state, [reducerKey, 'byId', id, 'lastFetched'])
    : get(state, [reducerKey, 'lastFetched']);

const isRequestNeeded = (state: Object, reducerKey: string, id: string) => {
  if (!reducerKey) return true;
  const lastFetched = getLastFetched(state, reducerKey, id);
  return lastFetched ? Date.now() - lastFetched > cacheSeconds : true;
};

export default isRequestNeeded;
