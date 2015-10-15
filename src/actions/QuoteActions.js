import { Quotes } from './ActionTypes';
import { callAPI } from '../util/http';

export function fetchAll() {
  return callAPI({
    type: Quotes.FETCH_ALL,
    endpoint: '/quotes/'
  });
}
