// @flow

import { get } from 'lodash';
import { fetchHistoryEntryKey } from 'app/reducers/fetchHistory';

// cacheSeconds is the number of seconds that will be awaited until new request is allowed
const getCachedRequest = (
  state: Object,
  endpoint: string,
  paginationKey: string,
  cursor: string,
  cacheSeconds: number
) => {
  if (!cacheSeconds) return null;
  const key = fetchHistoryEntryKey({ paginationKey, cursor, endpoint });
  const historyObject = get(state, ['fetchHistory', key]);
  if (!historyObject) return null;
  const shouldReturnCache =
    Date.now() - historyObject.timestamp < cacheSeconds * 1000;
  return shouldReturnCache ? historyObject.action : null;
};

export default getCachedRequest;
