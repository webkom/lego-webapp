import { Routing } from './ActionTypes';

export function setStatusCode(statusCode) {
  return {
    type: Routing.SET_STATUS_CODE,
    payload: statusCode
  };
}
