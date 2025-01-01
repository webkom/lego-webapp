import { usePreparedEffect } from '@webkom/react-prepare';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import type { RootState } from 'app/store/createRootReducer';
import type { AppDispatch } from 'app/store/createStore';

/**
 * Creates a hook that fetches data (server side) using the given action and
 * returns data using the given selector.
 */
export const createFetchHook = <Arg, T>(
  prepareId: string,
  fetchAction: (arg: Arg) => Parameters<AppDispatch>[0],
  selector: (state: RootState) => T,
) => {
  return (arg: Arg) => {
    const dispatch = useAppDispatch();

    usePreparedEffect(prepareId, () => {
      dispatch(fetchAction(arg));
    }, [dispatch, arg]);

    return useAppSelector(selector);
  };
};
