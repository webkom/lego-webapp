import type { Action } from 'app/types';
import { Routing } from './ActionTypes';

export function setStatusCode(statusCode: number | null | undefined): Action {
  return {
    type: Routing.SET_STATUS_CODE,
    payload: statusCode,
  };
}
