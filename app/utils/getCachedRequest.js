import { get } from 'lodash';

// cacheSeconds is of seconds that will be awaited until new request is allowed
const getCachedRequest = (
  state: Object,
  endpoint: string,
  cacheSeconds: Number
) => {
  if (!endpoint || !cacheSeconds) return null;
  const historyObject = get(state, ['fetchHistory', endpoint]);
  let shouldReturnCache = false;
  if (historyObject) {
    shouldReturnCache =
      Date.now() - historyObject.timestamp < cacheSeconds * 1000;
  }
  return shouldReturnCache ? historyObject.action : null;
};

export default getCachedRequest;
