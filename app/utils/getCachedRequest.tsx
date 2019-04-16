

import { get } from 'lodash';

// cacheSeconds is the number of seconds that will be awaited until new request is allowed
const getCachedRequest = (
  state: Object,
  endpoint: string,
  cacheSeconds: number
) => {
  if (!cacheSeconds) return null;
  const historyObject = get(state, ['fetchHistory', endpoint]);
  if (!historyObject) return null;
  const shouldReturnCache =
    Date.now() - historyObject.timestamp < cacheSeconds * 1000;
  return shouldReturnCache ? historyObject.action : null;
};

export default getCachedRequest;
