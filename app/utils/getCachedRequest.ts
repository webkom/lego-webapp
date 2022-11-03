import { get } from 'lodash';
import { fetchHistoryEntryKey } from 'app/reducers/fetchHistory';
import type { PromiseAction } from 'app/types';
import 'app/types';

// cacheSeconds is the number of seconds that will be awaited until new request is allowed
const getCachedRequest = (
  state: Record<string, any>,
  endpoint: string,
  paginationKey: string,
  cursor: string,
  cacheSeconds: number
): PromiseAction<any> | null => {
  if (!cacheSeconds) return null;
  const key = fetchHistoryEntryKey({
    paginationKey,
    cursor,
    endpoint,
  });
  const historyObject = get(state, ['fetchHistory', key]);
  if (!historyObject) return null;
  const shouldReturnCache =
    Date.now() - historyObject.timestamp < cacheSeconds * 1000;
  return shouldReturnCache ? historyObject.action : null;
};

export default getCachedRequest;
