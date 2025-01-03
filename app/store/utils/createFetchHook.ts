import { usePreparedEffect } from '@webkom/react-prepare';
import { selectRequest } from 'app/reducers/requests';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import type { RequestThunk } from 'app/actions/FrontpageActions';
import type { RequestState } from 'app/reducers/requests';
import type { RootState } from 'app/store/createRootReducer';

/**
 * Creates a hook that fetches data (server side) using the given action and
 * returns data using the given selector.
 */
export const createFetchHook = <Arg, RT, T = RT>(
  prepareId: string,
  fetchAction: RequestThunk<RequestState<RT>, Arg>,
  returnValueSelector?: (
    state: RootState,
    request: RequestState<RT>,
  ) => RequestState<T>,
) => {
  return (arg: Arg) => {
    const dispatch = useAppDispatch();

    usePreparedEffect(prepareId, () => {
      dispatch(fetchAction(arg));
    }, [dispatch, arg]);

    returnValueSelector ??= (_, request) => request as RequestState<T>;

    return useAppSelector((state) =>
      returnValueSelector!(
        state,
        selectRequest(state, fetchAction.createRequestId(arg)),
      ),
    );
  };
};
