import { User, Event } from 'app/actions/ActionTypes';
import { fetchFollowers } from 'app/actions/EventActions';
import config from 'app/config';
import { selectCurrentUser } from 'app/reducers/auth';
import { addToast } from 'app/reducers/toasts';
import createQueryString from 'app/utils/createQueryString';
import type { Middleware } from '@reduxjs/toolkit';
import type { RootState } from 'app/store/createRootReducer';

const createWebSocketMiddleware = (): Middleware<
  Record<string, never>,
  RootState
> => {
  let socket: WebSocket | null = null;
  return ({ getState, dispatch }) => {
    const makeSocket = (jwt) => {
      if (socket || !jwt) return;
      const qs = createQueryString({
        jwt,
      });
      socket = new WebSocket(`${config.wsServerUrl}/${qs}`);

      socket.onmessage = (event) => {
        const { type, payload, meta: socketMeta } = JSON.parse(event.data);
        const meta = {
          ...socketMeta,
          currentUser: selectCurrentUser(getState()),
        };

        if (
          type === Event.SOCKET_REGISTRATION.SUCCESS &&
          (payload.user && payload.user.id) === meta.currentUser.id
        ) {
          dispatch(fetchFollowers(meta.eventId, meta.currentUser.id));
        }

        dispatch({
          type,
          payload,
          meta,
        });
        const message = meta.successMessage || meta.errorMessage;

        if (message) {
          dispatch(
            addToast({
              message,
              type: meta.successMessage
                ? 'success'
                : meta.errorMessage
                  ? 'error'
                  : undefined,
            }),
          );
        }
      };

      socket.onopen = () => {
        dispatch({
          type: 'WS_CONNECTED',
        });
      };

      socket.onclose = () => {
        dispatch({
          type: 'WS_CLOSED',
        });
      };

      socket.onerror = () => {
        dispatch({
          type: 'WS_ERROR',
        });
      };
    };

    return (next) => (action) => {
      if (action.type === 'REHYDRATED') {
        makeSocket(getState().auth.token);
        return next(action);
      }

      if (action.type === User.LOGIN.SUCCESS) {
        makeSocket(action.payload.token);
        return next(action);
      }

      if (action.type === User.LOGOUT) {
        if (socket) {
          socket.close();
        }

        socket = null;
        return next(action);
      }

      return next(action);
    };
  };
};

export default createWebSocketMiddleware;
