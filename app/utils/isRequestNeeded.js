import { get } from 'lodash';

// Number of seconds that will be awaited until new request is allowed
const cacheSeconds = 10 * 1000;

const isRequestNeeded = (state: Object, endpoint: string) => {
  if (!endpoint) return true;
  const lastFetched = get(state, ['fetchHistory', endpoint]);
  return lastFetched ? Date.now() - lastFetched > cacheSeconds : true;
};

export default isRequestNeeded;
