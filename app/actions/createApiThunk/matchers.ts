import { IS_API_ACTION } from 'app/actions/createApiThunk/index';
import type { UnknownAction } from '@reduxjs/toolkit';
import type { ApiThunkActionCreator } from 'app/actions/createApiThunk/index';

export const isApiThunkAction = (
  action: UnknownAction,
): action is ReturnType<
  | ApiThunkActionCreator['pending']
  | ApiThunkActionCreator['fulfilled']
  | ApiThunkActionCreator['rejected']
> =>
  'meta' in action &&
  typeof action.meta === 'object' &&
  action.meta !== null &&
  IS_API_ACTION in action.meta;

export const isApiThunkFulfilledAction = (
  action: UnknownAction,
): action is ReturnType<ApiThunkActionCreator['fulfilled']> =>
  isApiThunkAction(action) && action.meta.requestStatus === 'fulfilled';
