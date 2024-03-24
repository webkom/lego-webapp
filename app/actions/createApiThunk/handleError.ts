import { logout } from 'app/actions/UserActions';
import { setStatusCode } from 'app/reducers/routing';
import { HttpError } from 'app/utils/fetchJSON';
import type { AppDispatch } from 'app/store/createStore';

export const handleError = (
  error: HttpError | unknown,
  propagateError: boolean,
  loggedIn: boolean,
  dispatch: AppDispatch,
) => {
  if (error instanceof HttpError && error.response) {
    const statusCode = error.response.status;

    if (statusCode === 401 && loggedIn) {
      dispatch(logout());
    }

    if (propagateError) {
      const serverRenderer = !__CLIENT__;

      if ((serverRenderer && statusCode < 500) || !serverRenderer) {
        dispatch(setStatusCode(statusCode));
      }
    }
  }

  return error;
};
