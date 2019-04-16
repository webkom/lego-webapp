

import { Routing } from './ActionTypes';

export function setStatusCode(statusCode: ?number) {
  return {
    type: Routing.SET_STATUS_CODE,
    payload: statusCode
  };
}
