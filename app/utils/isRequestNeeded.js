import { get } from 'lodash';

// cacheSeconds is of seconds that will be awaited until new request is allowed
const isRequestNeeded = (
  state: Object,
  endpoint: string,
  cacheSeconds: Number
) => {
  if (!endpoint || !cacheSeconds) return true;
  const lastFetched = get(state, ['fetchHistory', endpoint]);
  return lastFetched ? Date.now() - lastFetched > cacheSeconds * 1000 : true;
};

export default isRequestNeeded;
