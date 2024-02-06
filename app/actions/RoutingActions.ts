import { Routing } from './ActionTypes';
import type { Action } from 'app/types';

export function setStatusCode(statusCode: number | null | undefined): Action {
  return {
    type: Routing.SET_STATUS_CODE,
    payload: statusCode,
  };
}
