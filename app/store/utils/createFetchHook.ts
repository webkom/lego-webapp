import { usePreparedEffect } from '@webkom/react-prepare';
import { normalize } from 'normalizr';
import { urlFor } from 'app/actions/callAPI';
import {
  createRequestThunk,
  executeRequest,
  selectRequest,
} from 'app/reducers/requests';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { entitiesReceived } from 'app/utils/legoAdapter/actions';
import type { EntityId } from '@reduxjs/toolkit';
import type { RequestThunk } from 'app/actions/FrontpageActions';
import type { RequestState } from 'app/reducers/requests';
import type { RootState } from 'app/store/createRootReducer';
import type { AppDispatch } from 'app/store/createStore';
import type { GetState } from 'app/types';
import type { Schema } from 'normalizr';

/**
 * Creates a hook that fetches data (server side) using the given action and
 * returns data using the given selector.
 */
export const createFetchHook = <Arg, RT, T = RT>(
  prepareId: string,
  fetchAction: RequestThunk<RequestState<RT>, Arg>,
  returnValueSelector: (
    state: RootState,
    request: RequestState<RT>,
    arg?: Arg,
  ) => RequestState<T> = (_, request) => request as RequestState<T>,
) => {
  return (arg?: Arg) => {
    const dispatch = useAppDispatch();

    usePreparedEffect(prepareId, () => {
      arg !== undefined && dispatch(fetchAction(arg));
    }, [dispatch, arg]);

    return useAppSelector((state) =>
      returnValueSelector(
        state,
        selectRequest(state, arg ? fetchAction.createRequestId(arg) : ''),
        arg,
      ),
    );
  };
};
